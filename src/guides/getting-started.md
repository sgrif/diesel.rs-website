---
title: "Getting Started"
lang: en-US
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: demo
::: content-wrapper
::: guide-wrapper

For this guide, we're going to walk through some simple examples for each of the pieces of CRUD,
which stands for "Create Read Update Delete". Each step in this guide will build on the previous,
and is meant to be followed along.

**This guide assumes that you're using PostgreSQL.** Before we start,
make sure you have PostgreSQL installed and running.

<aside class = "aside aside--note">
<header class = "aside__header">A note on Rust versions:</header>

::: aside__text
Diesel requires Rust 1.31 or later. If you're following along with this guide,
make sure you're using at least that version of Rust by running `rustup update stable`.

:::
</aside>

## Initializing a new project

The first thing we need to do is generate our project.

::: code-block

[Generate a new project]()

```sh
cargo new --lib diesel_demo
cd diesel_demo
```

:::

First, let's add Diesel to our dependencies. We're also going to use a tool called
[`.env`][dotenv] to manage our environment variables for us. We'll add it to our dependencies
as well.

[dotenv]: https://github.com/dotenv-rs/dotenv

::: code-block

[Cargo.toml](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_1/Cargo.toml)

```toml
[dependencies]
diesel = { version = "1.4.4", features = ["postgres"] }
dotenv = "0.15.0"
```

:::

## Installing Diesel CLI

Diesel provides a separate [CLI] tool to help manage your project. Since it's a standalone binary,
and doesn't affect your project's code directly, we don't add it to `Cargo.toml`.
Instead, we just install it on our system.

[CLI]: https://github.com/diesel-rs/diesel/tree/master/diesel_cli

::: code-block

[Install the CLI tool]()

```sh
cargo install diesel_cli
```

:::

<aside class = "aside aside--note">
<header class = "aside__header"> A note on installing `diesel_cli`</header>

::: aside__text

If you run into an error like:

```
note: ld: library not found for -lmysqlclient
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

This means you are missing the client library needed for a database backend
– `mysqlclient` in this case. You can resolve this issue by either installing the library
(using the usual way to do this depending on your operating system) or by excluding
the undesired default library with the `--no-default-features` flag.

For example, if you only have PostgreSQL installed, you can use this to install `diesel_cli`
with only PostgreSQL:

```sh
cargo install diesel_cli --no-default-features --features postgres
```
:::
</aside>

## Setup Diesel for your project

We need to tell Diesel where to find our database. We do this by setting the `DATABASE_URL`
environment variable. On our development machines, we'll likely have multiple projects going,
and we don't want to pollute our environment. We can put the url in a `.env` file instead.

```sh
echo DATABASE_URL=postgres://username:password@localhost/diesel_demo > .env
```

Now Diesel CLI can set everything up for us.

```
diesel setup
```

This will create our database (if it didn't already exist), and create an empty migrations directory
that we can use to manage our schema (more on that later).

Now we're going to write a small CLI that lets us manage a blog (ignoring the fact
that we can only access the database from this CLI…). The first thing we're going to need is
a table to store our posts. Let's create a migration for that:

```sh
diesel migration generate create_posts
```

Diesel CLI will create two empty files for us in the required structure.
You'll see output that looks something like this:

```
Creating migrations/20160815133237_create_posts/up.sql
Creating migrations/20160815133237_create_posts/down.sql
```

Migrations allow us to evolve the database schema over time. Each migration can be applied
(`up.sql`) or reverted (`down.sql`). Applying and immediately reverting a migration should
leave your database schema unchanged.

Next, we'll write the SQL for migrations:

::: code-block

[up.sql]( https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/getting_started_step_1/migrations/20160815133237_create_posts/up.sql)

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  body TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT 'f'
)
```

:::

::: code-block

[down.sql](https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/getting_started_step_1/migrations/20160815133237_create_posts/down.sql)

```sql
DROP TABLE posts
```

:::

We can apply our new migration:

```sh
diesel migration run
```

It's a good idea to make sure that `down.sql` is correct. You can quickly confirm that your `down.sql`
rolls back your migration correctly by `redoing` the migration:

```
diesel migration redo
```

<aside class = "aside aside--note">
<header class = "aside__header"> A Note on Raw SQL in Migrations:</header>
::: aside__text
Since migrations are written in raw SQL, they can contain specific features of the database system you use.
For example, the `CREATE TABLE` statement above uses PostgreSQL's `SERIAL` type. If you want to use SQLite instead,
you need to use `INTEGER` instead.
:::
</aside>

<aside class = "aside aside--note">
<header class = "aside__header">A Note on Using Migrations in Production:</header>

::: aside__text
When preparing your app for use in production, you may want to run your migrations
during the application's initialization phase. You may also want to include the migration scripts
as a part of your code, to avoid having to copy them to your deployment location/image etc.

The [diesel_migrations] crate provides the `embed_migrations!` macro, allowing you to embed migration scripts
in the final binary. Once your code uses it, you can simply include `embedded_migrations::run(&db_conn)`
at the start of your `main` function to run migrations every time the application starts.

[diesel_migrations]: https://docs.rs/crate/diesel_migrations/

:::
</aside>

## Write Rust

OK enough SQL, let's write some Rust. We'll start by writing some code to show the last five published posts.
The first thing we need to do is establish a database connection.

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_1/src/lib.rs)

```rust
#[macro_use]
extern crate diesel;
extern crate dotenv;

use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenv::dotenv;
use std::env;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}
```

:::

We'll also want to create a `Post` struct into which we can read our data, and have diesel generate the names
we'll use to reference tables and columns in our queries.

We'll add the following lines to the top of `src/lib.rs`:

::: code-block

[src/lib.rs](https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/getting_started_step_1/src/lib.rs)

```rust
pub mod schema;
pub mod models;
```

:::

Next we need to create the two modules that we just declared.

::: code-block

[src/models.rs](https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/getting_started_step_1/src/models.rs)

```rust
#[derive(Queryable)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
}
```

:::

`#[derive(Queryable)]` will generate all of the code needed to load a `Post` struct from a SQL query.

Typically the schema module isn't created by hand, it gets generated by Diesel. When we ran `diesel setup`,
a file called [diesel.toml] was created which tells Diesel to maintain a file at src/schema.rs for us.
The file should look like this:

[diesel.toml]: https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_1/diesel.toml

::: code-block

[src/schema.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_1/src/schema.rs)

```rust
table! {
    posts (id) {
        id -> Integer,
        title -> Text,
        body -> Text,
        published -> Bool,
    }
}
```

:::

The exact output might vary slightly depending on your database, but it should be equivalent.

The [`table!` macro] creates a bunch of code based on the database schema to represent
all of the tables and columns. We'll see how exactly to use that in the next example.

Any time we run or revert a migration, this file will get automatically updated.

[`table!` macro]: https://docs.diesel.rs/diesel/macro.table.html

<aside class = "aside aside--note">
<header class = "aside__header"> A Note on Field Order</header>

::: aside__text

Using `#[derive(Queryable)]` assumes that the order of fields on the `Post` struct matches
the columns in the `posts` table, so make sure to define them in the order seen in the `schema.rs` file.

:::

</aside>

Let's write the code to actually show us our posts.

::: code-block

[src/bin/show_posts.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_1/src/bin/show_posts.rs)

```rust
extern crate diesel_demo;
extern crate diesel;

use self::diesel_demo::*;
use self::models::*;
use self::diesel::prelude::*;

fn main() {
    use diesel_demo::schema::posts::dsl::*;

    let connection = establish_connection();
    let results = posts.filter(published.eq(true))
        .limit(5)
        .load::<Post>(&connection)
        .expect("Error loading posts");

    println!("Displaying {} posts", results.len());
    for post in results {
        println!("{}", post.title);
        println!("----------\n");
        println!("{}", post.body);
    }
}
```

:::


The use `diesel_demo::schema::posts::dsl::*` line imports a bunch of aliases so that we can say `posts`
instead of `posts::table`, and published instead of `posts::published`. It's useful
when we're only dealing with a single table, but that's not always what we want.

We can run our script with `cargo run --bin show_posts`. Unfortunately, the results
won't be terribly interesting, as we don't actually have any posts in the database.
Still, we've written a decent amount of code, so let's commit.

The full code for the demo at this point can be found [here][full code].

[full code]: https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/getting_started_step_1/

Next, let's write some code to create a new post.We'll want a struct to use for inserting
a new record.

::: code-block

[src/models.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_2/src/models.rs)

```rust
use super::schema::posts;

#[derive(Insertable)]
#[table_name="posts"]
pub struct NewPost<'a> {
    pub title: &'a str,
    pub body: &'a str,
}
```

:::

Now let's add a function to save a new post.

::: code-block

[src/lib.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_2/src/lib.rs)

```rust
use self::models::{Post, NewPost};

pub fn create_post<'a>(conn: &PgConnection, title: &'a str, body: &'a str) -> Post {
    use schema::posts;

    let new_post = NewPost {
        title: title,
        body: body,
    };

    diesel::insert_into(posts::table)
        .values(&new_post)
        .get_result(conn)
        .expect("Error saving new post")
}
```

:::

When we call `.get_result` on an insert or update statement, it automatically adds `RETURNING *`
to the end of the query, and lets us load it into any struct that implements `Queryable`
for the right types. Neat!

Diesel can insert more than one record in a single query. Just pass a `Vec` or slice to `insert`,
and then call `get_results` instead of `get_result`. If you don't actually want to do anything
with the row that was just inserted, call `.execute` instead. The compiler won't complain
at you, that way. :)

Now that we've got everything set up, we can create a little script to write a new post.

::: code-block

[src/bin/write_post.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_2/src/bin/write_post.rs)

```rust
extern crate diesel_demo;
extern crate diesel;

use self::diesel_demo::*;
use std::io::{stdin, Read};

fn main() {
    let connection = establish_connection();

    println!("What would you like your title to be?");
    let mut title = String::new();
    stdin().read_line(&mut title).unwrap();
    let title = &title[..(title.len() - 1)]; // Drop the newline character
    println!("\nOk! Let's write {} (Press {} when finished)\n", title, EOF);
    let mut body = String::new();
    stdin().read_to_string(&mut body).unwrap();

    let post = create_post(&connection, title, &body);
    println!("\nSaved draft {} with id {}", title, post.id);
}

#[cfg(not(windows))]
const EOF: &'static str = "CTRL+D";

#[cfg(windows)]
const EOF: &'static str = "CTRL+Z";
```

:::

We can run our new script with `cargo run --bin write_post`. Go ahead and write a blog post.
Get creative! Here was mine:

```
   Compiling diesel_demo v0.1.0 (file:///Users/sean/Documents/Projects/open-source/diesel_demo)
     Running `target/debug/write_post`

What would you like your title to be?
Diesel demo

Ok! Let's write Diesel demo (Press CTRL+D when finished)

You know, a CLI application probably isn't the best interface for a blog demo.
But really I just wanted a semi-simple example, where I could focus on Diesel.
I didn't want to get bogged down in some web framework here.
Plus I don't really like the Rust web frameworks out there. We might make a
new one, soon.

Saved draft Diesel demo with id 1
```

Unfortunately, running `show_posts` still won't display our new post,
because we saved it as a draft. If we look back to the code in
`show_posts`, we added `.filter(published.eq(true))`, and we had
`published` default to false in our migration. We need to publish it!
But in order to do that, we'll need to look at how to update an
existing record. First, let's commit. The code for this demo at this
point can be found [here][commit-no-2].

[commit-no-2]: https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/getting_started_step_2/

Now that we've got create and read out of the way, update is actually
relatively simple. Let's jump right into the script:

::: code-block

[src/bin/publish_post.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_3/src/bin/publish_post.rs)

```rust
extern crate diesel_demo;
extern crate diesel;

use self::diesel::prelude::*;
use self::diesel_demo::*;
use self::models::Post;
use std::env::args;

fn main() {
    use diesel_demo::schema::posts::dsl::{posts, published};

    let id = args().nth(1).expect("publish_post requires a post id")
        .parse::<i32>().expect("Invalid ID");
    let connection = establish_connection();

    let post = diesel::update(posts.find(id))
        .set(published.eq(true))
        .get_result::<Post>(&connection)
        .expect(&format!("Unable to find post {}", id));
    println!("Published post {}", post.title);
}
```

:::

That's it! Let's try it out with `cargo run --bin publish_post 1`.

```
 Compiling diesel_demo v0.1.0 (file:///Users/sean/Documents/Projects/open-source/diesel_demo)
   Running `target/debug/publish_post 1`
Published post Diesel demo
```

And now, finally, we can see our post with `cargo run --bin show_posts`.

```
     Running `target/debug/show_posts`
Displaying 1 posts
Diesel demo
----------

You know, a CLI application probably isn't the best interface for a blog demo.
But really I just wanted a semi-simple example, where I could focus on Diesel.
I didn't want to get bogged down in some web framework here.
Plus I don't really like the Rust web frameworks out there. We might make a
new one, soon.
```

We've still only covered three of the four letters of CRUD though. Let's show
how to delete things. Sometimes we write something we really hate, and
we don't have time to look up the ID. So let's delete based on the
title, or even just some words in the title.

::: code-block

[src/bin/delete_post.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/getting_started_step_3/src/bin/delete_post.rs)

```rust
extern crate diesel_demo;
extern crate diesel;

use self::diesel::prelude::*;
use self::diesel_demo::*;
use std::env::args;

fn main() {
    use diesel_demo::schema::posts::dsl::*;

    let target = args().nth(1).expect("Expected a target to match against");
    let pattern = format!("%{}%", target);

    let connection = establish_connection();
    let num_deleted = diesel::delete(posts.filter(title.like(pattern)))
        .execute(&connection)
        .expect("Error deleting posts");

    println!("Deleted {} posts", num_deleted);
}
```

:::

We can run the script with `cargo run --bin delete_post` demo (at least with the title I chose).
Your output should look something like:

```
   Compiling diesel_demo v0.1.0 (file:///Users/sean/Documents/Projects/open-source/diesel_demo)
     Running `target/debug/delete_post demo`
Deleted 1 posts
```

When we try to run `cargo run --bin show_post`s again, we can see that the post was in fact deleted.
This barely scratches the surface of what you can do with Diesel, but hopefully this tutorial
has given you a good foundation to build off of. We recommend exploring the [API docs] to see more.
The final code for this tutorial can be found [here][final].

[API docs]: ../docs/index.md
[final]: https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/getting_started_step_3/

::: 
:::
:::
