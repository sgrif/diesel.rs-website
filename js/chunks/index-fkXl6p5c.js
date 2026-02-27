import { createRenderer, getStableObjectHash } from 'rehype-expressive-code';
export * from 'rehype-expressive-code';

function mergeEcConfigOptions(...configs) {
  const merged = {};
  configs.forEach((config) => merge(merged, config, ["defaultProps", "frames", "shiki", "styleOverrides"]));
  return merged;
  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function merge(target, source, limitDeepMergeTo, path = "") {
    for (const key in source) {
      const srcProp = source[key];
      const tgtProp = target[key];
      if (isObject(srcProp)) {
        if (isObject(tgtProp) && (!limitDeepMergeTo || limitDeepMergeTo.includes(key))) {
          merge(tgtProp, srcProp, void 0, path ? path + "." + key : key);
        } else {
          target[key] = { ...srcProp };
        }
      } else if (Array.isArray(srcProp)) {
        if (Array.isArray(tgtProp) && path === "shiki" && key === "langs") {
          target[key] = [...tgtProp, ...srcProp];
        } else {
          target[key] = [...srcProp];
        }
      } else {
        target[key] = srcProp;
      }
    }
  }
}
function getAssetsPrefix(fileExtension, assetsPrefix) {
  if (!assetsPrefix)
    return "";
  if (typeof assetsPrefix === "string")
    return assetsPrefix;
  const dotLessFileExtension = fileExtension.slice(1);
  if (assetsPrefix[dotLessFileExtension]) {
    return assetsPrefix[dotLessFileExtension];
  }
  return assetsPrefix.fallback;
}
function getAssetsBaseHref(fileExtension, assetsPrefix, base) {
  return (getAssetsPrefix(fileExtension, assetsPrefix) || base || "").trim().replace(/\/+$/g, "");
}
async function createAstroRenderer({ ecConfig, astroConfig, logger }) {
  const { emitExternalStylesheet = true, customCreateRenderer, plugins = [], shiki = true, ...rest } = ecConfig ?? {};
  const assetsDir = astroConfig.build?.assets || "_astro";
  let inlineStyles = "";
  const hashedStyles = [];
  const hashedScripts = [];
  plugins.push({
    name: "astro-expressive-code",
    hooks: {
      postprocessRenderedBlockGroup: ({ renderData, renderedGroupContents }) => {
        const isFirstGroupInDocument = renderedGroupContents[0]?.codeBlock.parentDocument?.positionInDocument?.groupIndex === 0;
        if (!isFirstGroupInDocument)
          return;
        const extraElements = [];
        hashedStyles.forEach(([hashedRoute]) => {
          extraElements.push({
            type: "element",
            tagName: "link",
            properties: { rel: "stylesheet", href: `${getAssetsBaseHref(".css", astroConfig.build?.assetsPrefix, astroConfig.base)}${hashedRoute}` },
            children: []
          });
        });
        if (inlineStyles) {
          extraElements.push({
            type: "element",
            tagName: "style",
            properties: {},
            children: [{ type: "text", value: inlineStyles }]
          });
        }
        hashedScripts.forEach(([hashedRoute]) => {
          extraElements.push({
            type: "element",
            tagName: "script",
            properties: { type: "module", src: `${getAssetsBaseHref(".js", astroConfig.build?.assetsPrefix, astroConfig.base)}${hashedRoute}` },
            children: []
          });
        });
        if (!extraElements.length)
          return;
        renderData.groupAst.children.unshift(...extraElements);
      }
    }
  });
  const mergedShikiConfig = shiki === true ? {} : shiki;
  const astroShikiConfig = astroConfig.markdown?.shikiConfig;
  if (mergedShikiConfig) {
    if (!mergedShikiConfig.langs && astroShikiConfig?.langs)
      mergedShikiConfig.langs = astroShikiConfig.langs;
    if (!mergedShikiConfig.langAlias && astroShikiConfig?.langAlias)
      mergedShikiConfig.langAlias = astroShikiConfig.langAlias;
  }
  const renderer = await (customCreateRenderer ?? createRenderer)({
    plugins,
    logger,
    shiki: mergedShikiConfig,
    ...rest
  });
  renderer.hashedStyles = hashedStyles;
  renderer.hashedScripts = hashedScripts;
  if (emitExternalStylesheet) {
    const combinedStyles = `${renderer.baseStyles}${renderer.themeStyles}`;
    hashedStyles.push(getHashedRouteWithContent(combinedStyles, `/${assetsDir}/ec.{hash}.css`));
  } else {
    inlineStyles = `${renderer.baseStyles}${renderer.themeStyles}`;
  }
  renderer.baseStyles = "";
  renderer.themeStyles = "";
  const uniqueJsModules = [...new Set(renderer.jsModules)];
  const mergedJsCode = uniqueJsModules.join("\n");
  renderer.jsModules = [];
  hashedScripts.push(getHashedRouteWithContent(mergedJsCode, `/${assetsDir}/ec.{hash}.js`));
  return renderer;
}
function getHashedRouteWithContent(content, routeTemplate) {
  const contentHash = getStableObjectHash(content, { hashLength: 5 });
  return [routeTemplate.replace("{hash}", contentHash), content];
}

export { createAstroRenderer, mergeEcConfigOptions };
