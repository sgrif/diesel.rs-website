---
lang: "en-US"
title: "Diesel 2.2.0"
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: demo
::: content-wrapper
::: guide-wrapper

Diesel 2.2.0 contains the contributions of 42 people. More than 560 commits were submitted
over a span of 12 months.

This release contains several new features and improves existing features. Diesel now provides a procedural macro attribute that infers the correct return type for your query. It's now possible to instrument connection implementations provided by diesel to perform logging and performance measurements. We added support for PostgreSQL's `COPY FROM` and `COPY TO` syntax which can be used to send and receive large amounts of data efficiently. Our dependencies wrapping the native database drives support now all building the database driver as part of your `cargo build`. This enables us to distribute static precompiled versions of diesel-cli easily. Finally we worked with the [Rust team to stabilize](https://blog.weiznich.de/blog/diagnostic-namespace-10-23/) attributes to customize error messages emitted by the compiler. This is now used by diesel to improve the quality of certain otherwise hard to understand error messages. Check out our [changelog for a complete list of changes](/changelog.html).

This release wouldn't be possible without the support of our contributors and sponsors. If you want to support diesels development, consider [joining the reviewer team](https://github.com/diesel-rs/diesel/issues/1186), submitting [PR's](https://github.com/diesel-rs/diesel/issues?q=is%3Aissue+is%3Aopen++label%3A%22help+wanted%22+), help writing documentation or [sponsor the maintainers](https://github.com/sponsors/weiznich).

## Automatic return type inference for QueryDSL types

Diesel's QueryDSL is designed to be composable through several functions since even before diesel 1.0. This enables you to move common parts of your query into a function and reuse that function from several places. 

In practice that requires specifying the return type of your query part, which is a complex composed highly nested type for anything that's not a trivial query. That made it hard for users to refactor their code to move common query parts into shared functions. Diesel 2.2 introduces the [`#[diesel::dsl::auto_type]`](https://docs.diesel.rs/2.2.x/diesel/dsl/attr.auto_type.html) procedural macro attribute, which infers the correct return type for you.

Without this attribute you would need to write code like this:

```rust
fn users_filtered_by_name(name: &str) -> dsl::Filter<users::table, dsl::Eq<users::name, &str>> {
    users::table.filter(users::name.eq(name))
}
```

The new attribute enables you to write just:

```rust
#[dsl::auto_type]
fn users_filtered_by_name(name: &str) -> _ {
    users::table.filter(users::name.eq(name))
}
```

The `#[dsl::auto_type]` attribute macro replace the `_` placeholder with the correct return type. See the [documentation](https://docs.diesel.rs/2.2.x/diesel/dsl/attr.auto_type.html) for more advanced examples and limitations.

## Instrumentation Support

Diesel now provides support for instrumenting the built-in connections. This enables users to customize logging for these connection types. Diesel provides the [`Connection::set_instrumentation`](https://docs.diesel.rs/2.2.x/diesel/connection/trait.Connection.html#tymethod.set_instrumentation) method that allows to set connection specific instrumentations. It also provides a global [`diesel::connection::set_global_instrumentation`](https://docs.diesel.rs/2.2.x/diesel/connection/fn.set_default_instrumentation.html) that allows to set an instrumentation constructor that is used by all supported connection types.

An [`Instrumentation`](https://docs.diesel.rs/2.2.x/diesel/connection/trait.Instrumentation.html) is a user defined hook that allows to get notified for certain [`InstrumentationEvent`](https://docs.diesel.rs/2.2.x/diesel/connection/enum.InstrumentationEvent.html). By default the `Instrumentation` trait is implemented for closures with a single `InstrumentationEvent` argument, but it is possible to provide custom implementations for this trait. This enables our users to customize logging based on their preferences in terms of used logging crate, log levels and similar preferences.

Example of a simple `println!` based instrumentation that just logs everything to the standard output:

```rust
let mut connection = PgConnection::establish("postgres://localhost/diesel")?;
connection.set_instrumentation(|event: InstrumentationEvent<'_>| println!("{event:?}"));
```

## PostgreSQL COPY FROM/TO Support

Diesel now supports [PostgreSQL's `COPY FROM STDIN` and `COPY TO STDOUT`](https://www.postgresql.org/docs/current/sql-copy.html) syntax. This allows to efficiently transfer large amounts of data between the database and your application. Diesel supports two ways to use these commands, one for using the Diesel model structs as source or target for an optimised binary transfer and one that allows you to configure the low level statement in detail and provide your own input/output stream.

Example `COPY FROM` statement using an `Insertable` struct:

```rust
#[derive(Insertable)]
#[diesel(table_name = users)]
#[diesel(treat_none_as_default_value = false)]
struct NewUser {
    name: &'static str,
}


let data = vec![
    NewUser { name: "Diva Plavalaguna" },
    NewUser { name: "Father Vito Cornelius" },
];

let count = diesel::copy_from(users::table)
    .from_insertable(&data)
    .execute(connection)?;

assert_eq!(count, 2);
```

Example `COPY FROM` statement using the low level interface to provide a CSV stream:

```rust
use diesel::pg::CopyFormat;
let count = diesel::copy_from(users::table)
    .from_raw_data(users::table, |copy| {
        writeln!(copy, "3,Diva Plavalaguna").unwrap();
        writeln!(copy, "4,Father Vito Cornelius").unwrap();
        diesel::QueryResult::Ok(())
    })
    .with_format(CopyFormat::Csv)
    .execute(connection)?;
```

See the documentation of [`diesel::copy_to`](https://docs.diesel.rs/2.2.x/diesel/fn.copy_from.html) and [`diesel::copy_from`](https://docs.diesel.rs/2.2.x/diesel/fn.copy_from.html) for more details.

## Bundling support for all native drives and perbuild binaries for diesel-cli

We updated the [pq-sys](https://blog.weiznich.de/blog/pq-sys-05/) and [mysqlclient-sys](https://blog.weiznich.de/blog/mysqlclient-sys-03/) crates to provide a feature that allows to build both libraries as part of your local `cargo build` command. This simplifies the setup of diesel in new environments and also makes it easier to cross compile applications using diesel. As with the existing bundling support for the SQLite backend you need to add the relevant crate to your `Cargo.toml` and enable the `bundled` feature for this crate. For `diesel-cli` we now provide a `postgres-bundled` and a `mysql-bundled` feature flag as well.

As a result of this work we are now able to build fully static binaries for `diesel-cli`. Such builds are now provided as part of each release as prebuild binaries. This hopefully streamlines the setup process for new users, although you can continue to use `cargo install diesel_cli` to locally build your version of diesel-cli.

## Improved Error Messages

We worked with the [Rust team to stabilize](https://blog.weiznich.de/blog/diagnostic-namespace-10-23/) attributes to customize error messages emitted by the compiler. This allows us to include custom messages directly in the compiler error message to hint possible solutions.

The following two examples demonstrate the new error messages:

For type mismatches between your query and the result type we now include explicit hints to use `#[derive(Selectable)]` + `#[diesel(check_for_backend(…))]`:

```
error[E0277]: the trait bound `(diesel::sql_types::Integer, diesel::sql_types::Text): load_dsl::private::CompatibleType<User, _>` is not satisfied
  --> tests/fail/queryable_with_typemismatch.rs:21:31
   |
21 |     users::table.load::<User>(&mut conn).unwrap();
   |                  ----         ^^^^^^^^^ the trait `load_dsl::private::CompatibleType<User, _>` is not implemented for `(diesel::sql_types::Integer, diesel::sql_types::Text)`, which is required by `users::table: LoadQuery<'_, _, User>`
   |                  |
   |                  required by a bound introduced by this call
   |
   = note: this is a mismatch between what your query returns and what your type expects the query to return
   = note: the fields in your struct need to match the fields returned by your query in count, order and type
   = note: consider using `#[derive(Selectable)]` + `#[diesel(check_for_backend(_))]` on your struct `User` and
           in your query `.select(UserWithToManyFields::as_select())` to get a better error message
```

For field type mismatches rustc now explicitly tells you that this mapping is not supported:

```

error[E0277]: cannot deserialize a value of the database type `diesel::sql_types::Integer` as `*const str`
  --> tests/fail/broken_queryable_by_name.rs:16:5
   |
16 |     id: String,
   |     ^^^^^^^^^^ the trait `FromSql<diesel::sql_types::Integer, Pg>` is not implemented for `*const str`, which is required by `std::string::String: FromSqlRow<diesel::sql_types::Integer, Pg>`
   |
   = note: double check your type mappings via the documentation of `diesel::sql_types::Integer`
```

Diesel 2.2 includes similar improvements for many more error messages. Improving hard to understand error messages is still an ongoing project so please reach out with examples if you hit a particular bad error message. This enables us to further improve the messages by either adding the new attribute there as well or by working with the Rust team to introduce additional attributes to cover more cases.

## Thanks

Thank you to everyone who helped to make this release happen through sponsoring, bug reports, and discussion on GitHub and Gitter. While we don't have a way to collect stats on that form of contribution, it's greatly appreciated.

In addition to the Diesel core team, 60 people contributed code to this release. A huge thank you to:

* Alexander 'z33ky' Hirsch
* aumetra
* BlackDex
* Caio
* Daniel Sousa
* Danilo Bargen
* Danny Goldberg
* David Soria Parra
* Davis Muro
* Denny Biasiolli
* Dessalines
* Drew Vogel
* dullbananas
* Elrendio
* Emile Fugulin
* Ernest Rudnicki
* Everett Pompeii
* forest1102
* George Manning
* hasezoey
* Henry Zimmerman
* ISibboI
* Jonathan Boyle
* Junghyun Nam
* Kevin GRONDIN
* kirk
* Kornel
* Kristopher Wuollett
* Marc Coleman
* Maxi Barmetler
* Michael Bachmann
* Minsung Kim
* Mohamed Belaouad
* Moulins
* obsoleszenz
* Omid Rad
* Orne Brocaar
* Paolo Barbolini
* Pavan Kumar Sunkara
* Peter C. S. Scholtens
* retro
* sabati
* Saber Haj Rabiee
* Samuel Batissou
* Sean Klein
* Sebastian Fritsch
* Sebastian N. Fernandez
* Sebastian Schmidt
* Sebastian Urban
* Serhii Potapov
* Simon Eisenmann
* snf
* Tal Pressman
* Tanguille
* Thomas Constantine Moore
* Tommy McCallig
* Viktor Szépe
* yagince
* Zhai Xiang
* 森田一世

:::
:::
:::
