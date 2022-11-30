---
title: "Relations"
lang: en-US
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: demo
::: content-wrapper
::: guide-wrapper

For this guide, we're going to look at 1-to-many and many-to-many relations in Diesel.
Each step in this guide will build on the previous, and is meant to be followed along.

**This guide assumes that you have gone through the Getting Started Guide**

## New project

Let's make a new project for this guide:

::: code-block

[Generate a new project]()

```sh
cargo new --lib diesel_relations
cd diesel_relations
```

:::

As before, let's add Diesel and dotenvy to our dependencies.

::: code-block

[Cargo.toml](https://github.com/diesel-rs/diesel/blob/2.0.x/examples/postgres/getting_started_step_1/Cargo.toml)

```toml
[dependencies]
diesel = { version = "2.0.0", features = ["postgres"] }
dotenvy = "0.15.6"
```

:::

Don't forget to add a `.env` to point Diesel to the correct database.

```sh
echo DATABASE_URL=postgres://username:password@localhost/diesel_relations > .env
```

and run

```
diesel setup
```

We need to create two different objects that we want to connect, for the first
1-to-many example let's create books and pages. A book can have many pages, but
a page can only belong to a single book.

## Migrations

```sh
diesel migration generate create_books
diesel migration generate create_pages
```

Next, we'll write the SQL for the book migration, which should be straight forward:

::: code-block

[up.sql]( https://github.com/diesel-rs/diesel/tree/2.0.x/examples/postgres/getting_started_step_1/migrations/20160815133237_create_posts/up.sql)

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  author VARCHAR NOT NULL,
)
```
:::

The pages migration needs to point to the book they appear in, therefore we add a reference to the book to the migration:

::: code-block

[up.sql]( https://github.com/diesel-rs/diesel/tree/2.0.x/examples/postgres/getting_started_step_1/migrations/20160815133237_create_posts/up.sql)
```sql
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  page_number INT NOT NULL,
  content TEXT NOT NULL,
  book_id SERIAL REFERENCES books(id)
)
```

:::

Let's add the corresponding down migrations as well:

::: code-block

[down.sql](https://github.com/diesel-rs/diesel/tree/2.0.x/examples/postgres/getting_started_step_1/migrations/20160815133237_create_posts/down.sql)

```sql
DROP TABLE books
```
:::

and again for pages

::: code-block

[down.sql](https://github.com/diesel-rs/diesel/tree/2.0.x/examples/postgres/getting_started_step_1/migrations/20160815133237_create_posts/down.sql)

```sql
DROP TABLE pages
```

:::

We can apply our new migration:

```sh
diesel migration run
```

Let's make sure the down migrations are correct too:

```
diesel migration redo
```

## Schema.rs

The schema should now look like this:

::: code-block

[schema.rs](https://github.com/fix-me/schema.rs)

```rust
// @generated automatically by Diesel CLI.

diesel::table! {
    books (id) {
        id -> Int4,
        title -> Varchar,
        author -> Varchar,
    }
}

diesel::table! {
    pages (id) {
        id -> Int4,
        page_number -> Int4,
        content -> Text,
        book_id -> Int4,
    }
}

diesel::joinable!(pages -> books (book_id));

diesel::allow_tables_to_appear_in_same_query!(
    books,
    pages,
);
```
:::

Diesel picked up on the reference and created a schema for us that has pages as
joinable into books via the `book_id` and allows for the two to appear in the
same query.

## Models

Let's reflect this now in our `model.rs` 

::: code-block

[src/model.rs]( https://github.com/fix-me/model.rs )

```rust
use diesel::prelude::*;

use crate::schema::books;
use crate::schema::pages;

#[derive(Queryable, Identifiable)]
#[diesel(table_name = books)]
pub struct Book {
    pub id: i32,
    pub author: String,
}

#[derive(Insertable)]
#[diesel(table_name = books)]
pub struct NewBook<'a> {
    pub author: &'a str,
}

#[derive(Queryable, Identifiable, Associations)]
#[diesel(belongs_to(Book))]
#[diesel(table_name = pages)]
pub struct Page {
    pub id: i32,
    pub content: String,
    pub page_number: i32,
    pub book_id: i32,
}

#[derive(Insertable)]
#[diesel(table_name = pages)]
pub struct NewPage<'a> {
    pub content: &'a str,
    pub page_number: i32,
    pub book_id: i32,
}
```

:::

Associations in Diesel are always child-to-parent. You can declare an
association between two records with `#[belongs_to]`. First we need to add
`#[derive(Associations)]`, which will allow us to add
`#[diesel(belongs_to(Book))]` to `Page` so that we can tell Diesel that pages
belong to books and thereby reflect out 1-to-many relation.

## Writing and reading data

For ease of following this tutorial, we are going to put all the code into `main.rs`.

::: code-block

[src/main.rs]( https://github.com/fix-me/main.rs )

```rust
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub mod model;
pub mod schema;

use crate::model::*;
use crate::schema::*;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

fn main() {
    let conn = &mut establish_connection();

    let new_book = NewBook {
        title: "Momo",
        author: "Michael Ende",
    };
    let book: Book = diesel::insert_into(books::table)
        .values(&new_book)
        .get_result(conn)
        .expect("Error saving book");

    let new_page_1 = NewPage {
        page_number: 1,
        content: "In alten, alten Zeiten ...",
        book_id: book.id,
    };
    let page_1: Page = diesel::insert_into(pages::table)
        .values(&new_page_1)
        .get_result(conn)
        .expect("Error saving page 1");

    let new_page_2 = NewPage {
        page_number: 2,
        content: "den prachtvollen Theatern...",
        book_id: book.id,
    };
    let page_2: Page = diesel::insert_into(pages::table)
        .values(&new_page_2)
        .get_result(conn)
        .expect("Error saving page 2");

    // get pages for a book
    let pages = Page::belonging_to(&book)
        .inner_join(books::table)
        .select(pages::all_columns)
        .load::<Page>(conn)
        .expect("Error loading pages");

    // the data is the same we put in
    assert_eq!(&page_1, pages.get(0).unwrap());
    assert_eq!(&page_2, pages.get(1).unwrap());
}
```

:::

:::
:::
:::
