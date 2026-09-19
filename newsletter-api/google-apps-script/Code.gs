/**
 * NEICA community receipt sender.
 * Deploy as a Google Apps Script web app owned by neica.labs@gmail.com.
 * Set the script property NEICA_RECEIPT_SECRET before deployment.
 * The Cloudflare Worker is the only intended caller; this script accepts no
 * sender-selected subject or body.
 */

var NEICA_CONTACT = "neica.labs@gmail.com";
var NEICA_PRIVACY = "https://neica-labs.github.io/privacy/";
var NEICA_WORDMARK = "https://neica-labs.github.io/brand/neica-wordmark-source.png";

function doPost(event) {
  var body;
  try {
    body = JSON.parse(event.postData.contents || "{}");
  } catch (error) {
    return jsonResponse({ ok: false });
  }

  var secret = PropertiesService.getScriptProperties().getProperty("NEICA_RECEIPT_SECRET");
  if (!secret || !secureEqual(body.secret, secret)) {
    return jsonResponse({ ok: false });
  }

  var email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@,;:<>]+@[^\s@,;:<>]+\.[^\s@,;:<>]+$/.test(email) || email.length > 254 ||
      (body.locale !== "ko" && body.locale !== "en")) {
    return jsonResponse({ ok: false });
  }

  if (MailApp.getRemainingDailyQuota() < 1) {
    return jsonResponse({ ok: false });
  }

  var mail = receiptContent(body.locale);
  try {
    MailApp.sendEmail({
      to: email,
      subject: mail.subject,
      body: mail.text,
      htmlBody: mail.html,
      name: "NEICA community",
      replyTo: NEICA_CONTACT
    });
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false });
  }
}

function secureEqual(input, expected) {
  if (typeof input !== "string") return false;
  var difference = input.length ^ expected.length;
  var length = Math.max(input.length, expected.length);
  for (var i = 0; i < length; i++) {
    difference |= (input.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
  }
  return difference === 0;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function receiptContent(locale) {
  var korean = locale === "ko";
  var subject = korean
    ? "NEICA community — 사전 등록 요청을 받았습니다"
    : "NEICA community — We received your early registration";
  var heading = korean
    ? "사전 등록 요청을 받았습니다."
    : "We received your early registration.";
  var message = korean
    ? "NEICA의 글과 모임 소식을 이 주소로 전하겠습니다. 뉴스레터가 시작되면 먼저 알려드릴게요."
    : "We’ll send NEICA’s writing and gathering updates to this address, and let you know when the newsletter begins.";
  var notMe = korean
    ? "신청한 적이 없다면 이 메일에 답장해 주세요. 등록 정보를 삭제하겠습니다."
    : "If you didn’t sign up, reply to this email and we’ll remove your registration.";
  var privacyLabel = korean ? "개인정보 처리 안내" : "Privacy notice";
  var text = heading + "\n\n" + message + "\n\n" + notMe +
    "\n\nNEICA community\n" + NEICA_CONTACT + "\n" + NEICA_PRIVACY;

  // Table layout and inline styles keep the same restrained hierarchy in
  // common mail clients. The message remains readable when images are blocked.
  var html = '<!doctype html><html lang="' + locale + '"><head>' +
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>' +
    '<body style="margin:0;padding:0;background:#ffffff;color:#161616;' +
    'font-family:Apple SD Gothic Neo,-apple-system,BlinkMacSystemFont,Helvetica Neue,Arial,sans-serif;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#ffffff;"><tr><td align="center">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:560px;"><tr><td style="padding:48px 24px 64px;">' +
    '<img src="' + NEICA_WORDMARK + '" width="128" height="28" alt="NEICA" style="display:block;width:128px;height:28px;border:0;">' +
    '<p style="margin:46px 0 18px;color:#666666;font-family:SFMono-Regular,SF Mono,Menlo,Consolas,monospace;font-size:14px;line-height:1.5;letter-spacing:0.04em;">COMMUNITY</p>' +
    '<h1 style="margin:0 0 28px;font-size:28px;line-height:1.4;font-weight:600;letter-spacing:-0.025em;">' + heading + '</h1>' +
    '<p style="margin:0 0 22px;font-size:17px;line-height:1.75;">' + message + '</p>' +
    '<p style="margin:0 0 64px;color:#555555;font-size:16px;line-height:1.75;">' + notMe + '</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-top:1px solid #dddddd;"><tr><td style="padding-top:20px;color:#666666;font-size:14px;line-height:1.8;">' +
    '<span style="color:#161616;">NEICA community</span><br>' +
    '<a href="mailto:' + NEICA_CONTACT + '" style="color:#666666;text-decoration:none;">' + NEICA_CONTACT + '</a><br>' +
    '<a href="' + NEICA_PRIVACY + '" style="color:#666666;text-decoration:underline;text-underline-offset:3px;">' + privacyLabel + '</a>' +
    '</td></tr></table>' +
    '</td></tr></table></td></tr></table></body></html>';

  return { subject: subject, text: text, html: html };
}
