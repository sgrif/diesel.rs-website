import { c as createComponent, m as maybeRenderHead, b as renderTemplate, l as createVNode, g as Fragment, _ as __astro_tag_component__ } from './astro/server-CLdwTDY0.js';
import { e as $$CardGrid, f as $$Tabs, g as $$TabItem } from './Code-C6zxu3W7.js';
import 'piccolore';
import 'clsx';

const features = [
  {
    title: 'Preventing Runtime Errors',
    img: '/images/type-safe.svg',
    text: "We don't want to waste time tracking down runtime errors. We achieve this by having Diesel eliminate the possibility of incorrect database interactions at compile time."
  },
  {
    title: 'Built for Performance',
    img: '/images/performance.svg',
    text: 'Diesel offers a high level query builder and lets you think about your problems in Rust, not SQL. Our focus on zero-cost abstractions allows Diesel to run your query and load your data even faster than C.'
  },
  {
    title: 'Productive and Extensible',
    img: '/images/extensible.svg',
    text: 'Unlike Active Record and other ORMs, Diesel is designed to be abstracted over. Diesel enables you to write reusable code and think in terms of your problem domain and not SQL.'
  }
];

const projects = [
  {
    name: 'crates.io',
    url: 'https://github.com/rust-lang/crates.io',
    description: 'crates.io serves as a central registry for sharing “crates”, which are packages or libraries written in Rust that you can use to enhance your projects. This repository contains the source code and infrastructure for the crates.io website, including both frontend and backend components. It uses Diesel as central component to store crate metadata in a database.',
    img: '/images/crates_io.png',
    imgStyles: 'width: 10rem; height: 10rem;'
  },
  {
    name: 'vaultwarden',
    url: 'https://github.com/dani-garcia/vaultwarden/',
    description: 'Vaultwarden is a alternative server implementation of the Bitwarden Client API, written in Rust and compatible with official Bitwarden clients [disclaimer], perfect for self-hosted deployment where running the official resource-heavy service might not be ideal. Diesel is used to store sensitive data in their backend application.',
    img: '/images/vaultwarden-logo-auto.svg',
    imgStyles: 'width: 25rem; height: 10rem;'
  },
  {
    name: 'lemmy',
    url: 'https://github.com/LemmyNet/lemmy/',
    description: "Lemmy is a link aggregator and forum for the fediverse. It's similar to sites like Reddit, Lobste.rs, or Hacker News: you subscribe to forums you're interested in, post links and discussions, then vote, and comment on them. It's a well established software for the fediverse using Diesel in the backend.",
    img: '/images/lemmy.svg',
    imgStyles: 'width: 10rem; height: 10rem;'
  }
];

const communityProjects = [
  {
    name: 'dsync',
    githubUrl: 'https://github.com/Wulf/dsync',
    crateUrl: 'https://crates.io/crates/dsync',
    badge: 'https://img.shields.io/crates/v/dsync.svg?style=for-the-badge',
    description: 'Generate rust structs & query functions from diesel schema files.'
  },
  {
    name: 'diesel-logger',
    githubUrl: 'https://github.com/shssoichiro/diesel-logger',
    crateUrl: 'https://crates.io/crates/diesel-logger',
    badge: 'https://img.shields.io/crates/v/diesel-logger.svg?style=for-the-badge',
    description: 'A generic diesel connection implementations that allows to log any executed query.'
  },
  {
    name: 'diesel-derive-enum',
    githubUrl: 'http://github.com/adwhit/diesel-derive-enum',
    crateUrl: 'https://crates.io/crates/diesel-derive-enum',
    badge: 'https://img.shields.io/crates/v/diesel-derive-enum.svg?style=for-the-badge',
    description: 'Use Rust enums directly with diesel.'
  },
  {
    name: 'diesel-oci',
    githubUrl: 'https://github.com/GiGainfosystems/diesel-oci',
    crateUrl: 'https://crates.io/crates/diesel-oci',
    badge: 'https://img.shields.io/crates/v/diesel-oci.svg?style=for-the-badge',
    description: 'A diesel backend and connection implementation for oracles database system.'
  },
  {
    name: 'rsfbclient-diesel',
    githubUrl: 'https://github.com/fernandobatels/rsfbclient',
    crateUrl: 'https://crates.io/crates/rsfbclient-diesel',
    badge: 'https://img.shields.io/crates/v/rsfbclient-diesel.svg?style=for-the-badge',
    description: 'A diesel backend and connection implementation for the Firebird database system.'
  },
  {
    name: 'diesel-async',
    githubUrl: 'https://github.com/weiznich/diesel_async',
    crateUrl: 'https://crates.io/crates/diesel-async',
    badge: 'https://img.shields.io/crates/v/diesel-async.svg?style=for-the-badge',
    description: 'An async diesel connection implementation for PostgreSQL and MySQL.'
  },
  {
    name: 'jiff-diesel',
    githubUrl: 'https://crates.io/crates/jiff-diesel',
    crateUrl: 'https://crates.io/crates/jiff-diesel',
    badge: 'https://img.shields.io/crates/v/jiff-diesel.svg?style=for-the-badge',
    description: 'A helper crate to integrate jiff datetime types with diesel.'
  },
  {
    name: 'diesel-guard',
    githubUrl: 'https://github.com/ayarotsky/diesel-guard',
    crateUrl: 'https://crates.io/crates/diesel-guard',
    badge: 'https://img.shields.io/crates/v/diesel-guard.svg?style=for-the-badge',
    description: 'Catch dangerous PostgreSQL migrations before they take down production.'
  }
];


const sponsors = [
  {
    name: 'NLNet Foundation',
    url: 'https://nlnet.nl/project/Diesel/',
    img: '/images/nl_net_foundation_logo.svg',
  },
  {
    name: 'NGI Zero Core',
    url: 'https://nlnet.nl/project/Diesel/',
    img: '/images/NGI0Core_tag.svg',
  },
  {
    name: 'Prototype Fund',
    url: 'https://www.prototypefund.de/projects/diesel-databaseviews',
    img: '/images/PrototypeFund_logo_dark.png',
  },
  {
    name: 'Federal Ministry of Research, Technology and Space (Germany)',
    url: 'https://www.prototypefund.de/projects/diesel-databaseviews',
    img: '/images/bmbf_logo.jpg',
  },
  {
    name: 'GitHub Secure Open Source Fund',
    url: 'https://github.blog/open-source/maintainers/securing-the-supply-chain-at-scale-starting-with-71-important-open-source-projects/',
    img: '/images/GitHub_Logo.png',
  },
  {
    name: 'GiGa infosystems GmbH',
    url: 'https://giga-infosystems.com/',
    img: '/images/logo_giga.svg',
  }
];

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="footer"> <div> <p> Found a mistake on this website? Submit an issue or send a pull request
<a href="https://github.com/sgrif/diesel.rs-website">here</a>! </p> <br> <p>Copyright © 2015-${currentYear} The Diesel Core Team</p> </div> </footer>`;
}, "/home/runner/work/diesel.rs-website/diesel.rs-website/src/components/Footer.astro", void 0);

const frontmatter = {
  "title": "Diesel is a Safe, Extensible ORM and Query Builder for <a href=\"https://www.rust-lang.org/\" target=\"_blank\" class=\"rust-link\">Rust</a>",
  "description": "Diesel is the most productive way to interact with databases in Rust because of its safe and composable abstractions over queries.",
  "template": "splash",
  "hero": {
    "tagline": "Diesel is the most productive way to interact with databases in Rust because of its safe and composable abstractions over queries.",
    "actions": [{
      "text": "🚀 Getting Started",
      "link": "/guides/getting-started",
      "class": "lolik"
    }, {
      "text": "⭐ Contribute to Diesel",
      "link": "#contribute"
    }]
  },
  "head": [{
    "tag": "style",
    "content": "body .main-pane {\n  background: -webkit-linear-gradient(#535379, #c3c3d6);\n  background: linear-gradient(#535379, #c3c3d6);\n  background-repeat: no-repeat;\n  background-attachment: fixed;\n}\n"
  }]
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "why-did-we-make-diesel",
    "text": "Why did we make Diesel?"
  }, {
    "depth": 2,
    "slug": "see-some-examples",
    "text": "See some examples"
  }, {
    "depth": 2,
    "slug": "contribute",
    "text": "Contribute"
  }, {
    "depth": 2,
    "slug": "security-reviews",
    "text": "Security Reviews"
  }, {
    "depth": 2,
    "slug": "notable-sponsors-and-supporters",
    "text": "Notable Sponsors and Supporters"
  }];
}
function _createMdxContent(props) {
  const _components = {
    div: "div",
    p: "p",
    ...props.components
  }, {Fragment: Fragment$1} = _components;
  if (!Fragment$1) _missingMdxReference("Fragment");
  return createVNode(Fragment, {
    children: [createVNode("div", {
      style: "text-align: center; margin-bottom: 4rem;",
      "set:html": "<div class=\"sl-heading-wrapper level-h2\"><h2 id=\"why-did-we-make-diesel\">Why did we make Diesel?</h2><a class=\"sl-anchor-link\" href=\"#why-did-we-make-diesel\"><span aria-hidden=\"true\" class=\"sl-anchor-icon\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\"><path fill=\"currentcolor\" d=\"m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z\"></path></svg></span><span class=\"sr-only\">Section titled “Why did we make Diesel?”</span></a></div>"
    }), "\n", createVNode("div", {
      class: "feature-row-aligned",
      children: createVNode($$CardGrid, {
        children: features.map(feature => createVNode("div", {
          class: "feature-side-by-side",
          children: [createVNode("div", {
            class: "feature-img-side",
            children: createVNode("div", {
              class: "features-img-container",
              children: createVNode("img", {
                class: "features-img",
                src: feature.img
              })
            })
          }), createVNode("div", {
            class: "feature-card-side",
            children: [createVNode("h4", {
              children: feature.title
            }), createVNode("div", {
              children: createVNode("p", {
                children: feature.text
              })
            }, feature.title)]
          })]
        }))
      })
    }), "\n", createVNode("div", {
      style: "text-align: center; margin-bottom: 4rem;",
      "set:html": "<p>Still not sold? Have a look at an in-depth <a href=\"./compare/compare_diesel\">comparison</a> with other rust database crates.</p>"
    }), "\n", createVNode("div", {
      style: "text-align: center; margin: 3rem;",
      "set:html": "<div class=\"sl-heading-wrapper level-h2\"><h2 id=\"see-some-examples\">See some examples</h2><a class=\"sl-anchor-link\" href=\"#see-some-examples\"><span aria-hidden=\"true\" class=\"sl-anchor-icon\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\"><path fill=\"currentcolor\" d=\"m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z\"></path></svg></span><span class=\"sr-only\">Section titled “See some examples”</span></a></div>"
    }), "\n", createVNode($$Tabs, {
      children: [createVNode($$TabItem, {
        label: "Simple Queries",
        "set:html": "<p>Simple queries are a complete breeze. Loading all users from a database:</p><div class=\"expressive-code\"><link rel=\"stylesheet\" href=\"/static/ec.v4551.css\"><script type=\"module\" src=\"/static/ec.0vx5m.js\"></script><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">users</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#C5E478;--1:#3B61B0\">table</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">load</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"users::table.load(&#x26;mut connection)\"><div></div></button></div></figure></div><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Executed SQL</span></figcaption><pre data-language=\"sql\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">SELECT</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#7FDBCA;--1:#096E72\">*</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">FROM</span><span style=\"--0:#D6DEEB;--1:#403F53\"> users;</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"SELECT * FROM users;\"><div></div></button></div></figure></div><p>Loading all the posts for a user:</p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">Post</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#82AAFF;--1:#3B61B0\">belonging_to</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">user</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">load</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"Post::belonging_to(user).load(&#x26;mut connection)\"><div></div></button></div></figure></div><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Executed SQL</span></figcaption><pre data-language=\"sql\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">SELECT</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#7FDBCA;--1:#096E72\">*</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">FROM</span><span style=\"--0:#D6DEEB;--1:#403F53\"> posts </span><span style=\"--0:#C792EA;--1:#8844AE\">WHERE</span><span style=\"--0:#D6DEEB;--1:#403F53\"> user_id </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#F78C6C;--1:#AA0982\">1</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"SELECT * FROM posts WHERE user_id = 1;\"><div></div></button></div></figure></div>"
      }), createVNode($$TabItem, {
        label: "Complex Queries",
        "set:html": "<p>Diesel’s powerful query builder helps you construct queries as simple or complex as you need, at zero cost.</p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">let</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">versions</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> Version</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#82AAFF;--1:#3B61B0\">belonging_to</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">krate</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">select</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">id</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">order</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">num</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">desc</span><span style=\"--0:#D6DEEB;--1:#403F53\">())</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">limit</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#F78C6C;--1:#AA0982\">5</span><span style=\"--0:#D6DEEB;--1:#403F53\">);</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">let</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">downloads</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">version_downloads</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">filter</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">date</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">gt</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">now</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#7FDBCA;--1:#096E72\">-</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#F78C6C;--1:#AA0982\">90.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">days</span><span style=\"--0:#D6DEEB;--1:#403F53\">()))</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">filter</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">version_id</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">eq</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#82AAFF;--1:#3B61B0\">any</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">versions</span><span style=\"--0:#D6DEEB;--1:#403F53\">)))</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">order</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">date</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">load</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">&#x3C;Download>(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">conn</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span><span style=\"--0:#7FDBCA;--1:#096E72\">?</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"let versions = Version::belonging_to(krate)  .select(id)  .order(num.desc())  .limit(5);let downloads = version_downloads  .filter(date.gt(now - 90.days()))  .filter(version_id.eq(any(versions)))  .order(date)  .load::<Download>(&#x26;mut conn)?;\"><div></div></button></div></figure></div><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Executed SQL</span></figcaption><pre data-language=\"sql\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">SELECT</span><span style=\"--0:#D6DEEB;--1:#403F53\"> version_downloads.</span><span style=\"--0:#7FDBCA;--1:#096E72\">*</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#C792EA;--1:#8844AE\">WHERE</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">date</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">></span><span style=\"--0:#D6DEEB;--1:#403F53\"> (</span><span style=\"--0:#C792EA;--1:#8844AE\">NOW</span><span style=\"--0:#D6DEEB;--1:#403F53\">() </span><span style=\"--0:#7FDBCA;--1:#096E72\">-</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#ECC48D;--1:#984E4D\">90 days</span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C792EA;--1:#8844AE\">AND</span><span style=\"--0:#D6DEEB;--1:#403F53\"> version_id </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> ANY(</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">      </span><span style=\"--0:#C792EA;--1:#8844AE\">SELECT</span><span style=\"--0:#D6DEEB;--1:#403F53\"> id </span><span style=\"--0:#C792EA;--1:#8844AE\">FROM</span><span style=\"--0:#D6DEEB;--1:#403F53\"> versions</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">        </span><span style=\"--0:#C792EA;--1:#8844AE\">WHERE</span><span style=\"--0:#D6DEEB;--1:#403F53\"> crate_id </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#F78C6C;--1:#AA0982\">1</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">        </span><span style=\"--0:#C792EA;--1:#8844AE\">ORDER BY</span><span style=\"--0:#D6DEEB;--1:#403F53\"> num </span><span style=\"--0:#C792EA;--1:#8844AE\">DESC</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">        </span><span style=\"--0:#C792EA;--1:#8844AE\">LIMIT</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#F78C6C;--1:#AA0982\">5</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">  </span><span style=\"--0:#C792EA;--1:#8844AE\">ORDER BY</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">date</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"SELECT version_downloads.*  WHERE date > (NOW() - &#x27;90 days&#x27;)    AND version_id = ANY(      SELECT id FROM versions        WHERE crate_id = 1        ORDER BY num DESC        LIMIT 5    )  ORDER BY date\"><div></div></button></div></figure></div>"
      }), createVNode($$TabItem, {
        label: "Less Boilerplate",
        "set:html": "<p>Diesel codegen generates boilerplate for you. It lets you focus on your business logic, not mapping to and from SQL rows.</p><p><strong>With Diesel:</strong></p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">#[derive(Queryable)]</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">pub</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">struct</span><span style=\"--0:#D6DEEB;--1:#403F53\"> Download {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">version_id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">downloads</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">counted</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">date</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> SystemTime,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"#[derive(Queryable)]pub struct Download {    id: i32,    version_id: i32,    downloads: i32,    counted: i32,    date: SystemTime,}\"><div></div></button></div></figure></div><p><strong>Without Diesel:</strong></p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">pub</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">struct</span><span style=\"--0:#D6DEEB;--1:#403F53\"> Download {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">version_id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">downloads</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">counted</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">date</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> SystemTime,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\">\n</div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">impl</span><span style=\"--0:#D6DEEB;--1:#403F53\"> Download {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C792EA;--1:#8844AE\">fn</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#82AAFF;--1:#3B61B0\">from_row</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">row</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#D6DEEB;--1:#403F53\">Row) </span><span style=\"--0:#7FDBCA;--1:#096E72\">-></span><span style=\"--0:#D6DEEB;--1:#403F53\"> Download {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">        </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">Download {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">            </span><span style=\"--0:#C5E478;--1:#3B61B0\">id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">row</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">get</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">id</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">            </span><span style=\"--0:#C5E478;--1:#3B61B0\">version_id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">row</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">get</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">version_id</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">            </span><span style=\"--0:#C5E478;--1:#3B61B0\">downloads</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">row</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">get</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">downloads</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">            </span><span style=\"--0:#C5E478;--1:#3B61B0\">counted</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">row</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">get</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">counted</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">            </span><span style=\"--0:#C5E478;--1:#3B61B0\">date</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">row</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">get</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">date</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">        </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"pub struct Download {    id: i32,    version_id: i32,    downloads: i32,    counted: i32,    date: SystemTime,}impl Download {    fn from_row(row: &#x26;Row) -> Download {        Download {            id: row.get(&#x22;id&#x22;),            version_id: row.get(&#x22;version_id&#x22;),            downloads: row.get(&#x22;downloads&#x22;),            counted: row.get(&#x22;counted&#x22;),            date: row.get(&#x22;date&#x22;),        }    }}\"><div></div></button></div></figure></div>"
      }), createVNode($$TabItem, {
        label: "Inserting Data",
        "set:html": "<p>It’s not just about reading data. Diesel makes it easy to use structs for new records.</p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">#[derive(Insertable)]</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">#[diesel(table_name </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> users)]</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">struct</span><span style=\"--0:#D6DEEB;--1:#403F53\"> NewUser&#x3C;'a> {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">name</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#D6DEEB;--1:#403F53\">'a str,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">hair_color</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> Option&#x3C;</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#D6DEEB;--1:#403F53\">'a str>,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\">\n</div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">let</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">new_users</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#82AAFF;--1:#3B61B0\">vec!</span><span style=\"--0:#D6DEEB;--1:#403F53\">[</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">NewUser { </span><span style=\"--0:#C5E478;--1:#3B61B0\">name</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">Sean</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">, </span><span style=\"--0:#C5E478;--1:#3B61B0\">hair_color</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> Some(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">Black</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">) },</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">NewUser { </span><span style=\"--0:#C5E478;--1:#3B61B0\">name</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">Gordon</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">, </span><span style=\"--0:#C5E478;--1:#3B61B0\">hair_color</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> None },</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">];</span></div></div><div class=\"ec-line\"><div class=\"code\">\n</div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#82AAFF;--1:#3B61B0\">insert_into</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">users</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">values</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C5E478;--1:#3B61B0\">new_users</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">execute</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">);</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"#[derive(Insertable)]#[diesel(table_name = users)]struct NewUser<&#x27;a> {    name: &#x26;&#x27;a str,    hair_color: Option<&#x26;&#x27;a str>,}let new_users = vec![    NewUser { name: &#x22;Sean&#x22;, hair_color: Some(&#x22;Black&#x22;) },    NewUser { name: &#x22;Gordon&#x22;, hair_color: None },];insert_into(users)    .values(&#x26;new_users)    .execute(&#x26;mut connection);\"><div></div></button></div></figure></div><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Executed SQL</span></figcaption><pre data-language=\"sql\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">INSERT INTO</span><span style=\"--0:#D6DEEB;--1:#403F53\"> users (</span><span style=\"--0:#C792EA;--1:#8844AE\">name</span><span style=\"--0:#D6DEEB;--1:#403F53\">, hair_color) </span><span style=\"--0:#C792EA;--1:#8844AE\">VALUES</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">  </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#ECC48D;--1:#984E4D\">Sean</span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#D6DEEB;--1:#403F53\">, </span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#ECC48D;--1:#984E4D\">Black</span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#D6DEEB;--1:#403F53\">),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">  </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#ECC48D;--1:#984E4D\">Gordon</span><span style=\"--0:#D9F5DD;--1:#111111\">'</span><span style=\"--0:#D6DEEB;--1:#403F53\">, </span><span style=\"--0:#C792EA;--1:#8844AE\">DEFAULT</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"INSERT INTO users (name, hair_color) VALUES  (&#x27;Sean&#x27;, &#x27;Black&#x27;),  (&#x27;Gordon&#x27;, DEFAULT)\"><div></div></button></div></figure></div>"
      }), createVNode($$TabItem, {
        label: "Updating Data",
        "set:html": "<p>Diesel’s codegen can generate several ways to update a row, letting you encapsulate your logic in the way that makes sense for your app.</p><p><strong>Modifying a struct:</strong></p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C5E478;--1:#3B61B0\">post</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#D6DEEB;--1:#403F53\">published </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#82AAFF;--1:#3B61B0\">true</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C5E478;--1:#3B61B0\">post</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">save_changes</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">);</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"post.published = true;post.save_changes(&#x26;mut connection);\"><div></div></button></div></figure></div><p><strong>One-off batch changes:</strong></p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#82AAFF;--1:#3B61B0\">update</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">users</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">filter</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">email</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">like</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">%@spammer.com</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">)))</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">set</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">banned</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">eq</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#82AAFF;--1:#3B61B0\">true</span><span style=\"--0:#D6DEEB;--1:#403F53\">))</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">execute</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"update(users.filter(email.like(&#x22;%@spammer.com&#x22;)))    .set(banned.eq(true))    .execute(&#x26;mut connection)\"><div></div></button></div></figure></div><p><strong>Using a struct for encapsulation:</strong></p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#82AAFF;--1:#3B61B0\">update</span><span style=\"--0:#D6DEEB;--1:#403F53\">(Settings</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#82AAFF;--1:#3B61B0\">belonging_to</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">current_user</span><span style=\"--0:#D6DEEB;--1:#403F53\">))</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">set</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C5E478;--1:#3B61B0\">settings_form</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">execute</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"update(Settings::belonging_to(current_user))    .set(&#x26;settings_form)    .execute(&#x26;mut connection)\"><div></div></button></div></figure></div>"
      }), createVNode($$TabItem, {
        label: "Ergonomic Multidatabase support",
        "set:html": "<p>Diesel allows to ergonomically abstract over different database backends while keeping all of it’s compile time guarantees.</p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">#[derive(diesel</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">MultiConnection)]</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">enum</span><span style=\"--0:#D6DEEB;--1:#403F53\"> DatabaseConnection {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#82AAFF;--1:#3B61B0\">Sqlite</span><span style=\"--0:#D6DEEB;--1:#403F53\">(diesel</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">SqliteConnection),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#82AAFF;--1:#3B61B0\">Postgres</span><span style=\"--0:#D6DEEB;--1:#403F53\">(diesel</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">PgConnection),</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\">\n</div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">let</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">DatabaseConnection</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#82AAFF;--1:#3B61B0\">establish</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">postgres://localhost/diesel</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span><span style=\"--0:#7FDBCA;--1:#096E72\">?</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div><div class=\"ec-line\"><div class=\"code\">\n</div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">let</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">all_users</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> users</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#C5E478;--1:#3B61B0\">table</span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">load</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">&#x3C;User>(</span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span><span style=\"--0:#7FDBCA;--1:#096E72\">?</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div><div class=\"ec-line\"><div class=\"code\">\n</div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">match</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\"> {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">DatabaseConnection</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#82AAFF;--1:#3B61B0\">Sqlite</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">) </span><span style=\"--0:#7FDBCA;--1:#096E72\">=></span><span style=\"--0:#D6DEEB;--1:#403F53\"> {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">        </span><span style=\"--0:#82AAFF;--1:#3B61B0\">perform_sqlite_specific_query</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span><span style=\"--0:#7FDBCA;--1:#096E72\">?</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">DatabaseConnection</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#82AAFF;--1:#3B61B0\">Postgres</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">) </span><span style=\"--0:#7FDBCA;--1:#096E72\">=></span><span style=\"--0:#D6DEEB;--1:#403F53\"> {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">        </span><span style=\"--0:#82AAFF;--1:#3B61B0\">perform_postgres_specific_query</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#C5E478;--1:#3B61B0\">connection</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span><span style=\"--0:#7FDBCA;--1:#096E72\">?</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\"><span style=\"--0:#D6DEEB;--1:#403F53\">    </span></span><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"#[derive(diesel::MultiConnection)]enum DatabaseConnection {    Sqlite(diesel::SqliteConnection),    Postgres(diesel::PgConnection),}let mut connection =    DatabaseConnection::establish(&#x22;postgres://localhost/diesel&#x22;)?;let all_users = users::table.load::<User>(connection)?;match connection {    DatabaseConnection::Sqlite(connection) => {        perform_sqlite_specific_query(connection)?;    }    DatabaseConnection::Postgres(connection) => {        perform_postgres_specific_query(connection)?;    }}\"><div></div></button></div></figure></div>"
      }), createVNode($$TabItem, {
        label: "Ergonomic Raw SQL",
        "set:html": "<p>There will always be certain queries that are just easier to write as raw SQL, or can’t be expressed with the query builder. Even in these cases, Diesel provides an easy to use API for writing raw SQL.</p><div class=\"expressive-code\"><figure class=\"frame has-title not-content\"><figcaption class=\"header\"><span class=\"title\">Rust</span></figcaption><pre data-language=\"rust\"><code><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">#[derive(QueryableByName)]</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">#[diesel(table_name </span><span style=\"--0:#C792EA;--1:#8844AE\">=</span><span style=\"--0:#D6DEEB;--1:#403F53\"> users)]</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#C792EA;--1:#8844AE\">struct</span><span style=\"--0:#D6DEEB;--1:#403F53\"> User {</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">name</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> String,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#C5E478;--1:#3B61B0\">organization_id</span><span style=\"--0:#7FDBCA;--1:#096E72\">:</span><span style=\"--0:#D6DEEB;--1:#403F53\"> i32,</span></div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#D6DEEB;--1:#403F53\">}</span></div></div><div class=\"ec-line\"><div class=\"code\">\n</div></div><div class=\"ec-line\"><div class=\"code\"><span style=\"--0:#82AAFF;--1:#3B61B0\">sql_query</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#82AAFF;--1:#3B61B0\">include_str!</span><span style=\"--0:#D6DEEB;--1:#403F53\">(</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#ECC48D;--1:#984E4D\">complex_users_by_organization.sql</span><span style=\"--0:#D9F5DD;--1:#111111\">\"</span><span style=\"--0:#D6DEEB;--1:#403F53\">))</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">bind</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">&#x3C;Integer, </span><span style=\"--0:#C5E478;--1:#3B61B0\">_</span><span style=\"--0:#D6DEEB;--1:#403F53\">>(</span><span style=\"--0:#C5E478;--1:#3B61B0\">organization_id</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">bind</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">&#x3C;BigInt, </span><span style=\"--0:#C5E478;--1:#3B61B0\">_</span><span style=\"--0:#D6DEEB;--1:#403F53\">>(</span><span style=\"--0:#C5E478;--1:#3B61B0\">offset</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">bind</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">&#x3C;BigInt, </span><span style=\"--0:#C5E478;--1:#3B61B0\">_</span><span style=\"--0:#D6DEEB;--1:#403F53\">>(</span><span style=\"--0:#C5E478;--1:#3B61B0\">limit</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span></div></div><div class=\"ec-line\"><div class=\"code\"><span class=\"indent\">    </span><span style=\"--0:#7FDBCA;--1:#096E72\">.</span><span style=\"--0:#82AAFF;--1:#3B61B0\">load</span><span style=\"--0:#7FDBCA;--1:#096E72\">::</span><span style=\"--0:#D6DEEB;--1:#403F53\">&#x3C;User>(</span><span style=\"--0:#7FDBCA;--1:#096E72\">&#x26;</span><span style=\"--0:#C792EA;--1:#8844AE\">mut</span><span style=\"--0:#D6DEEB;--1:#403F53\"> </span><span style=\"--0:#C5E478;--1:#3B61B0\">conn</span><span style=\"--0:#D6DEEB;--1:#403F53\">)</span><span style=\"--0:#7FDBCA;--1:#096E72\">?</span><span style=\"--0:#D6DEEB;--1:#403F53\">;</span></div></div></code></pre><div class=\"copy\"><div aria-live=\"polite\"></div><button title=\"Copy to clipboard\" data-copied=\"Copied!\" data-code=\"#[derive(QueryableByName)]#[diesel(table_name = users)]struct User {    id: i32,    name: String,    organization_id: i32,}sql_query(include_str!(&#x22;complex_users_by_organization.sql&#x22;))    .bind::<Integer, _>(organization_id)    .bind::<BigInt, _>(offset)    .bind::<BigInt, _>(limit)    .load::<User>(&#x26;mut conn)?;\"><div></div></button></div></figure></div>"
      }), createVNode($$TabItem, {
        label: "Popular Projects using Diesel",
        children: [projects.map(project => createVNode("div", {
          className: "community-project",
          children: [createVNode("h2", {
            children: createVNode("a", {
              href: project.url,
              target: "_blank",
              children: project.name
            })
          }), createVNode("img", {
            src: project.img,
            style: project.imgStyles,
            alt: project.name
          }), project.description]
        }, project.name)), createVNode(_components.p, {
          "set:html": "Do you have found some cool project that should be linked here? Submit an issue <a href=\"https://github.com/sgrif/diesel.rs-website\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">here</a>."
        })]
      }), createVNode($$TabItem, {
        label: "Community Extensions",
        children: [createVNode(_components.p, {
          children: "The community has made some utilities to help make diesel even easier to work with!"
        }), createVNode(_components.div, {
          children: communityProjects.map(project => createVNode("div", {
            className: "community-project",
            children: [createVNode("div", {
              style: "display: flex; justify-content: space-between; align-items: center; gap: 1rem;",
              children: [createVNode("h4", {
                style: "margin: 0;",
                children: createVNode("a", {
                  href: project.githubUrl,
                  target: "_blank",
                  style: "font-family: monospace;",
                  children: project.name
                })
              }), createVNode("a", {
                href: project.crateUrl,
                target: "_blank",
                children: createVNode("img", {
                  src: project.badge,
                  alt: `${project.name} on crates.io`
                })
              })]
            }), createVNode("br", {}), createVNode("p", {
              style: "margin-top: 0.75rem; margin-bottom: 0;",
              children: project.description
            })]
          }, project.name))
        }), createVNode(Fragment$1, {
          "set:html": "<p>Something missing? Submit an issue <a href=\"https://github.com/sgrif/diesel.rs-website\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">here</a>.</p><br>"
        })]
      })]
    }), "\n", createVNode("div", {
      style: "text-align: center; margin-top: 5rem; margin-bottom: 2rem;",
      "set:html": "<div class=\"sl-heading-wrapper level-h2\"><h2 id=\"contribute\">Contribute</h2><a class=\"sl-anchor-link\" href=\"#contribute\"><span aria-hidden=\"true\" class=\"sl-anchor-icon\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\"><path fill=\"currentcolor\" d=\"m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z\"></path></svg></span><span class=\"sr-only\">Section titled “Contribute”</span></a></div>"
    }), "\n", createVNode(Fragment$1, {
      "set:html": "<p>The Diesel project is always looking for people to help with various parts of the project. If you would like to help here are different ways to contribute to the project:</p>\n<ul>\n<li>Contributing Code, Documentation or Guides. Checkout the planning for <a href=\"https://github.com/orgs/diesel-rs/projects/1\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">Diesel 2.4</a> for open tasks.</li>\n<li>Providing knowledge and help to maintain the MySQL/MariaDB backend. This is currently the only in-tree backend that is not used by any maintainers, so having someone around that actually uses this backend would be very helpful for the Diesel project.</li>\n<li>Answering questions in our <a href=\"https://github.com/diesel-rs/diesel/discussions\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">discussion forum</a>.</li>\n<li>Reporting bugs in our <a href=\"https://github.com/diesel-rs/diesel/issues\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">issue tracker</a>.</li>\n<li>Helping triaging issues in our <a href=\"https://github.com/diesel-rs/diesel/issues\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">issue tracker</a>.</li>\n<li><a href=\"https://github.com/weiznich\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">Sponsoring</a> the maintainers.</li>\n</ul>\n"
    }), createVNode("div", {
      style: "text-align: center; margin-top: 5rem; margin-bottom: 3rem;",
      "set:html": "<div class=\"sl-heading-wrapper level-h2\"><h2 id=\"security-reviews\">Security Reviews</h2><a class=\"sl-anchor-link\" href=\"#security-reviews\"><span aria-hidden=\"true\" class=\"sl-anchor-icon\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\"><path fill=\"currentcolor\" d=\"m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z\"></path></svg></span><span class=\"sr-only\">Section titled “Security Reviews”</span></a></div>"
    }), "\n", createVNode(Fragment$1, {
      "set:html": "<ul>\n<li>October 2025 (Diesel 2.3): <a href=\"/NGICore-Diesel-penetration-test-report-2025-1.0.pdf\">Review</a> by <a href=\"https://www.radicallyopensecurity.com/\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">RadicallyOpenSecurity</a> as part of the <a href=\"https://nlnet.nl/project/Diesel/\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">NLNet</a> funding.</li>\n</ul>\n"
    }), createVNode("div", {
      style: "text-align: center; margin-top: 5rem; margin-bottom: 3rem;",
      "set:html": "<div class=\"sl-heading-wrapper level-h2\"><h2 id=\"notable-sponsors-and-supporters\">Notable Sponsors and Supporters</h2><a class=\"sl-anchor-link\" href=\"#notable-sponsors-and-supporters\"><span aria-hidden=\"true\" class=\"sl-anchor-icon\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\"><path fill=\"currentcolor\" d=\"m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z\"></path></svg></span><span class=\"sr-only\">Section titled “Notable Sponsors and Supporters”</span></a></div><br><br><p>We would like to thank all of the sponsors supporting the work on Diesel. Notable large sponsors are:</p>"
    }), "\n", createVNode("div", {
      style: "display: flex; flex-direction: column; gap: 1rem;",
      children: sponsors.map(sponsor => createVNode("span", {
        style: "margin-bottom: 1rem;",
        children: [createVNode("img", {
          src: sponsor.img,
          alt: sponsor.name,
          style: "width: 20rem; max-width: 100%; height: auto; margin: 0 auto;"
        }), createVNode("br", {}), createVNode("a", {
          href: sponsor.url,
          target: "_blank",
          rel: "noopener noreferrer",
          style: "display: block; text-align: center;",
          children: sponsor.name
        })]
      }))
    }), "\n", createVNode("div", {
      style: "text-align: center; margin-top: 4rem;",
      "set:html": "<p>Additionally we would like to thank all persons sponsoring the project on <a href=\"https://github.com/sponsors/weiznich#sponsors\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">GitHub</a>.\nWithout them developing Diesel wouldn’t be possible.</p>"
    }), "\n", createVNode($$Footer, {})]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

const url = "src/content/docs/index.mdx";
const file = "/home/runner/work/diesel.rs-website/diesel.rs-website/src/content/docs/index.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/runner/work/diesel.rs-website/diesel.rs-website/src/content/docs/index.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
