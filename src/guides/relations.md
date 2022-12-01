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
diesel = { version = "2.0.2", features = ["postgres"] }
dotenvy = "0.15.6"
```

:::

And a `.env` to point Diesel to the correct database.

```sh
echo DATABASE_URL=postgres://username:password@localhost/diesel_relations > .env
```

Now we can set up Diesel by running:

```
diesel setup
```

## 1-to-many or 1:m

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
    pub title: String,
}

#[derive(Insertable)]
#[diesel(table_name = books)]
pub struct NewBook<'a> {
    pub title: &'a str,
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

## many-to-many or m:n

We currently have books and they have pages, but books have an author, too. To
be precise, a book can have more than one author and an author can have more
than one book. So we have a many-to-many relation here. Diesel does not have a
concept of `has_many` but instead we are going create a "join table"
`books_authors` and add a `belongs_to` to both `books` and `authors`. Let's see
that in action.

## Migrations

```sh
diesel migration generate create_authors
diesel migration generate create_books_authors
```

Let's keep it simple and just give our `authors` a name.

::: code-block

[up.sql]( https://github.com/fix-me/up.sql )

```sql
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
);
```
:::

And the corresponding down migration.

::: code-block

[down.sql]( https://github.com/fix-me/up.sql )

```sql
DROP TABLE authors;
```
:::

The `books_authors` migration has two foreign keys which point to book's id and
the author's id. This allows us to create a many-to-many relation between books
and authors.

::: code-block

[up.sql]( https://github.com/fix-me/up.sql )

```sql
CREATE TABLE books_authors (
  id SERIAL PRIMARY KEY,
  book_id SERIAL REFERENCES books(id),
  author_id SERIAL REFERENCES authors(id)
);
```
:::

And the corresponding down migration.

::: code-block

[down.sql]( https://github.com/fix-me/up.sql )

```sql
DROP TABLE books_authors;
```
:::

Lastly, let's run the migrations

::: code-block

[Run the migrations]()

```sh
diesel migration run
diesel migration redo
```

:::

## Model

Now let's reflect the join table in the `model.rs`. To keep this brief, let's only look at what we are adding.

::: code-block

[model.rs]( https://github.com/fix-me/model.rs )

```rust
use crate::schema::authors;
use crate::schema::books_authors;

#[derive(Queryable, Identifiable, PartialEq, Debug)]
#[diesel(table_name = authors)]
pub struct Author {
    pub id: i32,
    pub name: String,
}

#[derive(Insertable)]
#[diesel(table_name = authors)]
pub struct NewAuthor<'a> {
    pub name: &'a str,
}

#[derive(Identifiable, Queryable, Associations)]
#[diesel(belongs_to(Book))]
#[diesel(belongs_to(Author))]
#[diesel(table_name = books_authors)]
pub struct BooksAuthor {
    pub id: i32,
    pub book_id: i32,
    pub author_id: i32,
}

#[derive(Insertable)]
#[diesel(table_name = books_authors)]
pub struct NewBooksAuthor {
    pub book_id: i32,
    pub author_id: i32,
}
```
:::

The important part is to give `BooksAuthor` two `belongs_to` that point to the book and the author.

## Writing and reading data

If you have been following the tutorial step-by-step, the easiest thing here
will be to replace your old `main.rs` with this one.

::: code-block

[main.rs]( https://github.com/fix-me/main.rs )

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

pub fn new_author(conn: &mut PgConnection, name: &str) -> Author {
    let new_author = NewAuthor { name };
    diesel::insert_into(authors::table)
        .values(&new_author)
        .get_result(conn)
        .expect("Error saving author")
}

pub fn new_book(conn: &mut PgConnection, title: &str) -> Book {
    let new_book = NewBook { title };
    diesel::insert_into(books::table)
        .values(&new_book)
        .get_result(conn)
        .expect("Error saving book")
}

pub fn new_books_author(conn: &mut PgConnection, book_id: i32, author_id: i32) -> BooksAuthor {
    let new_books_author = NewBooksAuthor { book_id, author_id };
    diesel::insert_into(books_authors::table)
        .values(&new_books_author)
        .get_result(conn)
        .expect("Error saving BooksAuthor")
}
pub fn new_page(conn: &mut PgConnection, page_number: i32, content: &str, book_id: i32) -> Page {
    let new_page = NewPage {
        page_number,
        content,
        book_id,
    };
    diesel::insert_into(pages::table)
        .values(&new_page)
        .get_result(conn)
        .expect("Error saving page")
}

fn main() {
    let conn = &mut establish_connection();

    // create a book
    let momo = new_book(conn, "Momo");

    // a page in that book
    let page_1 = new_page(conn, 1, "In alten, alten Zeiten ...", momo.id);
    // a second page
    let page_2 = new_page(conn, 2, "den prachtvollen Theatern...", momo.id);

    // get pages for the book
    let pages = Page::belonging_to(&momo)
        .inner_join(books::table)
        .select(pages::all_columns)
        .load::<Page>(conn)
        .expect("Error loading pages");
    // the data is the same we put in
    assert_eq!(&page_1, pages.get(0).unwrap());
    assert_eq!(&page_2, pages.get(1).unwrap());

    // get a book from a page
    let book_maybe = books::table
        .find(page_2.book_id)
        .first::<Book>(conn)
        .expect("Error loading book");
    assert_eq!(book_maybe, momo);

    // create an author
    let michael_ende = new_author(conn, "Michael Ende");

    // let's add the author to the already created book
    new_books_author(conn, momo.id, michael_ende.id);

    // create a second author
    let astrid_lindgren = new_author(conn, "Astrid Lindgren");
    let pippi = new_book(conn, "Pippi Långstrump");
    new_books_author(conn, pippi.id, astrid_lindgren.id);

    // now that both have a single book, let's add a third book, an imaginary collaboration
    let collaboration = new_book(conn, "Pippi and Momo");
    new_books_author(conn, collaboration.id, astrid_lindgren.id);
    new_books_author(conn, collaboration.id, michael_ende.id);

    // get authors for the collaboration
    let authors = BooksAuthor::belonging_to(&collaboration)
        .inner_join(authors::table)
        .select(authors::all_columns)
        .load::<Author>(conn)
        .expect("Error loading authors");
    println!("{:?}", authors);

    // get all of Astrid Lindgren's books
    let books = BooksAuthor::belonging_to(&astrid_lindgren)
        .inner_join(books::table)
        .select(books::all_columns)
        .load::<Book>(conn)
        .expect("Error loading books");
    println!("{:?}", books);
}
```
:::

:::
:::
:::
