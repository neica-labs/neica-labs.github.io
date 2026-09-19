const consentVersion = "newsletter-early-access-2026-09";
const emailPattern = /^[^\s@,;:<>]+@[^\s@,;:<>]+\.[^\s@,;:<>]+$/;

async function sendReceipt(email, locale, env) {
  const endpoint = new URL(env.MAIL_ENDPOINT);
  if (endpoint.protocol !== "https:" || endpoint.hostname !== "script.google.com")
    throw new Error("Invalid mail endpoint");
  const mailResponse = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, locale, secret: env.MAIL_SHARED_SECRET }),
    signal: AbortSignal.timeout(20000),
  });
  if (!mailResponse.ok || (await mailResponse.json()).ok !== true)
    throw new Error("Receipt was not sent");
}

function response(status, body, origin) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    if (origin !== env.ALLOWED_ORIGIN) return new Response(null, { status: 403 });
    if (url.pathname !== "/subscribe") return response(404, { error: "Not found" }, origin);
    if (request.method === "OPTIONS") return response(204, {}, origin);
    if (request.method !== "POST") return response(405, { error: "Method not allowed" }, origin);
    if (!request.headers.get("Content-Type")?.startsWith("application/json"))
      return response(415, { error: "Unsupported content type" }, origin);
    if (Number(request.headers.get("Content-Length") || 0) > 4096)
      return response(413, { error: "Request too large" }, origin);

    try {
      const { success } = await env.SIGNUP_RATE_LIMIT.limit({
        key: request.headers.get("CF-Connecting-IP") || "unknown",
      });
      if (!success) return response(429, { error: "Too many requests" }, origin);
    } catch {
      return response(503, { error: "Temporarily unavailable" }, origin);
    }

    let data;
    try {
      const raw = await request.text();
      if (raw.length > 4096) return response(413, { error: "Request too large" }, origin);
      data = JSON.parse(raw);
    } catch {
      return response(400, { error: "Invalid request" }, origin);
    }
    if (data?.company) return response(202, { accepted: true }, origin);
    const email = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";
    if (
      !emailPattern.test(email) ||
      email.length > 254 ||
      !["ko", "en"].includes(data?.locale) ||
      data?.consent !== true ||
      data?.consentVersion !== consentVersion
    ) return response(400, { error: "Invalid request" }, origin);

    if (!env.MAIL_ENDPOINT || !env.MAIL_SHARED_SECRET)
      return response(503, { error: "Temporarily unavailable" }, origin);

    try {
      await env.DB.prepare(
        "INSERT INTO early_access_signups (email, locale, consent_version) VALUES (?1, ?2, ?3) ON CONFLICT(email) DO NOTHING",
      ).bind(email, data.locale, consentVersion).run();

      // Claim once before sending. A duplicate, unsubscribe, or in-flight send
      // receives the same response without triggering another email.
      const claim = await env.DB.prepare(
        "UPDATE early_access_signups SET receipt_claimed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP " +
        "WHERE email = ?1 AND status = 'pending' AND receipt_sent_at IS NULL " +
        "AND (receipt_claimed_at IS NULL OR receipt_claimed_at < datetime('now', '-10 minutes'))",
      ).bind(email).run();
      if (claim.meta?.changes !== 1) return response(202, { accepted: true }, origin);

      const signup = await env.DB.prepare(
        "SELECT locale FROM early_access_signups WHERE email = ?1",
      ).bind(email).first();
      try {
        await sendReceipt(email, signup.locale, env);
      } catch {
        await env.DB.prepare(
          "UPDATE early_access_signups SET receipt_claimed_at = NULL WHERE email = ?1 AND receipt_sent_at IS NULL",
        ).bind(email).run();
        return response(503, { error: "Temporarily unavailable" }, origin);
      }
      await env.DB.prepare(
        "UPDATE early_access_signups SET receipt_sent_at = CURRENT_TIMESTAMP, receipt_claimed_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE email = ?1",
      ).bind(email).run();
      return response(202, { accepted: true }, origin);
    } catch {
      return response(503, { error: "Temporarily unavailable" }, origin);
    }
  },
};
