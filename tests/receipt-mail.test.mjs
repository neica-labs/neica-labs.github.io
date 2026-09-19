import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = readFileSync(new URL("../newsletter-api/google-apps-script/Code.gs", import.meta.url), "utf8");

function createScript({ quota = 100, secret = "test-secret" } = {}) {
  const sent = [];
  const context = {
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (text) => ({ text, setMimeType() { return this; } }),
    },
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: () => secret }),
    },
    MailApp: {
      getRemainingDailyQuota: () => quota,
      sendEmail: (message) => sent.push(message),
    },
  };
  runInNewContext(source, context);
  const call = (body) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(body) } }).text);
  return { call, sent };
}

test("receipt uses one fixed, readable bilingual template", () => {
  const script = createScript();
  assert.equal(script.call({ email: "Reader@example.com", locale: "ko", secret: "test-secret" }).ok, true);
  assert.equal(script.sent.length, 1);
  assert.equal(script.sent[0].to, "reader@example.com");
  assert.match(script.sent[0].subject, /사전 등록 요청/);
  assert.match(script.sent[0].htmlBody, /neica-wordmark-source\.png/);
  assert.match(script.sent[0].body, /신청한 적이 없다면/);
  assert.equal(script.call({ email: "reader@example.com", locale: "en", secret: "test-secret", subject: "injected" }).ok, true);
  assert.match(script.sent[1].subject, /early registration/);
  assert.doesNotMatch(script.sent[1].subject, /injected/);
});

test("receipt sender rejects invalid or unauthorized requests", () => {
  const script = createScript();
  assert.equal(script.call({ email: "reader@example.com", locale: "ko", secret: "wrong" }).ok, false);
  assert.equal(script.call({ email: "one@a.com,two@b.com", locale: "ko", secret: "test-secret" }).ok, false);
  assert.equal(script.call({ email: "reader@example.com", locale: "fr", secret: "test-secret" }).ok, false);
  assert.equal(script.sent.length, 0);
  const noQuota = createScript({ quota: 0 });
  assert.equal(noQuota.call({ email: "reader@example.com", locale: "ko", secret: "test-secret" }).ok, false);
  assert.equal(noQuota.sent.length, 0);
});
