import fs from "node:fs/promises";
import path from "node:path";
import { appRoot, readJson, checkBundle } from "./content.mjs";

const dist = path.join(appRoot, "dist");
const catalogs = {
  ko: await readJson(path.join(appRoot, "src/generated/catalog.json")),
  en: await readJson(path.join(appRoot, "src/generated/catalog.en.json")),
};
for (const catalog of Object.values(catalogs)) await checkBundle(catalog, dist);
for (const route of [
  "index.html",
  "about/index.html",
  "labs/index.html",
  "community/index.html",
  "contact/index.html",
  "404.html",
]) {
  const html = await fs.readFile(path.join(dist, route), "utf8");
  if (!html.includes('lang="ko"') || !html.includes("<title>"))
    throw Error(`Incomplete page: ${route}`);
}
let size = 0;
async function inspect(folder) {
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw Error("Symlinks cannot be deployed");
    if (
      /^(planner|images|\.cache|project\.json|neica-project\.json|release\.json|research\.md)$/.test(
        entry.name,
      )
    )
      throw Error(`Private file in build: ${entry.name}`);
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else size += (await fs.stat(file)).size;
  }
}
await inspect(dist);
if (size > 750 * 1024 * 1024)
  throw Error("Build exceeds 750 MB. Review image storage before deploying.");
await fs.writeFile(
  path.join(dist, "build.json"),
  JSON.stringify({
    schemaVersion: "neica-build.v1",
    buildId: `${catalogs.ko.buildId}:${catalogs.en.buildId}`,
    posts: {
      ko: catalogs.ko.entries.length,
      en: catalogs.en.entries.length,
    },
    builtAt: new Date().toISOString(),
  }) + "\n",
);
await fs.writeFile(path.join(dist, ".nojekyll"), "");
console.log(
  `정적 배포 검사 통과 · 콘텐츠 ko ${catalogs.ko.entries.length}개 / en ${catalogs.en.entries.length}개 · ${(size / 1024 / 1024).toFixed(2)} MB`,
);
