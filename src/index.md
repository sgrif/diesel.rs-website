---
title: "Diesel is a Safe, Extensible ORM and Query Builder for <a href=\"https://www.rust-lang.org/\" target=\"_blank\" class=\"rust-link\">Rust</a>"
css: assets/stylesheets/application.css 
lang: en-US
header-includes: |
    <style type="text/css">
        body {
            background: linear-gradient(#535379, #c3c3d6);
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
    </style>
include-after: |
    <script src="assets/javascripts/application.js"></script>
    <script type = "text/javascript">
        function change_tab(evt, tab) {
            // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("vertical-tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("vertical-tab");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" is-active", "");
            }

            // Show the current tab, and add an "active" class to the link that opened the tab
            document.getElementById(tab).style.display = "block";
            evt.currentTarget.className += " is-active";
        }
    </script>
---

> 

::: main-page

::: banner-wrapper

Diesel is the most productive way to interact with databases in Rust because of its safe and composable abstractions over queries.

::: btn-container

[Getting Started](/guides/getting-started/){.btn .btn-primary .btn-download}    [View on GitHub](https://github.com/diesel-rs/diesel){.btn .btn-secondary}

:::

:::

::: feature-list

::: content-wrapper

### Why did we make Diesel? {.feature-list__heading .section-heading}
<!-- {.feature-list__heading section-heading} -->

::: {.feature-list__feature .type-safe}

#### Preventing Runtime Errors {.feature__heading}

We don't want to waste time tracking down runtime errors.
We achieve this by having
Diesel eliminate the possibility of incorrect database interactions
at compile time.

:::

::: {.feature-list__feature .performance}

#### Built for Performance {.feature__heading}

Diesel offers a high level query builder and lets you think about your problems in Rust, not SQL.
Our focus on zero-cost abstractions allows
Diesel to run your query and load your data even faster than C.

:::

::: {.feature-list__feature .extensible}

#### Productive and Extensible {.feature__heading}

Unlike Active Record and other ORMs, Diesel is designed to be abstracted over.
Diesel enables you to write reusable code
and think in terms of your problem domain and not SQL.

:::

:::
:::

Still not sold? Have a look at an in-depth [comparison](/compare_diesel.html) with other rust database crates.

::: demo

::: content-wrapper

### See some examples {.demo__heading .section-heading .no-anchor}

::: vertical-tabs-container

::: vertical-tabs

<!-- <button class = "js-vertical-tab vertical-tab is-active" onclick = "change_tab(event, 'simple_queries')"> -->
<!-- Simple Queries -->
<!-- </button> -->

<!-- <button class = "js-vertical-tab vertical-tab" on-click = "change_tab(event, 'complex_queries')"> -->
<!-- Complex Queries -->
<!-- </button> -->

[Simple Queries](javascript::void(0)){.js-vertical-tab .vertical-tab .is-active onclick="change_tab(event, 'simple_queries')"}
[Complex Queries](javascript::void(0)){.js-vertical-tab .vertical-tab onclick="change_tab(event, 'complex_queries')"}
[Less Boilerplate](javascript::void(0)){.js-vertical-tab .vertical-tab onclick="change_tab(event, 'less_boilerplate')"}
[Inserting Data](javascript::void(0)){.js-vertical-tab .vertical-tab onclick="change_tab(event, 'inserting_data')"}
[Updating Data](javascript::void(0)){.js-vertical-tab .vertical-tab
onclick="change_tab(event, 'updating_data')"}
[Ergonomic Raw SQL](javascript::void(0)){.js-vertical-tab .vertical-tab onclick="change_tab(event, 'raw_sql')"}
[Popular Projects using Diesel](javascript::void(0)){.js-vertical-tab .vertical-tab onclick="change_tab(event, 'popular_projects_using_diesel')"}
[Community Extensions](javascript::void(0)){.js-vertical-tab .vertical-tab onclick="change_tab(event, 'community_extensions')"}

:::

::: vertical-tab-content-container

::: {#simple_queries .js-vertical-tab-content .vertical-tab-content style="display: block;"}
Simple queries are a complete breeze. Loading all users from a database:

::: code-block

[Rust code]()

```rust
users::table.load(&mut connection)
```

:::

::: code-block

[Executed SQL]()

```sql
SELECT * FROM users;
```
:::

Loading all the posts for a user:

::: code-block

[Rust code]()

``` rust
Post::belonging_to(user).load(&mut connection)
```

:::

::: code-block

[Executed SQL]()

```sql
SELECT * FROM posts WHERE user_id = 1;
```

:::

:::

::: {#complex_queries .js-vertical-tab-content .vertical-tab-content}

Diesel's powerful query builder helps you construct queries as simple or complex as
you need, at zero cost.

::: code-block

[Rust code]()

```rust
let versions = Version::belonging_to(krate)
  .select(id)
  .order(num.desc())
  .limit(5);
let downloads = version_downloads
  .filter(date.gt(now - 90.days()))
  .filter(version_id.eq(any(versions)))
  .order(date)
  .load::<Download>(&mut conn)?;
```

:::

::: code-block

[Executed SQL]()
```sql
SELECT version_downloads.*
  WHERE date > (NOW() - '90 days')
    AND version_id = ANY(
      SELECT id FROM versions
        WHERE crate_id = 1
        ORDER BY num DESC
        LIMIT 5
    )
  ORDER BY date
```
:::

:::

::: {#less_boilerplate .js-vertical-tab-content .vertical-tab-content}
Diesel codegen generates boilerplate for you. It lets you focus on your business logic, not mapping to and from SQL rows.

That means you can write this:

::: code-block

[With Diesel]()

```rust
#[derive(Queryable)]
pub struct Download {
    id: i32,
    version_id: i32,
    downloads: i32,
    counted: i32,
    date: SystemTime,
}
```

:::

Instead of this:

::: code-block

[Without Diesel]()

```rust
pub struct Download {
    id: i32,
    version_id: i32,
    downloads: i32,
    counted: i32,
    date: SystemTime,
}

impl Download {
    fn from_row(row: &Row) -> Download {
        Download {
            id: row.get("id"),
            version_id: row.get("version_id"),
            downloads: row.get("downloads"),
            counted: row.get("counted"),
            date: row.get("date"),
        }
    }
}
```

:::

:::

::: {#inserting_data .js-vertical-tab-content .vertical-tab-content}

It's not just about reading data. Diesel makes it easy to use structs for new records.

::: code-block

[Rust code]()

```rust
#[derive(Insertable)]
#[diesel(table_name = users)]
struct NewUser<'a> {
    name: &'a str,
    hair_color: Option<&'a str>,
}

let new_users = vec![
    NewUser { name: "Sean", hair_color: Some("Black") },
    NewUser { name: "Gordon", hair_color: None },
];

insert_into(users)
    .values(&new_users)
    .execute(&mut connection);
```
:::

::: code-block

[Executed SQL]()

```sql
INSERT INTO users (name, hair_color) VALUES
  ('Sean', 'Black'),
  ('Gordon', DEFAULT)
```
:::

If you need data from the rows you inserted, just change `execute` to `get_result` or `get_results`. Diesel will take care of the rest.

::: code-block

[Rust code]()

```rust
let new_users = vec![
    NewUser { name: "Sean", hair_color: Some("Black") },
    NewUser { name: "Gordon", hair_color: None },
];

let inserted_users = insert_into(users)
    .values(&new_users)
    .get_results::<User>(&mut connection);
```
:::

::: code-block

[Executed SQL]()

```sql
INSERT INTO users (name, hair_color) VALUES
  ('Sean', 'Black'),
  ('Gordon', DEFAULT)
  RETURNING *
```

:::

:::

::: {#updating_data .js-vertical-tab-content .vertical-tab-content}

Diesel's codegen can generate several ways to update a row, letting you encapsulate your logic in the way that makes sense for your app.


::: code-block

[Modifying a struct]()

```rust
post.published = true;
post.save_changes(&mut connection);
```

:::

::: code-block

[One-off batch changes]()

```rust
update(users.filter(email.like("%@spammer.com")))
    .set(banned.eq(true))
    .execute(&mut connection)
```
:::

::: code-block

[Using a struct for encapsulation]()

```rust
update(Settings::belonging_to(current_user))
    .set(&settings_form)
    .execute(&mut connection)
```

:::

:::

:::{#raw_sql .js-vertical-tab-content .vertical-tab-content}

There will always be certain queries that are just easier to write as raw SQL, or can't be expressed with the query builder. Even in these cases, Diesel provides an easy to use API for writing raw SQL.

::: code-block

[Running raw SQL]()

```rust
#[derive(QueryableByName)]
#[diesel(table_name = users)]
struct User {
    id: i32,
    name: String,
    organization_id: i32,
}

// Using `include_str!` allows us to keep the SQL in a
// separate file, where our editor can give us SQL specific
// syntax highlighting.
sql_query(include_str!("complex_users_by_organization.sql"))
    .bind::<Integer, _>(organization_id)
    .bind::<BigInt, _>(offset)
    .bind::<BigInt, _>(limit)
    .load::<User>(&mut conn)?;
```

:::

:::

::: {#popular_projects_using_diesel .js-vertical-tab-content .vertical-tab-content}

::: {.community-project}
### [crates.io](https://github.com/rust-lang/crates.io) {.no-anchor}
![](assets/images/crates_io.png){height=5em}

crates.io serves as a central registry for sharing "crates", which are packages or libraries written in Rust that you can use to enhance your projects. This repository contains the source code and infrastructure for the crates.io website, including both frontend and backend components. It uses Diesel as central component to store crate metadata in a database.

:::

::: {.community-project}

### [vaultwarden](https://github.com/dani-garcia/vaultwarden/) {.no-anchor}

![](assets/images/vaultwarden-logo-auto.svg){height=5em}

Vaultwarden is a alternative server implementation of the Bitwarden Client API, written in Rust and compatible with official Bitwarden clients [disclaimer], perfect for self-hosted deployment where running the official resource-heavy service might not be ideal. Diesel is used to store sensitive data in their backend application.

:::

::: {.community-project}

### [lemmy](https://github.com/LemmyNet/lemmy/) {.no-anchor}

![](assets/images/lemmy.svg){height=5em}

Lemmy is a link aggregator and forum for the fediverse. It's similar to sites like Reddit, Lobste.rs, or Hacker News: you subscribe to forums you're interested in, post links and discussions, then vote, and comment on them. It's a well established software for the fediverse using Diesel in the backend.

:::

Do you have found some cool project that should be linked here? Submit an issue [here](https://github.com/sgrif/diesel.rs-website)

:::

::: {#community_extensions .js-vertical-tab-content .vertical-tab-content}

The community has made some utilities to help make diesel even easier to work with!

::: {.community-project}

#### [`dsync`](https://github.com/Wulf/dsync) <a style="float:right" href="https://crates.io/crates/dsync"><img src="https://img.shields.io/crates/v/dsync.svg?style=for-the-badge" height="18" alt="License: MIT OR Apache-2.0" /></a> {.no-anchor}

Generate rust structs & query functions from diesel schema files.

:::

::: {.community-project}

#### [`diesel-logger`](https://github.com/shssoichiro/diesel-logger) <a style="float:right" href="https://crates.io/crates/diesel-logger"><img src="https://img.shields.io/crates/v/diesel-logger.svg?style=for-the-badge" height="18" alt="License: MIT OR Apache-2.0" /></a> {.no-anchor}

A generic diesel connection implementations that allows to log any executed query.

:::

::: {.community-project}

#### [`diesel-derive-enum`](http://github.com/adwhit/diesel-derive-enum) <a style="float:right" href="https://crates.io/crates/diesel-derive-enum"><img src="https://img.shields.io/crates/v/diesel-derive-enum.svg?style=for-the-badge" height="18" alt="License: MIT OR Apache-2.0" /></a> {.no-anchor}

Use Rust enums directly with diesel.

:::

::: {.community-project}

#### [`diesel-oci`](https://github.com/GiGainfosystems/diesel-oci) <a style="float:right" href="https://crates.io/crates/diesel-oci"><img src="https://img.shields.io/crates/v/diesel-oci.svg?style=for-the-badge" height="18" alt="License: MIT OR Apache-2.0" /></a> {.no-anchor}

A diesel backend and connection implementation for oracles database system.

:::

::: {.community-project}

#### [`rsfbclient-diesel`](https://github.com/fernandobatels/rsfbclient) <a style="float:right" href="https://crates.io/crates/rsfbclient-diesel"><img src="https://img.shields.io/crates/v/rsfbclient-diesel.svg?style=for-the-badge" height="18" alt="License: MIT" /></a> {.no-anchor}

A diesel backend and connection implementation for the Firebird database system.

:::

::: {.community-project}

#### [`diesel-async`](https://github.com/weiznich/diesel_async) <a style="float:right" href="https://crates.io/crates/diesel-async"><img src="https://img.shields.io/crates/v/diesel-async.svg?style=for-the-badge" height="18" alt="License: AGPL3+" /></a> {.no-anchor}

An experimental async diesel connection implementation for PostgreSQL and MySQL.

:::


Something missing? Submit an issue [here](https://github.com/sgrif/diesel.rs-website).

:::

:::

:::
:::
:::
:::
