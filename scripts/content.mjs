import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const canonical = (value) => JSON.stringify(sortKeys(value));
function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortKeys(value[key])]),
    );
  return value;
}
export const readJson = async (file) =>
  JSON.parse(await fs.readFile(file, "utf8"));
const exists = async (file) =>
  fs.access(file).then(
    () => true,
    () => false,
  );
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function slug(value) {
  assert(
    typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value),
    `Invalid identifier: ${value}`,
  );
  return value;
}
export function safeUrl(url) {
  if (typeof url !== "string" || /[\\\s]/.test(url)) return false;
  if (/^\/(?!\/)/.test(url)) return true;
  try {
    const parsed = new URL(url);
    return (
      ["http:", "https:", "mailto:"].includes(parsed.protocol) &&
      (parsed.protocol === "mailto:" ? !!parsed.pathname : !!parsed.hostname)
    );
  } catch {
    return false;
  }
}
export async function safeFile(root, relative) {
  assert(
    typeof relative === "string" &&
      relative &&
      !path.isAbsolute(relative) &&
      !relative.split(/[\\/]/).includes("..") &&
      !relative.includes("\\"),
    `Unsafe asset path: ${relative}`,
  );
  const base = await fs.realpath(root);
  const actual = await fs.realpath(path.join(root, relative));
  assert(
    actual.startsWith(base + path.sep),
    `Asset escapes content folder: ${relative}`,
  );
  return actual;
}
async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n");
}
export async function defaultContentRoot() {
  const proposed = path.resolve(appRoot, "../contents");
  return exists(proposed).then((ok) =>
    ok ? proposed : path.resolve(appRoot, "../public/assets"),
  );
}
export async function findPostFolders(root) {
  const found = [];
  async function walk(dir, depth) {
    if (depth > 4) return;
    const names = await fs.readdir(dir, { withFileTypes: true });
    if (
      names.some(
        (x) =>
          x.isFile() &&
          ["content.json", "project.json", "neica-project.json"].includes(
            x.name,
          ),
      )
    ) {
      found.push(dir);
      return;
    }
    for (const item of names)
      if (
        item.isDirectory() &&
        !["images", "output", "releases", "node_modules"].includes(item.name) &&
        !item.name.startsWith(".")
      )
        await walk(path.join(dir, item.name), depth + 1);
  }
  await walk(root, 0);
  return found.sort();
}
const cleanText = (value) => String(value || "").replace(/\*\*/g, "");
function captionOf(project) {
  const c = project.caption || {};
  return {
    body: c.body || "",
    cta: c.cta || "",
    hashtags: c.hashtags || [],
    attributions: c.attributions || [],
  };
}
export async function describeLegacy(folder) {
  const meta = (await exists(path.join(folder, "content.json")))
    ? await readJson(path.join(folder, "content.json"))
    : {};
  const locale = meta.locale === "en" ? "en" : "ko";
  if (meta.type === "link") {
    assert(safeUrl(meta.href), "Link URL is invalid");
    const file = await safeFile(folder, meta.cover.path),
      bytes = await fs.readFile(file),
      info = await sharp(bytes).metadata();
    const payload = {
      id: slug(meta.id),
      locale,
      kind: "link",
      title: meta.title,
      displayDate: meta.displayDate || "2026-09-01",
      order: meta.order ?? null,
      href: meta.href,
      cover: {
        path: meta.cover.path,
        width: info.width,
        height: info.height,
        sha256: hash(bytes),
        alt: meta.cover.alt || meta.title,
      },
    };
    return {
      schemaVersion: "neica-release.v1",
      revision: hash(canonical(payload)),
      payload,
      assetRoot: folder,
    };
  }
  const savedPath = path.join(folder, "neica-project.json");
  const source = await readJson(
    (await exists(savedPath)) ? savedPath : path.join(folder, "project.json"),
  );
  const slides = source.slides || source.carousel?.slides || [];
  const output = path.join(folder, "output");
  if (!(await exists(output))) return null;
  assert(slides.length > 0, `No slides: ${folder}`);
  const payloadSlides = [];
  for (const [i, slide] of slides.entries()) {
    const relative = `${String(i + 1).padStart(2, "0")}.png`;
    const file = await safeFile(output, relative);
    const bytes = await fs.readFile(file);
    const meta = await sharp(bytes).metadata();
    assert(
      meta.format === "png" && meta.width && meta.height,
      `Invalid PNG: ${file}`,
    );
    payloadSlides.push({
      id: slide.id || `slide-${i + 1}`,
      image: {
        path: relative,
        width: meta.width,
        height: meta.height,
        sha256: hash(bytes),
        alt: slide.altText || slide.image?.altText || cleanText(slide.headline),
      },
      text: [slide.headline, slide.body, slide.emphasis]
        .filter(Boolean)
        .map(cleanText)
        .join("\n\n"),
    });
  }
  const id = slug(
    meta.id ||
      `${path.basename(path.dirname(folder))}-${path.basename(folder)}`,
  );
  const cover = meta.coverSlideId
    ? payloadSlides.find((s) => s.id === meta.coverSlideId)?.image
    : payloadSlides[0].image;
  assert(cover, "Unknown coverSlideId");
  const payload = {
    id,
    locale,
    kind: "carousel",
    title: meta.title || source.title || source.project?.title || id,
    displayDate: meta.displayDate || source.updatedAt || "2026-09-01",
    order: meta.order ?? null,
    cover,
    slides: payloadSlides,
    caption: captionOf(source),
    sources: (source.sources || source.research?.sources || [])
      .filter((s) => safeUrl(s.url))
      .map((s) => ({
        title: s.title || s.publisher || s.url,
        url: s.url,
        ...(s.publisher ? { publisher: s.publisher } : {}),
      })),
  };
  return {
    schemaVersion: "neica-release.v1",
    revision: hash(canonical(payload)),
    payload,
    assetRoot: output,
    legacy: true,
  };
}

export async function validateRelease(release, root, { approved = true } = {}) {
  assert(
    release?.schemaVersion === "neica-release.v1",
    "Unknown release format",
  );
  const p = release.payload;
  assert(
    p && typeof p.title === "string" && p.title.trim(),
    "Release title missing",
  );
  slug(p.id);
  assert(
    release.revision === hash(canonical(p)),
    "Release changed after approval: revision mismatch",
  );
  if (approved) {
    assert(
      release.approval?.revision === release.revision &&
        !Number.isNaN(Date.parse(release.approval.at)),
      "User approval required",
    );
    assert(
      Array.isArray(release.approval.targets) &&
        release.approval.targets.includes("homepage"),
      "Homepage is not an approved target",
    );
  }
  const assets = [p.cover];
  if (p.kind === "carousel") {
    assert(
      Array.isArray(p.slides) && p.slides.length > 0,
      "Carousel has no slides",
    );
    assert(
      new Set(p.slides.map((s) => s.id)).size === p.slides.length,
      "Duplicate slide IDs",
    );
    for (const slide of p.slides) {
      assert(typeof slide.text === "string", "Slide text missing");
      assets.push(slide.image);
    }
    assert(
      p.caption &&
        typeof p.caption.body === "string" &&
        Array.isArray(p.caption.hashtags) &&
        Array.isArray(p.caption.attributions) &&
        typeof p.caption.cta === "string",
      "Caption is invalid",
    );
    assert(
      Array.isArray(p.sources) &&
        p.sources.every((s) => typeof s.title === "string" && safeUrl(s.url)),
      "Invalid sources",
    );
  } else {
    assert(p.kind === "link" && safeUrl(p.href), "Link URL is invalid");
  }
  const checked = new Set();
  for (const asset of assets) {
    assert(
      asset &&
        typeof asset.alt === "string" &&
        Number.isInteger(asset.width) &&
        Number.isInteger(asset.height),
      "Invalid image metadata",
    );
    if (checked.has(asset.path)) continue;
    const bytes = await fs.readFile(await safeFile(root, asset.path));
    assert(hash(bytes) === asset.sha256, `Image changed: ${asset.path}`);
    const info = await sharp(bytes).metadata();
    assert(
      info.width === asset.width && info.height === asset.height,
      `Image dimensions differ: ${asset.path}`,
    );
    await sharp(bytes).stats();
    checked.add(asset.path);
  }
  return release;
}

export async function createBundle({
  contentRoot,
  destination,
  mode = "publish",
  locale = "ko",
  publicPrefix = locale === "en" ? "content-en" : "content",
  catalogFilename = locale === "en" ? "catalog.en.json" : "catalog.json",
}) {
  assert(["publish", "review"].includes(mode), "Invalid mode");
  assert(["ko", "en"].includes(locale), "Invalid locale");
  const folders = await findPostFolders(contentRoot);
  const entries = [],
    files = {},
    warnings = [];
  const root = path.join(destination, publicPrefix);
  await fs.mkdir(root, { recursive: true });
  async function emit(relative, bytes) {
    const out = path.join(destination, relative);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, bytes);
    files[relative] = hash(bytes);
  }
  for (const folder of folders) {
    const metaPath = path.join(folder, "content.json");
    const meta = (await exists(metaPath)) ? await readJson(metaPath) : {};
    const folderLocale = meta.locale === "en" ? "en" : "ko";
    if (folderLocale !== locale) continue;
    if (meta.homepageWithdrawn === true) continue;
    let release, assetRoot;
    if (meta.approvedRevision && mode === "publish") {
      assert(
        /^[a-f0-9]{64}$/.test(meta.approvedRevision),
        "Invalid approvedRevision",
      );
      assetRoot = path.join(folder, "releases", meta.approvedRevision);
      release = await readJson(path.join(assetRoot, "release.json"));
      assert(
        release.revision === meta.approvedRevision,
        "Approval pointer mismatch",
      );
      assert(
        !meta.id || meta.id === release.payload.id,
        "Content identity mismatch",
      );
      await validateRelease(release, assetRoot);
    } else if (mode === "review") {
      try {
        release = await describeLegacy(folder);
      } catch (error) {
        warnings.push(`${path.basename(folder)}: ${error.message}`);
        continue;
      }
      if (!release) continue;
      assetRoot = release.assetRoot;
      await validateRelease(release, assetRoot, { approved: false });
      warnings.push(
        `${release.payload.title}: 검수용 · 최신 편집본과 이미지 일치 여부 확인 필요`,
      );
    } else continue;
    const p = release.payload,
      prefix = `${publicPrefix}/${p.id}/${release.revision}`;
    assert(
      !entries.some((e) => e.id === p.id),
      `Duplicate content ID: ${p.id}`,
    );
    const imageMap = new Map();
    const assets = [
      p.cover,
      ...(p.kind === "carousel" ? p.slides.map((s) => s.image) : []),
    ];
    for (const asset of assets) {
      if (imageMap.has(asset.path)) continue;
      const extension = path.extname(asset.path).toLowerCase();
      assert(
        [".png", ".jpg", ".jpeg", ".webp"].includes(extension),
        "Unsupported public image",
      );
      const target = `${prefix}/${asset.sha256.slice(0, 20)}${extension}`;
      await emit(
        target,
        await fs.readFile(await safeFile(assetRoot, asset.path)),
      );
      imageMap.set(asset.path, {
        path: target,
        width: asset.width,
        height: asset.height,
        alt: asset.alt,
      });
    }
    const cover = { ...imageMap.get(p.cover.path), variants: [] };
    for (const width of [540, 1080]) {
      const name = `${prefix}/cover-${width}.webp`;
      await emit(
        name,
        await sharp(await safeFile(assetRoot, p.cover.path))
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 92 })
          .toBuffer(),
      );
      cover.variants.push({
        path: name,
        width: Math.min(width, p.cover.width),
      });
    }
    const entry = {
      id: p.id,
      locale,
      revision: release.revision,
      title: p.title,
      displayDate: p.displayDate,
      order: p.order ?? null,
      kind: p.kind,
      cover,
    };
    if (p.kind === "carousel") {
      entry.slideCount = p.slides.length;
      entry.postPath = `${prefix}/post.json`;
      const post = {
        schemaVersion: "neica-post.v1",
        id: p.id,
        revision: release.revision,
        title: p.title,
        slides: p.slides.map((s) => ({
          id: s.id,
          image: imageMap.get(s.image.path),
          text: s.text,
        })),
        caption: p.caption,
        sources: p.sources,
      };
      await emit(entry.postPath, Buffer.from(JSON.stringify(post)));
      const hashes = p.slides.map((s) => s.image.sha256);
      if (new Set(hashes).size !== hashes.length)
        warnings.push(`${p.title}: 동일한 슬라이드 이미지가 있습니다.`);
    } else {
      entry.href = p.href;
      entry.external = /^https?:\/\//i.test(p.href);
    }
    entries.push(entry);
  }
  entries.sort(
    (a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      String(b.displayDate).localeCompare(String(a.displayDate)) ||
      a.id.localeCompare(b.id),
  );
  const catalog = {
    schemaVersion: "neica-catalog.v1",
    mode,
    locale,
    publicPrefix,
    buildId: hash(canonical({ entries, files })),
    entries,
    files,
    ...(mode === "review" ? { warnings } : {}),
  };
  await writeJson(path.join(destination, catalogFilename), catalog);
  await checkBundle(catalog, destination, mode);
  return catalog;
}

export async function checkBundle(catalog, root, expectedMode = "publish") {
  assert(
    catalog.schemaVersion === "neica-catalog.v1" &&
      catalog.mode === expectedMode,
    "Review data cannot be published",
  );
  assert(
    Array.isArray(catalog.entries) &&
      catalog.files &&
      typeof catalog.files === "object",
    "Invalid catalog",
  );
  if (catalog.entries.length || Object.keys(catalog.files).length)
    assert(
      catalog.buildId ===
        hash(canonical({ entries: catalog.entries, files: catalog.files })),
      "Catalog was changed manually",
    );
  const publicPrefix = catalog.publicPrefix || "content";
  const seen = new Set();
  const requireFile = (relative) =>
    assert(
      typeof relative === "string" &&
        relative.startsWith(`${publicPrefix}/`) &&
        catalog.files[relative],
      `Asset missing from manifest: ${relative}`,
    );
  for (const [file, digest] of Object.entries(catalog.files)) {
    assert(file.startsWith(`${publicPrefix}/`), "Unexpected bundle file");
    assert(
      hash(await fs.readFile(await safeFile(root, file))) === digest,
      `Bundle file changed: ${file}`,
    );
  }
  for (const entry of catalog.entries) {
    slug(entry.id);
    assert(!seen.has(entry.id), "Duplicate catalog ID");
    seen.add(entry.id);
    requireFile(entry.cover.path);
    for (const v of entry.cover.variants || []) requireFile(v.path);
    if (entry.kind === "link") {
      assert(safeUrl(entry.href), "Unsafe link");
      continue;
    }
    assert(entry.kind === "carousel", "Unknown card kind");
    requireFile(entry.postPath);
    const post = await readJson(await safeFile(root, entry.postPath));
    assert(
      post.schemaVersion === "neica-post.v1" &&
        post.id === entry.id &&
        post.revision === entry.revision,
      "Post identity mismatch",
    );
    assert(
      Array.isArray(post.slides) &&
        post.slides.length === entry.slideCount &&
        post.slides.length > 0,
      "Slide count mismatch",
    );
    for (const slide of post.slides) requireFile(slide.image.path);
  }
}

export async function syncPublic(contentRoot) {
  const stage = await fs.mkdtemp(path.join(os.tmpdir(), "neica-publish-"));
  try {
    const catalogs = {
      ko: await createBundle({
        contentRoot,
        destination: stage,
        locale: "ko",
        publicPrefix: "content",
        catalogFilename: "catalog.ko.json",
      }),
      en: await createBundle({
        contentRoot,
        destination: stage,
        locale: "en",
        publicPrefix: "content-en",
        catalogFilename: "catalog.en.json",
      }),
    };
    const publicRoot = path.join(appRoot, "public");
    const previous = {
      ko: await readJson(path.join(appRoot, "src/generated/catalog.json")),
      en: (await exists(path.join(appRoot, "src/generated/catalog.en.json")))
        ? await readJson(path.join(appRoot, "src/generated/catalog.en.json"))
        : { files: {} },
    };
    // Retain exactly the previous catalog's files for already-open tabs.
    for (const locale of ["ko", "en"])
      for (const file of Object.keys(previous[locale].files || {}))
        if (
          !catalogs[locale].files[file] &&
          (await exists(path.join(publicRoot, file)))
        ) {
          const dest = path.join(stage, file);
          await fs.mkdir(path.dirname(dest), { recursive: true });
          await fs.copyFile(await safeFile(publicRoot, file), dest);
        }
    await fs.mkdir(publicRoot, { recursive: true });
    const timestamp = Date.now();
    const swaps = [];
    for (const name of ["content", "content-en"]) {
      const current = path.join(publicRoot, name);
      const incoming = path.join(publicRoot, `.${name}-${timestamp}`);
      const old = path.join(appRoot, ".cache", `previous-${name}-${timestamp}`);
      await fs.cp(path.join(stage, name), incoming, { recursive: true });
      await fs.mkdir(path.dirname(old), { recursive: true });
      if (await exists(current)) await fs.rename(current, old);
      swaps.push({ current, incoming, old });
    }
    try {
      for (const { current, incoming } of swaps)
        await fs.rename(incoming, current);
      await writeJson(
        path.join(appRoot, "src/generated/catalog.json"),
        catalogs.ko,
      );
      await writeJson(
        path.join(appRoot, "src/generated/catalog.en.json"),
        catalogs.en,
      );
    } catch (error) {
      for (const { current, incoming, old } of swaps.reverse()) {
        if (await exists(current)) await fs.rename(current, incoming);
        if (await exists(old)) await fs.rename(old, current);
      }
      throw error;
    }
    console.log(
      `공개 콘텐츠 ko ${catalogs.ko.entries.length}개 · en ${catalogs.en.entries.length}개 준비 완료`,
    );
    return catalogs;
  } finally {
    await fs.rm(stage, { recursive: true, force: true });
  }
}

export async function prepareRelease(folder) {
  const release = await describeLegacy(folder);
  assert(release, "Export PNGs before preparing a release");
  const target = path.join(folder, "releases", release.revision);
  if (await exists(path.join(target, "release.json")))
    return { revision: release.revision, target };
  await fs.mkdir(target, { recursive: true });
  const assets = [
    release.payload.cover,
    ...(release.payload.slides || []).map((s) => s.image),
  ];
  for (const asset of assets) {
    const dest = path.join(target, asset.path);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(await safeFile(release.assetRoot, asset.path), dest);
  }
  await writeJson(path.join(target, "release.json"), {
    schemaVersion: release.schemaVersion,
    revision: release.revision,
    payload: release.payload,
  });
  return { revision: release.revision, target };
}
export async function approveRelease(folder, revision) {
  assert(
    /^[a-f0-9]{64}$/.test(revision || ""),
    "Provide the exact reviewed revision with --confirm-revision",
  );
  const root = path.join(folder, "releases", revision);
  const release = await readJson(path.join(root, "release.json"));
  await validateRelease(release, root, { approved: false });
  assert(release.revision === revision, "Reviewed revision mismatch");
  release.approval = {
    revision,
    at: new Date().toISOString(),
    targets: ["homepage", "instagram"],
  };
  await writeJson(path.join(root, "release.json"), release);
  const file = path.join(folder, "content.json");
  const meta = (await exists(file)) ? await readJson(file) : {};
  await writeJson(file, {
    ...meta,
    schemaVersion: "neica-content.v1",
    id: release.payload.id,
    type: release.payload.kind,
    editorialStatus: "approved",
    approvedRevision: revision,
  });
  return release;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [command, ...args] = process.argv.slice(2);
  const option = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  try {
    if (command === "sync")
      await syncPublic(
        path.resolve(
          option("--root") ||
            process.env.NEICA_CONTENT_ROOT ||
            (await defaultContentRoot()),
        ),
      );
    else if (command === "check") {
      for (const filename of ["catalog.json", "catalog.en.json"])
        await checkBundle(
          await readJson(path.join(appRoot, "src/generated", filename)),
          path.join(appRoot, "public"),
        );
      console.log("공개 콘텐츠 ko/en 검사 통과");
    } else if (command === "prepare") {
      assert(option("--post"), "--post is required");
      const result = await prepareRelease(path.resolve(option("--post")));
      console.log(JSON.stringify(result, null, 2));
      console.log("이미지와 문구를 검수한 뒤에만 이 revision을 확정하세요.");
    } else if (command === "approve") {
      assert(option("--post"), "--post is required");
      const result = await approveRelease(
        path.resolve(option("--post")),
        option("--confirm-revision"),
      );
      console.log(
        `확정본 저장: ${result.revision} · 아직 게시되지 않았습니다.`,
      );
    } else throw new Error("Use sync, check, prepare or approve");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
