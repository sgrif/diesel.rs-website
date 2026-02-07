export const features = [
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

export const projects = [
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

export const communityProjects = [
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


export const sponsors = [
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
    name: 'GiGa Infosystems GmbH',
    url: 'https://giga-infosystems.com/',
    img: '/images/logo_giga.svg',
  }
];
