import 'js-yaml';
import 'smol-toml';
import path, { relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import '@astrojs/markdown-remark';
import { slug } from 'github-slugger';
import colors from 'piccolore';
import 'xxhash-wasm';
import * as z from 'zod';
import { z as z$1 } from 'zod';
import { slash } from '@astrojs/internal-helpers/path';
import 'common-ancestor-path';
import { C as CONTENT_LAYER_TYPE, L as LIVE_CONTENT_TYPE, g as getCollectionPathFromRoot, n as defineCollection } from './translations-DODf8bvg.js';
import { a as AstroUserError } from './astro/server-CLdwTDY0.js';
import './_astro_assets-CQpRG8Ui.js';
import { existsSync, promises } from 'node:fs';
import pLimit from 'p-limit';
import picomatch from 'picomatch';
import { glob as glob$1 } from 'tinyglobby';
import { d as docsSchema } from './index@_@astro-CXJ0RgpM.js';
import fs from 'node:fs/promises';
import { r as stripLeadingAndTrailingSlash, t as stripTrailingSlash } from './middleware-VlC8AfLK.js';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import { visit, SKIP, CONTINUE } from 'unist-util-visit';

const isWindows = typeof process !== "undefined" && process.platform === "win32";
function normalizePath(id) {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

function generateIdDefault({ entry, base, data }) {
  if (data.slug) {
    return data.slug;
  }
  const entryURL = new URL(encodeURI(entry), base);
  const { slug } = getContentEntryIdAndSlug({
    entry: entryURL,
    contentDir: base,
    collection: ""
  });
  return slug;
}
function checkPrefix(pattern, prefix) {
  if (Array.isArray(pattern)) {
    return pattern.some((p) => p.startsWith(prefix));
  }
  return pattern.startsWith(prefix);
}
function glob(globOptions) {
  if (checkPrefix(globOptions.pattern, "../")) {
    throw new Error(
      "Glob patterns cannot start with `../`. Set the `base` option to a parent directory instead."
    );
  }
  if (checkPrefix(globOptions.pattern, "/")) {
    throw new Error(
      "Glob patterns cannot start with `/`. Set the `base` option to a parent directory or use a relative path instead."
    );
  }
  const generateId = globOptions?.generateId ?? generateIdDefault;
  const fileToIdMap = /* @__PURE__ */ new Map();
  return {
    name: "glob-loader",
    load: async ({ config, logger, watcher, parseData, store, generateDigest, entryTypes }) => {
      const renderFunctionByContentType = /* @__PURE__ */ new WeakMap();
      const untouchedEntries = new Set(store.keys());
      const isLegacy = globOptions._legacy;
      const emulateLegacyCollections = !config.legacy.collections;
      async function syncData(entry, base, entryType, oldId) {
        if (!entryType) {
          logger.warn(`No entry type found for ${entry}`);
          return;
        }
        const fileUrl = new URL(encodeURI(entry), base);
        const contents = await promises.readFile(fileUrl, "utf-8").catch((err) => {
          logger.error(`Error reading ${entry}: ${err.message}`);
          return;
        });
        if (!contents && contents !== "") {
          logger.warn(`No contents found for ${entry}`);
          return;
        }
        const { body, data } = await entryType.getEntryInfo({
          contents,
          fileUrl
        });
        const id = generateId({ entry, base, data });
        if (oldId && oldId !== id) {
          store.delete(oldId);
        }
        let legacyId;
        if (isLegacy) {
          const entryURL = new URL(encodeURI(entry), base);
          const legacyOptions = getContentEntryIdAndSlug({
            entry: entryURL,
            contentDir: base,
            collection: ""
          });
          legacyId = legacyOptions.id;
        }
        untouchedEntries.delete(id);
        const existingEntry = store.get(id);
        const digest = generateDigest(contents);
        const filePath2 = fileURLToPath(fileUrl);
        if (existingEntry && existingEntry.digest === digest && existingEntry.filePath) {
          if (existingEntry.deferredRender) {
            store.addModuleImport(existingEntry.filePath);
          }
          if (existingEntry.assetImports?.length) {
            store.addAssetImports(existingEntry.assetImports, existingEntry.filePath);
          }
          fileToIdMap.set(filePath2, id);
          return;
        }
        const relativePath2 = posixRelative(fileURLToPath(config.root), filePath2);
        const parsedData = await parseData({
          id,
          data,
          filePath: filePath2
        });
        if (entryType.getRenderFunction) {
          if (isLegacy && data.layout) {
            logger.error(
              `The Markdown "layout" field is not supported in content collections in Astro 5. Ignoring layout for ${JSON.stringify(entry)}. Enable "legacy.collections" if you need to use the layout field.`
            );
          }
          let render = renderFunctionByContentType.get(entryType);
          if (store.has(id)) {
            logger.warn(
              `Duplicate id "${id}" found in ${filePath2}. Later items with the same id will overwrite earlier ones.`
            );
          }
          if (!render) {
            render = await entryType.getRenderFunction(config);
            renderFunctionByContentType.set(entryType, render);
          }
          let rendered = void 0;
          try {
            rendered = await render?.({
              id,
              data,
              body,
              filePath: filePath2,
              digest
            });
          } catch (error) {
            logger.error(`Error rendering ${entry}: ${error.message}`);
          }
          store.set({
            id,
            data: parsedData,
            body,
            filePath: relativePath2,
            digest,
            rendered,
            assetImports: rendered?.metadata?.imagePaths,
            legacyId
          });
        } else if ("contentModuleTypes" in entryType) {
          store.set({
            id,
            data: parsedData,
            body,
            filePath: relativePath2,
            digest,
            deferredRender: true,
            legacyId
          });
        } else {
          store.set({ id, data: parsedData, body, filePath: relativePath2, digest, legacyId });
        }
        fileToIdMap.set(filePath2, id);
      }
      const baseDir = globOptions.base ? new URL(globOptions.base, config.root) : config.root;
      if (!baseDir.pathname.endsWith("/")) {
        baseDir.pathname = `${baseDir.pathname}/`;
      }
      const filePath = fileURLToPath(baseDir);
      const relativePath = relative(fileURLToPath(config.root), filePath);
      const exists = existsSync(baseDir);
      if (!exists) {
        logger.warn(`The base directory "${fileURLToPath(baseDir)}" does not exist.`);
      }
      const files = await glob$1(globOptions.pattern, {
        cwd: fileURLToPath(baseDir),
        expandDirectories: false
      });
      if (exists && files.length === 0) {
        logger.warn(
          `No files found matching "${globOptions.pattern}" in directory "${relativePath}"`
        );
        return;
      }
      function configForFile(file) {
        const ext = file.split(".").at(-1);
        if (!ext) {
          logger.warn(`No extension found for ${file}`);
          return;
        }
        return entryTypes.get(`.${ext}`);
      }
      const limit = pLimit(10);
      const skippedFiles = [];
      const contentDir = new URL("content/", config.srcDir);
      function isInContentDir(file) {
        const fileUrl = new URL(file, baseDir);
        return fileUrl.href.startsWith(contentDir.href);
      }
      const configFiles = new Set(
        ["config.js", "config.ts", "config.mjs"].map((file) => new URL(file, contentDir).href)
      );
      function isConfigFile(file) {
        const fileUrl = new URL(file, baseDir);
        return configFiles.has(fileUrl.href);
      }
      await Promise.all(
        files.map((entry) => {
          if (isConfigFile(entry)) {
            return;
          }
          if (!emulateLegacyCollections && isInContentDir(entry)) {
            skippedFiles.push(entry);
            return;
          }
          return limit(async () => {
            const entryType = configForFile(entry);
            await syncData(entry, baseDir, entryType);
          });
        })
      );
      const skipCount = skippedFiles.length;
      if (skipCount > 0) {
        const patternList = Array.isArray(globOptions.pattern) ? globOptions.pattern.join(", ") : globOptions.pattern;
        logger.warn(
          `The glob() loader cannot be used for files in ${colors.bold("src/content")} when legacy mode is enabled.`
        );
        if (skipCount > 10) {
          logger.warn(
            `Skipped ${colors.green(skippedFiles.length)} files that matched ${colors.green(patternList)}.`
          );
        } else {
          logger.warn(`Skipped the following files that matched ${colors.green(patternList)}:`);
          skippedFiles.forEach((file) => logger.warn(`\u2022 ${colors.green(file)}`));
        }
      }
      untouchedEntries.forEach((id) => store.delete(id));
      if (!watcher) {
        return;
      }
      watcher.add(filePath);
      const matchesGlob = (entry) => !entry.startsWith("../") && picomatch.isMatch(entry, globOptions.pattern);
      const basePath = fileURLToPath(baseDir);
      async function onChange(changedPath) {
        const entry = posixRelative(basePath, changedPath);
        if (!matchesGlob(entry)) {
          return;
        }
        const entryType = configForFile(changedPath);
        const baseUrl = pathToFileURL(basePath);
        const oldId = fileToIdMap.get(changedPath);
        await syncData(entry, baseUrl, entryType, oldId);
        logger.info(`Reloaded data from ${colors.green(entry)}`);
      }
      watcher.on("change", onChange);
      watcher.on("add", onChange);
      watcher.on("unlink", async (deletedPath) => {
        const entry = posixRelative(basePath, deletedPath);
        if (!matchesGlob(entry)) {
          return;
        }
        const id = fileToIdMap.get(deletedPath);
        if (id) {
          store.delete(id);
          fileToIdMap.delete(deletedPath);
        }
      });
    }
  };
}

const entryTypeSchema = z$1.object({
  id: z$1.string({
    invalid_type_error: "Content entry `id` must be a string"
    // Default to empty string so we can validate properly in the loader
  })
}).passthrough();
z$1.union([
  z$1.array(entryTypeSchema),
  z$1.record(
    z$1.string(),
    z$1.object({
      id: z$1.string({
        invalid_type_error: "Content entry `id` must be a string"
      }).optional()
    }).passthrough()
  )
]);
const collectionConfigParser = z$1.union([
  z$1.object({
    type: z$1.literal("content").optional().default("content"),
    schema: z$1.any().optional()
  }),
  z$1.object({
    type: z$1.literal("data"),
    schema: z$1.any().optional()
  }),
  z$1.object({
    type: z$1.literal(CONTENT_LAYER_TYPE),
    schema: z$1.any().optional(),
    loader: z$1.union([
      z$1.function(),
      z$1.object({
        name: z$1.string(),
        load: z$1.function(
          z$1.tuple(
            [
              z$1.object({
                collection: z$1.string(),
                store: z$1.any(),
                meta: z$1.any(),
                logger: z$1.any(),
                config: z$1.any(),
                entryTypes: z$1.any(),
                parseData: z$1.any(),
                renderMarkdown: z$1.any(),
                generateDigest: z$1.function(z$1.tuple([z$1.any()], z$1.string())),
                watcher: z$1.any().optional(),
                refreshContextData: z$1.record(z$1.unknown()).optional()
              })
            ],
            z$1.unknown()
          )
        ),
        schema: z$1.any().optional(),
        render: z$1.function(z$1.tuple([z$1.any()], z$1.unknown())).optional()
      })
    ]),
    /** deprecated */
    _legacy: z$1.boolean().optional()
  }),
  z$1.object({
    type: z$1.literal(LIVE_CONTENT_TYPE).optional().default(LIVE_CONTENT_TYPE),
    schema: z$1.any().optional(),
    loader: z$1.function()
  })
]);
z$1.object({
  collections: z$1.record(collectionConfigParser)
});
function getContentEntryIdAndSlug({
  entry,
  contentDir,
  collection
}) {
  const relativePath = getRelativeEntryPath(entry, collection, contentDir);
  const withoutFileExt = relativePath.replace(new RegExp(path.extname(relativePath) + "$"), "");
  const rawSlugSegments = withoutFileExt.split(path.sep);
  const slug$1 = rawSlugSegments.map((segment) => slug(segment)).join("/").replace(/\/index$/, "");
  const res = {
    id: normalizePath(relativePath),
    slug: slug$1
  };
  return res;
}
function getRelativeEntryPath(entry, collection, contentDir) {
  const relativeToContent = path.relative(fileURLToPath(contentDir), fileURLToPath(entry));
  const relativeToCollection = path.relative(collection, relativeToContent);
  return relativeToCollection;
}
function posixifyPath(filePath) {
  return filePath.split(path.sep).join("/");
}
function posixRelative(from, to) {
  return posixifyPath(path.relative(from, to));
}

const docsExtensions = ["markdown", "mdown", "mkdn", "mkd", "mdwn", "md", "mdx"];
function docsLoader({
  generateId
} = {}) {
  return {
    name: "starlight-docs-loader",
    load: createGlobLoadFn("docs", generateId)
  };
}
function createGlobLoadFn(collection, generateId) {
  return (context) => {
    const extensions = docsExtensions ;
    if (context.config.integrations.find(({ name }) => name === "@astrojs/markdoc")) {
      extensions.push("mdoc");
    }
    const options = {
      base: getCollectionPathFromRoot(collection, context.config),
      pattern: `**/[^_]*.{${extensions.join(",")}}`
    };
    if (generateId) options.generateId = generateId;
    return glob(options).load(context);
  };
}

function throwPluginError(message, error) {
  throw new AstroUserError(
    `${message}${error instanceof Error ? `

  ${error.message}
` : ""}`,
    `See the error report above for more informations.

If you believe this is a bug, please file an issue at https://github.com/HiDeoo/starlight-changelogs/issues/new/choose`
  );
}

const ProviderBaseConfigSchema = z.object({
  /**
   * The base path to use for this changelog.
   *
   * For example, setting this option to `changelog` will result in the changelog version list being available at
   * `/changelog/` and a version entry at `/changelog/versions/0.1.0/`.
   */
  base: z.string().transform((value) => stripLeadingAndTrailingSlash(value)),
  /**
   * Defines whether this specific changelog is enabled.
   *
   * When set to `false`, changelog data will not be loaded and no changelog pages or sidebar links will be generated
   * for this changelog.
   * This can be useful to disable a changelog depending on some environment variable that may not always be available.
   *
   * @default true
   */
  enabled: z.boolean().default(true),
  /**
   * Defines whether the changelog pages should be indexed by Pagefind, Starlight's default site search provider.
   *
   * @default true
   * @see https://starlight.astro.build/reference/configuration/#pagefind
   */
  pagefind: z.boolean().default(true),
  /**
   * The number of versions to display per page in the changelog version list.
   *
   * @default 10
   */
  pageSize: z.number().default(10),
  /**
   * An optional function called for every version entry in the changelog which can be used to either modify the version
   * title or filter out certain versions.
   *
   * The function receives the version title found in the changelog and can use it to return an updated title or
   * `undefined` to filter out this specific version.
   *
   * Filtering out versions can be useful for example when using the GitHub provider on a monorepo publishing releases
   * for multiple packages, and only changes for a specific package should be shown in the changelog.
   */
  process: z.function().args(
    z.object({
      /** The version title found in the changelog. */
      title: z.string()
    })
  ).returns(z.union([z.string(), z.undefined(), z.void()])).optional(),
  /**
   * The title of the changelog.
   *
   * The value can be a string, or for multilingual sites, an object with values for each different locale. When using
   * the object form, the keys must be BCP-47 tags (e.g. `en`, `fr`, or `zh-CN`).
   *
   * @default 'Changelog'
   */
  title: z.union([z.string(), z.record(z.string())]).default("Changelog")
});
const SerializedProviderBaseConfigSchema = ProviderBaseConfigSchema.pick({
  base: true,
  enabled: true,
  pagefind: true,
  pageSize: true,
  title: true
});

// src/index.ts
function getConditionalHeaders({
  init,
  meta
}) {
  const etag = meta.get("etag");
  const lastModified = meta.get("last-modified");
  const headers = new Headers(init);
  if (etag) {
    headers.set("If-None-Match", etag);
  } else if (lastModified) {
    headers.set("If-Modified-Since", lastModified);
  }
  return headers;
}
function storeConditionalHeaders({
  headers,
  meta
}) {
  const etag = headers.get("etag");
  const lastModified = headers.get("last-modified");
  meta.delete("etag");
  meta.delete("last-modified");
  if (etag) {
    meta.set("etag", etag);
  } else if (lastModified) {
    meta.set("last-modified", lastModified);
  }
}

async function fetchFromLoader(url, headers, logger) {
  let response;
  try {
    response = await fetch(url, { headers });
  } catch (error) {
    throw error;
  }
  return response ? { ok: true, response } : { ok: false };
}

function slugifyVersion(config, version) {
  const versionSlug = slug(version.replaceAll(".", " ").replaceAll("@", " "));
  return [`${config.base}/version/${versionSlug}`, versionSlug];
}

const urlRegex = /^https?:\/\//;
async function loadMarkdownData(config, context) {
  const { config: astroConfig, logger, watcher } = context;
  const isUrlString = urlRegex.test(config.changelog);
  if (isUrlString) {
    await syncData$2(new URL(config.changelog), config, context);
    return;
  }
  const path = fileURLToPath(new URL(config.changelog, astroConfig.root));
  await syncData$2(path, config, context);
  watcher?.add(path);
  watcher?.on("change", async (changedPath) => {
    if (changedPath === path) {
      logger.info(`Reloading data from ${path}`);
      await syncData$2(path, config, context);
    }
  });
}
async function syncData$2(pathOrUrl, config, context) {
  const { generateDigest, parseData, renderMarkdown, store } = context;
  try {
    const result = await getChangelogContent(pathOrUrl, context);
    if (!result.modified) return;
    const entries = parseMarkdown(config, result.content);
    for (const entry of entries) {
      const { id, body, ...data } = entry;
      const existingEntry = store.get(id);
      const digest = generateDigest({ id, content: body });
      if (existingEntry && existingEntry.digest === digest) continue;
      const parsedData = await parseData({ id, data });
      store.set({ id, body, data: parsedData, digest, rendered: await renderMarkdown(body) });
    }
  } catch (error) {
    throwPluginError(`Failed to read the changelog file at ${pathOrUrl}`, error);
  }
}
async function getChangelogContent(pathOrUrl, { logger, meta }) {
  if (typeof pathOrUrl === "string") {
    if (!existsSync(pathOrUrl)) throwPluginError(`The provided changelog file path at ${pathOrUrl} does not exist.`);
    const content = await promises.readFile(pathOrUrl, "utf8");
    return { modified: true, content };
  }
  const headers = new Headers();
  const result = await fetchFromLoader(pathOrUrl, getConditionalHeaders({ init: headers, meta }));
  if (!result.ok) return { modified: true, content: "" };
  const response = result.response;
  if (response.status === 304) return { modified: false };
  if (!response.ok)
    throwPluginError(`Failed to fetch data from ${pathOrUrl}: ${response.status} - ${response.statusText}`);
  try {
    const content = await response.text();
    storeConditionalHeaders({ headers: response.headers, meta });
    return { modified: true, content };
  } catch (error) {
    throwPluginError(`Failed to parse data from ${pathOrUrl}`, error);
  }
}
function parseMarkdown(config, content) {
  const entries = [];
  const tree = fromMarkdown(content);
  let version;
  function addEntry(version2) {
    const parsedVersion = parseMarkdownVersion(config, version2);
    if (!parsedVersion) return;
    if (config.markdown.ignoredVersions?.includes(parsedVersion.title)) return;
    entries.push(parsedVersion);
  }
  visit(tree, (node) => {
    if (node.type === "heading" && node.depth === config.markdown.versionHeadingLevel) {
      if (version) addEntry(version);
      version = { title: toString(node).trim(), nodes: [] };
      return SKIP;
    }
    if (!version) return CONTINUE;
    version.nodes.push(node);
    return SKIP;
  });
  if (version) addEntry(version);
  return entries;
}
function parseMarkdownVersion(config, version) {
  let title = version.title;
  const process = config.process ?? config.markdown.process;
  if (process) {
    const processedTitle = process({ title });
    if (!processedTitle) return;
    title = processedTitle;
  }
  const [id, slug] = slugifyVersion(config, title);
  return {
    id,
    body: toMarkdown({ type: "root", children: version.nodes }),
    base: config.base,
    provider: config.provider,
    slug,
    title
  };
}

const ChangesetProviderConfigSchema = ProviderBaseConfigSchema.extend({
  /**
   * The path or URL of the changelog file generated by Changeset to load.
   *
   * When using a path, it should be relative to the root of the Starlight project.
   * When using a URL, it should point to a raw file that contains the changelog, e.g. a GitHub raw URL.
   */
  changelog: z.string(),
  /** The type of provider used to load the changelog, `changeset` in this case. */
  provider: z.literal("changeset")
});
const provider$3 = { name: "changeset", label: "Changeset" };
const markdown$1 = { versionHeadingLevel: 2 };
async function loadChangesetData(config, context) {
  await loadMarkdownData({ ...config, markdown: markdown$1, provider: provider$3 }, context);
}

const GiteaProviderConfigSchema = ProviderBaseConfigSchema.extend({
  /**
   * The Gitea API endpoint URL to use for loading releases.
   *
   * @default 'https://gitea.com/api/v1'
   */
  api: z.string().url().default("https://gitea.com/api/v1").transform(stripTrailingSlash),
  /** The owner of the Gitea repository containing releases to load. */
  owner: z.string(),
  /** The type of provider used to load the changelog, `gitea` in this case. */
  provider: z.literal("gitea"),
  /**
   * An optional label to use for the provider instead of the default one.
   *
   * This can be useful when using a provider with a Gitea-compatible API like Codeberg. Such label is used in some
   * parts of the UI to link to the provider website.
   *
   * @default 'Gitea'
   */
  providerLabel: z.string().default("Gitea"),
  /** The name of the Gitea repository containing releases to load. */
  repo: z.string(),
  /**
   * An optional Gitea API token to use for loading releases which can be used to access private repositories.
   *
   * The token should have the `repository` permission (read).
   *
   * @see https://docs.gitea.com/development/api-usage#generating-and-listing-api-tokens
   */
  token: z.string().optional()
});
const provider$2 = { name: "gitea", label: "Gitea" };
async function loadGiteaData(config, context) {
  const result = await fetchGiteaReleases(config, context);
  if (!result.modified) return;
  await syncData$1(config, result.entries, context);
}
async function syncData$1(config, entries, { parseData, renderMarkdown, store }) {
  for (const entry of store.values()) {
    if (entry.data["base"] === config.base) store.delete(entry.id);
  }
  for (const entry of entries) {
    const { id, body, ...data } = entry;
    const parsedData = await parseData({ id, data });
    store.set({ id, body, data: parsedData, rendered: await renderMarkdown(body) });
  }
}
async function fetchGiteaReleases(config, { logger, meta }) {
  let page = "1";
  const entries = [];
  while (page) {
    const url = new URL(`${config.api}/repos/${config.owner}/${config.repo}/releases`);
    url.searchParams.set("page", page);
    url.searchParams.set("limit", "50");
    const headers = new Headers();
    headers.set("Accept", "application/json");
    if (config.token) headers.set("Authorization", `token ${config.token}`);
    const result = await fetchFromLoader(url, getConditionalHeaders({ init: headers, meta }));
    if (!result.ok) return { modified: true, entries: [] };
    const response = result.response;
    if (!response.ok) throwPluginError(`Failed to fetch Gitea data: ${response.status} - ${response.statusText}`);
    page = getGiteaApiResponseNextPage(response);
    try {
      const data = await response.json();
      const parsedData = GiteaApiReleasesSchema.parse(data);
      if (!page) storeConditionalHeaders({ headers: response.headers, meta });
      for (const release of parsedData) {
        const parsedVersion = parseGiteaReleaseVersion(config, release);
        if (parsedVersion) entries.push(parsedVersion);
      }
    } catch (error) {
      throwPluginError("Failed to parse Gitea data.", error);
    }
  }
  return entries.length > 0 ? { modified: true, entries } : { modified: false };
}
function getGiteaApiResponseNextPage(response) {
  return response.headers.get("Link")?.match(GiteaApiResponseNextPageRegex)?.[1] ?? null;
}
function parseGiteaReleaseVersion(config, release) {
  if (release.draft || release.prerelease) return;
  let title = release.name ?? release.tag_name;
  if (config.process) {
    const processedTitle = config.process({ title });
    if (!processedTitle) return;
    title = processedTitle;
  }
  const [id, slug] = slugifyVersion(config, title);
  return {
    id,
    body: release.body,
    base: config.base,
    date: release.published_at ? new Date(release.published_at) : void 0,
    link: release.html_url,
    provider: config.providerLabel ? { ...provider$2, label: config.providerLabel } : provider$2,
    slug,
    title
  };
}
const GiteaApiResponseNextPageRegex = /(?<=<)(?:[\S]*?)[&|?]page=(\d+)(?:[\S]*?)(?=>; rel="next")/i;
const GiteaApiReleasesSchema = z.object({
  body: z.string(),
  draft: z.boolean(),
  html_url: z.string(),
  name: z.string().nullable(),
  prerelease: z.boolean(),
  published_at: z.string().datetime({ offset: true }),
  tag_name: z.string()
}).array();

const GitHubProviderConfigSchema = ProviderBaseConfigSchema.extend({
  /** The owner of the GitHub repository containing releases to load. */
  owner: z.string(),
  /** The type of provider used to load the changelog, `github` in this case. */
  provider: z.literal("github"),
  /** The name of the GitHub repository containing releases to load. */
  repo: z.string(),
  /**
   * An optional GitHub fine-grained access token to use for loading releases which can be used to access private
   * repositories or to increase the rate limit for public repositories.
   *
   * The token should have the `Contents` repository permission (read).
   *
   * @see https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#list-releases--fine-grained-access-tokens
   */
  token: z.string().optional()
});
const provider$1 = { name: "github", label: "GitHub" };
async function loadGitHubData(config, context) {
  const result = await fetchGitHubReleases(config, context);
  if (!result.modified) return;
  await syncData(config, result.entries, context);
}
async function syncData(config, entries, { parseData, renderMarkdown, store }) {
  for (const entry of store.values()) {
    if (entry.data["base"] === config.base) store.delete(entry.id);
  }
  for (const entry of entries) {
    const { id, body, ...data } = entry;
    const parsedData = await parseData({ id, data });
    store.set({ id, body, data: parsedData, rendered: await renderMarkdown(body) });
  }
}
async function fetchGitHubReleases(config, { logger, meta }) {
  let page = "1";
  const entries = [];
  while (page) {
    const url = new URL(`https://api.github.com/repos/${config.owner}/${config.repo}/releases`);
    url.searchParams.set("page", page);
    url.searchParams.set("per_page", "100");
    const headers = new Headers();
    headers.set("Accept", "application/vnd.github+json");
    headers.set("X-GitHub-Api-Version", "2022-11-28");
    if (config.token) headers.set("Authorization", `Bearer ${config.token}`);
    const result = await fetchFromLoader(url, getConditionalHeaders({ init: headers, meta }));
    if (!result.ok) return { modified: true, entries: [] };
    const response = result.response;
    if (response.status === 304) return { modified: false };
    if (!response.ok) throwPluginError(`Failed to fetch GitHub data: ${response.status} - ${response.statusText}`);
    page = getGitHubApiResponseNextPage(response);
    try {
      const data = await response.json();
      const parsedData = GitHubApiReleasesSchema.parse(data);
      if (!page) storeConditionalHeaders({ headers: response.headers, meta });
      for (const release of parsedData) {
        const parsedVersion = parseGitHubReleaseVersion(config, release);
        if (parsedVersion) entries.push(parsedVersion);
      }
    } catch (error) {
      throwPluginError("Failed to parse GitHub data.", error);
    }
  }
  return entries.length > 0 ? { modified: true, entries } : { modified: false };
}
function getGitHubApiResponseNextPage(response) {
  return response.headers.get("Link")?.match(GitHubApiResponseNextPageRegex)?.[1] ?? null;
}
function parseGitHubReleaseVersion(config, release) {
  if (release.draft || release.prerelease) return;
  let title = release.name ?? release.tag_name;
  if (config.process) {
    const processedTitle = config.process({ title });
    if (!processedTitle) return;
    title = processedTitle;
  }
  const [id, slug] = slugifyVersion(config, title);
  return {
    id,
    body: release.body,
    base: config.base,
    date: release.published_at ? new Date(release.published_at) : void 0,
    link: release.html_url,
    provider: provider$1,
    slug,
    title
  };
}
const GitHubApiResponseNextPageRegex = /(?<=<)(?:[\S]*?)[&|?]page=(\d+)(?:[\S]*?)(?=>; rel="next")/i;
const GitHubApiReleasesSchema = z.object({
  body: z.string().nullable().transform((val) => val ?? ""),
  draft: z.boolean(),
  html_url: z.string(),
  name: z.string().nullable(),
  prerelease: z.boolean(),
  published_at: z.string().datetime(),
  tag_name: z.string()
}).array();

const KeepAChangelogProviderConfigSchema = ProviderBaseConfigSchema.extend({
  /**
   * The path or URL of the changelog file using the Keep a Changelog format to load.
   *
   * When using a path, it should be relative to the root of the Starlight project.
   * When using a URL, it should point to a raw file that contains the changelog, e.g. a GitHub raw URL.
   */
  changelog: z.string(),
  /** The type of provider used to load the changelog, `keep-a-changelog` in this case. */
  provider: z.literal("keep-a-changelog")
});
const provider = { name: "keep-a-changelog", label: "Keep a Changelog" };
const markdown = {
  ignoredVersions: ["Unreleased"],
  process({ title }) {
    return title.replace(/(?<version>.*?)\s-\s?\d{4}-\d{2}-\d{2}\s*$/, "$<version>");
  },
  versionHeadingLevel: 2
};
async function loadKeepAChangelogData(config, context) {
  await loadMarkdownData({ ...config, markdown, provider }, context);
}

const StarlightChangelogsLoaderConfigSchema = z.discriminatedUnion("provider", [
  ChangesetProviderConfigSchema,
  GiteaProviderConfigSchema,
  GitHubProviderConfigSchema,
  KeepAChangelogProviderConfigSchema
]).array().default([]);
function getLoaderConfigUrl(astroConfig) {
  return new URL(".astro/starlight-changelogs.json", astroConfig.root);
}
async function saveLoaderConfig(astroConfig, loaderConfig) {
  const oldConfig = await readLoaderConfig(astroConfig);
  const newConfig = JSON.stringify(loaderConfig);
  if (oldConfig === newConfig) return;
  return fs.writeFile(getLoaderConfigUrl(astroConfig), newConfig);
}
function serializeLoaderConfig(loaderConfig) {
  return loaderConfig.map((config) => SerializedProviderBaseConfigSchema.parse(config));
}
async function readLoaderConfig(astroConfig) {
  try {
    return await fs.readFile(getLoaderConfigUrl(astroConfig), "utf8");
  } catch {
    return "[]";
  }
}

const VersionEntrySchema = z.object({
  /** The base path used for the changelog this version belongs to. */
  base: z.string(),
  /** An optional date for the version entry, if available. */
  date: z.date().optional(),
  /** An optional link to the version source for remote providers, e.g. GitHub. */
  link: z.string().url().optional(),
  /** The provider used for the associated changelog. */
  provider: z.object({
    /** The name of the provider. */
    name: z.string(),
    /** A human-readable label for the provider. */
    label: z.string()
  }),
  /**
   * The slugified form of the version `title`.
   * This is different from the entry `id` which is the full path to the version entry.
   */
  slug: z.string(),
  /** The title of the version entry which is the version number. */
  title: z.string()
});

function changelogsLoader(userConfig) {
  const parsedConfig = StarlightChangelogsLoaderConfigSchema.safeParse(userConfig);
  return {
    name: "starlight-changelogs",
    load: async (context) => {
      const { config: astroConfig } = context;
      if (!parsedConfig.success) {
        throwPluginError(
          `The provided starlight-changelogs loader configuration is invalid.
${parsedConfig.error.issues.map((issue) => issue.message).join("\n")}`
        );
      }
      const config = parsedConfig.data;
      const serializedConfig = serializeLoaderConfig(config);
      await saveLoaderConfig(astroConfig, serializedConfig);
      for (const changelog of config) {
        if (!changelog.enabled) continue;
        switch (changelog.provider) {
          case "changeset": {
            await loadChangesetData(changelog, context);
            break;
          }
          case "gitea": {
            await loadGiteaData(changelog, context);
            break;
          }
          case "github": {
            await loadGitHubData(changelog, context);
            break;
          }
          case "keep-a-changelog": {
            await loadKeepAChangelogData(changelog, context);
            break;
          }
          default: {
            throwPluginError(
              // @ts-expect-error - error when all known providers are supported.
              `Missing loader implementation for provider '${changelog.provider}'. This is a bug in the starlight-changelogs plugin.`
            );
          }
        }
      }
    },
    schema: VersionEntrySchema
  };
}

const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  changelogs: defineCollection({
    loader: changelogsLoader([
      {
        provider: "github",
        base: "changelog",
        owner: "diesel-rs",
        repo: "diesel"
      }
    ])
  })
};

export { collections };
