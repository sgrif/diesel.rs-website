---
lang: "en-US"
title: "Diesel 2.0.0"
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: demo
::: content-wrapper
::: guide-wrapper

This release marks the first release candidate for the upcoming Diesel 2.0 Release.

Diesel 2.0.0 contains the contributions of more than 130 people. More than 1700 commits were submitted
over a span of 3 years.

As part of this release we introduced numerous new features and rewrote large parts of the internal structure.
Check out our [changelog for a complete list of changes](/changelog.html). As this is a new major Diesel release it contains a number of breaking changes. Checkout our [migration guide](/guides/migration_guide.html) for details about how to handle those breaking changes.

This release contains the following parts:

* diesel 2.0.0
* diesel_derives 2.0.0
* diesel_migrations 2.0.0
* diesel_cli 2.0.0
* diesel_dynamic_schema 0.2.0

Support the development of Diesel by [sponsoring our work on GitHub](https://github.com/diesel-rs/diesel)

## Features

As a highlight Diesel 2.0.0 adds support for the following features:

* Fully type checked `GROUP BY` support
* Support for table aliasing
* Support for defining select clauses via a corresponding type
* Support for `UNION`/`INTERSECT` queries

In addition to the highlighted features Diesel 2.0.0 fixes several in our type level SQL representation such that it now correctly handles the following cases:

* Mixed nested `LEFT JOINS` and `INNER JOINS`
* Chaining mixed nullable expressions via `AND`, `OR` and similar operators

### Support for `GROUP BY` clauses

Diesel 2.0 adds support for `GROUP BY` clauses for select queries.

This means queries like the following one will just work.

::: code-block

[Example]()

```rust
 users::table.inner_join(posts::table)
    .group_by(users::id)
    .select((users::name, count(posts::id)))
```

:::

As this is the case for all other Diesel built-in query dsl, this construct is fully checked at compile time. This means Diesel
will ensure that the `GROUP BY` clause is valid for the current query and it will also ensure that expressions appearing inside
of your `SELECT` clause will match the aggregation rules provided by the current `GROUP BY` clause. Checkout the documentation of [`QueryDsl::group_by`](https://docs.diesel.rs/2.0.x/diesel/prelude/trait.QueryDsl.html#method.group_by) for examples.

### Support for table aliasing

Diesel 2.0 adds support for table aliasing. This enables users to write queries, where a table appears more than once in the corresponding
`FROM` clause. For this Diesel provides a [`diesel::alias!`] macro that allows to define new alias for existing tables.

The following query demonstrates the support for this feature:

::: code-block

[Example]()

```rust
// Define new table alias for the existing `users` table
let users1 = diesel::alias!(schema::users as user1);

// Use the corresponding alias inside any existing query
users::table
    .inner_join(users1.on(users::id).eq(users1.field(users::id))))
    .select((users::id, users::name, users1.field(users::name)))
    .order_by(users1.field(users::id))
```

:::

Again all of this is checked at compile time. So similar to a normal table, columns from aliases are only allowed to appear if
the corresponding query actually uses the alias.

[`diesel::alias!`]: https://docs.diesel.rs/2.0.x/diesel/macro.alias.html

### Implied selection via the new `Selectable` trait

Diesel 2.0 features a new [`Selectable`] trait and derive that lets users declare that a type expects a certain kind of select clause.
The major use case for this feature is to ensure that columns from a specific query are always requested in the right order
for a corresponding type implementing `Queryable`. This also works for complex queries involving joins or other kinds of nesting.


::: code-block 

[Example]()

```rust
#[derive(Queryable, Selectable)]
struct User {
    id: i32,
    name: String,
}

let first_user = users.select(User::as_select()).first(connection)?;
```

:::

Diesel enforces at type system level that once you provided such a select clause via `User::as_select()` you are only allowed
to construct this type from the returned result of the corresponding query. This means there is no need to specify the `User` type
twice in the query above.

[`Selectable`]: https://docs.diesel.rs/2.0.x/diesel/expression/trait.Selectable.html

### Support for `UNION`/`INTERSECT`/`EXCEPT` queries

Diesel 2.0 extents the query builder to support query combinations via `UNION`/`INTERSECT`/`EXCEPT`. This allows you
to easily chain multiple queries together as long as they return fields of the same type. Queries like the following
one are now supported:

::: code-block

[Example]()

```rust
 users.select(user_name.nullable())
    .union(animals.select(animal_name).filter(animal_name.is_not_null()))
```

:::

As always this is checked at compile time to reject invalid queries, like for example that ones containing select
clauses with different fields. Checkout the documentation of [`CombineDsl`](https://docs.diesel.rs/2.0.x/diesel/prelude/trait.CombineDsl.html) for details.

## Call for Participation

The release of Diesel 2.0 does not only include the features listed above, but also marks the
point where the following things can be provided by third party crates:

* Custom `QueryDsl` extensions to support previously unsupported SQL features. Checkout 
[`diesel_full_text_search`](https://github.com/diesel-rs/diesel_full_text_search) for an example
* Alternative query dsl implementations reusing the existing `Connection` infrastructure
* Custom [`Connection`](https://docs.diesel.rs/2.0.x/diesel/connection/trait.Connection.html#provide-a-new-connection-implementation-for-an-existing-backend) implementations for existing backends
* Custom [`Connection`](https://docs.diesel.rs/2.0.x/diesel/connection/trait.Connection.html#implement-support-for-an-unsupported-database-system) 
and [`Backend`](https://docs.diesel.rs/2.0.x/diesel/backend/trait.Backend.html#implementing-a-custom-backend) implementations for previously unsupported backends. Checkout [diesel-oci](https://github.com/GiGainfosystems/diesel-oci) for an example.

We encourage our community to try out those features. Especially we would like to see experimentation around:

* Previously unsupported database backends
* Pure rust implementations of existing backend implementations. Checkout [this](https://github.com/sfackler/rust-postgres/issues/890) and [this](https://github.com/blackbeam/rust-mysql-simple/discussions/320) discussion for starting points.
* Alternative query dsl implementations. Checkout [this discussion](https://github.com/SeaQL/sea-query/discussions/168) as starting point.

Please get in touch with us for pointers, help and details.


## Input for Future Roadmap

With the release of Diesel 2.0 the planing for our next releases start. Hopefully they will not take as long as Diesel 2.0. We are looking for input on which features are wanted by our community. Please open a discussion thread with your idea in our [discussion forum](https://github.com/diesel-rs/diesel/discussions/categories/ideas).

Weiznich will work on improving error messages for trait heavy crates based on a Rust Foundation Project Grant. This work will hopefully improve error messages for Diesel as well. If you are aware of bad error messages please submit a
minimal example [here](https://github.com/weiznich/rust-foundation-community-grant).

## Update considerations

Diesel 2.0 introduces substantial changes to Diesel's inner workings. 
In some cases this impacts code written using Diesel 1.4.x. 
This document outlines notable changes and presents potential update strategies. 
We recommend to start the upgrade by removing the usage of all items that 
are marked as deprecated in Diesel 1.4.x.

Any code base migrating from Diesel 1.4.x to Diesel 2.0 is expected to be affected at least by 
the following changes:

* [Diesel now requires a mutable reference to the connection](/guides/migration_guide.html#2-0-0-mutable-connection)
* [Changed derive attributes](/guides/migration_guide.html#2-0-0-derive-attributes)

Users of `diesel_migration` are additionally affected by the following change:

* [`diesel_migration` rewrite](/guides/migration_guide.html#2-0-0-upgrade-migrations)

Users of `BoxableExpression` might be affected by the following change:

* [Changed nullability of operators](/guides/migration_guide.html#2-0-0-nullability-ops)

Users of tables containing a column of the type `Array<T>` are affected by the following change:

* [Changed nullability of array elemetns](/guides/migration_guide.html#2-0-0-nullability-of-array-elements)

Users that implement support for their SQL types or type mappings are affected 
by the following changes:

* [Changed required traits for custom SQL types](/guides/migration_guide.html#2-0-0-custom-type-implementation)
* [Changed `ToSql` implementations](/guides/migration_guide.html#2-0-0-to-sql)
* [Changed `FromSql` implementations](/guides/migration_guide.html#2-0-0-from-sql)

`no_arg_sql_function!` macro is now pending deprecation.
Users of the macro are advised to consider `sql_function!` macro.

* [Deprecated usage of `no_arg_sql_function!` macro](/guides/migration_guide.html#2-0-0-no_arg_sql_function)

Users of `eq_any` on the PostgreSQL backend might hit type rejection error in rare cases.

* [Changed accepted argument to `eq_any()` for the PostgreSQL backend](/guides/migration_guide.html#2-0-0-changed_eq_any)

Users that update generic Diesel code will also be affected by the following changes:

* [Removing `NonAggregate` in favor of `ValidGrouping`](/guides/migration_guide.html#2-0-0-upgrade-non-aggregate)
* [Changed generic bounds](/guides/migration_guide.html#2-0-0-generic-changes)

Additionally this release contains many changes for users that implemented a custom backend/connection.
We do not provide explicit migration steps but we encourage users to reach out with questions pertaining to these changes. 

## Thanks

As part of this release we would like to welcome @Ten0 as part of the
diesel core team.

Thank you to everyone who helped make this release happen through sponsoring, bug reports, and discussion on GitHub and Gitter. While we don't have a way to collect stats on that form of contribution, it's greatly appreciated.

In addition to the Diesel core team, 141 people contributed code to this release. A huge thank you to:


* Alessandro Menezes
* Alexander 'z33ky' Hirsch
* Alexei Pastuchov
* Alice Ryhl
* Amila Welihinda
* Andre Braga Reis
* Andreas Runfalk
* Andrew Safigan
* Andrew Speed
* Andy Russell
* Artem Vorotnikov
* Arve Seljebu
* Billy Chan
* Blas Rodriguez Irizar
* Bryan Henry
* Callym
* Caroline Glassberg-Powell
* Cassie Jones
* Chenxi Yuan
* Chris Eckhardt
* Chris Hanks
* Chris Maddox
* Chris West (Faux)
* Clouds Flowing
* Corentin Henry
* Daniel Buse
* Danilo Bargen
* David Teller
* David Tulig
* DebugSteven
* Diggory Blake
* Dmitriy Pleshevskiy
* Dusty Mabe
* DrVilepis
* EclipsedSolari
* Emile Fugulin
* Emm
* Emmanuel Surleau
* Erlend Langseth
* Felix Watts
* Filip Gospodinov
* Garrett Thornburg
* Giorgio Gambino
* Grégory Obanos
* Hal Gentz
* Han Xu
* Heliozoa
* Henk van der Laan
* Henry Boisdequin
* Hirokazu Hata
* Iban Eguia (Razican)
* Igor Raits
* Ivan Tham
* JR Heard
* Jean SIMARD
* Jeremy Stucki
* Jiří Sejkora
* jigaoqiang
* Joel Parker Henderson
* John Brandt
* Jonas Platte
* Jonas Schievink
* Joshua Koudys
* Juhasz Sandor
* Justice4Joffrey
* Katharina Fey
* Kevin King
* Kevin Kirchner
* Khionu Sybiern
* Kitsu
* Koisell
* Kononnable
* Leonardo Yvens
* Lukas Markeffsky
* Maccesch
* Marc-Stefan Cassola
* Martell Malone
* Martijn Groeneveldt
* Martin Nordholts
* Matthew Kuo
* Matthieu Guillemot
* Mcat12
* Meven
* Mike Cronce
* Mr Ceperka
* Nafiul Islam
* Nathan Papapietro
* Nicholas Yang
* Oliver Cooper
* Otto Castle
* Pankaj Jangid
* Paolo Barbolini
* Paul Le Corre
* Paul Martensen
* Pavan Kumar Sunkara
* Paweł Przeniczny
* Philip Trauner
* Raphael Arias
* Roman
* Ryan Leckey
* Sarthak Singh
* Scott Driggers
* Sean Klein
* Simon Ertl
* Spencer Taylor
* Steven Chu
* Storm Timmermans
* Sébastien Santoro
* Takayuki Maeda
* Thomas Constantine Moore
* Thomas Eizinger
* Thomas Etter
* Tom MacWright
* Tuetuopay
* Urhengulas
* Vanio Begic
* WebeWizard
* William Myers
* Yin Jifeng
* Yuki Okushi
* Zane Duffield
* blackghost1987
* czotomo
* dchenk
* ejc Drobnič
* gorbit99
* hasezoey
* hi-rustin
* kevinpoitra
* kpcyrd
* matthew-dowdell
* ode79
* ropottnik
* telios
* theredfish
* zoewithabang
* Zhenhui Xie
* Émile Fugulin
* κeen
* 二手掉包工程师
* 棒棒彬_Binboy


:::
:::
:::
