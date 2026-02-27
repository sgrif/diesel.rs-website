import { l as createVNode, g as Fragment, _ as __astro_tag_component__ } from './astro/server-CLdwTDY0.js';
import './Code-BuxNgG9R.js';
import 'clsx';

const frontmatter = {
  "title": "API Documentation",
  "lang": "en-US",
  "head": [{
    "tag": "style",
    "content": ".version-box {\n  margin: 1rem 0rem 2rem 0rem;\n  padding: 1rem 0rem 1rem 1rem;\n}\n\n.version-box:hover {\n  background: var(--sl-color-accent-high);\n  transition: all 0.4s ease-out;\n  border-radius: 5px;\n}\n"
  }]
};
function getHeadings() {
  return [];
}
const dieselVersions = [{
  label: "main branch",
  link: "https://docs.diesel.rs/main/diesel/index.html"
}, {
  label: "2.3.x",
  link: "https://docs.diesel.rs/2.3.x/diesel/index.html"
}, {
  label: "2.2.x",
  link: "https://docs.diesel.rs/2.2.x/diesel/index.html"
}, {
  label: "2.1.x",
  link: "https://docs.diesel.rs/2.1.x/diesel/index.html"
}, {
  label: "2.0.x",
  link: "https://docs.diesel.rs/2.0.x/diesel/index.html"
}, {
  label: "1.4.x",
  link: "https://docs.diesel.rs/1.4.x/diesel/index.html"
}];
function _createMdxContent(props) {
  return createVNode(Fragment, {
    children: dieselVersions.map(item => createVNode("div", {
      class: "version-box",
      children: createVNode("a", {
        href: item.link,
        children: ["API Documentation (", `${item.label}`, ")"]
      })
    }))
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent();
}

const url = "src/content/docs/api_docs/index.mdx";
const file = "/home/runner/work/diesel.rs-website/diesel.rs-website/src/content/docs/api_docs/index.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/runner/work/diesel.rs-website/diesel.rs-website/src/content/docs/api_docs/index.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, dieselVersions, file, frontmatter, getHeadings, url };
