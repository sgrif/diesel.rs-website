import { escape } from 'html-escaper';
import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import * as z from 'zod';
import { z as z$1 } from 'zod';
import { removeBase, isRemotePath, prependForwardSlash } from '@astrojs/internal-helpers/path';
import { A as AstroError, L as LiveContentConfigError, a as AstroUserError, U as UnknownContentCollectionError, c as createComponent, R as RenderUndefinedEntryError, u as unescapeHTML, b as renderTemplate, p as renderUniqueStylesheet, q as renderScriptElement, t as createHeadAndContent, r as renderComponent } from './astro/server-CLdwTDY0.js';
import 'piccolore';
import * as devalue from 'devalue';
import i18next from 'i18next';

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
const CONTENT_LAYER_TYPE = "content_layer";
const LIVE_CONTENT_TYPE = "live";

const VALID_INPUT_FORMATS = [
  "jpeg",
  "jpg",
  "png",
  "tiff",
  "webp",
  "gif",
  "svg",
  "avif"
];
const VALID_SUPPORTED_FORMATS = [
  "jpeg",
  "jpg",
  "png",
  "tiff",
  "webp",
  "gif",
  "svg",
  "avif"
];
const DEFAULT_OUTPUT_FORMAT = "webp";
const DEFAULT_HASH_PROPS = [
  "src",
  "width",
  "height",
  "format",
  "quality",
  "fit",
  "position"
];

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

function getImporterFilename() {
  const stackLine = new Error().stack?.split("\n").find(
    (line) => !line.includes("defineCollection") && !line.includes("defineLiveCollection") && !line.includes("getImporterFilename") && !line.startsWith("Error")
  );
  if (!stackLine) {
    return void 0;
  }
  const match = /\/((?:src|chunks)\/.*?):\d+:\d+/.exec(stackLine);
  return match?.[1] ?? void 0;
}
function defineCollection$1(config) {
  const importerFilename = getImporterFilename();
  if (importerFilename?.includes("live.config")) {
    throw new AstroError({
      ...LiveContentConfigError,
      message: LiveContentConfigError.message(
        "Collections in a live config file must use `defineLiveCollection`.",
        importerFilename
      )
    });
  }
  if ("loader" in config) {
    if (config.type && config.type !== CONTENT_LAYER_TYPE) {
      throw new AstroUserError(
        `Collections that use the Content Layer API must have a \`loader\` defined and no \`type\` set. Check your collection definitions in ${importerFilename ?? "your content config file"}.`
      );
    }
    if (typeof config.loader === "object" && typeof config.loader.load !== "function" && ("loadEntry" in config.loader || "loadCollection" in config.loader)) {
      throw new AstroUserError(
        `Live content collections must be defined in "src/live.config.ts" file. Check your collection definitions in "${importerFilename ?? "your content config file"}" to ensure you are not using a live loader.`
      );
    }
    config.type = CONTENT_LAYER_TYPE;
  }
  if (!config.type) config.type = "content";
  return config;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content-DdwmZ7PV.js');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://diesel.rs", "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
z$1.object({
  tags: z$1.array(z$1.string()).optional(),
  lastModified: z$1.date().optional()
});
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection,
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./content-assets-DleWbedO.js');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (entry.legacyId) {
          entry = emulateLegacyEntry(entry);
        }
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function emulateLegacyEntry({ legacyId, ...entry }) {
  const legacyEntry = {
    ...entry,
    id: legacyId,
    slug: entry.id
  };
  return {
    ...legacyEntry,
    // Define separately so the render function isn't included in the object passed to `renderEntry()`
    render: () => renderEntry(legacyEntry)
  };
}
function createGetEntry({
  getEntryImport,
  getRenderEntryImport,
  collectionNames,
  liveCollections
}) {
  return async function getEntry(collectionOrLookupObject, lookup) {
    let collection, lookupId;
    if (typeof collectionOrLookupObject === "string") {
      collection = collectionOrLookupObject;
      if (!lookup)
        throw new AstroError({
          ...UnknownContentCollectionError,
          message: "`getEntry()` requires an entry identifier as the second argument."
        });
      lookupId = lookup;
    } else {
      collection = collectionOrLookupObject.collection;
      lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
    }
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
      });
    }
    if (typeof lookupId === "object") {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `The entry identifier must be a string. Received object.`
      });
    }
    const store = await globalDataStore.get();
    if (store.hasCollection(collection)) {
      const entry2 = store.get(collection, lookupId);
      if (!entry2) {
        console.warn(`Entry ${collection} → ${lookupId} was not found.`);
        return;
      }
      const { default: imageAssetMap } = await import('./content-assets-DleWbedO.js');
      entry2.data = updateImageReferencesInData(entry2.data, entry2.filePath, imageAssetMap);
      if (entry2.legacyId) {
        return emulateLegacyEntry({ ...entry2, collection });
      }
      return {
        ...entry2,
        collection
      };
    }
    if (!collectionNames.has(collection)) {
      console.warn(
        `The collection ${JSON.stringify(collection)} does not exist. Please ensure it is defined in your content config.`
      );
      return void 0;
    }
    const entryImport = await getEntryImport(collection, lookupId);
    if (typeof entryImport !== "function") return void 0;
    const entry = await entryImport();
    if (entry._internal.type === "content") {
      return {
        id: entry.id,
        slug: entry.slug,
        body: entry.body,
        collection: entry.collection,
        data: entry.data,
        async render() {
          return render({
            collection: entry.collection,
            id: entry.id,
            renderEntryImport: await getRenderEntryImport(collection, lookupId)
          });
        }
      };
    } else if (entry._internal.type === "data") {
      return {
        id: entry.id,
        collection: entry.collection,
        data: entry.data
      };
    }
    return void 0;
  };
}
const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await import('./content-assets-DleWbedO.js');
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage } = await import('./_astro_assets-CYRbqyXM.js').then(n => n._);
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      let image;
      if (URL.canParse(decodedImagePath.src)) {
        image = await getImage(decodedImagePath);
      } else {
        const id = imageSrcToImportId(decodedImagePath.src, fileName);
        const imported = imageAssetMap.get(id);
        if (!id || imageObjects.has(id) || !imported) {
          continue;
        }
        image = await getImage({ ...decodedImagePath, src: imported });
      }
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute,
      // This attribute is used by the toolbar audit
      ...Object.assign(__vite_import_meta_env__, { _: process.env._ }).DEV ? { "data-image-component": "true" } : {}
    }).map(([key, value]) => value ? `${key}="${escape(value)}"` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if ("render" in entry && !("legacyId" in entry)) {
    return entry.render();
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules } = await import('./content-modules-B2hy9yif.js');
      const renderEntryImport = contentModules.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e) {
      console.error(e);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}
function defineCollection(config) {
  if (config.type === "live") {
    throw new AstroError({
      ...LiveContentConfigError,
      message: LiveContentConfigError.message(
        "Collections with type `live` must be defined in a `src/live.config.ts` file."
      )
    });
  }
  return defineCollection$1(config);
}

// astro-head-inject

const liveCollections = {};

const contentDir = '/src/content/';

const contentEntryGlob = "";
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = "";
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
const collectionToEntryMap = createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {};

const collectionNames = new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = "";
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
	liveCollections,
});

const getEntry = createGetEntry({
	getEntryImport: createGlobLookup(collectionToEntryMap),
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	collectionNames,
	liveCollections,
});

const starlightConfig = {"logo":{"src":"/public/images/diesel_logo_favicon.png","alt":"","replacesTitle":false},"social":[{"icon":"github","label":"GitHub","href":"https://github.com/diesel-rs/diesel"}],"tableOfContents":{"minHeadingLevel":2,"maxHeadingLevel":3},"editLink":{},"sidebar":[{"label":"Guides to Diesel","translations":{},"collapsed":false,"items":[{"label":"Overview","translations":{},"link":"/guides/","attrs":{}},{"label":"Getting Started","translations":{},"link":"/guides/getting-started/","attrs":{}},{"label":"All About Selects","translations":{},"link":"/guides/all-about-selects/","attrs":{}},{"label":"All About Updates","translations":{},"link":"/guides/all-about-updates/","attrs":{}},{"label":"All About Inserts","translations":{},"link":"/guides/all-about-inserts/","attrs":{}},{"label":"Relations","translations":{},"link":"/guides/relations/","attrs":{}},{"label":"Composing Applications with Diesel","translations":{},"link":"/guides/composing-applications/","attrs":{}},{"label":"Schema in Depth","translations":{},"link":"/guides/schema-in-depth/","attrs":{}},{"label":"Extending Diesel","translations":{},"link":"/guides/extending-diesel/","attrs":{}},{"label":"Configuring Diesel CLI","translations":{},"link":"/guides/configuring-diesel-cli/","attrs":{}},{"label":"Diesel 2.0 migration guide","translations":{},"link":"/guides/migration-guide/","attrs":{}}]},{"label":"News","translations":{},"collapsed":false,"items":[{"label":"News","translations":{},"link":"/news/","attrs":{}},{"label":"Diesel 2.3.0","translations":{},"link":"/news/2_3_0_release","attrs":{}},{"label":"Diesel 2.2.0","translations":{},"link":"/news/2_2_0_release","attrs":{}},{"label":"Diesel 2.1.0","translations":{},"link":"/news/2_1_0_release","attrs":{}},{"label":"Diesel 2.0.0","translations":{},"link":"/news/2_0_0_release","attrs":{}}]},{"label":"API Docs","translations":{},"collapsed":false,"autogenerate":{"directory":"api_docs","attrs":{}}},{"label":"Changelog","translations":{},"link":"/changelog/","attrs":{}},{"label":"Compare Diesel","translations":{},"collapsed":false,"autogenerate":{"directory":"compare","attrs":{}}}],"head":[],"lastUpdated":false,"pagination":true,"favicon":{"href":"/images/diesel_logo_favicon_32.png","type":"image/png"},"components":{"Search":"@astrojs/starlight/components/Search.astro"},"titleDelimiter":"|","credits":false,"pagefind":{"ranking":{"pageLength":0.1,"termFrequency":0.1,"termSaturation":2,"termSimilarity":9}},"title":{"en":"DIESEL"},"isMultilingual":false,"defaultLocale":{"label":"English","lang":"en","dir":"ltr"}};

const project = {"build":{"format":"directory"},"root":"file:///home/runner/work/diesel.rs-website/diesel.rs-website/","srcDir":"file:///home/runner/work/diesel.rs-website/diesel.rs-website/src/","trailingSlash":"ignore"};

const pluginTranslations = {"en":{"starlightChangelogs.compare.label":"All versions forward","starlightChangelogs.compare.title":"All versions since {{version}}","starlightChangelogs.pagination.next":"Older versions","starlightChangelogs.pagination.prev":"Newer versions","starlightChangelogs.version.date":"{{date, datetime(dateStyle: medium)}}","starlightChangelogs.version.find":"Find a version","starlightChangelogs.version.open":"View on {{provider}}","starlightChangelogs.version.title":"Version {{version}}","starlightChangelogs.versions.all":"All versions"},"fr":{"starlightChangelogs.compare.label":"Toutes les versions suivantes","starlightChangelogs.compare.title":"Toutes les versions depuis {{version}}","starlightChangelogs.pagination.next":"Versions plus anciennes","starlightChangelogs.pagination.prev":"Versions plus récentes","starlightChangelogs.version.date":"{{date, datetime(dateStyle: medium)}}","starlightChangelogs.version.find":"Trouver une version","starlightChangelogs.version.open":"Voir sur {{provider}}","starlightChangelogs.version.title":"Version {{version}}","starlightChangelogs.versions.all":"Toutes les versions"},"de":{"starlightChangelogs.compare.label":"Alle Versionen ab jetzt","starlightChangelogs.compare.title":"Alle Versionen seit {{version}}","starlightChangelogs.pagination.next":"Ältere Versionen","starlightChangelogs.pagination.prev":"Neuere Versionen","starlightChangelogs.version.date":"{{date, datetime(dateStyle: medium)}}","starlightChangelogs.version.find":"Eine Version finden","starlightChangelogs.version.open":"Auf {{provider}} anschauen","starlightChangelogs.version.title":"Version {{version}}","starlightChangelogs.versions.all":"Alle Versionen"}};

function builtinI18nSchema() {
  return starlightI18nSchema().required().strict().merge(pagefindI18nSchema()).merge(expressiveCodeI18nSchema());
}
function starlightI18nSchema() {
  return z.object({
    "skipLink.label": z.string().describe(
      "Text displayed in the accessible “Skip link” when a keyboard user first tabs into a page."
    ),
    "search.label": z.string().describe("Text displayed in the search bar."),
    "search.ctrlKey": z.string().describe(
      "Visible representation of the Control key potentially used in the shortcut key to open the search modal."
    ),
    "search.cancelLabel": z.string().describe("Text for the “Cancel” button that closes the search modal."),
    "search.devWarning": z.string().describe("Warning displayed when opening the Search in a dev environment."),
    "themeSelect.accessibleLabel": z.string().describe("Accessible label for the theme selection dropdown."),
    "themeSelect.dark": z.string().describe("Name of the dark color theme."),
    "themeSelect.light": z.string().describe("Name of the light color theme."),
    "themeSelect.auto": z.string().describe("Name of the automatic color theme that syncs with system preferences."),
    "languageSelect.accessibleLabel": z.string().describe("Accessible label for the language selection dropdown."),
    "menuButton.accessibleLabel": z.string().describe("Accessible label for the mobile menu button."),
    "sidebarNav.accessibleLabel": z.string().describe(
      "Accessible label for the main sidebar `<nav>` element to distinguish it from other `<nav>` landmarks on the page."
    ),
    "tableOfContents.onThisPage": z.string().describe("Title for the table of contents component."),
    "tableOfContents.overview": z.string().describe(
      "Label used for the first link in the table of contents, linking to the page title."
    ),
    "i18n.untranslatedContent": z.string().describe(
      "Notice informing users they are on a page that is not yet translated to their language."
    ),
    "page.editLink": z.string().describe("Text for the link to edit a page."),
    "page.lastUpdated": z.string().describe("Text displayed in front of the last updated date in the page footer."),
    "page.previousLink": z.string().describe("Label shown on the “previous page” pagination arrow in the page footer."),
    "page.nextLink": z.string().describe("Label shown on the “next page” pagination arrow in the page footer."),
    "page.draft": z.string().describe(
      "Development-only notice informing users they are on a page that is a draft which will not be included in production builds."
    ),
    "404.text": z.string().describe("Text shown on Starlight’s default 404 page"),
    "aside.tip": z.string().describe("Text shown on the tip aside variant"),
    "aside.note": z.string().describe("Text shown on the note aside variant"),
    "aside.caution": z.string().describe("Text shown on the warning aside variant"),
    "aside.danger": z.string().describe("Text shown on the danger aside variant"),
    "fileTree.directory": z.string().describe("Label for the directory icon in the file tree component."),
    "builtWithStarlight.label": z.string().describe(
      "Label for the “Built with Starlight” badge optionally displayed in the site footer."
    ),
    "heading.anchorLabel": z.string().describe("Label for anchor links in Markdown content.")
  }).partial();
}
function pagefindI18nSchema() {
  return z.object({
    "pagefind.clear_search": z.string().describe(
      'Pagefind UI translation. English default value: `"Clear"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.load_more": z.string().describe(
      'Pagefind UI translation. English default value: `"Load more results"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.search_label": z.string().describe(
      'Pagefind UI translation. English default value: `"Search this site"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.filters_label": z.string().describe(
      'Pagefind UI translation. English default value: `"Filters"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.zero_results": z.string().describe(
      'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.many_results": z.string().describe(
      'Pagefind UI translation. English default value: `"[COUNT] results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.one_result": z.string().describe(
      'Pagefind UI translation. English default value: `"[COUNT] result for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.alt_search": z.string().describe(
      'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Showing results for [DIFFERENT_TERM] instead"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.search_suggestion": z.string().describe(
      'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Try one of the following searches:"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.searching": z.string().describe(
      'Pagefind UI translation. English default value: `"Searching for [SEARCH_TERM]..."`. See https://pagefind.app/docs/ui/#translations'
    )
  }).partial();
}
function expressiveCodeI18nSchema() {
  return z.object({
    "expressiveCode.copyButtonCopied": z.string().describe('Expressive Code UI translation. English default value: `"Copied!"`'),
    "expressiveCode.copyButtonTooltip": z.string().describe('Expressive Code UI translation. English default value: `"Copy to clipboard"`'),
    "expressiveCode.terminalWindowFallbackTitle": z.string().describe('Expressive Code UI translation. English default value: `"Terminal window"`')
  }).partial();
}

const cs = {
  "skipLink.label": "Přeskočit na obsah",
  "search.label": "Hledat",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Zrušit",
  "search.devWarning": "Vyhledávání je dostupné pouze v produkčních sestaveních. \nZkuste sestavit a zobrazit náhled webu a otestovat jej lokálně.",
  "themeSelect.accessibleLabel": "Vyberte motiv",
  "themeSelect.dark": "Tmavý",
  "themeSelect.light": "Světlý",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Vyberte jazyk",
  "menuButton.accessibleLabel": "Nabídka",
  "sidebarNav.accessibleLabel": "Hlavní",
  "tableOfContents.onThisPage": "Na této stránce",
  "tableOfContents.overview": "Přehled",
  "i18n.untranslatedContent": "Tento obsah zatím není dostupný ve vašem jazyce.",
  "page.editLink": "Upravit stránku",
  "page.lastUpdated": "Poslední aktualizace:",
  "page.previousLink": "Předchozí",
  "page.nextLink": "Další",
  "page.draft": "Tento obsah je koncept a nebude zahrnutý v produkčním sestavení.",
  "404.text": "Stránka nenalezena. Zkontrolujte adresu nebo zkuste použít vyhledávač",
  "aside.note": "Poznámka",
  "aside.tip": "Tip",
  "aside.caution": "Upozornění",
  "aside.danger": "Nebezpečí",
  "fileTree.directory": "Adresář",
  "builtWithStarlight.label": "Postavené s Starlight",
  "expressiveCode.copyButtonCopied": "Zkopírováno!",
  "expressiveCode.copyButtonTooltip": "Kopíruj do schránky",
  "expressiveCode.terminalWindowFallbackTitle": "Terminál",
  "pagefind.clear_search": "Vyčistit",
  "pagefind.load_more": "Načíst další výsledky",
  "pagefind.search_label": "Vyhledat stránku",
  "pagefind.filters_label": "Filtry",
  "pagefind.zero_results": "Žádný výsledek pro: [SEARCH_TERM]",
  "pagefind.many_results": "počet výsledků: [COUNT] pro: [SEARCH_TERM]",
  "pagefind.one_result": "[COUNT] výsledek pro: [SEARCH_TERM]",
  "pagefind.alt_search": "Žádné výsledky pro [SEARCH_TERM]. Namísto toho zobrazuji výsledky pro: [DIFFERENT_TERM]",
  "pagefind.search_suggestion": "Žádný výsledek pro [SEARCH_TERM]. Zkus nějaké z těchto hledání:",
  "pagefind.searching": "Hledám [SEARCH_TERM]...",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const en = {
  "skipLink.label": "Skip to content",
  "search.label": "Search",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Cancel",
  "search.devWarning": "Search is only available in production builds. \nTry building and previewing the site to test it out locally.",
  "themeSelect.accessibleLabel": "Select theme",
  "themeSelect.dark": "Dark",
  "themeSelect.light": "Light",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Select language",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Main",
  "tableOfContents.onThisPage": "On this page",
  "tableOfContents.overview": "Overview",
  "i18n.untranslatedContent": "This content is not available in your language yet.",
  "page.editLink": "Edit page",
  "page.lastUpdated": "Last updated:",
  "page.previousLink": "Previous",
  "page.nextLink": "Next",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Page not found. Check the URL or try using the search bar.",
  "aside.note": "Note",
  "aside.tip": "Tip",
  "aside.caution": "Caution",
  "aside.danger": "Danger",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const es = {
  "skipLink.label": "Ir al contenido",
  "search.label": "Buscar",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Cancelar",
  "search.devWarning": "La búsqueda solo está disponible en las versiones de producción.  \nIntenta construir y previsualizar el sitio para probarlo localmente.",
  "themeSelect.accessibleLabel": "Seleccionar tema",
  "themeSelect.dark": "Oscuro",
  "themeSelect.light": "Claro",
  "themeSelect.auto": "Automático",
  "languageSelect.accessibleLabel": "Seleccionar idioma",
  "menuButton.accessibleLabel": "Menú",
  "sidebarNav.accessibleLabel": "Primario",
  "tableOfContents.onThisPage": "En esta página",
  "tableOfContents.overview": "Sinopsis",
  "i18n.untranslatedContent": "Esta página aún no está disponible en tu idioma.",
  "page.editLink": "Edita esta página",
  "page.lastUpdated": "Última actualización:",
  "page.previousLink": "Página anterior",
  "page.nextLink": "Siguiente página",
  "page.draft": "Este contenido es un borrador y no se incluirá en las versiones de producción.",
  "404.text": "Página no encontrada. Verifica la URL o intenta usar la barra de búsqueda.",
  "aside.note": "Nota",
  "aside.tip": "Consejo",
  "aside.caution": "Precaución",
  "aside.danger": "Peligro",
  "expressiveCode.copyButtonCopied": "¡Copiado!",
  "expressiveCode.copyButtonTooltip": "Copiar al portapapeles",
  "expressiveCode.terminalWindowFallbackTitle": "Ventana de terminal",
  "fileTree.directory": "Directorio",
  "builtWithStarlight.label": "Hecho con Starlight",
  "pagefind.clear_search": "Limpiar",
  "pagefind.load_more": "Cargar más resultados",
  "pagefind.search_label": "Buscar página",
  "pagefind.filters_label": "Filtros",
  "pagefind.zero_results": "Ningún resultado para: [SEARCH_TERM]",
  "pagefind.many_results": "[COUNT] resultados para: [SEARCH_TERM]",
  "pagefind.one_result": "[COUNT] resultado para: [SEARCH_TERM]",
  "pagefind.alt_search": "Ningún resultado para [SEARCH_TERM]. Mostrando resultados para: [DIFFERENT_TERM]",
  "pagefind.search_suggestion": "Ningún resultado para [SEARCH_TERM]. Prueba alguna de estas búsquedas:",
  "pagefind.searching": "Buscando [SEARCH_TERM]...",
  "heading.anchorLabel": "Sección titulada «{{title}}»",
};

const ca = {
  "skipLink.label": "Saltar al contingut",
  "search.label": "Cercar",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Cancel·lar",
  "search.devWarning": "La cerca només està disponible a les versions de producció.  \nProva de construir i previsualitzar el lloc per provar-ho localment.",
  "themeSelect.accessibleLabel": "Seleccionar tema",
  "themeSelect.dark": "Fosc",
  "themeSelect.light": "Clar",
  "themeSelect.auto": "Automàtic",
  "languageSelect.accessibleLabel": "Seleccionar idioma",
  "menuButton.accessibleLabel": "Menú",
  "sidebarNav.accessibleLabel": "Primari",
  "tableOfContents.onThisPage": "En aquesta pàgina",
  "tableOfContents.overview": "Sinopsi",
  "i18n.untranslatedContent": "Aquesta pàgina encara no està disponible en el teu idioma.",
  "page.editLink": "Edita aquesta pàgina",
  "page.lastUpdated": "Última actualització:",
  "page.previousLink": "Pàgina anterior",
  "page.nextLink": "Pàgina següent",
  "page.draft": "Aquest contingut és un esborrany i no s'inclourà en les versions de producció.",
  "404.text": "Pàgina no trobada. Comprova la URL o intenta utilitzar la barra de cerca.",
  "aside.note": "Nota",
  "aside.tip": "Consell",
  "aside.caution": "Precaució",
  "aside.danger": "Perill",
  "expressiveCode.copyButtonCopied": "Copiat!",
  "expressiveCode.copyButtonTooltip": "Copiar al porta-retalls",
  "expressiveCode.terminalWindowFallbackTitle": "Finestra del terminal",
  "fileTree.directory": "Directori",
  "builtWithStarlight.label": "Fet amb Starlight",
  "pagefind.clear_search": "Netejar",
  "pagefind.load_more": "Carregar més resultats",
  "pagefind.search_label": "Cercar pàgina",
  "pagefind.filters_label": "Filtres",
  "pagefind.zero_results": "Cap resultat per a: [SEARCH_TERM]",
  "pagefind.many_results": "[COUNT] resultats per a: [SEARCH_TERM]",
  "pagefind.one_result": "[COUNT] resultat per a: [SEARCH_TERM]",
  "pagefind.alt_search": "Cap resultat per a [SEARCH_TERM]. Mostrant resultats per a: [DIFFERENT_TERM]",
  "pagefind.search_suggestion": "Cap resultat per a [SEARCH_TERM]. Prova alguna d’aquestes cerques:",
  "pagefind.searching": "Cercant [SEARCH_TERM]...",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const de = {
  "skipLink.label": "Zum Inhalt springen",
  "search.label": "Suchen",
  "search.ctrlKey": "Strg",
  "search.cancelLabel": "Abbrechen",
  "search.devWarning": "Die Suche ist nur in Produktions-Builds verfügbar. \nVersuche, die Website zu bauen und in der Vorschau anzusehen, um sie lokal zu testen.",
  "themeSelect.accessibleLabel": "Farbschema wählen",
  "themeSelect.dark": "Dunkel",
  "themeSelect.light": "Hell",
  "themeSelect.auto": "System",
  "languageSelect.accessibleLabel": "Sprache wählen",
  "menuButton.accessibleLabel": "Menü",
  "sidebarNav.accessibleLabel": "Hauptnavigation",
  "tableOfContents.onThisPage": "Auf dieser Seite",
  "tableOfContents.overview": "Überblick",
  "i18n.untranslatedContent": "Dieser Inhalt ist noch nicht in deiner Sprache verfügbar.",
  "page.editLink": "Seite bearbeiten",
  "page.lastUpdated": "Zuletzt aktualisiert:",
  "page.previousLink": "Vorherige Seite",
  "page.nextLink": "Nächste Seite",
  "page.draft": "Dieser Inhalt ist ein Entwurf und wird nicht in den Produktions-Builds enthalten sein.",
  "404.text": "Seite nicht gefunden. Überprüfe die URL oder nutze die Suchleiste.",
  "aside.note": "Hinweis",
  "aside.tip": "Tipp",
  "aside.caution": "Achtung",
  "aside.danger": "Gefahr",
  "fileTree.directory": "Ordner",
  "builtWithStarlight.label": "Erstellt mit Starlight",
  "heading.anchorLabel": "Abschnitt betitelt „{{title}}“",
};

const ja = {
  "skipLink.label": "コンテンツにスキップ",
  "search.label": "検索",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "キャンセル",
  "search.devWarning": "検索はプロダクションビルドでのみ利用可能です。\nローカルでテストするには、サイトをビルドしてプレビューしてください。",
  "themeSelect.accessibleLabel": "テーマの選択",
  "themeSelect.dark": "ダーク",
  "themeSelect.light": "ライト",
  "themeSelect.auto": "自動",
  "languageSelect.accessibleLabel": "言語の選択",
  "menuButton.accessibleLabel": "メニュー",
  "sidebarNav.accessibleLabel": "メイン",
  "tableOfContents.onThisPage": "目次",
  "tableOfContents.overview": "概要",
  "i18n.untranslatedContent": "このコンテンツはまだ日本語訳がありません。",
  "page.editLink": "ページを編集",
  "page.lastUpdated": "最終更新日:",
  "page.previousLink": "前へ",
  "page.nextLink": "次へ",
  "page.draft": "このコンテンツは下書きです。プロダクションビルドには含まれません。",
  "404.text": "ページが見つかりません。 URL を確認するか、検索バーを使用してみてください。",
  "aside.note": "ノート",
  "aside.tip": "ヒント",
  "aside.caution": "注意",
  "aside.danger": "危険",
  "fileTree.directory": "ディレクトリ",
  "builtWithStarlight.label": "Starlightで作成",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const pt = {
  "skipLink.label": "Pular para o conteúdo",
  "search.label": "Pesquisar",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Cancelar",
  "search.devWarning": "A pesquisa está disponível apenas em builds em produção. \nTente fazer a build e pré-visualize o site para testar localmente.",
  "themeSelect.accessibleLabel": "Selecionar tema",
  "themeSelect.dark": "Escuro",
  "themeSelect.light": "Claro",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Selecionar língua",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Principal",
  "tableOfContents.onThisPage": "Nesta página",
  "tableOfContents.overview": "Visão geral",
  "i18n.untranslatedContent": "Este conteúdo não está disponível em sua língua ainda.",
  "page.editLink": "Editar página",
  "page.lastUpdated": "Última atualização:",
  "page.previousLink": "Anterior",
  "page.nextLink": "Próximo",
  "page.draft": "Esse conteúdo é um rascunho e não será incluído em builds de produção.",
  "404.text": "Página não encontrada. Verifique o URL ou tente usar a barra de pesquisa.",
  "aside.note": "Nota",
  "aside.tip": "Dica",
  "aside.caution": "Cuidado",
  "aside.danger": "Perigo",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Feito com Starlight",
  "heading.anchorLabel": "Seção intitulada “{{title}}”",
};

const fa = {
  "skipLink.label": "رفتن به محتوا",
  "search.label": "جستجو",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "لغو",
  "search.devWarning": "جستجو تنها در نسخه‌های تولیدی در دسترس است. \nسعی کنید سایت را بسازید و پیش‌نمایش آن را به صورت محلی آزمایش کنید.",
  "themeSelect.accessibleLabel": "انتخاب پوسته",
  "themeSelect.dark": "تیره",
  "themeSelect.light": "روشن",
  "themeSelect.auto": "خودکار",
  "languageSelect.accessibleLabel": "انتخاب زبان",
  "menuButton.accessibleLabel": "منو",
  "sidebarNav.accessibleLabel": "اصلی",
  "tableOfContents.onThisPage": "در این صفحه",
  "tableOfContents.overview": "نگاه کلی",
  "i18n.untranslatedContent": "این محتوا هنوز به زبان شما در دسترس نیست.",
  "page.editLink": "ویرایش صفحه",
  "page.lastUpdated": "آخرین به‌روزرسانی:",
  "page.previousLink": "قبلی",
  "page.nextLink": "بعدی",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "صفحه یافت نشد. لطفاً URL را بررسی کنید یا از جستجو استفاده نمایید.",
  "aside.note": "یادداشت",
  "aside.tip": "نکته",
  "aside.caution": "احتیاط",
  "aside.danger": "خطر",
  "fileTree.directory": "فهرست",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const fi = {
  "skipLink.label": "Siirry sisältöön",
  "search.label": "Haku",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Peruuta",
  "search.devWarning": "Haku on käytettävissä vain tuotantoversioissa.\nKokeile kääntää ja esikatsella sivustoa paikallisesti testataksesi sitä.",
  "themeSelect.accessibleLabel": "Valitse teema",
  "themeSelect.dark": "Tumma",
  "themeSelect.light": "Vaalea",
  "themeSelect.auto": "Automaattinen",
  "languageSelect.accessibleLabel": "Valitse kieli",
  "menuButton.accessibleLabel": "Valikko",
  "sidebarNav.accessibleLabel": "Päävalikko",
  "tableOfContents.onThisPage": "Tällä sivulla",
  "tableOfContents.overview": "Yleiskatsaus",
  "i18n.untranslatedContent": "Tämä sisältö ei ole vielä saatavilla valitsemallasi kielellä.",
  "page.editLink": "Muokkaa sivua",
  "page.lastUpdated": "Viimeksi päivitetty:",
  "page.previousLink": "Edellinen",
  "page.nextLink": "Seuraava",
  "page.draft": "Tämä sisältö on luonnos eikä sitä sisällytetä tuotantoversioon.",
  "404.text": "Sivua ei löytynyt. Tarkista URL-osoite tai käytä hakupalkkia.",
  "aside.note": "Huomio",
  "aside.tip": "Vinkki",
  "aside.caution": "Varoitus",
  "aside.danger": "Vaara",
  "fileTree.directory": "Hakemisto",
  "builtWithStarlight.label": "Rakennettu Starlightilla",
  "heading.anchorLabel": "Osio nimeltä “{{title}}”",
};

const fr = {
  "skipLink.label": "Aller au contenu",
  "search.label": "Rechercher",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Annuler",
  "search.devWarning": "La recherche est disponible uniquement en mode production. \nEssayez de construire puis de prévisualiser votre site pour tester la recherche localement.",
  "themeSelect.accessibleLabel": "Selectionner le thème",
  "themeSelect.dark": "Sombre",
  "themeSelect.light": "Clair",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Selectionner la langue",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "principale",
  "tableOfContents.onThisPage": "Sur cette page",
  "tableOfContents.overview": "Vue d’ensemble",
  "i18n.untranslatedContent": "Ce contenu n’est pas encore disponible dans votre langue.",
  "page.editLink": "Modifier cette page",
  "page.lastUpdated": "Dernière mise à jour :",
  "page.previousLink": "Précédent",
  "page.nextLink": "Suivant",
  "page.draft": "Ce contenu est une ébauche et ne sera pas inclus dans la version de production.",
  "404.text": "Page non trouvée. Vérifiez l’URL ou essayez d’utiliser la barre de recherche.",
  "aside.note": "Note",
  "aside.tip": "Astuce",
  "aside.caution": "Attention",
  "aside.danger": "Danger",
  "expressiveCode.copyButtonCopied": "Copié !",
  "expressiveCode.copyButtonTooltip": "Copier dans le presse-papiers",
  "expressiveCode.terminalWindowFallbackTitle": "Fenêtre de terminal",
  "fileTree.directory": "Répertoire",
  "builtWithStarlight.label": "Créé avec Starlight",
  "heading.anchorLabel": "Section intitulée « {{title}} »",
};

const gl = {
  "skipLink.label": "Ir ao contido",
  "search.label": "Busca",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Deixar",
  "search.devWarning": "A busca só está dispoñible nas versións de producción. \nTrata de construir e ollear o sitio para probalo localmente.",
  "themeSelect.accessibleLabel": "Selecciona tema",
  "themeSelect.dark": "Escuro",
  "themeSelect.light": "Claro",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Seleciona linguaxe",
  "menuButton.accessibleLabel": "Menú",
  "sidebarNav.accessibleLabel": "Principal",
  "tableOfContents.onThisPage": "Nesta páxina",
  "tableOfContents.overview": "Sinopse",
  "i18n.untranslatedContent": "Este contido aínda non está dispoñible no teu idioma.",
  "page.editLink": "Editar páxina",
  "page.lastUpdated": "Última actualización:",
  "page.previousLink": "Anterior",
  "page.nextLink": "Seguinte",
  "page.draft": "Este contido é un borrador e non se incluirá nas versións de producción.",
  "404.text": "Páxina non atopada. Comproba a URL ou intenta usar a barra de busca.",
  "aside.note": "Nota",
  "aside.tip": "Consello",
  "aside.caution": "Precaución",
  "aside.danger": "Perigo",
  "expressiveCode.copyButtonCopied": "¡Copiado!",
  "expressiveCode.copyButtonTooltip": "Copiar ao portapapeis",
  "expressiveCode.terminalWindowFallbackTitle": "Fiestra do terminal",
  "fileTree.directory": "Directorio",
  "builtWithStarlight.label": "Feito con Starlight",
  "pagefind.clear_search": "Limpar",
  "pagefind.load_more": "Cargar máis resultados",
  "pagefind.search_label": "Buscar páxina",
  "pagefind.filters_label": "Filtros",
  "pagefind.zero_results": "Ningún resultado para: [SEARCH_TERM]",
  "pagefind.many_results": "[COUNT] resultados para: [SEARCH_TERM]",
  "pagefind.one_result": "[COUNT] resultado para: [SEARCH_TERM]",
  "pagefind.alt_search": "Ningún resultado para [SEARCH_TERM]. Amósanse resultados para: [DIFFERENT_TERM]",
  "pagefind.search_suggestion": "Ningún resultado para [SEARCH_TERM]. Proba algunha destas buscas:",
  "pagefind.searching": "Buscando [SEARCH_TERM]...",
  "heading.anchorLabel": "Sección titulada «{{title}}»",
};

const he = {
  "skipLink.label": "דלגו לתוכן",
  "search.label": "חיפוש",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "ביטול",
  "search.devWarning": "החיפוש זמין רק בסביבת ייצור. \nנסו לבנות ולהציג תצוגה מקדימה של האתר כדי לבדוק אותו באופן מקומי.",
  "themeSelect.accessibleLabel": "בחרו פרופיל צבע",
  "themeSelect.dark": "כהה",
  "themeSelect.light": "בהיר",
  "themeSelect.auto": "מערכת",
  "languageSelect.accessibleLabel": "בחרו שפה",
  "menuButton.accessibleLabel": "תפריט",
  "sidebarNav.accessibleLabel": "ראשי",
  "tableOfContents.onThisPage": "בדף זה",
  "tableOfContents.overview": "סקירה כללית",
  "i18n.untranslatedContent": "תוכן זה אינו זמין עדיין בשפה שלך.",
  "page.editLink": "ערכו דף",
  "page.lastUpdated": "עדכון אחרון:",
  "page.previousLink": "הקודם",
  "page.nextLink": "הבא",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "הדף לא נמצא. אנא בדקו את כתובת האתר או נסו להשתמש בסרגל החיפוש.",
  "aside.note": "Note",
  "aside.tip": "Tip",
  "aside.caution": "Caution",
  "aside.danger": "Danger",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const id = {
  "skipLink.label": "Lewati ke konten",
  "search.label": "Pencarian",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Batal",
  "search.devWarning": "Pencarian hanya tersedia pada build produksi. \nLakukan proses build dan pratinjau situs Anda sebelum mencoba di lingkungan lokal.",
  "themeSelect.accessibleLabel": "Pilih tema",
  "themeSelect.dark": "Gelap",
  "themeSelect.light": "Terang",
  "themeSelect.auto": "Otomatis",
  "languageSelect.accessibleLabel": "Pilih Bahasa",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Utama",
  "tableOfContents.onThisPage": "Di halaman ini",
  "tableOfContents.overview": "Ringkasan",
  "i18n.untranslatedContent": "Konten ini belum tersedia dalam bahasa Anda.",
  "page.editLink": "Edit halaman",
  "page.lastUpdated": "Terakhir diperbaharui:",
  "page.previousLink": "Sebelumnya",
  "page.nextLink": "Selanjutnya",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Halaman tidak ditemukan. Cek kembali kolom URL atau gunakan fitur pencarian.",
  "aside.note": "Catatan",
  "aside.tip": "Tips",
  "aside.caution": "Perhatian",
  "aside.danger": "Bahaya",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const it = {
  "skipLink.label": "Salta ai contenuti",
  "search.label": "Cerca",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Cancella",
  "search.devWarning": "La ricerca è disponibile solo nelle build di produzione. \nProvare ad eseguire il processo di build e visualizzare la preview del sito per testarlo localmente.",
  "themeSelect.accessibleLabel": "Seleziona tema",
  "themeSelect.dark": "Scuro",
  "themeSelect.light": "Chiaro",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Seleziona lingua",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Principale",
  "tableOfContents.onThisPage": "In questa pagina",
  "tableOfContents.overview": "Panoramica",
  "i18n.untranslatedContent": "Questi contenuti non sono ancora disponibili nella tua lingua.",
  "page.editLink": "Modifica pagina",
  "page.lastUpdated": "Ultimo aggiornamento:",
  "page.previousLink": "Indietro",
  "page.nextLink": "Avanti",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Pagina non trovata. Verifica l'URL o prova a utilizzare la barra di ricerca.",
  "aside.note": "Nota",
  "aside.tip": "Consiglio",
  "aside.caution": "Attenzione",
  "aside.danger": "Pericolo",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Sezione intitolata “{{title}}”",
};

const nl = {
  "skipLink.label": "Ga naar inhoud",
  "search.label": "Zoeken",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Annuleren",
  "search.devWarning": "Zoeken is alleen beschikbaar tijdens productie. \nProbeer om de site te builden en er een preview van te bekijken om lokaal te testen.",
  "themeSelect.accessibleLabel": "Selecteer thema",
  "themeSelect.dark": "Donker",
  "themeSelect.light": "Licht",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Selecteer taal",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Hoofdnavigatie",
  "tableOfContents.onThisPage": "Op deze pagina",
  "tableOfContents.overview": "Overzicht",
  "i18n.untranslatedContent": "Deze inhoud is nog niet vertaald.",
  "page.editLink": "Bewerk pagina",
  "page.lastUpdated": "Laatst bewerkt:",
  "page.previousLink": "Vorige",
  "page.nextLink": "Volgende",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Pagina niet gevonden. Controleer de URL of probeer de zoekbalk.",
  "aside.note": "Opmerking",
  "aside.tip": "Tip",
  "aside.caution": "Opgepast",
  "aside.danger": "Gevaar",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const da = {
  "skipLink.label": "Gå til indhold",
  "search.label": "Søg",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Annuller",
  "search.devWarning": "Søgning er kun tilgængeligt i produktions versioner. \nPrøv at bygge siden og forhåndsvis den for at teste det lokalt.",
  "themeSelect.accessibleLabel": "Vælg tema",
  "themeSelect.dark": "Mørk",
  "themeSelect.light": "Lys",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Vælg sprog",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Hovednavigation",
  "tableOfContents.onThisPage": "På denne side",
  "tableOfContents.overview": "Oversigt",
  "i18n.untranslatedContent": "Dette indhold er ikke tilgængeligt i dit sprog endnu.",
  "page.editLink": "Rediger siden",
  "page.lastUpdated": "Sidst opdateret:",
  "page.previousLink": "Forrige",
  "page.nextLink": "Næste",
  "page.draft": "Indholdet er en kladde og vil ikke blive inkluderet i produktions versioner.",
  "404.text": "Siden er ikke fundet. Tjek din URL eller prøv søgelinjen.",
  "aside.note": "Note",
  "aside.tip": "Tip",
  "aside.caution": "Bemærk",
  "aside.danger": "Advarsel",
  "fileTree.directory": "Mappe",
  "builtWithStarlight.label": "Bygget med Starlight",
  "heading.anchorLabel": "Sektion kaldt “{{title}}”",
};

const tr = {
  "skipLink.label": "İçeriğe geç",
  "search.label": "Ara",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "İptal",
  "search.devWarning": "Arama yalnızca üretim derlemelerinde kullanılabilir. \nYerel bilgisayarınızda test etmek için siteyi derleyin ve önizleme yapın.",
  "themeSelect.accessibleLabel": "Tema seç",
  "themeSelect.dark": "Koyu",
  "themeSelect.light": "Açık",
  "themeSelect.auto": "Otomatik",
  "languageSelect.accessibleLabel": "Dil seçin",
  "menuButton.accessibleLabel": "Menü",
  "sidebarNav.accessibleLabel": "Ana",
  "tableOfContents.onThisPage": "Sayfa içeriği",
  "tableOfContents.overview": "Genel bakış",
  "i18n.untranslatedContent": "Bu içerik henüz dilinizde mevcut değil.",
  "page.editLink": "Sayfayı düzenle",
  "page.lastUpdated": "Son güncelleme:",
  "page.previousLink": "Önceki",
  "page.nextLink": "Sonraki",
  "page.draft": "Bu içerik taslaktır ve canlı sürümde bulunmayacaktır.",
  "404.text": "Sayfa bulunamadı. URL'i kontrol edin ya da arama çubuğunu kullanmayı deneyin.",
  "aside.note": "Not",
  "aside.tip": "İpucu",
  "aside.caution": "Dikkat",
  "aside.danger": "Tehlike",
  "fileTree.directory": "Dizin",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const ar = {
  "skipLink.label": "تخطَّ إلى المحتوى",
  "search.label": "ابحث",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "إلغاء",
  "search.devWarning": "البحث متوفر فقط في بنيات اﻹنتاج. \n جرب بناء المشروع ومعاينته على جهازك",
  "themeSelect.accessibleLabel": "اختر سمة",
  "themeSelect.dark": "داكن",
  "themeSelect.light": "فاتح",
  "themeSelect.auto": "تلقائي",
  "languageSelect.accessibleLabel": "اختر لغة",
  "menuButton.accessibleLabel": "القائمة",
  "sidebarNav.accessibleLabel": "الرئيسية",
  "tableOfContents.onThisPage": "على هذه الصفحة",
  "tableOfContents.overview": "نظرة عامة",
  "i18n.untranslatedContent": "هذا المحتوى غير متوفر بلغتك بعد.",
  "page.editLink": "عدل الصفحة",
  "page.lastUpdated": "آخر تحديث:",
  "page.previousLink": "السابق",
  "page.nextLink": "التالي",
  "page.draft": "هذا المحتوى مجرد مسودة ولن يظهر في بنيات الإنتاج",
  "404.text": "الصفحة غير موجودة. تأكد من الرابط أو ابحث بإستعمال شريط البحث.",
  "aside.note": "ملاحظة",
  "aside.tip": "نصيحة",
  "aside.caution": "تنبيه",
  "aside.danger": "تحذير",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "طوِّر بواسطة Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const nb = {
  "skipLink.label": "Gå til innholdet",
  "search.label": "Søk",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Avbryt",
  "search.devWarning": "Søk er bare tilgjengelig i produksjonsbygg. \nPrøv å bygg siden og forhåndsvis den for å teste det lokalt.",
  "themeSelect.accessibleLabel": "Velg tema",
  "themeSelect.dark": "Mørk",
  "themeSelect.light": "Lys",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Velg språk",
  "menuButton.accessibleLabel": "Meny",
  "sidebarNav.accessibleLabel": "Hovednavigasjon",
  "tableOfContents.onThisPage": "På denne siden",
  "tableOfContents.overview": "Oversikt",
  "i18n.untranslatedContent": "Dette innholdet er ikke tilgjengelig på ditt språk.",
  "page.editLink": "Rediger side",
  "page.lastUpdated": "Sist oppdatert:",
  "page.previousLink": "Forrige",
  "page.nextLink": "Neste",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Siden ble ikke funnet. Sjekk URL-en eller prøv å bruke søkefeltet.",
  "aside.note": "Merknad",
  "aside.tip": "Tips",
  "aside.caution": "Advarsel",
  "aside.danger": "Fare",
  "fileTree.directory": "Mappe",
  "builtWithStarlight.label": "Laget med Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const zh = {
  "skipLink.label": "跳转到内容",
  "search.label": "搜索",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "取消",
  "search.devWarning": "搜索仅适用于生产版本。\n尝试构建并预览网站以在本地测试。",
  "themeSelect.accessibleLabel": "选择主题",
  "themeSelect.dark": "深色",
  "themeSelect.light": "浅色",
  "themeSelect.auto": "自动",
  "languageSelect.accessibleLabel": "选择语言",
  "menuButton.accessibleLabel": "菜单",
  "sidebarNav.accessibleLabel": "主要",
  "tableOfContents.onThisPage": "本页内容",
  "tableOfContents.overview": "概述",
  "i18n.untranslatedContent": "此内容尚不支持你的语言。",
  "page.editLink": "编辑此页",
  "page.lastUpdated": "最近更新：",
  "page.previousLink": "上一页",
  "page.nextLink": "下一页",
  "page.draft": "此内容为草稿，不会包含在生产版本中。",
  "404.text": "页面未找到。检查 URL 或尝试使用搜索栏。",
  "aside.note": "注意",
  "aside.tip": "提示",
  "aside.caution": "警告",
  "aside.danger": "危险",
  "fileTree.directory": "文件夹",
  "builtWithStarlight.label": "基于 Starlight 构建",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const ko = {
  "skipLink.label": "콘텐츠로 이동",
  "search.label": "검색",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "취소",
  "search.devWarning": "검색 기능은 프로덕션 빌드에서만 작동합니다. \n로컬에서 테스트하려면 사이트를 빌드하고 미리 보기를 실행하세요.",
  "themeSelect.accessibleLabel": "테마 선택",
  "themeSelect.dark": "어두운 테마",
  "themeSelect.light": "밝은 테마",
  "themeSelect.auto": "자동",
  "languageSelect.accessibleLabel": "언어 선택",
  "menuButton.accessibleLabel": "메뉴",
  "sidebarNav.accessibleLabel": "메인",
  "tableOfContents.onThisPage": "목차",
  "tableOfContents.overview": "개요",
  "i18n.untranslatedContent": "이 콘텐츠는 아직 번역되지 않았습니다.",
  "page.editLink": "페이지 편집",
  "page.lastUpdated": "마지막 업데이트:",
  "page.previousLink": "이전 페이지",
  "page.nextLink": "다음 페이지",
  "page.draft": "이 콘텐츠는 아직 초안 상태이며, 최종 빌드에는 포함되지 않습니다.",
  "404.text": "페이지를 찾을 수 없습니다. URL을 다시 확인해보거나 검색을 사용해보세요.",
  "aside.note": "참고",
  "aside.tip": "팁",
  "aside.caution": "주의",
  "aside.danger": "위험",
  "fileTree.directory": "디렉터리",
  "builtWithStarlight.label": "이 웹사이트는 Starlight로 제작되었습니다.",
  "heading.anchorLabel": "섹션 제목: “{{title}}”",
};

const sv = {
  "skipLink.label": "Hoppa till innehåll",
  "search.label": "Sök",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Avbryt",
  "search.devWarning": "Sökfunktionen är endast tillgänglig i produktionsbyggen. \nProva att bygga och förhandsvisa siten för att testa det lokalt.",
  "themeSelect.accessibleLabel": "Välj tema",
  "themeSelect.dark": "Mörkt",
  "themeSelect.light": "Ljust",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Välj språk",
  "menuButton.accessibleLabel": "Meny",
  "sidebarNav.accessibleLabel": "Huvudmeny",
  "tableOfContents.onThisPage": "På den här sidan",
  "tableOfContents.overview": "Översikt",
  "i18n.untranslatedContent": "Det här innehållet är inte tillgängligt på ditt språk än.",
  "page.editLink": "Redigera sida",
  "page.lastUpdated": "Senast uppdaterad:",
  "page.previousLink": "Föregående",
  "page.nextLink": "Nästa",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Sidan hittades inte. Kontrollera URL:n eller testa att använda sökfältet.",
  "aside.note": "Note",
  "aside.tip": "Tip",
  "aside.caution": "Caution",
  "aside.danger": "Danger",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const ro = {
  "skipLink.label": "Sari la conținut",
  "search.label": "Caută",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Anulează",
  "search.devWarning": "Căutarea este disponibilă numai în versiunea de producție. \nÎncercă să construiești și să previzualizezi site-ul pentru a-l testa local.",
  "themeSelect.accessibleLabel": "Selectează tema",
  "themeSelect.dark": "Întunecată",
  "themeSelect.light": "Deschisă",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Selectează limba",
  "menuButton.accessibleLabel": "Meniu",
  "sidebarNav.accessibleLabel": "Principal",
  "tableOfContents.onThisPage": "Pe această pagină",
  "tableOfContents.overview": "Sinopsis",
  "i18n.untranslatedContent": "Acest conținut nu este încă disponibil în limba selectată.",
  "page.editLink": "Editează pagina",
  "page.lastUpdated": "Ultima actualizare:",
  "page.previousLink": "Pagina precendentă",
  "page.nextLink": "Pagina următoare",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Pagina nu a fost găsită. Verifică adresa URL sau încercă să folosești bara de căutare.",
  "aside.note": "Mențiune",
  "aside.tip": "Sfat",
  "aside.caution": "Atenție",
  "aside.danger": "Pericol",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const ru = {
  "skipLink.label": "Перейти к содержимому",
  "search.label": "Поиск",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Отменить",
  "search.devWarning": "Поиск доступен только в продакшен-сборках. \nВыполните сборку и запустите превью, чтобы протестировать поиск локально.",
  "themeSelect.accessibleLabel": "Выберите тему",
  "themeSelect.dark": "Тёмная",
  "themeSelect.light": "Светлая",
  "themeSelect.auto": "Авто",
  "languageSelect.accessibleLabel": "Выберите язык",
  "menuButton.accessibleLabel": "Меню",
  "sidebarNav.accessibleLabel": "Основное",
  "tableOfContents.onThisPage": "На этой странице",
  "tableOfContents.overview": "Обзор",
  "i18n.untranslatedContent": "Это содержимое пока не доступно на вашем языке.",
  "page.editLink": "Редактировать страницу",
  "page.lastUpdated": "Последнее обновление:",
  "page.previousLink": "Предыдущая",
  "page.nextLink": "Следующая",
  "page.draft": "Этот контент является черновиком и не будет добавлен в продакшен-сборки.",
  "404.text": "Страница не найдена. Проверьте URL или используйте поиск по сайту.",
  "aside.note": "Заметка",
  "aside.tip": "Совет",
  "aside.caution": "Осторожно",
  "aside.danger": "Опасно",
  "fileTree.directory": "Директория",
  "expressiveCode.copyButtonCopied": "Скопировано!",
  "expressiveCode.copyButtonTooltip": "Копировать",
  "expressiveCode.terminalWindowFallbackTitle": "Окно терминала",
  "builtWithStarlight.label": "Сделано с помощью Starlight",
  "heading.anchorLabel": "Заголовок раздела «{{title}}»",
};

const vi = {
  "skipLink.label": "Bỏ qua để đến nội dung",
  "search.label": "Tìm kiếm",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Hủy",
  "search.devWarning": "Chức năng tìm kiếm chỉ có sẵn trong các phiên bản thật.\nHãy thử xây dựng và xem trước trang web để kiểm tra.",
  "themeSelect.accessibleLabel": "Chọn giao diện",
  "themeSelect.dark": "Tối",
  "themeSelect.light": "Sáng",
  "themeSelect.auto": "Tự động",
  "languageSelect.accessibleLabel": "Chọn ngôn ngữ",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Chính",
  "tableOfContents.onThisPage": "Trên trang này",
  "tableOfContents.overview": "Tổng quan",
  "i18n.untranslatedContent": "Nội dung này hiện chưa có sẵn bằng ngôn ngữ của bạn.",
  "page.editLink": "Chỉnh sửa trang",
  "page.lastUpdated": "Cập nhật lần cuối:",
  "page.previousLink": "Trước",
  "page.nextLink": "Tiếp",
  "page.draft": "Nội dung này là bản nháp và sẽ không được đưa vào các phiên bản thật.",
  "404.text": "Không tìm thấy trang. Hãy kiểm tra lại URL hoặc thử dùng thanh tìm kiếm.",
  "aside.note": "Ghi chú",
  "aside.tip": "Mẹo",
  "aside.caution": "Chú ý",
  "aside.danger": "Nguy hiểm",
  "fileTree.directory": "Thư mục",
  "builtWithStarlight.label": "Được xây dựng bằng Starlight",
  "heading.anchorLabel": "Phần tiêu đề “{{title}}”",
};

const uk = {
  "skipLink.label": "Перейти до вмісту",
  "search.label": "Пошук",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Скасувати",
  "search.devWarning": "Пошук доступний лише у виробничих збірках. \nСпробуйте зібрати та переглянути сайт, щоби протестувати його локально",
  "themeSelect.accessibleLabel": "Обрати тему",
  "themeSelect.dark": "Темна",
  "themeSelect.light": "Світла",
  "themeSelect.auto": "Авто",
  "languageSelect.accessibleLabel": "Обрати мову",
  "menuButton.accessibleLabel": "Меню",
  "sidebarNav.accessibleLabel": "Головне",
  "tableOfContents.onThisPage": "На цій сторінці",
  "tableOfContents.overview": "Огляд",
  "i18n.untranslatedContent": "Цей контент ще не доступний вашою мовою.",
  "page.editLink": "Редагувати сторінку",
  "page.lastUpdated": "Останнє оновлення:",
  "page.previousLink": "Назад",
  "page.nextLink": "Далі",
  "page.draft": "Цей контент є чернеткою і не буде включений до виробничих збірок.",
  "404.text": "Сторінку не знайдено. Перевірте URL або спробуйте скористатися пошуком.",
  "aside.note": "Заувага",
  "aside.tip": "Порада",
  "aside.caution": "Обережно",
  "aside.danger": "Небезпечно",
  "fileTree.directory": "Каталог",
  "builtWithStarlight.label": "Створено з Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const hi = {
  "skipLink.label": "इसे छोड़कर कंटेंट पर जाएं",
  "search.label": "खोजें",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "रद्द करे",
  "search.devWarning": "खोज केवल उत्पादन बिल्ड में उपलब्ध है। \nस्थानीय स्तर पर परीक्षण करने के लिए साइट बनाए और उसका पूर्वावलोकन करने का प्रयास करें।",
  "themeSelect.accessibleLabel": "थीम चुनें",
  "themeSelect.dark": "अँधेरा",
  "themeSelect.light": "रोशनी",
  "themeSelect.auto": "स्वत",
  "languageSelect.accessibleLabel": "भाषा चुने",
  "menuButton.accessibleLabel": "मेन्यू",
  "sidebarNav.accessibleLabel": "मुख्य",
  "tableOfContents.onThisPage": "इस पृष्ठ पर",
  "tableOfContents.overview": "अवलोकन",
  "i18n.untranslatedContent": "यह कंटेंट अभी तक आपकी भाषा में उपलब्ध नहीं है।",
  "page.editLink": "पृष्ठ संपादित करें",
  "page.lastUpdated": "आखिरी अद्यतन:",
  "page.previousLink": "पिछला",
  "page.nextLink": "अगला",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "यह पृष्ठ नहीं मिला। URL जांचें या खोज बार का उपयोग करने का प्रयास करें।",
  "aside.note": "टिप्पणी",
  "aside.tip": "संकेत",
  "aside.caution": "सावधानी",
  "aside.danger": "खतरा",
  "fileTree.directory": "Directory",
  "builtWithStarlight.label": "Starlight द्वारा निर्मित",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const zhTW = {
  "skipLink.label": "跳到內容",
  "search.label": "搜尋",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "取消",
  "search.devWarning": "正式版本才能使用搜尋功能。\n如要在本地測試，請先建置並預覽網站。",
  "themeSelect.accessibleLabel": "選擇佈景主題",
  "themeSelect.dark": "深色",
  "themeSelect.light": "淺色",
  "themeSelect.auto": "自動",
  "languageSelect.accessibleLabel": "選擇語言",
  "menuButton.accessibleLabel": "選單",
  "sidebarNav.accessibleLabel": "主要",
  "tableOfContents.onThisPage": "本頁內容",
  "tableOfContents.overview": "概述",
  "i18n.untranslatedContent": "本頁內容尚未翻譯。",
  "page.editLink": "編輯頁面",
  "page.lastUpdated": "最後更新於：",
  "page.previousLink": "前一則",
  "page.nextLink": "下一則",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "找不到頁面。請檢查網址或改用搜尋功能。",
  "aside.note": "注意",
  "aside.tip": "提示",
  "aside.caution": "警告",
  "aside.danger": "危險",
  "fileTree.directory": "目錄",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const pl = {
  "skipLink.label": "Przejdź do głównej zawartości",
  "search.label": "Szukaj",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Anuluj",
  "search.devWarning": "Wyszukiwanie jest dostępne tylko w buildach produkcyjnych. \nSpróbuj zbudować i uruchomić aplikację, aby przetestować lokalnie.",
  "themeSelect.accessibleLabel": "Wybierz motyw",
  "themeSelect.dark": "Ciemny",
  "themeSelect.light": "Jasny",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Wybierz język",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Główne",
  "tableOfContents.onThisPage": "Na tej stronie",
  "tableOfContents.overview": "Przegląd",
  "i18n.untranslatedContent": "Ta treść nie jest jeszcze dostępna w Twoim języku.",
  "page.editLink": "Edytuj stronę",
  "page.lastUpdated": "Ostatnia aktualizacja:",
  "page.previousLink": "Poprzednia strona",
  "page.nextLink": "Następna strona",
  "page.draft": "This content is a draft and will not be included in production builds.",
  "404.text": "Nie znaleziono. Sprawdź URL lub użyj wyszukiwarki.",
  "aside.note": "Notatka",
  "aside.tip": "Wskazówka",
  "aside.caution": "Uwaga",
  "aside.danger": "Ważne",
  "fileTree.directory": "Folder",
  "expressiveCode.copyButtonCopied": "Skopiowane!",
  "expressiveCode.copyButtonTooltip": "Skopiuj do schowka",
  "expressiveCode.terminalWindowFallbackTitle": "Okno terminala",
  "builtWithStarlight.label": "Built with Starlight",
  "heading.anchorLabel": "Dział zatytułowany „{{title}}”",
};

const sk = {
  "skipLink.label": "Preskočiť na obsah",
  "search.label": "Hľadať",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Zrušiť",
  "search.devWarning": "Vyhľadávanie je dostupné len v produkčných zostaveniach. \nSkúste vytvoriť a zobraziť náhľad stránky lokálne.",
  "themeSelect.accessibleLabel": "Vyberte tému",
  "themeSelect.dark": "Tmavý",
  "themeSelect.light": "Svetlý",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Vyberte jazyk",
  "menuButton.accessibleLabel": "Menu",
  "sidebarNav.accessibleLabel": "Hlavný",
  "tableOfContents.onThisPage": "Na tejto stránke",
  "tableOfContents.overview": "Prehľad",
  "i18n.untranslatedContent": "Tento obsah zatiaľ nie je dostupný vo vašom jazyku.",
  "page.editLink": "Upraviť stránku",
  "page.lastUpdated": "Posledná aktualizácia:",
  "page.previousLink": "Predchádzajúce",
  "page.nextLink": "Nasledujúce",
  "page.draft": "Tento obsah je koncept a nebude zahrnutý do produkčných zostavení.",
  "404.text": "Stránka nenájdená. Skontrolujte URL alebo skúste použiť vyhľadávacie pole.",
  "aside.note": "Poznámka",
  "aside.tip": "Tip",
  "aside.caution": "Upozornenie",
  "aside.danger": "Nebezpečenstvo",
  "fileTree.directory": "Adresár",
  "builtWithStarlight.label": "Postavené so Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const lv = {
  "skipLink.label": "Pāriet uz saturu",
  "search.label": "Meklēt",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Atcelt",
  "search.devWarning": "Meklēšana ir pieejama tikai ražošanas kompilācijās. \nMēģiniet kompilēt un priekšskatīt vietni, lai to pārbaudītu lokāli.",
  "themeSelect.accessibleLabel": "Izvēlieties tēmu",
  "themeSelect.dark": "Tumša",
  "themeSelect.light": "Gaiša",
  "themeSelect.auto": "Automātiska",
  "languageSelect.accessibleLabel": "Izvēlieties valodu",
  "menuButton.accessibleLabel": "Izvēlne",
  "sidebarNav.accessibleLabel": "Galvenā",
  "tableOfContents.onThisPage": "Šajā lapā",
  "tableOfContents.overview": "Pārskats",
  "i18n.untranslatedContent": "Šis saturs vēl nav pieejams jūsu valodā.",
  "page.editLink": "Rediģēt lapu",
  "page.lastUpdated": "Pēdējoreiz atjaunināts:",
  "page.previousLink": "Iepriekšējā",
  "page.nextLink": "Nākamā",
  "page.draft": "Šis saturs ir melnraksts un netiks iekļauts ražošanas kompilācijās.",
  "404.text": "Lapa nav atrasta. Pārbaudiet URL vai mēģiniet izmantot meklēšanas joslu.",
  "aside.note": "Piezīme",
  "aside.tip": "Padoms",
  "aside.caution": "Uzmanību",
  "aside.danger": "Bīstamība",
  "fileTree.directory": "Direktorija",
  "builtWithStarlight.label": "Veidots ar Starlight",
  "heading.anchorLabel": "Section titled “{{title}}”",
};

const hu = {
  "skipLink.label": "Tovább a tartalomhoz",
  "search.label": "Keresés",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Mégsem",
  "search.devWarning": "A keresés csak a production build-ekben működik. \nPróbáld meg először buildelni, hogy kipróbálhasd.",
  "themeSelect.accessibleLabel": "Téma választás",
  "themeSelect.dark": "Sötét",
  "themeSelect.light": "Világos",
  "themeSelect.auto": "Auto",
  "languageSelect.accessibleLabel": "Nyelv választása",
  "menuButton.accessibleLabel": "Menü",
  "sidebarNav.accessibleLabel": "Fő",
  "tableOfContents.onThisPage": "Ezen az oldalon",
  "tableOfContents.overview": "Tartalom",
  "i18n.untranslatedContent": "Ez a tartalom még nem érhető el a jelenlegi nyelven.",
  "page.editLink": "Oldal szerkesztése",
  "page.lastUpdated": "Utoljára frissítve:",
  "page.previousLink": "Előző",
  "page.nextLink": "Következő",
  "page.draft": "Ez a tartalom még vázlat, így nem lesz benne a production build-ben.",
  "404.text": "Az oldal nem található. Nézd meg az URL-t vagy használd a keresőt.",
  "aside.note": "Megjegyzés",
  "aside.tip": "Tipp",
  "aside.caution": "Figyelem",
  "aside.danger": "Veszély",
  "fileTree.directory": "Könyvtár",
  "builtWithStarlight.label": "Starlight-tal készítve",
  "heading.anchorLabel": "Szekció neve “{{title}}”",
  "expressiveCode.copyButtonCopied": "Másolva!",
  "expressiveCode.copyButtonTooltip": "Másolás",
  "expressiveCode.terminalWindowFallbackTitle": "Terminál",
  "pagefind.clear_search": "Törlés",
  "pagefind.load_more": "Több találat betöltése",
  "pagefind.search_label": "Keresés ezen az oldalon",
  "pagefind.filters_label": "Szűrők",
  "pagefind.zero_results": "Erre a kifejezésre nincs találat: [SEARCH_TERM]",
  "pagefind.many_results": "[COUNT] találat erre: [SEARCH_TERM]",
  "pagefind.one_result": "[COUNT] találat erre: [SEARCH_TERM]",
  "pagefind.alt_search": "Erre a kifejezésre nincs találat: [SEARCH_TERM]. Találatok mutatása erre: [DIFFERENT_TERM]",
  "pagefind.search_suggestion": "Erre a kifejezésre nincs találat: [SEARCH_TERM]. Próbáld meg ezek közül az egyiket:",
  "pagefind.searching": "Keresés erre: [SEARCH_TERM]...",
};

const el = {
  "skipLink.label": "Μετάβαση στο περιεχόμενο",
  "search.label": "Αναζήτηση",
  "search.ctrlKey": "Ctrl",
  "search.cancelLabel": "Ακύρωση",
  "search.devWarning": "Η αναζήτηση είναι διαθέσιμη μόνο σε builds παραγωγής.\nΔοκίμασε να κάνεις build τον ιστότοπο και να τον προεπισκοπήσεις για να τον ελέγξεις τοπικά.",
  "themeSelect.accessibleLabel": "Επιλογή χρωματικού θέματος",
  "themeSelect.dark": "Σκοτεινό",
  "themeSelect.light": "Φωτεινό",
  "themeSelect.auto": "Σύστημα",
  "languageSelect.accessibleLabel": "Επιλογή γλώσσας",
  "menuButton.accessibleLabel": "Μενού",
  "sidebarNav.accessibleLabel": "Κύρια πλοήγηση",
  "tableOfContents.onThisPage": "Σε αυτή τη σελίδα",
  "tableOfContents.overview": "Επισκόπηση",
  "i18n.untranslatedContent": "Αυτό το περιεχόμενο δεν είναι ακόμη διαθέσιμο στη γλώσσα σου.",
  "page.editLink": "Επεξεργασία σελίδας",
  "page.lastUpdated": "Τελευταία ενημέρωση:",
  "page.previousLink": "Προηγούμενη σελίδα",
  "page.nextLink": "Επόμενη σελίδα",
  "page.draft": "Αυτό το περιεχόμενο είναι πρόχειρο και δεν θα περιλαμβάνεται στα builds παραγωγής.",
  "404.text": "Η σελίδα δεν βρέθηκε. Έλεγξε το URL ή χρησιμοποίησε τη γραμμή αναζήτησης.",
  "aside.note": "Σημείωση",
  "aside.tip": "Συμβουλή",
  "aside.caution": "Προσοχή",
  "aside.danger": "Κίνδυνος",
  "fileTree.directory": "Φάκελος",
  "builtWithStarlight.label": "Δημιουργήθηκε με το Starlight",
  "heading.anchorLabel": "Ενότητα με τίτλο «{{title}}»",
};

const { parse } = builtinI18nSchema();
const builtinTranslations = Object.fromEntries(
  Object.entries({
    cs,
    en,
    es,
    ca,
    de,
    ja,
    pt,
    fa,
    fi,
    fr,
    gl,
    he,
    id,
    it,
    nl,
    da,
    tr,
    ar,
    nb,
    zh,
    ko,
    sv,
    ro,
    ru,
    vi,
    uk,
    hi,
    "zh-TW": zhTW,
    pl,
    sk,
    lv,
    hu,
    el
  }).map(([key, dict]) => [key, parse(dict)])
);

const wellKnownRTL = ["ar", "fa", "he", "prs", "ps", "syc", "ug", "ur"];
const BuiltInDefaultLocale = { ...getLocaleInfo("en"), lang: "en" };
function getLocaleInfo(lang) {
  try {
    const locale = new Intl.Locale(lang);
    const label = new Intl.DisplayNames(locale, { type: "language" }).of(lang);
    if (!label || lang === label) throw new Error("Label not found.");
    return {
      label: label[0]?.toLocaleUpperCase(locale) + label.slice(1),
      dir: getLocaleDir(locale)
    };
  } catch {
    throw new AstroUserError(
      `Failed to get locale information for the '${lang}' locale.`,
      "Make sure to provide a valid BCP-47 tags (e.g. en, ar, or zh-CN)."
    );
  }
}
function getLocaleDir(locale) {
  if ("textInfo" in locale) {
    return locale.textInfo.direction;
  } else if ("getTextInfo" in locale) {
    return locale.getTextInfo().direction;
  }
  return wellKnownRTL.includes(locale.language) ? "rtl" : "ltr";
}
function pickLang(dictionary, lang) {
  return dictionary[lang];
}

const I18nextNamespace = "starlight";
async function createTranslationSystem(config, userTranslations, pluginTranslations = {}) {
  const defaultLocale = config.defaultLocale.lang || config.defaultLocale?.locale || BuiltInDefaultLocale.lang;
  const translations = {
    [defaultLocale]: buildResources(
      builtinTranslations[defaultLocale],
      builtinTranslations[stripLangRegion(defaultLocale)],
      pluginTranslations[defaultLocale],
      userTranslations[defaultLocale]
    )
  };
  if (config.locales) {
    for (const locale in config.locales) {
      const lang = localeToLang(locale, config.locales, config.defaultLocale);
      translations[lang] = buildResources(
        builtinTranslations[lang] || builtinTranslations[stripLangRegion(lang)],
        pluginTranslations[lang],
        userTranslations[lang]
      );
    }
  }
  const i18n = i18next.createInstance();
  await i18n.init({
    resources: translations,
    fallbackLng: config.defaultLocale.lang || config.defaultLocale?.locale || BuiltInDefaultLocale.lang
  });
  return (lang) => {
    lang ??= config.defaultLocale?.lang || BuiltInDefaultLocale.lang;
    const t = i18n.getFixedT(lang, I18nextNamespace);
    t.all = () => i18n.getResourceBundle(lang, I18nextNamespace);
    t.exists = (key, options) => i18n.exists(key, { lng: lang, ns: I18nextNamespace, ...options });
    t.dir = (dirLang = lang) => i18n.dir(dirLang);
    return t;
  };
}
function stripLangRegion(lang) {
  return lang.replace(/-[a-zA-Z]{2}/, "");
}
function localeToLang(locale, locales, defaultLocale) {
  const lang = locale ? locales?.[locale]?.lang : locales?.root?.lang;
  const defaultLang = defaultLocale?.lang || defaultLocale?.locale;
  return lang || defaultLang || BuiltInDefaultLocale.lang;
}
function buildResources(...dictionaries) {
  const dictionary = {};
  for (const dict of dictionaries) {
    for (const key in dict) {
      const value = dict[key];
      if (value) dictionary[key] = value;
    }
  }
  return { [I18nextNamespace]: dictionary };
}

function getCollectionPathFromRoot(collection, { root, srcDir }) {
  return (typeof srcDir === "string" ? srcDir : srcDir.pathname).replace(
    typeof root === "string" ? root : root.pathname,
    ""
  ) + "content/" + collection;
}

function ensureLeadingSlash(href) {
  if (href[0] !== "/") href = "/" + href;
  return href;
}
function ensureTrailingSlash(href) {
  if (href[href.length - 1] !== "/") href += "/";
  return href;
}
function stripLeadingSlash(href) {
  if (href[0] === "/") href = href.slice(1);
  return href;
}
function stripTrailingSlash(href) {
  if (href[href.length - 1] === "/") href = href.slice(0, -1);
  return href;
}
function stripLeadingAndTrailingSlashes(href) {
  href = stripLeadingSlash(href);
  href = stripTrailingSlash(href);
  return href;
}
function stripHtmlExtension(path) {
  const pathWithoutTrailingSlash = stripTrailingSlash(path);
  return pathWithoutTrailingSlash.endsWith(".html") ? pathWithoutTrailingSlash.slice(0, -5) : path;
}
function ensureHtmlExtension(path) {
  path = stripLeadingAndTrailingSlashes(path);
  if (!path.endsWith(".html")) {
    path = path ? path + ".html" : "/index.html";
  }
  return ensureLeadingSlash(path);
}
function stripExtension(path) {
  const periodIndex = path.lastIndexOf(".");
  return path.slice(0, periodIndex > -1 ? periodIndex : void 0);
}

const i18nCollectionPathFromRoot = getCollectionPathFromRoot("i18n", project);
async function loadTranslations() {
  const warn = console.warn;
  console.warn = () => {
  };
  const userTranslations = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — may be a type error in projects without an i18n collection
    (await getCollection("i18n")).map(({ id, data, filePath }) => {
      const lang = !filePath ? id : stripExtension(stripLeadingSlash(filePath.replace(i18nCollectionPathFromRoot, "")));
      return [lang, data];
    })
  );
  console.warn = warn;
  return userTranslations;
}
const useTranslations = await createTranslationSystem(
  starlightConfig,
  await loadTranslations(),
  pluginTranslations
);

export { BuiltInDefaultLocale as B, CONTENT_LAYER_TYPE as C, DEFAULT_OUTPUT_FORMAT as D, LIVE_CONTENT_TYPE as L, VALID_SUPPORTED_FORMATS as V, starlightConfig as a, getCollection as b, stripTrailingSlash as c, stripLeadingSlash as d, stripHtmlExtension as e, ensureHtmlExtension as f, getCollectionPathFromRoot as g, ensureTrailingSlash as h, pickLang as i, ensureLeadingSlash as j, stripExtension as k, getEntry as l, DEFAULT_HASH_PROPS as m, defineCollection as n, project as p, renderEntry as r, stripLeadingAndTrailingSlashes as s, useTranslations as u };
