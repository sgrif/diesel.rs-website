---
title: "Compare Diesel"
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: content-wrapper 
::: guide-wrapper

This page aims to compare Diesel with various other crates that allow to connect to relational databases.

We will cover the following crates:

* [Diesel](https://crates.io/crates/diesel) and [Diesel-async](https://crates.io/crates/diesel)
* [SQLx](https://crates.io/crates/sqlx)
* [SeaORM](https://crates.io/crates/sea-orm)
* [tokio-postgres](https://crates.io/crates/tokio-postgres) and [postgres](https://crates.io/crates/tokio-postgres)
* [mysql-async](https://crates.io/crates/mysql_async) and [mysql](https://crates.io/crates/mysql_async)
* [rusqlite](https://crates.io/crates/rusqlite)

As part of this comparison we will try to cover the following topics:

* Stability, which covers what stability guarantees are provided by the corresponding crates
* Safety guarantees, which covers what is checked by a specific crate at compile time
* Flexibility, which covers what queries can by expressed by the corresponding crates
* Extensibility, which covers how easy you can extend a specific crate by additional functionality
* Usability, which covers how easy it is to use a specific crate
* Performance, which covers how well a specific crate performs

## Stability

Rust crates usually follow semantic versioning, which means the stability of Rust crates is mostly defined by their version. Any crate with an version greater than 1.0 promises not to make breaking changes without a major version bump. By convention a 1.0 release means that a crate reached a point where the authors consider the API stable and sound for an extended amount of time. 

From the listed crates `diesel` and `sea-orm` have a version greater than 1.0. `diesel` published a 1.0 release in 2018, `diesel` 2.0 was published 4 years later in 2022. `sea-orm` published a 1.0 version in Summer 2024. All other crates are still in a 0.x state.

<aside class = "aside_aside--note">
<header class = "aside__header"> Known instances of potential SemVer violations </header>

::: aside__text
In addition the author of this document is aware of the following potential SemVer violations:

* `sea-orm` plans to regularly bump their public dependency on `sqlx` to newer version which is a breaking change according to the Semver spec. This happened the first time with the `sea-orm` 1.1 release, which  is **minor** version while such a change would either require a major version bump, or remaining compatibility with the older `sqlx` versions as well.
* `sqlx` is regularly bumping their public dependency on the `libsqlite3-sys` crate in patch versions. They document this as SemVer exempt, nevertheless this might break other crates and is usually considered to need at major version bump. 
* `diesel` has a disabled-by-default `i-implement-a-third-party-backend-and-opt-into-breaking-changes` feature flag, that allows you to explicitly opt into an unstable API. In addition it also moves deprecated functionality behind an enabled by default `with-deprecated` feature flag. Depending on your point of view these feature flags might also be considered to be breaking changes.
:::

</aside>

## Safety guarantees

There are three coarse different levels of safety guarantees offered by the different crates:

1. Pure database interface crates, that only accept SQL as strings
2. An unchecked query builder interface
3. Compile time checks which verify your query at compile time

The `tokio-postgres`, `rusqlite`, and `mysql` crates belong to the first category. These crates offer an interface that allows you to pass in SQL string and a number of bind values. This is conceptually safe as long as you don't construct your SQL strings via `format!()` or other string concatenations methods. For these crates, you as a user are responsible for writing syntactically correct SQL. If you fail that you will likely get a runtime error.

`sea-orm` belongs into the second category. It provides a Rust side DSL to construct queries. This ensures that queries are mostly syntactically correct, however it cannot reason about the types and other constraints of your queries. So it's still possible to construct queries that are syntactically correct, but can fail in any other way. The most prominent case for this a type mismatch between a value passed into the query and the column you compare in the query. There can be other similar issues here, like mismatches in the kind of aggregates you have in your select clause or other constraints on the query structure.

`diesel` and `sqlx` belong into the third category. They perform checks on your query at compile time, which means they can usually check for that your query will actually be valid to be run. Similar to Rust code that compiles, this gives you the guarantee that the code is able to run, but not that it is free from logic bugs. At that point the similarities between `diesel` and `sqlx` end. `diesel` implements these checks in Rust's type system, while `sqlx` uses proc-macros to check your queries against your actual database. Both approaches have their own advantages and disadvantages. `sqlx` offers an straight forward interface where you can put in whole static queries as string, `diesel` requires you to write your queries by using the DSL it provides. This difference has the following consequence:

* `sqlx` always needs to know the whole query at compile time
* `sqlx` requires a database running to perform the type-checks, although they also offer a mode that allows to read the relevant information from a previously dumped folder
* `diesel` can also check parts of the query at compile time. This allows you to build dynamic compile time checked queries as well.

Additionally there are differences in how exactly the type checking works. As `sqlx` relies on the database to provide type and correctness information it needs to work with these databases provide. These result widely varies between database systems and is often incomplete. A rather famous example here is the inference of the nullability of values coming from a left join. `sqlx` cannot infer that such a column might be actually `NULL` if it's marked as `NOT NULL` in your schema due to restrictions what these database return. `diesel` on the other hand can infer this information as it brings it's own type checking. On the other hand `diesel`'s approach has the downside that it needs to model all the relevant information in the type system, which opens up room for slight differences to the behaviour of the supported databases. At the time of writing the author is not aware of any such difference, but they could exist.

Overall, both `diesel` and `sqlx` provide compile time checking, but the extend and correctness of this checking widely differs. `diesel`'s checking is much more extensive and robust compared to what is currently implemented by `sqlx`.

## Flexibility

All listed crates expose an API that just let's you pass in string and a number of rust side values (via bind parameters). From that point of view every crate can express any possible SQL query. The main question here is rather: Which queries can be supported by using the safest possible API offered by this crate?

For the `tokio-postgres`, `rusqlite` and `mysql` crate this is simple to answer as the safest API is at the same time the API that lets you pass in a string and an number of bind values. So by definition it can execute any SQL query.

For `sea-orm` this API is their query builder, which obviously restricts the amount of supported queries by that DSL. At the time of writing this covers most common SQL functionality supported by PostgreSQL, SQLite and MySQL, which excludes most database specific features like for json operators or other functionality for database specific types. Notably it currently excludes the possiblity to join more than 3 tables at the same time. Crucially `sea-orm` also does not offer any extension points to extend their built-in DSL so you can bring your own drop in replacement for missing functionality. It is possible to write dynamic queries using the exposed query builder.

`sqlx` allows you to express any at **compile time statically known** query via their macros. On the one hand this covers a large amount of possible SQL queries, on the other hand this excludes any query that might possibly on runtime information. This includes the following possible queries:

* Anything that involves an `IN` expression that is constructed from a Rust side vector of values
* Any possible form of batch insert statements that again depend on a vector of values on Rust side
* Any possible query that might want to add a condition depending on a Rust side condition

In the opinion of the author of this document these cases are not that uncommon in real world applications. By not using the static query checking in these cases you essentially lose all benefits of `sqlx` there and fall back to the same level of functionality offered by `tokio-postgres`, `mysql` and `rusqlite`

`diesel` allows you to check any query expressible by the built-in DSL or any DSL/your own extension. This includes most dynamic queries, as long as at least the `FROM` query of your query is known at compile time. At the time of writing the built-in `diesel` DSL covers almost all common SQL supported by any of the supported backend, including many database specific types/operations/functions. There are SQL constructs that are currently unsupported by diesel. This includes:

* Common table expressions
* Subqueries as `FROM` clause

While it's possible to write custom extensions to for all of these missing variants, it can be challenging to do that in a way that provides the same level of compile time checks as other parts of diesel.

## Extensibility

Extensibility is mostly important for crates providing additional functionality on top of just executing queries or which support more than one database, which makes this topic relevant for `sea-orm`, `sqlx` and `diesel`.

`sea-orm` models most of their DSL as structs and enums. These have only the specified set of fields/variants. Given that for example expressions are implemented as enum this makes it impossible to easily provide your own custom expression operator that is not supported yet by `sea-orm`. The same goes for the supported database backends, which is an enum as well. Again this makes it impossible to extend the set of supported backends outside of `sea-orm`.

`sqlx` heavily relies on proc-macros for it's core functionality. As far as the author of this document knows it is not possible to extend a proc-macro crate, without providing an entirely new crate that reimplements/rexports the other proc-macro. This makes it essentially impossible to extend the set of database backends supported by `sqlx`.

`diesel` heavily relies on traits for almost anything. On of the large upsides of this approach is that you can extend almost anything in `diesel`, including the DSL, the type mapping and the set of supported backends. You can find examples for this on crates.io:

* [postgis-diesel](https://crates.io/crates/postgis_diesel) Support for the PostGIS extension (Functions & Types)
* [pgvector](https://crates.io/crates/pgvector) Support for the PgVector extension (Functions & Types)
* [diesel-oracle](https://crates.io/crates/diesel-oci) Support for Oracle as custom backend


## Usability

The `diesel-async` crate(not with the sqlite backend), the `sqlx` crate (not with the sqlite backend), the `sea-orm` crate (not with the sqlite backend), the `tokio-postgres` crate, the `postgres`, the `mysql-async` and the `mysql` crate provide pure rust connection implementations. This makes the first compilation of these crates as easy as running `cargo build`. They don't require any additional dependencies.
`diesel`, `rusqlite` and any other crate with a sqlite backend have dependencies on the native C client libraries for the relevant databases. These need to be installed before compiling these crates, although there are also ways to compile them as part of your build process. This can make the first compilation harder.

All of `diesel`, `diesel-async` and `sqlx` rely on traits to implement core parts of their functionality. While this makes things very flexible it can also lead to hard to understand error messages with these crates. `diesel` (and `diesel-async`) provide [documentation](https://docs.diesel.rs/2.2.x/diesel/index.html#how-to-read-diesels-compile-time-error-messages) on how to read error messages. Additionally it provides helper attributes and employs compiler hints to improve possible error messages to make them easier to understand.


## Performance

Performance is a complicated topic. It can be noted that all of the listed crates provide an good performance for almost all use-cases, as most users do not really need to care about the last bit of possible performance. Nevertheless there are differences in the performance provided by the different crates. As always: If you need to care about performance make sure to perform your **own** benchmarks with your own workload to find the optimal solution for your use-case. The following text will provide an general overview.
[The Diesel benchmark repository](https://github.com/diesel-rs/metrics) provides an overview of different benchmark results for all listed crates. 
We can observe the following points:

* All async SQLite crates perform considerably worse than their sync counterparts. This is likely due to SQLite not providing an async API at all. Consider using a sync crate if your application only needs to support SQLite.
* There is a notable difference between different output sizes for the different crates. For small output sizes there is almost no difference between most of them, while the gap becomes considerably larger for large output sizes. `diesel` and `diesel-async` perform relative well here. This might indicate that data deserialization is considerably more optimized in Diesel than in other crates


There is one notable performance related feature that deserves some discussion here: Query Pipelining. This PostgreSQL specific feature allows to send several queries in directly behind each other without waiting for the results of the previous queries. This enables skipping some of the time that are usually coupled to network round trips. For obvious reason this only works for cases where subsequent queries do not depend on results from previous queries. The crates.io team reported a 20% performance increase after converting one of their endpoints to use query pipelining. Query Pipelining is supported by `diesel-async` and `tokio-postgres`. Notably `sqlx` and `sea-orm` do not support this feature.


<aside class = "aside_aside--note">
<header class = "aside__header"> A note about the (non-)necessity of async database libraries </header>

::: aside__text

In the context of performance there are often claims that async database drivers perform significantly better than their synchronous counter parts. At the time of writing this seems to be not true for the Rust ecosystem. The author of this text has the following opinions on this topic:

* SQLite provides a purely synchronous API, any async library build on top of it introduces additional overhead
* Simple SQLite queries can stay under the 10 to 100 microseconds limit of what is [commonly considered as blocking in Rust](https://ryhl.io/blog/async-what-is-blocking/)
(See the benchmark repository for examples)
* For network based database services like PostgreSQL and MySQL your application is usually limited by the number of database connection. These database systems commonly allow only a few ten connections (up to the low hundreds) of database connections before running out of resources. If your application receives more concurrent requests than this it will need to wait on *getting* a database connection. This use-case is covered by async database pool solutions like [deadpool-diesel](https://docs.rs/deadpool-diesel/latest/deadpool_diesel/index.html), which can be used in combination with synchronous database libraries.

That all written: There are valid use-cases for using an async database library, for example setups with high network latency or situations where you need to abort requests. You can cover this use-case with [diesel-async](https://lib.rs/crates/diesel-async).

:::

</aside>

:::
:::
