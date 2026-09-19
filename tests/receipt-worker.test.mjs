import assert from "node:assert/strict";
import test from "node:test";
import worker from "../newsletter-api/src/worker.js";

const consentVersion = "newsletter-early-access-2026-09";

function fixture() {
  const records = new Map();
  const DB = {
    prepare(sql) {
      return {
        bind(...params) {
          const email = params[0];
          return {
            async run() {
              if (sql.startsWith("INSERT INTO")) {
                if (!records.has(email)) records.set(email, { locale: params[1], status: "pending", claimed: false, sent: false });
                return { meta: { changes: 1 } };
              }
              const row = records.get(email);
              if (sql.includes("SET receipt_claimed_at = CURRENT_TIMESTAMP")) {
                if (!row || row.status !== "pending" || row.claimed || row.sent) return { meta: { changes: 0 } };
                row.claimed = true;
                return { meta: { changes: 1 } };
              }
              if (sql.includes("SET receipt_sent_at = CURRENT_TIMESTAMP")) {
                row.sent = true;
                row.claimed = false;
                return { meta: { changes: 1 } };
              }
              if (sql.includes("SET receipt_claimed_at = NULL")) {
                row.claimed = false;
                return { meta: { changes: 1 } };
              }
              throw new Error(`Unexpected SQL: ${sql}`);
            },
            async first() { return records.get(email); },
          };
        },
      };
    },
  };
  const env = {
    ALLOWED_ORIGIN: "https://neica-labs.github.io",
    MAIL_ENDPOINT: "https://script.google.com/macros/s/test/exec",
    MAIL_SHARED_SECRET: "local-test-secret",
    SIGNUP_RATE_LIMIT: { async limit() { return { success: true }; } },
    DB,
  };
  const request = () => new Request("https://example.workers.dev/subscribe", {
    method: "POST",
    headers: { Origin: env.ALLOWED_ORIGIN, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "reader@example.com", locale: "ko", consent: true, consentVersion }),
  });
  return { records, env, request };
}

test("one registration sends one receipt and a duplicate does not resend", async () => {
  const { records, env, request } = fixture();
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (_url, options) => {
    calls.push(JSON.parse(options.body));
    return Response.json({ ok: true });
  };
  try {
    assert.equal((await worker.fetch(request(), env)).status, 202);
    assert.equal((await worker.fetch(request(), env)).status, 202);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], { email: "reader@example.com", locale: "ko", secret: "local-test-secret" });
    assert.equal(records.get("reader@example.com").sent, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("failed receipt is reported and can be retried without duplicate database rows", async () => {
  const { records, env, request } = fixture();
  const originalFetch = globalThis.fetch;
  let attempt = 0;
  globalThis.fetch = async () => Response.json({ ok: ++attempt > 1 });
  try {
    assert.equal((await worker.fetch(request(), env)).status, 503);
    assert.equal(records.get("reader@example.com").claimed, false);
    assert.equal((await worker.fetch(request(), env)).status, 202);
    assert.equal(records.size, 1);
    assert.equal(records.get("reader@example.com").sent, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("mail configuration missing fails before recording a registration", async () => {
  const { records, env, request } = fixture();
  delete env.MAIL_ENDPOINT;
  assert.equal((await worker.fetch(request(), env)).status, 503);
  assert.equal(records.size, 0);
});
