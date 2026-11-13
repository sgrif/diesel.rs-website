---
title: "Diesel 2.4.0"
lang: "en-US"
---


Diesel 2.4.0 includes contributions from 76 people. Over a span of 14 months, more than 1337 commits were submitted.

This release introduces several large new features to Diesel and also expands the number of platforms on which you can run Diesel out of the box. Notable changes include:

* [Support for Database Views](#database-views)
* [Improved support for Enums](#better-enum-support)
* [Support for batch update statements](#batch-updates)
* [Support for a distinct MariaDB backend](#distinct-mariadb-backend)
* [Extended support for SQLite functionality](#extended-sqlite-functionality)
* [Support for using Diesel in no-std Environments](#using-diesel-in-no-std-environment)
* [Rust written migrations](#rust-migrations)
* [`#[derive(MultiConnection)]` support in diesel-async](#derivemulticonnection-support-in-diesel-async)

Besides these headline features, a significant amount of work was done to improve the robustness of the existing code. As part of this effort, we started fuzzing parts of Diesel and added support to run several tests using Miri and various sanitizers. This work helped uncover and fix various soundness and correctness issues, as well as bugs that could lead to panics. Most of the relevant fixes have already been backported to the various Diesel 2.3.x releases over the last few months.

Check out [the full change log](../changelog.html) for a complete list of changes.

This release would not have been possible without the support of our contributors and sponsors. We would like to especially call out [Prototype Fund](https://www.prototypefund.de/projects/diesel-databaseviews) for funding the development of the newly added support for views. We would also like to call out the [Rust Foundation](https://rustfoundation.org/) for recently sponsoring maintenance work on Diesel.

Nevertheless, the Diesel project is always looking for support. You can help by:

* Contributing Code, Documentation, or Guides. 
* Answering questions in our [discussion forum](https://github.com/diesel-rs/diesel/discussions)
* Reporting bugs in our [issue tracker](https://github.com/diesel-rs/diesel/issues)
* Helping to triage issues in our [issue tracker](https://github.com/diesel-rs/diesel/issues)
* [Sponsoring](https://github.com/weiznich) the maintainers.
* Filling out [this survey](https://cryptpad.fr/form/#/2/form/view/p0lmiZqtL2DIAoraUh-ss+d8k-ABhWH5zn2Q9Ka1nNU/) about the current state and future developments of Diesel


## Database Views

Diesel 2.4 introduces support for database views. It was already possible to use database views in previous versions of Diesel by manually writing `table!` definitions for your views and carefully only using methods that work with a particular view. Diesel 2.4 now introduces a [`view!`](https://docs.diesel.rs/main/diesel/prelude/macro.view.html) macro that can be used to declare the existence of a database view. The syntax and usage of this macro closely mirror the existing `table!` macro, but the generated code prevents usage in any query other than `SELECT` statements.

```rust
diesel::view! {
    users {
        name -> Text,
        favorite_color -> Nullable<Text>,
    }
}

// can be used like ordinary tables to query data
users::view.select(users::name)
    .filter(users::favorite_color.eq("Red"))
    .load::<String>(&mut conn)?;
```

Additionally, `diesel-cli` has been extended to support generating these `view!` definitions when you regenerate your `schema.rs` file via `diesel print-schema` or by running a new migration. Support for generating `view!` macro definitions can be enabled for existing projects by setting `print_schema.include_views = true` in your `diesel.toml` file. For new projects, this will be the default. 

Finally, there is a new unstable `print_schema.experimental_infer_nullable_for_views` boolean configuration that enables inferring whether a view column might contain `NULL` values or not in more cases. By default, this configuration is disabled, causing Diesel to assume that most columns might contain `NULL` values, as reported by the underlying database system. This configuration enables an additional inference step to parse and verify the structure of relevant views to more accurately report possible null values. See [this blog post](https://blog.weiznich.de/blog/diesel-infer-sql-nullablity/) from last year for more details. The underlying functionality is also available via a new `diesel_infer_query` crate for third parties. Since we still consider the results of this inference to be non-100% satisfying, this configuration is marked as experimental, meaning results might change in future Diesel versions. If you encounter a case that doesn't work correctly, please report it in our issue tracker.

We would like to thank [Prototype Fund](https://www.prototypefund.de/projects/diesel-databaseviews) again for funding the development of this feature.

## Better Enum Support

Adding better support for mapping Rust enums to SQL values has been a long-standing request for Diesel. While such a mapping was possible for a long time, it either required significant custom code or the usage of a third-party crate. With Diesel 2.4, we finally introduce a new [`#[derive(Enum)]`](https://docs.diesel.rs/main/diesel/types/derive.Enum.html) proc-macro to simplify the mapping of field-less Rust enums to SQL values.

This macro enables mapping a Rust enum to SQL side enum types (PostgreSQL, MySQL, MariaDB), integer fields (all backends), or text fields (all backends), depending on your database backend. 

```rust
// Map to an SQL side enum types

#[derive(Debug, Enum)]
// just give an enum SQL type here
#[diesel(sql_types = schema::sql_types::Color)] 
enum Color {
    Red,
    Green,
    Blue,
}

// map to a text field
#[derive(Debug, Enum)]
#[diesel(sql_type = diesel::sql_types::Text)]
// optionally change the name mapping
#[diesel(rename_all = "SCREAMING_SNAKE_CASE")] 
enum Color {
    Red,
    Green,
    // you also can just rename a single field
    #[diesel(rename = "otherBlue")]
    Blue,
}

//map to an integer field
#[derive(Debug, Enum)]
// also bigger/smaller integer types are supported
#[diesel(sql_type = diesel::sql_types::Integer)] 
enum Color {
    // explicit discriminants are required for this
    Red = 1,
    Green = 2,
    Blue = 3,
}
```

You can also use `#[diesel(sql_types)]` multiple times on the same enum to support mapping to several different types.

As part of this feature, we also added support via the Diesel CLI for automatically generating the corresponding Rust enum definitions for given SQL side enums, including the ability to generate migrations based on these definitions. Support for generating such definitions for existing projects can be enabled by setting `print_schema.custom_enum_derives = true`. For new projects, this will be the default.

## Batch-Updates

[`diesel::update`](https://docs.diesel.rs/main/diesel/fn.update.html#batch-update) now supports updating multiple rows at once. SQL does not natively support this feature in a straightforward way for `INSERT` statements. Internally, we translate such an update request into a single `UPDATE` statement that assigns the correct values from a joined `VALUES` list based on the primary key. To enable this translation, we need to know both the values and the primary key simultaneously, which requires a struct that implements both `Identifiable` and `AsChangeset`.

Using this feature is straightforward by passing a list of values to `.set()`, like this:

```rust
// required to use the struct-based API
// as we need to know which field is the primary key
#[derive(Debug, Clone, AsChangeset, Identifiable)]
struct User {
    id: i32,
    name: &'static str,
    surname: &'static str,
}

let users_batch = [
   User { id: 1, name: "James", surname: "Bond" },
   User { id: 6, name: "Mev", surname: "Sane" },
   User { id: 3, name: "Kody", surname: "Pineda" },
];

diesel::update(users::table)
    .set(&users_batch)
    .execute(connection)?;
```

## Distinct MariaDB backend

MariaDB started as a fork of MySQL, so Diesel naturally supported MariaDB through the existing MySQL backend. However, over the last few years, MariaDB has added features and introduced changes to its database server and client that made supporting both systems with the same backend considerably harder. This created the need for a distinct backend and connection type for MariaDB in Diesel. With Diesel 2.4, we finally add a dedicated [backend](https://docs.diesel.rs/main/diesel/mariadb/struct.Mariadb.html) and [connection](https://docs.diesel.rs/main/diesel/mariadb/type.MariadbConnection.html) type to Diesel. It still shares as much code as possible with the existing MySQL backend, but it allows Diesel to support MariaDB-specific features like `RETURNING` clauses more easily. Support for this new backend is exposed via the new `mariadb` feature for `diesel` and `diesel-async`.

Usage of this new connection type works like any of the existing connections:

```rust
use diesel::prelude::*;

let mut conn = MariadbConnection::establish("mariadb://localhost/diesel")?;

let users = User::query().load(&mut conn)?;
```


Support for this new backend exists in all parts of Diesel, including `diesel-async`.

## Extended SQLite functionality

Diesel 2.4 adds support for a lot SQLite functionality for managing database connection details. This includes support for the following features:

* [Auto extension callbacks](https://docs.diesel.rs/main/diesel/sqlite/fn.register_auto_extension.html) for setting up a fixed set of functions, collections, or extensions for any SQLite connection created by a given process
* [A typed `PRAGMA` interface](https://docs.diesel.rs/main/diesel/sqlite/pragma/index.html) for reading and modifying database and connection level settings
* [Streaming BLOB support](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.get_read_only_blob) for reading large blob values in an incremental way
* [Support for setting limits](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.set_limit) and [various](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.set_views_enabled) [other](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.is_writable_schema) [features](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.set_fts3_tokenizer_enabled) to restrict what can be done with a specific connection
* [Support](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.on_authorize) [for](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.on_busy) [various](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.on_collation_needed) [hooks](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.on_commit) to interact with events sent by SQLite internally
* [Attaching additional databases](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html#method.attach_database) 

## Using Diesel in no-std Environment

Diesel 2.4 adds support for using the SQLite backend (via the new `sqlite-no-std` feature) with Rust targets that lack a standard library. This enables using Diesel with a SQLite database on embedded targets.

Such targets often have specific requirements for setting up the runtime. Please consult the documentation for the target you plan to use. Diesel and SQLite still require the usage of an allocator. Additionally, you need to supply a custom SQLite VFS to work with your environment. See the [`rsqlite_vfs`](https://docs.rs/rsqlite-vfs/latest/rsqlite_vfs/) for a Rust abstraction for building custom VFS, as well as a default in-memory VFS that works well with embedded targets.


See [the complete example for more details](https://github.com/diesel-rs/diesel/tree/main/examples/sqlite/embedded) on how to compile and use Diesel on an esp32-c6 with a bare-metal target.

## Rust migrations

Up until now, Diesel primarily expected users to write their database migrations using plain SQL, as that is often the most flexible solution for evolving your data requirements. Nevertheless, there was a long-running desire to also allow writing database migrations in Rust. With this release, we introduce [`RustMigrationSource`](https://docs.diesel.rs/main/diesel_migrations/struct.RustMigrationSource.html), which easily allows registering migrations written in Rust. This type allows you to register migrations via callbacks, functions, typed migration builders, and custom types. 

```rust

fn migration_function(conn: &mut SqliteConnection) -> QueryResult<()> {
    diesel::sql_query("SELECT 'EXECUTE YOUR MIGRATION HERE'").execute(conn)?;
    Ok(())
}

struct CustomMigration(&'static str);

impl TypedMigration<SqliteConnection> for CustomMigration {
    fn up(&self, conn: &mut SqliteConnection) -> QueryResult<()> {
        diesel::sql_query("SELECT 'YOUR MIGRATION', ?")
            .bind::<diesel::sql_types::Text, _>(self.0)
            .execute(conn)?;
        Ok(())
    }
}

let mut rust_migrations = RustMigrationSource::<SqliteConnection>::new();

// register migrations callback
rust_migrations.add_migration(
    "2026-01-30-121720",
    "callback",
    |conn: &mut SqliteConnection| {
        diesel::sql_query("SELECT 'EXECUTE YOUR MIGRATION HERE'").execute(conn)?;
        Ok(())
    },
);

// register a migration as function
rust_migrations.add_migration("2026-01-30-122420", "function", migration_function);

// register a RustMigration
let migration = RustMigration::new(|conn| {
    diesel::sql_query("SELECT 'EXECUTE YOUR MIGRATION HERE'").execute(conn)?;
    Ok(())
})
.with_down(|conn| {
    diesel::sql_query("SELECT 'REVERT YOUR MIGRATION HERE'").execute(conn)?;
    Ok(())
});
rust_migrations.add_migration("2026-01-30-122520", "rust_migration", migration);

// register a custom migration type
rust_migrations.add_migration(
    "2026-01-30-122920", "custom_type",
    CustomMigration("your custom args"),
);

// run the migrations
let mut conn = SqliteConnection::establish(&connection_url)?;
conn.run_pending_migrations(rust_migrations)?;
```

Diesel will then only execute migrations that have not yet been applied to the database, consistent with the existing migration framework. While we do not yet expose any query DSL constructs for the data definition part of SQL, this is planned for a future release.

As a secondary feature, we also introduced a [`CombinedMigrationSource`](https://docs.diesel.rs/main/diesel_migrations/struct.CombinedMigrationSource.html) type that allows you to mix migrations from different sources (e.g., plain SQL migrations and Rust-written migrations) in a straightforward way.

```rust
pub const SQLITE_MIGRATIONS: EmbeddedMigrations = embed_migrations!("../migrations/sqlite");

let mut rust_migrations = RustMigrationSource::<SqliteConnection>::new();
rust_migrations.add_migration("2026-11-06-122920", "rust_migration", my_migration_function);

// Create a new empty combined source
let mut combined_sources = CombinedMigrationSource::default();

combined_sources.add_source(SQLITE_MIGRATIONS);
combined_sources.add_source(rust_migrations);

// run migrations on a connection
let res = connection.run_pending_migrations(combined_sources);
```

## `#[derive(MultiConnection)]` support in diesel-async

[Diesel 2.1](https://diesel.rs/news/2_1_0_release#multiconnection-support) introduced a [`#[derive(MultiConnection)]`](https://docs.diesel.rs/main/diesel/derive.MultiConnection.html) macro to Diesel, which allows an application to precisely describe which database backends it supports. Previously, this macro lacked support for `diesel-async`, making it difficult to write multi-backend applications using `diesel-async`. With this release, we introduce support for `diesel-async` within the `#[derive(MultiConnection)]` proc-macro, enabling its use with asynchronous connections.

```rust
#[derive(MultiConnection)]
#[diesel_async]
enum AnyConnection {
    Postgresql(diesel_async::AsyncPgConnection),
    Mariadb(diesel_async::AsyncMariadbConnection),
}

let mut conn = AnyConnection::establish("postgres://localhost/database").await?;

let users = User::query().load(&mut conn).await?;
```


## Thanks

Thank you to everyone who helped make this release happen through sponsoring, bug reports, and discussions on GitHub. While we lack a way to automatically track contributions this way, your help is greatly appreciated. 

In addition to the Diesel core team, 76 people contributed code to this release. A huge thank you to:

* Luca Cappelletti
* Luca
* Julian Raffeiner
* Elrendio
* Pavan K Sunkara
* elbaro
* Alex Yarotsky
* judy
* sim-hash
* Ananth Prathap
* Ali Tariq
* Tobias Bieniek
* mevsane
* Samyra312007
* jraffeiner
* Tommaso Fontana
* Wesley-Arizio
* Alexi24601
* Caio
* Chris Rudd
* Dumindu Madunuwan
* Kevin GRONDIN
* Konstantinos Vasilopoulos
* Oscar Walter
* Spxg
* henyanagar
* thenlevy
* Samuel Batissou
* Zacherina
* be-mevsane
* Andreas Hartmann
* Anthony Pastrana
* Samran Asif
* SickleFire
* Thomas B
* Tibo Ulens
* WaterWhisperer
* ahmadalguydi
* clonejo
* jusax23
* zaveshaa
* 0x4nud33p
* Ahmed Said
* Alex Steele
* Alexi
* Ariel Eli
* DavidMei
* Eyüp Can Akman
* Jaume Delclòs Coll
* Kenny
* Leon Blakey
* Lynnesbian
* Martin Geisler
* Matthias Beyer
* Miikka Salminen
* Mora
* Noz Wu
* Paolo Barbolini
* Patrick Schneider
* Pierre-Marie Allard
* Samuel Batissou Tiburcio
* Terry Chen
* ThunderComplex
* Tommy Volk
* Vadim Petrochenkov
* Weixie Cui
* Will Buckner
* Zach
* arieleli01212
* barry3406
* ea935
* gr1zer1
* kvasi
* majiayu000
* malandrina
* simonzkl
* sjwang05

