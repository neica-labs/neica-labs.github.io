const consentVersion = "newsletter-early-access-2026-09";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    try {
      await env.DB.prepare(
        "INSERT INTO early_access_signups (email, locale, consent_version) VALUES (?1, ?2, ?3) ON CONFLICT(email) DO NOTHING",
      ).bind(email, data.locale, consentVersion).run();
      // A duplicate receives the same response, so the API never confirms membership.
      return response(202, { accepted: true }, origin);
    } catch {
      return response(503, { error: "Temporarily unavailable" }, origin);
    }
  },
};
