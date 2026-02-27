import { c as createComponent, r as renderComponent, b as renderTemplate, d as createAstro, e as renderSlot, m as maybeRenderHead, f as addAttribute, g as Fragment, h as renderScript } from './astro/server-CLdwTDY0.js';
import 'piccolore';
import { H as HeadConfigSchema, b as urlToSlug, s as slugToLocaleData, c as getSidebarFromConfig, d as getSidebar, e as getSiteTitle$1, f as getToC, h as getSiteTitleHref, i as getPrevNextLinks, j as getHead, a as attachRouteDataAndRunMiddleware, $ as $$Page, k as context, l as getLoaderConfig, m as getLink, n as getPathWithLocale, o as getI18nLabel } from './middleware-VlC8AfLK.js';
import * as z from 'zod';
import { s as stripLeadingAndTrailingSlashes, g as getCollectionPathFromRoot, p as project, a as starlightConfig, b as getCollection, r as renderEntry } from './translations-DODf8bvg.js';
import { I as Icons, a as I18nBadgeConfigSchema, B as BadgeConfigSchema, p as parseAsyncWithFriendlyErrors, b as parseWithFriendlyErrors, $ as $$Badge, c as $$Icon, d as $$LinkButton } from './Code-DTyl5U7a.js';
/* empty css                        */
import '../../renderers.mjs';

const PrevNextLinkConfigSchema = () => z.union([
  z.boolean(),
  z.string(),
  z.object({
    /** The navigation link URL. */
    link: z.string().optional(),
    /** The navigation link text. */
    label: z.string().optional()
  }).strict()
]).optional();

const defaults = { minHeadingLevel: 2, maxHeadingLevel: 3 };
const TableOfContentsSchema = () => z.union([
  z.object({
    /** The level to start including headings at in the table of contents. Default: 2. */
    minHeadingLevel: z.number().int().min(1).max(6).optional().default(2),
    /** The level to stop including headings at in the table of contents. Default: 3. */
    maxHeadingLevel: z.number().int().min(1).max(6).optional().default(3)
  }),
  z.boolean().transform((enabled) => enabled ? defaults : false)
]).default(defaults).refine((toc) => toc ? toc.minHeadingLevel <= toc.maxHeadingLevel : true, {
  message: "minHeadingLevel must be less than or equal to maxHeadingLevel"
});

const iconNames = Object.keys(Icons);
const IconSchema = () => z.enum(iconNames);

const HeroSchema = ({ image }) => z.object({
  /**
   * The large title text to show. If not provided, will default to the top-level `title`.
   * Can include HTML.
   */
  title: z.string().optional(),
  /**
   * A short bit of text about your project.
   * Will be displayed in a smaller size below the title.
   */
  tagline: z.string().optional(),
  /** The image to use in the hero. You can provide either a relative `file` path or raw `html`. */
  image: z.union([
    z.object({
      /** Alt text for screenreaders and other assistive technologies describing your hero image. */
      alt: z.string().default(""),
      /** Relative path to an image file in your repo, e.g. `../../assets/hero.png`. */
      file: image()
    }),
    z.object({
      /** Alt text for screenreaders and other assistive technologies describing your hero image. */
      alt: z.string().default(""),
      /** Relative path to an image file in your repo to use in dark mode, e.g. `../../assets/hero-dark.png`. */
      dark: image(),
      /** Relative path to an image file in your repo to use in light mode, e.g. `../../assets/hero-light.png`. */
      light: image()
    }),
    z.object({
      /** Raw HTML string instead of an image file. Useful for inline SVGs or more complex hero content. */
      html: z.string()
    }).transform(({ html }) => ({ html, alt: "" }))
  ]).optional(),
  /** An array of call-to-action links displayed at the bottom of the hero. */
  actions: z.object({
    /** Text label displayed in the link. */
    text: z.string(),
    /** Value for the link’s `href` attribute, e.g. `/page` or `https://mysite.com`. */
    link: z.string(),
    /** Button style to use. One of `primary` (the default), `secondary`, or `minimal`. */
    variant: z.enum(["primary", "secondary", "minimal"]).default("primary"),
    /**
     * An optional icon to display alongside the link text.
     * Can be an inline `<svg>` or the name of one of Starlight’s built-in icons.
     */
    icon: z.union([IconSchema(), z.string().startsWith("<svg")]).transform((icon) => {
      const parsedIcon = IconSchema().safeParse(icon);
      return parsedIcon.success ? { type: "icon", name: parsedIcon.data } : { type: "raw", html: icon };
    }).optional(),
    /** HTML attributes to add to the link */
    attrs: z.record(z.union([z.string(), z.number(), z.boolean()])).optional()
  }).array().default([])
});

const SidebarBaseSchema = z.object({
  /** The visible label for this item in the sidebar. */
  label: z.string(),
  /** Translations of the `label` for each supported language. */
  translations: z.record(z.string()).default({}),
  /** Adds a badge to the item */
  badge: I18nBadgeConfigSchema()
});
const SidebarGroupSchema = SidebarBaseSchema.extend({
  /**
   * Explicitly prevent custom attributes on groups as the final type for supported sidebar item
   * is a non-discriminated union where TypeScript will not perform excess property checks.
   * This means that a user could define a sidebar group with custom attributes, not getting a
   * TypeScript error, and only have it fail at runtime.
   * @see https://github.com/microsoft/TypeScript/issues/20863
   */
  attrs: z.never().optional(),
  /** Whether this item should be collapsed by default. */
  collapsed: z.boolean().default(false)
});
const linkHTMLAttributesSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.undefined(), z.null()])
);
const SidebarLinkItemHTMLAttributesSchema = () => linkHTMLAttributesSchema.default({});
const SidebarLinkItemSchema = SidebarBaseSchema.extend({
  /** The link to this item’s content. Can be a relative link to local files or the full URL of an external page. */
  link: z.string(),
  /** HTML attributes to add to the link item. */
  attrs: SidebarLinkItemHTMLAttributesSchema()
}).strict();
const AutoSidebarGroupSchema = SidebarGroupSchema.extend({
  /** Enable autogenerating a sidebar category from a specific docs directory. */
  autogenerate: z.object({
    /** The directory to generate sidebar items for. */
    directory: z.string().transform(stripLeadingAndTrailingSlashes),
    /**
     * Whether the autogenerated subgroups should be collapsed by default.
     * Defaults to the `AutoSidebarGroup` `collapsed` value.
     */
    collapsed: z.boolean().optional(),
    /** HTML attributes to add to the autogenerated link items. */
    attrs: SidebarLinkItemHTMLAttributesSchema()
    // TODO: not supported by Docusaurus but would be good to have
    /** How many directories deep to include from this directory in the sidebar. Default: `Infinity`. */
    // depth: z.number().optional(),
  })
}).strict();
const ManualSidebarGroupSchema = SidebarGroupSchema.extend({
  /** Array of links and subcategories to display in this category. */
  items: z.lazy(
    () => z.union([
      SidebarLinkItemSchema,
      ManualSidebarGroupSchema,
      AutoSidebarGroupSchema,
      InternalSidebarLinkItemSchema,
      InternalSidebarLinkItemShorthandSchema
    ]).array()
  )
}).strict();
const InternalSidebarLinkItemSchema = SidebarBaseSchema.partial({ label: true }).extend({
  /** The link to this item’s content. Must be a slug of a Content Collection entry. */
  slug: z.string(),
  /** HTML attributes to add to the link item. */
  attrs: SidebarLinkItemHTMLAttributesSchema()
});
const InternalSidebarLinkItemShorthandSchema = z.string().transform((slug) => InternalSidebarLinkItemSchema.parse({ slug }));
const SidebarItemSchema = z.union([
  SidebarLinkItemSchema,
  ManualSidebarGroupSchema,
  AutoSidebarGroupSchema,
  InternalSidebarLinkItemSchema,
  InternalSidebarLinkItemShorthandSchema
]);

const StarlightFrontmatterSchema = (context) => z.object({
  /** The title of the current page. Required. */
  title: z.string(),
  /**
   * A short description of the current page’s content. Optional, but recommended.
   * A good description is 150–160 characters long and outlines the key content
   * of the page in a clear and engaging way.
   */
  description: z.string().optional(),
  /**
   * Custom URL where a reader can edit this page.
   * Overrides the `editLink.baseUrl` global config if set.
   *
   * Can also be set to `false` to disable showing an edit link on this page.
   */
  editUrl: z.union([z.string().url(), z.boolean()]).optional().default(true),
  /** Set custom `<head>` tags just for this page. */
  head: HeadConfigSchema({ source: "content" }),
  /** Override global table of contents configuration for this page. */
  tableOfContents: TableOfContentsSchema().optional(),
  /**
   * Set the layout style for this page.
   * Can be `'doc'` (the default) or `'splash'` for a wider layout without any sidebars.
   */
  template: z.enum(["doc", "splash"]).default("doc"),
  /** Display a hero section on this page. */
  hero: HeroSchema(context).optional(),
  /**
   * The last update date of the current page.
   * Overrides the `lastUpdated` global config or the date generated from the Git history.
   */
  lastUpdated: z.union([z.date(), z.boolean()]).optional(),
  /**
   * The previous navigation link configuration.
   * Overrides the `pagination` global config or the link text and/or URL.
   */
  prev: PrevNextLinkConfigSchema(),
  /**
   * The next navigation link configuration.
   * Overrides the `pagination` global config or the link text and/or URL.
   */
  next: PrevNextLinkConfigSchema(),
  sidebar: z.object({
    /**
     * The order of this page in the navigation.
     * Pages are sorted by this value in ascending order. Then by slug.
     * If not provided, pages will be sorted alphabetically by slug.
     * If two pages have the same order value, they will be sorted alphabetically by slug.
     */
    order: z.number().optional(),
    /**
     * The label for this page in the navigation.
     * Defaults to the page `title` if not set.
     */
    label: z.string().optional(),
    /**
     * Prevents this page from being included in autogenerated sidebar groups.
     */
    hidden: z.boolean().default(false),
    /**
     * Adds a badge to the sidebar link.
     * Can be a string or an object with a variant and text.
     * Variants include 'note', 'tip', 'caution', 'danger', 'success', and 'default'.
     * Passing only a string defaults to the 'default' variant which uses the site accent color.
     */
    badge: BadgeConfigSchema(),
    /** HTML attributes to add to the sidebar link. */
    attrs: SidebarLinkItemHTMLAttributesSchema()
  }).default({}),
  /** Display an announcement banner at the top of this page. */
  banner: z.object({
    /** The content of the banner. Supports HTML syntax. */
    content: z.string()
  }).optional(),
  /** Pagefind indexing for this page - set to false to disable. */
  pagefind: z.boolean().default(true),
  /**
   * Indicates that this page is a draft and will not be included in production builds.
   * Note that the page will still be available when running Astro in development mode.
   */
  draft: z.boolean().default(false)
});
function docsSchema(...args) {
  const [options = {}] = args;
  const { extend } = options;
  return (context) => {
    const UserSchema = typeof extend === "function" ? extend(context) : extend;
    return UserSchema ? StarlightFrontmatterSchema(context).and(UserSchema) : StarlightFrontmatterSchema(context);
  };
}

const StarlightPageFrontmatterSchema = async (context) => {
  const userDocsSchema = await getUserDocsSchema();
  const schema = typeof userDocsSchema === "function" ? userDocsSchema(context) : userDocsSchema;
  return schema.transform((frontmatter) => {
    const { editUrl, sidebar, ...others } = frontmatter;
    const pageEditUrl = editUrl === void 0 || editUrl === true ? false : editUrl;
    return { ...others, editUrl: pageEditUrl };
  });
};
const validateSidebarProp = (sidebarProp) => {
  return parseWithFriendlyErrors(
    SidebarItemSchema.array().optional(),
    sidebarProp,
    "Invalid sidebar prop passed to the `<StarlightPage/>` component."
  );
};
async function generateStarlightPageRouteData({
  props,
  context
}) {
  const { frontmatter, ...routeProps } = props;
  const { url } = context;
  const slug = urlToSlug(url);
  const pageFrontmatter = await getStarlightPageFrontmatter(frontmatter);
  const id = slug;
  const localeData = slugToLocaleData(slug);
  const sidebar = props.sidebar ? getSidebarFromConfig(validateSidebarProp(props.sidebar), url.pathname, localeData.locale) : getSidebar(url.pathname, localeData.locale);
  const headings = props.headings ?? [];
  const pageDocsEntry = {
    id,
    slug,
    body: "",
    collection: "docs",
    filePath: `${getCollectionPathFromRoot("docs", project)}/${stripLeadingAndTrailingSlashes(slug)}.md`,
    data: {
      ...pageFrontmatter,
      sidebar: {
        attrs: {},
        hidden: false
      }
    }
  };
  const entry = pageDocsEntry;
  const entryMeta = {
    dir: props.dir ?? localeData.dir,
    lang: props.lang ?? localeData.lang,
    locale: localeData.locale
  };
  const editUrl = pageFrontmatter.editUrl ? new URL(pageFrontmatter.editUrl) : void 0;
  const lastUpdated = pageFrontmatter.lastUpdated instanceof Date ? pageFrontmatter.lastUpdated : void 0;
  const pageProps = {
    ...routeProps,
    ...localeData,
    entry,
    headings,
    locale: localeData.locale};
  const siteTitle = getSiteTitle$1(localeData.lang);
  const routeData = {
    ...routeProps,
    ...localeData,
    id,
    editUrl,
    entry,
    entryMeta,
    hasSidebar: props.hasSidebar ?? entry.data.template !== "splash",
    head: getHead(pageProps, context, siteTitle),
    headings,
    lastUpdated,
    pagination: getPrevNextLinks(sidebar, starlightConfig.pagination, entry.data),
    sidebar,
    siteTitle,
    siteTitleHref: getSiteTitleHref(localeData.locale),
    slug,
    toc: getToC(pageProps)
  };
  return routeData;
}
async function getStarlightPageFrontmatter(frontmatter) {
  const schema = await StarlightPageFrontmatterSchema({
    image: (() => (
      // Mock validator for ImageMetadata.
      // https://github.com/withastro/astro/blob/cf993bc263b58502096f00d383266cd179f331af/packages/astro/src/assets/types.ts#L32
      // It uses a custom validation approach because imported SVGs have a type of `function` as
      // well as containing the metadata properties and this ensures we handle those correctly.
      z.custom(
        (value) => value && (typeof value === "function" || typeof value === "object") && "src" in value && "width" in value && "height" in value && "format" in value,
        "Invalid image passed to `<StarlightPage>` component. Expected imported `ImageMetadata` object."
      )
    ))
  });
  return parseAsyncWithFriendlyErrors(
    schema,
    frontmatter,
    "Invalid frontmatter props passed to the `<StarlightPage/>` component."
  );
}
async function getUserDocsSchema() {
  const userCollections = (await import('./collection-config-CX8AzyHQ.js')).collections;
  return userCollections?.docs?.schema ?? docsSchema();
}

const $$Astro$7 = createAstro("https://diesel.rs");
const $$StarlightPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$StarlightPage;
  await attachRouteDataAndRunMiddleware(
    Astro2,
    await generateStarlightPageRouteData({ props: Astro2.props, context: Astro2 })
  );
  return renderTemplate`${renderComponent($$result, "Page", $$Page, {}, { "default": async ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/@astrojs/starlight/components/StarlightPage.astro", void 0);

const config = getLoaderConfig();
async function getChangelogsStaticPaths() {
  const paths = [];
  for (const changelog of config) {
    if (!changelog.enabled) continue;
    for (const localeKey of Object.keys(context.locales ?? { root: void 0 })) {
      const locale = localeKey === "root" ? void 0 : localeKey;
      const entries = await getVersionEntries(changelog, locale);
      const pages = getPaginatedVersionEntries(changelog, entries);
      const versions = getAllVersions(entries, locale);
      const context2 = { locale, versions };
      const accumulatedEntries = [];
      for (const [index, entries2] of pages.entries()) {
        paths.push(getVersionsStaticPath(changelog, pages, entries2, index, context2));
        for (const entry of entries2) {
          paths.push(getVersionStaticPath(changelog, entry, context2));
          accumulatedEntries.push(entry);
          paths.push(getCompareStaticPath(changelog, accumulatedEntries, entry, context2));
        }
      }
    }
  }
  return paths;
}
async function getVersionEntries(changelog, locale) {
  const entries = await getCollection("changelogs", ({ data }) => data.base === changelog.base);
  return entries.map((entry, index) => {
    const prevEntry = entries[index - 1];
    const prevLink = prevEntry ? { label: prevEntry.data.title, link: getLink(getVersionPath(prevEntry, locale)) } : void 0;
    const comparePrevLink = prevEntry ? { label: prevEntry.data.title, link: getLink(getComparePath(prevEntry, locale)) } : void 0;
    const nextEntry = entries[index + 1];
    const nextLink = nextEntry ? { label: nextEntry.data.title, link: getLink(getVersionPath(nextEntry, locale)) } : void 0;
    const compareNextLink = nextEntry ? { label: nextEntry.data.title, link: getLink(getComparePath(nextEntry, locale)) } : void 0;
    return {
      ...entry,
      compare: {
        pagination: {
          next: compareNextLink,
          prev: comparePrevLink
        }
      },
      latest: index === 0,
      pagination: {
        next: nextLink,
        prev: prevLink
      }
    };
  });
}
function getPaginatedVersionEntries(changelog, entries) {
  const pages = [];
  for (const entry of entries) {
    const lastPage = pages.at(-1);
    if (!lastPage || lastPage.length === changelog.pageSize) {
      pages.push([entry]);
    } else {
      lastPage.push(entry);
    }
  }
  if (pages.length === 0) {
    pages.push([]);
  }
  return pages;
}
function getVersionsStaticPath(changelog, pages, entries, index, { locale, versions }) {
  const prevPage = index === 0 ? void 0 : pages[index - 1];
  const prevLink = prevPage ? { label: "Newer versions", link: getLink(getVersionsPath(changelog, locale, index - 1)) } : void 0;
  const nextPage = pages[index + 1];
  const nextLink = nextPage ? { label: "Older versions", link: getLink(getVersionsPath(changelog, locale, index + 1)) } : void 0;
  return {
    params: {
      slug: getVersionsPath(changelog, locale, index)
    },
    props: {
      type: "versions",
      changelog,
      entries,
      locale,
      pagination: {
        next: nextLink,
        prev: prevLink
      },
      versions
    }
  };
}
function getVersionStaticPath(changelog, entry, { locale, versions }) {
  return {
    params: {
      slug: getVersionPath(entry, locale)
    },
    props: {
      type: "version",
      changelog,
      entry,
      locale,
      versions
    }
  };
}
function getCompareStaticPath(changelog, entries, entry, { locale, versions }) {
  return {
    params: {
      slug: getComparePath(entry, locale)
    },
    props: {
      type: "compare",
      changelog,
      entries: entries.toReversed(),
      entry,
      locale,
      versions
    }
  };
}
function getAllVersions(entries, locale) {
  return entries.map((entry) => ({
    link: getLink(getVersionPath(entry, locale)),
    title: entry.data.title
  }));
}
function getVersionsPath(changelog, locale, index) {
  return index ? `${getPathWithLocale(changelog.base, locale)}/${index + 1}` : getPathWithLocale(changelog.base, locale);
}
function getVersionPath(entry, locale) {
  return getPathWithLocale(entry.id, locale);
}
function getComparePath(entry, locale) {
  return getPathWithLocale(`${entry.id}...latest`, locale);
}

function getChangelogTitle(changelog, locale) {
  const title = getI18nLabel(changelog.title, locale);
  if (title.length === 0) {
    throw new Error("The changelog title must have a key for the default language.");
  }
  return title;
}
function getSiteTitle(lang) {
  return context.title;
}

const $$Astro$6 = createAstro("https://diesel.rs");
const $$Title = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Title;
  const { date, id, latest, link, title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<h2${addAttribute(id, "id")} class="astro-rvq5mvj3"> ${link ? renderTemplate`<a${addAttribute(link, "href")} class="astro-rvq5mvj3">${title}</a>` : title}${latest && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-rvq5mvj3" }, { "default": ($$result2) => renderTemplate`${" "}${renderComponent($$result2, "Badge", $$Badge, { "text": "Latest", "variant": "note", "class": "astro-rvq5mvj3" })} ` })}`} </h2> ${date && renderTemplate`<time${addAttribute(date.toISOString(), "datetime")} class="astro-rvq5mvj3">${Astro2.locals.t("starlightChangelogs.version.date", { date })}</time>`} `;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/components/Title.astro", void 0);

const $$Astro$5 = createAstro("https://diesel.rs");
const $$VersionList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$VersionList;
  const { versions } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "starlight-changelogs-versions-list", "starlight-changelogs-versions-list", { "class": "astro-3hot6j75" }, { "default": () => renderTemplate` ${maybeRenderHead()}<form onsubmit="return false" class="astro-3hot6j75"> <label class="sr-only astro-3hot6j75" for="find-version">${Astro2.locals.t("starlightChangelogs.version.find")}</label> ${renderComponent($$result, "Icon", $$Icon, { "class": "sl-changelogs-version-list-icon astro-3hot6j75", "name": "magnifier" })} <input autocomplete="off" id="find-version" list="starlight-changelogs-versions"${addAttribute(Astro2.locals.t("starlightChangelogs.version.find"), "placeholder")} type="text" required class="astro-3hot6j75"> <datalist id="starlight-changelogs-versions" class="astro-3hot6j75"> ${versions.map(({ link, title }) => renderTemplate`<option${addAttribute(link, "data-link")}${addAttribute(title, "value")} class="astro-3hot6j75"></option>`)} </datalist> </form> ` })}  ${renderScript($$result, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/components/VersionList.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/components/VersionList.astro", void 0);

const $$Astro$4 = createAstro("https://diesel.rs");
const $$Toolbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Toolbar;
  const { backLink, compareLink, link, versions } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="not-content astro-ummqa5ku"> ${renderComponent($$result, "VersionList", $$VersionList, { "versions": versions, "class": "astro-ummqa5ku" })} ${(backLink || compareLink || link) && renderTemplate`<div class="links sl-flex astro-ummqa5ku"> ${backLink && renderTemplate`${renderComponent($$result, "LinkButton", $$LinkButton, { "href": backLink, "variant": "secondary", "icon": "left-arrow", "iconPlacement": "start", "class": "astro-ummqa5ku" }, { "default": ($$result2) => renderTemplate`${Astro2.locals.t("starlightChangelogs.versions.all")}` })}`} ${compareLink && renderTemplate`${renderComponent($$result, "LinkButton", $$LinkButton, { "class": "compare astro-ummqa5ku", "href": compareLink, "variant": "secondary", "icon": "external", "iconPlacement": "start" }, { "default": ($$result2) => renderTemplate`${Astro2.locals.t("starlightChangelogs.compare.label")}` })}`} ${link && renderTemplate`${renderComponent($$result, "LinkButton", $$LinkButton, { "href": link.href, "variant": "secondary", "icon": "external", "iconPlacement": "start", "class": "astro-ummqa5ku" }, { "default": ($$result2) => renderTemplate`${Astro2.locals.t("starlightChangelogs.version.open", { provider: link.provider })}` })}`} </div>`} </div> `;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/components/Toolbar.astro", void 0);

const $$Astro$3 = createAstro("https://diesel.rs");
const $$Compare = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Compare;
  const { changelog, entries, entry, locale, versions } = Astro2.props;
  const changelogTitle = getChangelogTitle(changelog, locale);
  const compareTitle = Astro2.locals.t("starlightChangelogs.compare.title", {
    version: entry.data.title
  });
  return renderTemplate`${renderComponent($$result, "StarlightPage", $$StarlightPage, { "frontmatter": {
    head: [
      {
        tag: "title",
        content: `${compareTitle} ${context.titleDelimiter} ${changelogTitle} ${context.titleDelimiter} ${getSiteTitle(Astro2.currentLocale)}`
      }
    ],
    next: entry.compare.pagination.next,
    pagefind: changelog.pagefind,
    prev: entry.compare.pagination.prev,
    title: compareTitle
  }, "headings": entries.map((entry2) => ({ depth: 2, slug: entry2.data.slug, text: entry2.data.title })) }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Toolbar", $$Toolbar, { "backLink": getLink(getVersionsPath(changelog, locale)), "versions": versions })} ${entries.map(async (entry2) => {
    const { Content } = await renderEntry(entry2);
    return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Title", $$Title, { "date": entry2.data.date, "id": entry2.data.slug, "latest": entry2.latest, "link": getLink(getVersionPath(entry2, locale)), "title": entry2.data.title })} ${renderComponent($$result3, "Content", Content, {})} ` })}`;
  })}` })}`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/components/Compare.astro", void 0);

const $$Astro$2 = createAstro("https://diesel.rs");
const $$Version = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Version;
  const { changelog, entry, locale, versions } = Astro2.props;
  const { Content, headings } = await renderEntry(entry);
  const changelogTitle = getChangelogTitle(changelog, locale);
  const versionTitle = Astro2.locals.t("starlightChangelogs.version.title", {
    title: changelog.title,
    version: entry.data.title
  });
  return renderTemplate`${renderComponent($$result, "StarlightPage", $$StarlightPage, { "frontmatter": {
    head: [
      {
        tag: "title",
        content: `${entry.data.title} ${context.titleDelimiter} ${changelogTitle} ${context.titleDelimiter} ${getSiteTitle(Astro2.currentLocale)}`
      }
    ],
    next: entry.pagination.next,
    pagefind: changelog.pagefind,
    prev: entry.pagination.prev,
    title: changelogTitle
  }, "headings": [{ depth: 2, slug: entry.data.slug, text: versionTitle }, ...headings] }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Toolbar", $$Toolbar, { "backLink": getLink(getVersionsPath(changelog, locale)), "compareLink": entry.latest ? void 0 : getLink(getComparePath(entry, locale)), "link": entry.data.link ? { href: entry.data.link, provider: entry.data.provider.label } : void 0, "versions": versions.filter((version) => version.title !== entry.data.title) })} ${renderComponent($$result2, "Title", $$Title, { "date": entry.data.date, "id": entry.data.slug, "latest": entry.latest, "title": versionTitle })} ${renderComponent($$result2, "Content", Content, {})} ` })}`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/components/Version.astro", void 0);

const $$Astro$1 = createAstro("https://diesel.rs");
const $$Versions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Versions;
  const { changelog, entries, locale, pagination, versions } = Astro2.props;
  function translatePaginationLink(type, link) {
    if (!link) return link;
    return {
      ...link,
      label: Astro2.locals.t(
        type === "next" ? "starlightChangelogs.pagination.next" : "starlightChangelogs.pagination.prev"
      )
    };
  }
  return renderTemplate`${renderComponent($$result, "StarlightPage", $$StarlightPage, { "frontmatter": {
    next: translatePaginationLink("next", pagination.next),
    pagefind: changelog.pagefind,
    prev: translatePaginationLink("prev", pagination.prev),
    title: getChangelogTitle(changelog, locale)
  }, "headings": entries.map((entry) => ({ depth: 2, slug: entry.data.slug, text: entry.data.title })) }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Toolbar", $$Toolbar, { "versions": versions })} ${entries.map(async (entry) => {
    const { Content } = await renderEntry(entry);
    return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Title", $$Title, { "date": entry.data.date, "id": entry.data.slug, "latest": entry.latest, "link": getLink(getVersionPath(entry, locale)), "title": entry.data.title })} ${renderComponent($$result3, "Content", Content, {})} ` })}`;
  })}` })}`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/components/Versions.astro", void 0);

const $$Astro = createAstro("https://diesel.rs");
const prerender = true;
async function getStaticPaths() {
  return getChangelogsStaticPaths();
}
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { type } = Astro2.props;
  return renderTemplate`${type === "versions" && renderTemplate`${renderComponent($$result, "Versions", $$Versions, { ...Astro2.props })}`}${type === "version" && renderTemplate`${renderComponent($$result, "Version", $$Version, { ...Astro2.props })}`}${type === "compare" && renderTemplate`${renderComponent($$result, "Compare", $$Compare, { ...Astro2.props })}`}`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/routes/index.astro", void 0);

const $$file = "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/starlight-changelogs/routes/index.astro";
const $$url = undefined;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	getStaticPaths,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { docsSchema as d, page as p };
