// Local browser QA against existing review PNGs; never approves or publishes content.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { appRoot } from "./content.mjs";

const output = path.join(appRoot, ".cache/qa");
await fs.mkdir(output, { recursive: true });
const base = process.env.NEICA_QA_URL || "http://127.0.0.1:4174/";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const checkImage = async () => {
  await page.locator(".slide-image").waitFor();
  await page.waitForFunction(() => {
    const image = document.querySelector(".slide-image");
    return image?.complete && image.naturalWidth > 0;
  });
};
try {
  await page.goto(base);
  await page.locator(".card-link img").first().waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".card-link img")]
      .filter((i) => i.loading === "eager")
      .every((i) => i.complete && i.naturalWidth > 0),
  );
  const count = await page.locator(".card-link").count();
  assert.ok(count > 0, "Review needs exported content");
  assert.equal(
    await page
      .locator(".content-grid")
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      ),
    3,
  );
  await page.locator(".card-link").last().scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".card-link img")].every(
      (i) => i.complete && i.naturalWidth > 0,
    ),
  );
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: path.join(output, "home-desktop.png"),
    fullPage: true,
  });
  let slidesChecked = 0,
    firstPost;
  for (let card = 0; card < count; card++) {
    const item = page.locator(".card-link").nth(card);
    if (await item.getAttribute("target")) continue;
    await item.scrollIntoViewIfNeeded();
    const originalScroll = await page.evaluate(() => scrollY);
    const response = page.waitForResponse((r) =>
      r.url().endsWith("/post.json"),
    );
    await item.click();
    const post = await (await response).json();
    firstPost ||= post;
    for (let i = 0; i < post.slides.length; i++) {
      await checkImage();
      assert.ok(
        (await page.locator(".slide-image").getAttribute("src")).endsWith(
          post.slides[i].image.path,
        ),
      );
      assert.equal(
        await page.locator(".slide-image").evaluate((i) => i.naturalWidth),
        post.slides[i].image.width,
      );
      slidesChecked++;
      if (i < post.slides.length - 1)
        await page
          .getByRole("button", { name: "다음 슬라이드", exact: true })
          .click();
    }
    assert.equal(
      await page
        .getByRole("button", { name: "다음 슬라이드", exact: true })
        .isDisabled(),
      true,
    );
    if (card === 0)
      await page.screenshot({ path: path.join(output, "viewer-final.png") });
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "detached" });
    assert.equal(
      await item.evaluate((el) => el === document.activeElement),
      true,
    );
    assert.ok(
      Math.abs((await page.evaluate(() => scrollY)) - originalScroll) < 2,
      "Scroll position restored",
    );
  }
  await page.locator(".card-link").first().click();
  await checkImage();
  for (let i = 0; i < 12; i++)
    await page.getByRole("button", { name: "확대", exact: true }).click();
  assert.equal(await page.locator(".zoom-value").textContent(), "400%");
  const before = await page.locator(".slide-image").getAttribute("style");
  await page.mouse.move(720, 500);
  await page.mouse.down();
  await page.mouse.move(1000, 700, { steps: 8 });
  await page.mouse.up();
  assert.notEqual(
    await page.locator(".slide-image").getAttribute("style"),
    before,
  );
  assert.ok(page.url().endsWith("slide=1"), "Pan must not advance slide");
  await page.getByRole("button", { name: "화면에 맞춤", exact: true }).click();
  await page.getByRole("button", { name: "축소", exact: true }).click();
  await page.getByRole("button", { name: "축소", exact: true }).click();
  assert.equal(await page.locator(".zoom-value").textContent(), "50%");
  await page.getByRole("button", { name: "캡션과 출처", exact: true }).click();
  await page.locator(".post-info").waitFor();
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page.locator("dialog").waitFor({ state: "detached" });
  for (const [width, columns] of [
    [320, 1],
    [390, 1],
    [768, 2],
    [1440, 3],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.locator(".card-link").last().scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".card-link img")].every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
    );
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo(0, 0);
    });
    assert.equal(
      await page
        .locator(".content-grid")
        .evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
        ),
      columns,
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Horizontal overflow",
    );
    if (width === 390)
      await page.screenshot({
        path: path.join(output, "home-mobile.png"),
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}?post=${firstPost.id}&slide=1`);
  await checkImage();
  const touch = await context.newCDPSession(page);
  const sendTouch = (type, points) =>
    touch.send("Input.dispatchTouchEvent", {
      type,
      touchPoints: points.map(([id, x, y]) => ({ id, x, y })),
    });
  await sendTouch("touchStart", [[0, 300, 400]]);
  await sendTouch("touchMove", [[0, 100, 400]]);
  await sendTouch("touchEnd", []);
  await page.waitForURL("**&slide=2");
  await checkImage();
  await sendTouch("touchStart", [
    [0, 140, 400],
    [1, 240, 400],
  ]);
  await sendTouch("touchMove", [
    [0, 90, 400],
    [1, 290, 400],
  ]);
  await page.waitForFunction(
    () =>
      parseInt(document.querySelector(".zoom-value")?.textContent || "0") > 150,
  );
  await sendTouch("touchEnd", [[1, 290, 400]]);
  await sendTouch("touchEnd", []);
  assert.ok(page.url().endsWith("slide=2"), "Pinch must not swipe");
  await page.screenshot({ path: path.join(output, "viewer-mobile.png") });
  await touch.detach();
  await page.setViewportSize({ width: 1440, height: 1000 });
  // Direct URL, overflow index, stale loading response and explicit retry.
  await page.goto(`${base}?post=${firstPost.id}&slide=999`);
  await checkImage();
  assert.ok(page.url().endsWith(`slide=${firstPost.slides.length}`));
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "detached" });
  assert.equal(page.url(), base);
  const delay = firstPost.slides[1].image.path;
  await page.route(`**/${delay}`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });
  await page.goto(`${base}?post=${firstPost.id}&slide=1`);
  await checkImage();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await checkImage();
  assert.ok(
    (await page.locator(".slide-image").getAttribute("src")).endsWith(
      firstPost.slides[2].image.path,
    ),
  );
  await page.waitForTimeout(900);
  assert.ok(
    (await page.locator(".slide-image").getAttribute("src")).endsWith(
      firstPost.slides[2].image.path,
    ),
  );
  await page.unrouteAll({ behavior: "wait" });
  const fail = firstPost.slides.at(-1).image.path;
  await page.route(`**/${fail}`, (route) => route.abort());
  await page.goto(
    `${base}?post=${firstPost.id}&slide=${firstPost.slides.length}`,
  );
  await page
    .getByText("이미지를 불러오지 못했습니다.", { exact: true })
    .waitFor();
  await page.unrouteAll({ behavior: "wait" });
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await checkImage();
  await page.keyboard.press("Escape");
  for (const route of ["about/", "labs/", "community/", "contact/"]) {
    await page.goto(base + route);
    await page.locator("main h1").waitFor();
    assert.equal(await page.locator("nav a[aria-current]").count(), 1);
  }
  await page.goto(base + "about/");
  await page.screenshot({
    path: path.join(output, "about-desktop.png"),
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  const report = {
    postsChecked: count,
    slidesChecked,
    viewports: [320, 390, 768, 1440],
    checks: [
      "exact PNG source and dimensions",
      "last slide",
      "focus restoration",
      "scroll restoration",
      "touch swipe and pinch isolation",
      "50–400% zoom and pan",
      "direct URL",
      "late-image race",
      "failure retry",
      "all navigation pages",
    ],
    pageErrors: errors,
  };
  await fs.writeFile(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(report);
} finally {
  await browser.close();
}
