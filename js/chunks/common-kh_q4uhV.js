import { d as createAstro, c as createComponent, r as renderComponent, b as renderTemplate } from './astro/server-CLdwTDY0.js';
import 'piccolore';
import { r as renderEntry } from './translations-DPyF2JMs.js';
import { g as getRoute, a as attachRouteDataAndRunMiddleware, u as useRouteData, $ as $$Page } from './middleware-BNz-C4vL.js';

const $$Astro = createAstro("https://diesel.rs");
const $$Common = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Common;
  const route = await getRoute(Astro2);
  const renderResult = await renderEntry(route.entry);
  await attachRouteDataAndRunMiddleware(Astro2, useRouteData(Astro2, route, renderResult));
  const { Content, entry } = Astro2.locals.starlightRoute;
  return renderTemplate`${renderComponent($$result, "Page", $$Page, {}, { "default": async ($$result2) => renderTemplate`${Content && renderTemplate`${renderComponent($$result2, "Content", Content, { "frontmatter": entry.data })}`}` })}`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/node_modules/@astrojs/starlight/routes/common.astro", void 0);

export { $$Common as $ };
