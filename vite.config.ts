import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs/promises";
import path from "node:path";
import {
  createBundle,
  defaultContentRoot,
  readJson,
  safeFile,
} from "./scripts/content.mjs";

export default defineConfig(({ command, mode }) => {
  const root = import.meta.dirname;
  const review = mode === "review";
  if (review && command === "build")
    throw new Error("검수용 데이터는 공개 빌드할 수 없습니다.");
  let currentReviewRoot = "";
  let refresh: Promise<void> = Promise.resolve();
  let reviewCatalog: unknown;
  let serial = 0;
  async function prepare() {
    const destination = path.join(root, ".cache/review", String(++serial));
    const contentRoot =
      process.env.NEICA_CONTENT_ROOT || (await defaultContentRoot());
    const catalog = await createBundle({
      contentRoot,
      destination,
      mode: "review",
    });
    currentReviewRoot = destination;
    reviewCatalog = catalog;
  }
  return {
    base: process.env.NEICA_BASE || "/",
    plugins: [
      react(),
      {
        name: "neica-content",
        async buildStart() {
          if (review) await prepare();
        },
        resolveId(id) {
          if (id === "virtual:neica-catalog") return "\0neica-catalog";
        },
        async load(id) {
          if (id === "\0neica-catalog") {
            if (review) {
              await refresh;
              if (!reviewCatalog) await prepare();
              return `export default ${JSON.stringify(reviewCatalog)}`;
            }
            return `export default ${JSON.stringify(await readJson(path.join(root, "src/generated/catalog.json")))}`;
          }
        },
        async configureServer(server) {
          if (!review) return;
          const contentRoot =
            process.env.NEICA_CONTENT_ROOT || (await defaultContentRoot());
          server.watcher.add(contentRoot);
          let timer: ReturnType<typeof setTimeout>;
          const update = (file: string) => {
            if (
              !file.startsWith(contentRoot) ||
              !/(export|release|content|neica-project|project)\.json$|output\/\d+\.png$/.test(
                file,
              )
            )
              return;
            clearTimeout(timer);
            timer = setTimeout(() => {
              refresh = refresh
                .catch(() => {})
                .then(async () => {
                  await prepare();
                  const module =
                    server.moduleGraph.getModuleById("\0neica-catalog");
                  if (module) server.moduleGraph.invalidateModule(module);
                  server.ws.send({ type: "full-reload" });
                })
                .catch((error) =>
                  server.config.logger.error(
                    `검수 목록 갱신 실패: ${error.message}`,
                  ),
                );
            }, 1200);
          };
          server.watcher
            .on("add", update)
            .on("change", update)
            .on("unlink", update);
          server.httpServer?.once("close", () => {
            clearTimeout(timer);
            server.watcher
              .off("add", update)
              .off("change", update)
              .off("unlink", update);
          });
          server.middlewares.use("/__review__", async (req, res) => {
            try {
              await refresh;
              const relative = decodeURIComponent(
                new URL(req.url || "/", "http://local").pathname,
              ).slice(1);
              const file = await safeFile(currentReviewRoot, relative);
              const ext = path.extname(file);
              const mime: Record<string, string> = {
                ".png": "image/png",
                ".webp": "image/webp",
                ".jpg": "image/jpeg",
                ".json": "application/json",
              };
              if (!mime[ext]) {
                res.statusCode = 404;
                res.end();
                return;
              }
              res.setHeader("Content-Type", mime[ext]);
              res.setHeader("Cache-Control", "no-store");
              res.end(await fs.readFile(file));
            } catch {
              res.statusCode = 404;
              res.end("Not found");
            }
          });
        },
      },
    ],
    build: {
      rolldownOptions: {
        input: Object.fromEntries(
          [
            "index",
            "about/index",
            "labs/index",
            "community/index",
            "link/index",
            "404",
          ].map((name) => [name, path.join(root, `${name}.html`)]),
        ),
      },
    },
  };
});
