---
title: "News"
lang: en-US
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: content-wrapper
::: guide-wrapper

#### [Diesel 2.3.0](./2_3_0_release.html)

Diesel 2.3 introduces a new `#[derive(HasQuery)]` derive, support for WINDOW functions and the ability to use the SQLite backend with the `wasm32-unknown-unknown` target.

#### [Diesel 2.2.0](./2_2_0_release.html)

Diesel 2.2 introduces a new `#[diesel::dsl::auto_type]` macro to automatically infer query dsl types. Additionally it provides support for connection instrumentation and PostgreSQL's `COPY` syntax.

#### [Diesel 2.1.0](./2_1_0_release.html)

Diesel 2.1 introduces support for generating migrations based on differences between your rust code and your database schema. Additionally it provides a `#[derive(MultiConnection)]` derive for a simplified usage of several different connections at once and a improved compile time error message generation.

#### [Diesel 2.0.0](./2_0_0_release.html)

Diesel 2.0 introduces support for `GROUP BY` and `UNION`/`INTERSECT` queries. Additionally it features table aliases and a improved field mapping mechanism.

:::
:::
