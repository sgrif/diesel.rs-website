---
lang: "en-US"
title: "Diesel 2.3.0"
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: demo
::: content-wrapper
::: guide-wrapper

Diesel 2.3.0 contains the contributions of 95 people. More than 1142 commits were submitted
over a span of 16 months.

This release includes a several large extensions to the query DSL provided by Diesel and also helps increases the number of platforms you can use Diesel on out of the box. Notable changes include:

* [Improved query construction via `#[derive(HasQuery)]`](#hasquery-derive-for-easier-query-construction)
* [Added support for window functions](#support-for-window-functions)
* [Using SQLite with WASM in your browser](#using-sqlite-with-wasm)
* [Extended support for various types, functions and operators in the PostgreSQL backend](#extended-support-for-various-types-functions-and-operators-in-the-postgresql-backend)
* [Support for `JSON` and `JSONB` in the SQLite backend](#support-for-jsonjsonb-types-and-functions-for-sqlite)

This release wouldn't be possible without the support of our contributors and sponsors. We would like to especially call out NLNet Foundation which funded the development of the newly added support for window functions via their [NGI Zero Core](https://nlnet.nl/project/Diesel/) initiative. We would also like to call out GitHub for providing additional training security and resources for the Diesel project as part of their [GitHub Secure Open Source Fund](https://github.blog/open-source/maintainers/securing-the-supply-chain-at-scale-starting-with-71-important-open-source-projects/) initiative.

Nevertheless is the Diesel project always looking for support. You can help by:

* Contributing Code, Documentation or Guides. Checkout the planing for [Diesel 2.4](https://github.com/orgs/diesel-rs/projects/1) for open tasks.
* Providing knowledge and help to maintain the MySQL/MariaDB backend. This is currently the only in-tree backend that is not used by any maintainers, so having someone around that actually uses this backend would be very helpful for the Diesel project.
* Answering questions in our [discussion forum](https://github.com/diesel-rs/diesel/discussions)
* Reporting bugs in our [issue tracker](https://github.com/diesel-rs/diesel/issues)
* Helping triaging issues in our [issue tracker](https://github.com/diesel-rs/diesel/issues)
* [Sponsoring](https://github.com/weiznich) the maintainers.

## HasQuery derive for easier query construction

Diesel 2.3 provides a new [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) attribute to construct query more directly from a Rust struct. This new derives extends the existing abilities of [`#[derive(Selectable)]`](https://docs.diesel.rs/2.3.x/diesel/expression/derive.Selectable.html) by associating a specific `FROM` clause and possible other clauses with the given struct. This derive also ensures that the query result can actually be loaded into this specific Rust type.

For the most simple case you can use this derive as follows:

```rust
use crate::schema::users;

#[derive(HasQuery)]
struct User {
    id: i32,
    name: String,
}

let users = User::query().load(connection)?
```

which would be equivalent to deriving [`#[derive(Queryable)]`](https://docs.diesel.rs/2.3.x/diesel/deserialize/derive.Queryable.html) + [`#[derive(Selectable)]`](https://docs.diesel.rs/2.3.x/diesel/expression/derive.Selectable.html) and constructing the query via `users::table.select(User::as_select())` in older Diesel versions.

For more advanced usages you can also specify custom select expressions and `FROM` clauses as part of the derive like this:

```rust
use crate::schema::{employees, departments};

#[derive(HasQuery)]
#[diesel(base_query = employees::table.inner_join(departments::table))]
struct Employe {
    name: String,
    #[diesel(select_expression = departments::name)]
    department: String,
    salary: f64,
    #[diesel(select_expression = dsl::avg(employees::salary).partition_by(department::name))]
    avg_salary_per_department: f64,
}

let employees_with_salary = Employe::query()
    .filter(departments::name.eq_any(["Developers", "Maintainers"]))
    .load(connection)?;
```

which would be equivalent to the following query:

```rust
employees::table
    .inner_join(departments::table)
    .filter(departments::name.eq_any(["Developers", "Maintainers"]))
    .select(Employe::as_select())
```

The idea behind this feature is to provide an easier query entry point and also make it easier to share the same base query between different query construction sides all returning the same data structure.


## Support for Window Functions 

Diesel 2.3 introduces support for constructing [Window function expressions](https://www.postgresql.org/docs/current/tutorial-window.html) via the built-in DSL. This feature is supported on all built-in backends and allows to construct complex analytical queries using the provided DSL.

Diesel provides a set of [built-in Window](https://docs.diesel.rs/2.3.x/diesel/dsl/index.html) functions and also allows to use most of the built-in aggregate functions as window functions. To construct a Window function call it is required to chain at least one [`WindowExpressionMethods`](https://docs.diesel.rs/2.3.x/diesel/expression_methods/trait.WindowExpressionMethods.html) method after the actual function call. For example 

```rust
employees::table
    .select(
        dsl::rank()
            .partition_by(employees::department)
            .window_order(employees::salary.desc())
            .frame_by(dsl::frame::Rows.frame_starts_with(dsl::frame::UnboundedPreceding))
    )
```

corresponds to the following SQL query:

```rust
SELECT
   RANK() OVER(PARTITION BY department ORDER BY salary DESC ROWS UNBOUNDED PRECEDING
FROM 
   employees
```

Diesel ensures at compile time that the formed query is valid by restricting that window only function are used with an actual WINDOW clause, by restricting locations where you can use window functions and by restricting which constructs are supported by which backends.

Finally you can also define your own window functions via the [`#[declare_sql_function]`](https://docs.diesel.rs/2.3.x/diesel/expression/functions/attr.declare_sql_function.html) procedural macro like this:

```rust
#[declare_sql_function]
extern "SQL" {
    #[window]
    fn row_number() -> BigInt;
}
```

We would like to thank the NLNet Foundation again for funding the development of this feature as part of their [NGI Zero Core](https://nlnet.nl/project/Diesel) initiative.

## Using SQLite with WASM

Diesel 2.3 adds support for using the SQLite target with a `wasm32-unknown-unknown` compilation target. This enables using Diesel in a web browser or in any other WASM-runtime. 

This functionality works out of the box by just switching the compilation target to `wasm32-unknown-unknown`, although you might want to consider using a special VFS for actually store data in your web browser.

See [the complete example for more details](https://docs.diesel.rs/2.3.x/diesel/expression_methods/trait.WindowExpressionMethods.html)

## Extended support for various types, functions and operators in the PostgreSQL backend

We extended Diesel to provide support for the PostgreSQL specific [`MULTIRANGE`](https://www.postgresql.org/docs/current/rangetypes.html) type and also to provide support for a large number of `RANGE` and `MULTIRANGE` specific operators and functions. This feature allows you to construct queries like these:

```rust
diesel::select(dsl::int4range(1, 5, RangeBound::LowerBoundInclusiveUpperBoundExclusive).contains(4))
```

which would be equivalent to the following SQL:

```SQL
SELECT int4range(1,5) @> 4;
```

You can find a list of all supported functions in the documentation of the [`PgRangeExpressionMethods`](https://docs.diesel.rs/2.3.x/diesel/expression_methods/trait.PgRangeExpressionMethods.html) and a list of supported type mappings for the `MULTIRANGE` types in the documentation of the corresponding [SQL type](https://docs.diesel.rs/2.3.x/diesel/pg/sql_types/struct.Multirange.html)

In addition to the extended support for `RANGE` and `MULTIRANGE` types we also worked on adding a lot new functions for working with `ARRAY`, `JSON` and `JSONB` types. This now covers the majority of functions provided by default by PostgreSQL for these types. See the [documentation](https://docs.diesel.rs/2.3.x/diesel/pg/expression/dsl/index.html) for a complete list.


## Support for `JSON`/`JSONB` types and functions for SQLite

Finally we worked on extending the SQLite backend to support [their built-in JSON types and functions](https://sqlite.org/json1.html). As a result both the `Json` and `Jsonb` SQL types provided by Diesel are now supported in the SQLite backend. The SQLite backend does not support these types as *column* types, but requires you to use either the [`json`](https://docs.diesel.rs/2.3.x/diesel/sqlite/expression/functions/fn.json.html) or [`jsonb`](https://docs.diesel.rs/2.3.x/diesel/sqlite/expression/functions/fn.jsonb.html) function to turn a `TEXT` or `BINARY` value into a JSON value. The later value then can be used for manipulating the content of the JSON value, constructing filters or loading values from the database.

You can use this functionality like this:

```rust
let value = diesel::select(jsonb::<Binary, _>(br#"{"this":"is","a":["test"]}"#))
    .get_result::<serde_json::Value>(connection)?;
```

to load JSON values from the database.

See the [documentation](https://docs.diesel.rs/2.3.x/diesel/sqlite/expression/functions/index.html) for a list of supported functions and detailed examples.

## Thanks

Thank you to everyone who helped to make this release happen through sponsoring, bug reports, and discussion on GitHub. While we don't have a way to collect stats on that form of contribution, it's greatly appreciated. 

In addition to the Diesel core team, 95 people contributed code to this release. A huge thank you to:

* Abhishek Chanda
* accestfromim
* Albert Oudompheng
* Alex Steele
* Ali Tariq
* Ananth Prathap
* André
* Andrew Plaza
* Anna Ahmed
* Anton Vella
* Arpad Müller
* Azan Ali
* BlackDex
* bwqr
* Caio
* Caleb Bourg
* Carlos Carral C.
* Cole
* Daniele
* danila-b
* Delfi Sehidic
* Dhiren Serai
* Diana Alazzam
* Ed Cradock
* edwinlzs
* Elrendio
* Everett Pompeii
* Gary Coady
* Geoffroy Jaffa Planquart
* Guilherme Salustiano
* Hamir Mahal
* insky7
* Jakob K
* Jason White
* Jean-Marc Le Roux
* Jonas Schäfer
* Jonathan Alter
* Joona Brückner
* Julien Rouhaud
* Kevin GRONDIN
* Konrad Pagacz
* Kristof Mattei
* Kristopher Wuollett
* liamw1
* Logan Grosz
* LucaCappelletti94
* Lucas Sunsi Abreu
* Ludea
* Marvin Hansen
* meeshal
* mertwole
* Milo Moisson
* Mindaugas Vinkelis
* Moritz Pflanzer
* Nur
* Oleg Gushul
* Oliver Cooper
* Paolo Barbolini
* Pavan K Sunkara
* Pavan Kumar Sunkara
* philippuryas
* Pierre Fenoll
* Pratik Fandade
* Ramzi Sabra
* Randolf J.
* Renato Lochetti
* Saber Haj Rabiee
* Samuel Batissou
* schitcrafter
* Sebastian Goll
* Sebastian Thiel
* shray sharma
* Sindbad-Walter
* Sofía Aritz
* Spxg
* Stephen Thomas-Dorin
* Sugar
* Tanguille
* Tatounee
* Teoh Han Hui
* Thomas ARCHAMBEAU
* Thomas B
* Thomas Koch
* Tobias Bieniek
* VicVerevita
* vijair
* Vitaly Miniakhmetov
* Vladislav Dyachenko
* Vo Van Nghia
* Willow "Wolveric" Catkin
* Wolveric
* wowinter13
* xanonid
* Xue Haonan
* Zaira Bibi

:::
:::
:::
