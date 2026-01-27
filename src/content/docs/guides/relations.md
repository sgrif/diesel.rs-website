---
title: "Relations"
lang: en-US
---

For this guide, we're going to look at joins, 1-to-many and many-to-many relations in Diesel.
Each step in this guide will build on the previous, and is meant to be followed along.

**This guide assumes that you have gone through the [Getting Started Guide](/guides/getting-started/)**

## New project

Let's make a new project for this guide:


```sh title="Generate a new project"
cargo new --lib diesel_relations
cd diesel_relations
```


As before, let's add Diesel and dotenvy to our dependencies.


```sh title="Add dependencies"
cargo add diesel --features "postgres"
cargo add dotenvy
```


Your `Cargo.toml` file should now contain entries similar to the following ones:


[Cargo.toml](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/Cargo.toml#L8-L10)

```toml title="Cargo.toml"
[dependencies]
diesel = { version = "2.1.0", features = ["postgres"] }
dotenvy = "0.15.6"
```


And a `.env` to point Diesel to the correct database.

```sh title=".env"
echo DATABASE_URL=postgres://username:password@localhost/diesel_relations > .env
```

Now we can set up Diesel by running:

```sh
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


[up.sql](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/migrations/2023-02-08-193717_create_books/up.sql)

```sql title="up.sql"
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL
);
```

The pages migration needs to point to the book they appear in, therefore we add a reference to the book to the migration:


[up.sql](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/migrations/2023-02-08-193718_create_pages/up.sql)
```sql title="up.sql"
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  page_number INT NOT NULL,
  content TEXT NOT NULL,
  book_id INTEGER NOT NULL REFERENCES books(id)
);
```


Let's add the corresponding down migrations as well:


[down.sql](https://github.com/diesel-rs/diesel/tree/2.3.x/examples/postgres/relations/migrations/2023-02-08-193717_create_books/down.sql)

```sql title="down.sql"
DROP TABLE books;
```


and again for pages


[down.sql](https://github.com/diesel-rs/diesel/tree/2.3.x/examples/postgres/relations/migrations/2023-02-08-193718_create_pages/down.sql)

```sql title="down.sql"
DROP TABLE pages;
```


We can apply our new migration:

```sh
diesel migration run
```

Let's make sure the down migrations are correct too:

```sh
diesel migration redo -n 2
```

## Schema.rs

The generated schema should now look like this:


[schema.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/schema.rs)

```rust title="schema.rs"
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

Diesel picked up on the foreign key references. It created a schema for us that has pages as
joinable into books via the `book_id` and allows for the two to appear in the
same query. This allows to join this table without specify an explicit `ON` clause. Diesel generates these `joinable!` instances only for cases where there is only a single relation between two tables based on a non-composite foreign key. All other cases require to specify an explicit the `ON` clause while constructing such joins.

## Models

Let's reflect this now in our `model.rs`


[src/model.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/model.rs#L22-L38)

```rust title="src/model.rs"
use diesel::prelude::*;

use crate::schema::{books, pages};


#[derive(Queryable, Identifiable, Selectable, Debug, PartialEq)]
#[diesel(table_name = books)]
pub struct Book {
    pub id: i32,
    pub title: String,
}

#[derive(Queryable, Selectable, Identifiable, Associations, Debug, PartialEq)]
#[diesel(belongs_to(Book))]
#[diesel(table_name = pages)]
pub struct Page {
    pub id: i32,
    pub page_number: i32,
    pub content: String,
    pub book_id: i32,
}

```


Associations in Diesel are always child-to-parent. You can declare an
association between two records with `#[diesel(belongs_to)]`. First we need to add
[`#[derive(Associations)]`][associations-docs]
, which will allow us to add `#[diesel(belongs_to(Book))]` to `Page`.
That tells  that pages belong to books and thereby reflect our 1-to-many relation.

By default diesel will assume that your struct contains a field with the lower case
remote type name appended with `_id`. So for the given example `book_id`. If your
foreign key field has a different name you can specify that via the `foreign_key` option:
`#[diesel(belongs_to(Book, foreign_key = book_id))]`

[associations-docs]: https://docs.diesel.rs/2.3.x/diesel/associations/derive.Associations.html

## Reading data

For ease of following this tutorial, we are going to put all the code into `main.rs`. We create a separate function for each part of the guide. See the linked code for the complete file content.


[src/main.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/main.rs#L88-L98)

```rust title="src/main.rs"
let momo = books::table
    .filter(books::title.eq("Momo"))
    .select(Book::as_select())
    .get_result(conn)?;

// get pages for a book
let pages = Page::belonging_to(&momo)
    .select(Page::as_select())
    .load(conn)?;

println!("Pages for \"Momo\": \n {pages:?}\n");
```


[`Page::belonging_to`][belonging-to-dsl-docs] allows to query all child records related to one or more
parent record. For the presented case it will load all pages for the book with the title "Momo".
This function generates a query for loading these data. It does not execute the query, so that
it is possible to add additional clauses to the query later on.
The generated query is equivalent to `SELECT * FROM pages WHERE book_id IN(…)` with
a list of given book ids derived from the function input.


[belonging-to-dsl-docs]: https://docs.diesel.rs/2.3.x/diesel/prelude/trait.BelongingToDsl.html


Loading all pages for a single book is a straight forward query, it becomes more complicated if we
want to load all pages per book. This is a classic ORM problem, where frameworks sometimes run in
the so called N+1 query problem. That problem describes cases where a framework naively loads all
books first and then execute one query per book to receive the relevant pages. This approach is bad
for performance because it executes an unbound number of queries.

Diesel's [associations API] sidesteps that problem by providing a special tailored API for such cases:


[src/main.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/main.rs#L100-L115)

```rust title="src/main.rs"
let all_books = books::table.select(Book::as_select()).load(conn)?;

// get all pages for all books
let pages = Page::belonging_to(&all_books)
    .select(Page::as_select())
    .load(conn)?;

// group the pages per book
let pages_per_book = pages
    .grouped_by(&all_books)
    .into_iter()
    .zip(all_books)
    .map(|(pages, book)| (book, pages))
    .collect::<Vec<(Book, Vec<Page>)>>();

println!("Pages per book: \n {pages_per_book:?}\n");
```


Here we use a similar construct as before to load all pages for a given list of books by constructing the
relevant query via `Page::belonging_to`. The important difference to before is that we now pass a slice of books
as argument. This will again construct the equivalent of the `SELECT * FROM pages WHERE book_id IN(…)` query as
before. The important difference here is that we use the [`.grouped_by`] function to later group each page to the
correct book. In total there are two queries executed in this code block, independently of the number of queried books and pages.

[associations API]: https://docs.diesel.rs/2.3.x/diesel/associations/index.html
[`.grouped_by`]: https://docs.diesel.rs/2.3.x/diesel/associations/trait.GroupedBy.html


:::note[A note on consuming these data]

A common use case for loading associated data is to return a serialized data structure like
```json
[{
    "id": 1,
    "title": "Momo",
    "pages": […],
}]
```

Given the API provided by diesel, such a structure can easily be implemented by collecting the data in a struct with named fields instead of a tuple and using [`#[serde(flatten)]`](https://serde.rs/field-attrs.html#flatten) on the relevant fields.

```rust
#[derive(Serialize)]
struct BookWithPages {
    #[serde(flatten)]
    book: Book,
    pages: Vec<Page>,
}

// group the pages per book
let pages_per_book = pages
    .grouped_by(&all_books)
    .into_iter()
    .zip(all_books)
    .map(|(pages, book)| BookWithPages { book, pages })
    .collect::<Vec<BookWithPages>>();

```

:::


## Joins

We have currently loaded all pages for a given book by using the API provided by the `diesel::associations` module.
This API is designed to work for parent-child relations, but not the other way around. Using plain SQL joins is
the preferred way to resolve such relations the other way around. Diesel provides two kinds of joins: `INNER JOIN` and `LEFT JOIN`, where the former expects that linked elements always exist. The latter allows to include rows with missing linked elements. Both constructs load data by executing a single query.

### `INNER JOIN`

[`QueryDsl::inner_join`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.inner_join) allows to construct `INNER JOIN` statements between different tables.


[src/main.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/main.rs#L70-L76)

```rust title="src/main.rs"
let page_with_book = pages::table
    .inner_join(books::table)
    .filter(books::title.eq("Momo"))
    .select((Page::as_select(), Book::as_select()))
    .load::<(Page, Book)>(conn)?;

println!("Page-Book pairs: {page_with_book:?}");
```


`QueryDsl::inner_join()` modifies the constructed query to include a `INNER JOIN` clause based on the provided arguments. The `ON` clause of the join statement can be
inferred based on the [`joinable!`][doc-joinable] call in your `schema.rs` file. In addition it's possible to specify custom `ON` clauses via [`JoinDsl::on`][doc-on].
If no explicit select clause is provided the constructed query will return a tuple of both default select clauses for both sides of the join. This can be deserialized
to a rust tuple or any compatible type implementing [`Queryable`][doc-queryable].

It is possible to chain several joins to join multiple tables. The nesting of the joins controls which tables exactly are joined. This means the following two statements are not equal:

```rust
users::table.inner_join(posts::table.inner_join(comments::table));

// Results in the following SQL
// SELECT * FROM users
// INNER JOIN posts ON users.id = posts.user_id
// INNER JOIN comments ON post.id = comments.post_id

users::table.inner_join(posts::table).inner_join(comments::table);

// Results in the following SQL
// SELECT * FROM users
// INNER JOIN posts ON users.id = posts.user_id
// INNER JOIN comments ON users.id = comments.user_id

```

For joining the same table more than once, refer to the [`alias!`][doc-alias] macro to create distinct aliases.


[doc-joinable]: https://docs.diesel.rs/2.3.x/diesel/macro.joinable.html
[doc-on]: https://docs.diesel.rs/2.3.x/diesel/query_dsl/trait.JoinOnDsl.html#method.on
[doc-queryable]: https://docs.diesel.rs/2.3.x/diesel/deserialize/trait.Queryable.html
[doc-alias]: https://docs.diesel.rs/2.3.x/diesel/macro.alias.html

### `LEFT JOIN`

[`QueryDsl::left_join`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.left_join) allows to construct `LEFT JOIN` statements between different tables.


[src/main.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/main.rs#L78-L83)

```rust title="src/main.rs"
let book_without_pages = books::table
    .left_join(pages::table)
    .select((Book::as_select(), Option::<Page>::as_select()))
    .load::<(Book, Option<Page>)>(conn)?;

println!("Book-Page pairs (including empty books): {book_without_pages:?}");
```

This works similar to `QueryDsl::inner_join` with the notable difference that any column returned from a joined table is considered to be nullable. This has several consequences:

* A query like `books::table.left_join(pages::table).load(conn)` returns `(Book, Option<Page>)` or any compatible type
* Explicit calls to [`QueryDsl::select`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.select) require
that any column that comes from the left joined table is annotated with a [`NullableExpressionMethods::nullable`][doc-nullable] call.
This function can be called for individual columns, expressions or tuples containing columns form left joined tables.

[doc-nullable]: https://docs.diesel.rs/2.3.x/diesel/expression_methods/trait.NullableExpressionMethods.html#method.nullable

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


[up.sql](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/migrations/2023-02-17-084424_add_authors/up.sql)

```sql title="up.sql"
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);
```


And the corresponding down migration.


[down.sql](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/migrations/2023-02-17-084424_add_authors/down.sql)

```sql title="down.sql"
DROP TABLE authors;
```



The `books_authors` migration has two foreign keys which point to book's id and
the author's id. This allows us to create a many-to-many relation between books
and authors.


[up.sql](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/migrations/2023-02-17-084617_add_books_authors/up.sql)

```sql title="up.sql"
CREATE TABLE books_authors (
  book_id INTEGER REFERENCES books(id),
  author_id INTEGER REFERENCES authors(id),
  PRIMARY KEY(book_id, author_id)
);
```


And the corresponding down migration.


[down.sql](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/migrations/2023-02-17-084617_add_books_authors/down.sql)

```sql title="down.sql"
DROP TABLE books_authors;
```


Lastly, let's run the migrations


```sh title="Run the migrations"
diesel migration run
diesel migration redo -n 2
```


## Model

Now let's reflect the join table in the `model.rs`. To keep this brief, let's only look at what we are adding.


[src/model.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/model.rs#L1-L20)

```rust title="src/model.rs"
use diesel::prelude::*;

use crate::schema::{books, pages, authors, books_authors};

#[derive(Queryable, Selectable, Identifiable, PartialEq, Debug)]
#[diesel(table_name = authors)]
pub struct Author {
    pub id: i32,
    pub name: String,
}

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(Book))]
#[diesel(belongs_to(Author))]
#[diesel(table_name = books_authors)]
#[diesel(primary_key(book_id, author_id))]
pub struct BookAuthor {
    pub book_id: i32,
    pub author_id: i32,
}

```


The important part is to give `BooksAuthor` two `belongs_to` that point to the book and the author.

## Reading data

If we now want to load all books of a given author we can combine joins and diesels `BelongingToDsl` to load these data:


[src/main.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/main.rs#L121-L131)

```rust title="src/main.rs"
let astrid_lindgren = authors::table
    .filter(authors::name.eq("Astrid Lindgren"))
    .select(Author::as_select())
    .get_result(conn)?;

// get all of Astrid Lindgren's books
let books = BookAuthor::belonging_to(&astrid_lindgren)
    .inner_join(books::table)
    .select(Book::as_select())
    .load(conn)?;
println!("Books by Astrid Lindgren: {books:?}");
```


As described before `BookAuthor::belonging_to` constructs a query to which we can chain other clauses. In this case we join the `books` table to include the relevant books and select only the columns relevant for populating the `Book` type. This results in loading all books for a given author.

The same approach can be applied the other way around, to load all authors for a given book:

:::code-block

[src/main.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/main.rs#L133-L143)
```rust title="src/main.rs"
let collaboration = books::table
    .filter(books::title.eq("Pippi and Momo"))
    .select(Book::as_select())
    .get_result(conn)?;

// get authors for the collaboration
let authors = BookAuthor::belonging_to(&collaboration)
    .inner_join(authors::table)
    .select(Author::as_select())
    .load(conn)?;
println!("Authors for \"Pippi and Momo\": {authors:?}");
```


As before we can use this approach to load a list of all authors and their associated books:


[src/main.rs](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations/src/main.rs#L146-L162)
```rust title="src/main.rs"
let all_authors = authors::table
    .select(Author::as_select())
    .load(conn)?;

let books = BookAuthor::belonging_to(&authors)
    .inner_join(books::table)
    .select((BookAuthor::as_select(), Book::as_select()))
    .load(conn)?;

let books_per_author: Vec<(Author, Vec<Book>)> = books
    .grouped_by(&all_authors)
    .into_iter()
    .zip(authors)
    .map(|(b, author)| (author, b.into_iter().map(|(_, book)| book).collect()))
    .collect();

println!("All authors including their books: {books_per_author:?}");
```


As before we load all associated books by joining the books table to the query produced by `BookAuthor::belonging_to`. It is important to load the data from `books_authors` as well, as these data include the relevant mapping. The grouping is performed again with the `.grouped_by` method, similar to how this was done for the 1-to-n relations case. We now need to exclude the `BookAuthor` information in the final grouping step explicitly.

The final code for this tutorial can be found [here](https://github.com/diesel-rs/diesel/blob/2.3.x/examples/postgres/relations).

