import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  createBundle,
  checkBundle,
  prepareRelease,
  approveRelease,
  readJson,
  safeFile,
  safeUrl,
  hash,
  canonical,
  validateRelease,
} from "../scripts/content.mjs";
import { clampTransform, isSwipe } from "../src/viewer/geometry.mjs";

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "neica-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const contents = path.join(root, "contents"),
    post = path.join(contents, "series", "one");
  await fs.mkdir(path.join(post, "output"), { recursive: true });
  await fs.writeFile(
    path.join(post, "project.json"),
    JSON.stringify({
      title: "테스트 콘텐츠",
      slides: [
        { id: "cover", headline: "표지" },
        { id: "question", headline: "어떤 삶을 원하나요?" },
      ],
    }),
  );
  for (const [name, color] of [
    ["01", "#aaa"],
    ["02", "#fff"],
    ["03", "#000"],
  ])
    await sharp({
      create: { width: 108, height: 135, channels: 3, background: color },
    })
      .png()
      .toFile(path.join(post, "output", `${name}.png`));
  return {
    root,
    contents,
    post,
    bundle: (mode = "publish") =>
      createBundle({
        contentRoot: contents,
        destination: path.join(root, `bundle-${mode}`),
        mode,
      }),
  };
}
test("draft PNGs appear in review, never public; stale extra PNG ignored", async (t) => {
  const f = await fixture(t);
  assert.equal((await f.bundle()).entries.length, 0);
  const review = await f.bundle("review");
  assert.equal(review.entries[0].slideCount, 2);
  await assert.rejects(
    () => checkBundle(review, path.join(f.root, "bundle-review")),
    /Review/,
  );
});
test("approval binds immutable images and text; later draft does not replace public revision", async (t) => {
  const f = await fixture(t),
    r = await prepareRelease(f.post);
  await assert.rejects(() => approveRelease(f.post, "wrong"), /exact/);
  await approveRelease(f.post, r.revision);
  const first = await f.bundle();
  assert.equal(first.entries.length, 1);
  await fs.writeFile(
    path.join(f.post, "project.json"),
    JSON.stringify({
      title: "새 초안",
      slides: [{ id: "cover", headline: "변경" }],
    }),
  );
  assert.equal((await f.bundle()).entries[0].revision, r.revision);
  assert.equal((await f.bundle("review")).entries[0].title, "새 초안");
  await fs.writeFile(path.join(r.target, "01.png"), "broken");
  await assert.rejects(() => f.bundle(), /Image changed/);
});
test("tampered metadata and missing release image fail instead of silently disappearing", async (t) => {
  const f = await fixture(t),
    r = await prepareRelease(f.post);
  await approveRelease(f.post, r.revision);
  const file = path.join(r.target, "release.json"),
    release = await readJson(file);
  release.payload.title = "mutated";
  await fs.writeFile(file, JSON.stringify(release));
  await assert.rejects(() => f.bundle(), /revision mismatch/);
});
test("prepared but unapproved snapshot stays private", async (t) => {
  const f = await fixture(t),
    r = await prepareRelease(f.post);
  await fs.writeFile(
    path.join(f.post, "content.json"),
    JSON.stringify({ approvedRevision: r.revision }),
  );
  await assert.rejects(() => f.bundle(), /approval required/);
});
test("link cards share approval and asset validation workflow", async (t) => {
  const f = await fixture(t);
  await fs.writeFile(
    path.join(f.post, "content.json"),
    JSON.stringify({
      id: "test-link",
      type: "link",
      title: "공식 링크",
      href: "https://example.org/",
      cover: { path: "output/01.png", alt: "표지" },
    }),
  );
  const r = await prepareRelease(f.post);
  await approveRelease(f.post, r.revision);
  const published = await f.bundle();
  assert.equal(published.entries[0].kind, "link");
  assert.equal(published.entries[0].href, "https://example.org/");
  assert.equal(published.entries[0].external, true);
});
test("bundle hashes detect corrupt copied assets", async (t) => {
  const f = await fixture(t),
    r = await prepareRelease(f.post);
  await approveRelease(f.post, r.revision);
  const catalog = await f.bundle(),
    dir = path.join(f.root, "bundle-publish");
  await fs.appendFile(path.join(dir, catalog.entries[0].cover.path), "changed");
  await assert.rejects(() => checkBundle(catalog, dir), /changed/);
});
test("identical PNGs warn without deleting slide; withdrawal excludes post", async (t) => {
  const f = await fixture(t);
  await fs.copyFile(
    path.join(f.post, "output/01.png"),
    path.join(f.post, "output/02.png"),
  );
  const review = await f.bundle("review");
  assert.equal(review.entries[0].slideCount, 2);
  assert.ok(review.warnings.some((w) => w.includes("동일한")));
  await fs.writeFile(
    path.join(f.post, "content.json"),
    JSON.stringify({ homepageWithdrawn: true }),
  );
  assert.equal((await f.bundle("review")).entries.length, 0);
});
test("path traversal, symlink escape and executable URL denied", async (t) => {
  const f = await fixture(t);
  await assert.rejects(() => safeFile(f.post, "../project.json"), /Unsafe/);
  await fs.writeFile(path.join(f.root, "outside"), "private");
  await fs.symlink(path.join(f.root, "outside"), path.join(f.post, "escape"));
  await assert.rejects(() => safeFile(f.post, "escape"), /escapes/);
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,x",
    "//evil.test",
    "/\\evil.test",
    "https://",
  ])
    assert.equal(safeUrl(url), false, url);
  for (const url of [
    "/about/",
    "https://example.org/",
    "mailto:hello@example.org",
  ])
    assert.equal(safeUrl(url), true, url);
});
test("zoom bounds and swipe/pan distinction", () => {
  const viewport = { width: 400, height: 800 },
    image = { width: 1080, height: 1350 };
  assert.deepEqual(clampTransform(viewport, image, { zoom: 0, x: 50, y: 50 }), {
    zoom: 0.5,
    x: 0,
    y: 0,
  });
  assert.deepEqual(
    clampTransform(viewport, image, { zoom: 9, x: 9999, y: -9999 }),
    { zoom: 4, x: 600, y: -600 },
  );
  assert.equal(isSwipe(-100, 10, 300), true);
  assert.equal(isSwipe(-20, 100, 300), false);
  assert.equal(isSwipe(-100, 0, 1000), false);
});
