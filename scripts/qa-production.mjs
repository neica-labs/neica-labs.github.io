// Exercises a separate disposable checkout. Real post approvals are never modified.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import sharp from "sharp";
import { chromium } from "@playwright/test";
import {
  appRoot,
  createBundle,
  prepareRelease,
  approveRelease,
  safeFile,
} from "./content.mjs";

const root = await fs.mkdtemp(path.join(os.tmpdir(), "neica-production-"));
const app = path.join(root, "homepage");
await fs.mkdir(app);
let browser, server;
try {
  for (const name of [
    "src",
    "scripts",
    "index.html",
    "404.html",
    "about",
    "labs",
    "community",
    "contact",
    "link",
    "vite.config.ts",
    "tsconfig.json",
    "package.json",
  ])
    await fs.cp(path.join(appRoot, name), path.join(app, name), {
      recursive: true,
    });
  await fs.symlink(
    path.join(appRoot, "node_modules"),
    path.join(app, "node_modules"),
    "dir",
  );
  const contents = path.join(root, "contents"),
    post = path.join(contents, "sample");
  await fs.mkdir(path.join(post, "output"), { recursive: true });
  await fs.writeFile(
    path.join(post, "project.json"),
    JSON.stringify({
      title: "배포 경로 테스트",
      slides: [
        { id: "one", headline: "테스트 표지" },
        { id: "two", headline: "질문인가요?" },
      ],
    }),
  );
  for (const [name, color] of [
    ["01", "#555"],
    ["02", "#fff"],
  ])
    await sharp({
      create: { width: 108, height: 135, channels: 3, background: color },
    })
      .png()
      .toFile(path.join(post, "output", name + ".png"));
  const release = await prepareRelease(post);
  await approveRelease(post, release.revision);
  const link = path.join(contents, "link");
  await fs.mkdir(link);
  await fs.copyFile(
    path.join(post, "output/01.png"),
    path.join(link, "cover.png"),
  );
  await fs.writeFile(
    path.join(link, "content.json"),
    JSON.stringify({
      id: "sample-link",
      type: "link",
      title: "Labs 링크 테스트",
      href: "/labs/",
      cover: { path: "cover.png", alt: "테스트 표지" },
    }),
  );
  const lr = await prepareRelease(link);
  await approveRelease(link, lr.revision);
  const catalog = await createBundle({
    contentRoot: contents,
    destination: path.join(app, "public"),
  });
  const englishCatalog = await createBundle({
    contentRoot: contents,
    destination: path.join(app, "public"),
    locale: "en",
    publicPrefix: "content-en",
    catalogFilename: "catalog.en.json",
  });
  await fs.writeFile(
    path.join(app, "src/generated/catalog.json"),
    JSON.stringify(catalog),
  );
  await fs.writeFile(
    path.join(app, "src/generated/catalog.en.json"),
    JSON.stringify(englishCatalog),
  );
  const build = spawnSync("npm", ["run", "build"], {
    cwd: app,
    env: { ...process.env, NEICA_BASE: "/neica-test/" },
    encoding: "utf8",
  });
  assert.equal(build.status, 0, build.stdout + build.stderr);
  server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (!url.pathname.startsWith("/neica-test/")) throw Error();
      const relative = decodeURIComponent(
        url.pathname.slice("/neica-test/".length),
      );
      const file = await safeFile(
        path.join(app, "dist"),
        relative.endsWith("/") || !relative
          ? relative + "index.html"
          : relative,
      );
      const mime = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".webp": "image/webp",
        ".json": "application/json",
      };
      res.setHeader(
        "Content-Type",
        mime[path.extname(file)] || "application/octet-stream",
      );
      res.end(await fs.readFile(file));
    } catch {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(await fs.readFile(path.join(app, "dist/404.html")));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}/neica-test/`;
  browser = await chromium.launch();
  const page = await browser.newPage();
  const failures = [],
    errors = [];
  page.on("requestfailed", (r) => failures.push(r.url()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await page.locator(".card-link").first().waitFor();
  assert.equal(await page.locator(".card-link").count(), 2);
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".card-link img")].every(
      (i) => i.complete && i.naturalWidth > 0,
    ),
  );
  assert.ok(
    (
      await page.locator(".card-link img").first().getAttribute("src")
    ).startsWith("/neica-test/content/"),
  );
  const carousel = catalog.entries.find((e) => e.kind === "carousel");
  await page.goto(`${base}?post=${carousel.id}&slide=2`);
  await page.locator(".slide-image").waitFor();
  assert.ok(
    (await page.locator(".slide-image").getAttribute("src")).startsWith(
      "/neica-test/content/",
    ),
  );
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "detached" });
  await page
    .getByRole("link", { name: "Labs 링크 테스트, 페이지로 이동", exact: true })
    .click();
  assert.equal(page.url(), base + "labs/");
  assert.equal(await page.locator("dialog").count(), 0);
  for (const route of ["about/", "labs/", "community/", "contact/"]) {
    await page.goto(base + route);
    await page.locator("main h1").waitFor();
    await page.reload();
    await page.locator("main h1").waitFor();
  }
  const notFound = await page.goto(base + "missing");
  assert.equal(notFound.status(), 404);
  await page.getByRole("link", { name: "LABS로 돌아가기 ↗" }).waitFor();
  const version = await (await page.request.get(base + "build.json")).json();
  assert.equal(version.buildId, `${catalog.buildId}:${englishCatalog.buildId}`);
  assert.deepEqual(failures, []);
  assert.deepEqual(errors, []);
  console.log(
    "Production QA passed: /neica-test/ assets, approved carousel, link card, direct pages, reload, 404, buildId.",
  );
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  await fs.rm(root, { recursive: true, force: true });
}
