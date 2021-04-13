---
lang: en-US
title: "All About Updates"
---

::: demo
::: content-wrapper
::: guide-wrapper

Most applications fall into a category called "CRUD" apps. CRUD stands for
"Create, Read, Update, Delete". Diesel provides support for all four pieces,
but in this guide we're going to look at all the different ways to go about updating records.

An update statement is constructed by calling `diesel::update(target).set(changes)`.
The resulting statement is then run by calling either `execute`, `get_result`, or `get_results`.

If you look at the documentation for [`update`](https://docs.diesel.rs/diesel/fn.update.html),
you'll notice that the type of the argument is any type `T` which implements `IntoUpdateTarget`.
You don't need to worry about what this trait does, but it is important to know
which types implement it. There are three kinds which implement this trait. The first is tables.

If we have a table that looks like this:

::: code-block

[src/lib.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L12-L21)

```rust
table! {
    posts {
        id -> BigInt,
        title -> Text,
        body -> Text,
        draft -> Bool,
        publish_at -> Timestamp,
        visit_count -> Integer,
    }
}
```

:::

We could write a query that publishes all posts by doing:

::: code-block

[src/lib.rs](https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L33-L38)

```rust
use posts::dsl::*;

diesel::update(posts).set(draft.eq(false))
```

:::

We can use the [`debug_query`] function to inspect the generated SQL.
The output you see may slightly differ from this guide, depending on which backend you're using.
If we run `println!("{}", debug_query::<Pg, _>(&our_query));`, we'll see the following:

[`debug_query`]: https://docs.diesel.rs/diesel/fn.debug_query.html

::: code-block 

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L40-L48)

```sql
UPDATE "posts" SET "draft" = $1 -- binds: [false]
```

:::

This is pretty much one-to-one with the Rust code (the `?` denotes a bound parameter in SQL,
which will be substituted with `false` here). It's quite rare to want to update an entire table,
though. So let's look at how we can scope that down. The second kind that you can pass to
`update` is any query which has only had `.filter` called on it. We could scope our update to
only touch posts where `publish_at` is in the past like so:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L50-L57)

```rust
use posts::dsl::*;
use diesel::expression::dsl::now;

let target = posts.filter(publish_at.lt(now));
diesel::update(target).set(draft.eq(false))
```

::: 

That would generate the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L59-L71)

```sql
UPDATE `posts` SET `draft` = ?
WHERE `posts`.`publish_at` < CURRENT_TIMESTAMP
```

:::

The most common update queries are just scoped to a single record. So the final kind that
you can pass to `update` is anything which implements [the `Identifiable` trait].
`Identifiable` gets implemented by putting `#[derive(Identifiable)]` on a struct.
It represents any struct which is one-to-one with a row on a database table.

[the `Identifiable` trait]: https://docs.diesel.rs/diesel/associations/trait.Identifiable.html

If we wanted a struct that mapped to our posts table, it'd look something like this:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L23-L31)

```rust
#[derive(Identifiable)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub draft: bool,
    pub publish_at: SystemTime,
}
```

:::

The struct has one field per database column, but what's important for `Identifiable` is
that it has the `id` field, which is the primary key of our table. Since our struct name is
just the table name without an `s`, we don't have to provide the table name explicitly.
If our struct were named something different, or if pluralizing it was more complex than
putting an `s` on the end, we would have to specify the table name by adding `#[table_name="posts"]`.
We're using `SystemTime` here since it's in the standard library, but in a real application
we'd probably want to use a more full-featured type like one from `chrono`,
which you can do by enabling the `chrono` feature on Diesel.

If we wanted to publish just this post, we could do it like this:


::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L73-L76)

```rust
diesel::update(&post).set(posts::draft.eq(false))
```

:::

It's important to note that we always pass a reference to the post, not the post itself.
When we write `update(post)`, that's equivalent to writing `update(posts.find(post.id))`,
or `update(posts.filter(id.eq(post.id)))`. We can see this in the generated SQL:


::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L78-L93)

```sql
UPDATE `posts` SET `draft` = ? WHERE `posts`.`id` = ?
```

:::

Now that we've seen all the ways to specify what we want to update,
let's look at the different ways to provide the data to update it with.
We've already seen the first way, which is to pass `column.eq(value)` directly.
So far we've just been passing Rust values here, but we can actually use any Diesel expression.
For example, we could increment a column:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L95-L100)

```rust
use posts::dsl::*;

diesel::update(posts).set(visit_count.eq(visit_count + 1))
```

:::

That would generate this SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L102-L111)

```sql
UPDATE `posts`
SET `visit_count` = `posts`.`visit_count` + 1
```

:::

Assigning values directly is great for small, simple changes.
If we wanted to update multiple columns this way, we can pass a tuple.


::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L118-L127)

```rust
use posts::dsl::*;

diesel::update(posts)
  .set((
      title.eq("[REDACTED]"),
      body.eq("This post has been classified"),
  ))
```

:::

This will generate exactly the SQL you'd expect:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L129-L142)

```sql
UPDATE `posts` SET `title` = ?, `body` = ?
```

:::

## AsChangeset

While it's nice to have the ability to update columns directly like this,
it can quickly get cumbersome when dealing with forms that have more than a handful of fields.
If we look at the signature of [`.set`], you'll notice that the constraint is for a trait called
[`AsChangeset`]. This is another trait that `diesel` can derive for us. We can add
`#[derive(AsChangeset)]` to our `Post` struct, which will let us pass a `&Post` to `set`.

[`.set`]: https://docs.diesel.rs/diesel/query_builder/struct.IncompleteUpdateStatement.html#method.set
[`AsChangeset`]: https://docs.diesel.rs/diesel/query_builder/trait.AsChangeset.html

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L144-L146)

```rust
diesel::update(posts::table).set(&post)
```

:::

The SQL will set every field present on the `Post` struct except for the primary key.

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L148-L179)

```sql
UPDATE `posts` SET
    `title` = ?,
    `body` = ?,
    `draft` = ?,
    `publish_at` = ?,
    `visit_count` = ?
```

:::

Changing the primary key of an existing row is almost never something that you want to do,
so `#[derive(AsChangeset)]` assumes that you want to ignore it. The only way to change
the primary key is to explicitly do it with `.set(id.eq(new_id))`. However,
note that `#[derive(AsChangeset)]` doesn't have the information from your table definition.
If the primary key is something other than `id`, you'll need to put
`#[primary_key(your_primary_key)]` on the struct as well.

If the struct has any optional fields on it, these will also have special behavior.
By default, `#[derive(AsChangeset)]` will assume that `None` means that you don't wish
to assign that field. For example, if we had the following code:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L181-L195)

```rust
#[derive(AsChangeset)]
#[table_name="posts"]
struct PostForm<'a> {
    title: Option<&'a str>,
    body: Option<&'a str>,
}

diesel::update(posts::table)
    .set(&PostForm {
        title: None,
        body: Some("My new post"),
    })
```

:::

That would generate the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs#L197-L216)

```sql
UPDATE `posts` SET `body` = ?
```

:::

If you wanted to assign `NULL` instead, you can either specify `#[changeset_options(treat_none_as_null="true")]` on the struct, or you can have the field be of type `Option<Option<T>>`. Diesel doesn't currently provide a way to explicitly assign a field to its default value, though it may be provided in the future.

If you are using PostgreSQL, all of these options will work with `INSERT ON CONFLICT DO UPDATE`
as well. See the [upsert docs] for more details.

[upsert docs]: https://docs.diesel.rs/diesel/pg/upsert/index.html

## Executing your query

Once you've constructed your query, we need to actually execute it.
There are several different methods to do this, depending on what type you'd like back.

The simplest method for running your query is [`execute`]. This method will run your query,
and return the number of rows that were affected. This is the method you should use
if you simply want to ensure that the query executed successfully,
and don't care about getting anything back from the database.

[`execute`]: https://docs.diesel.rs/diesel/query_dsl/trait.RunQueryDsl.html#tymethod.execute

For queries where you do want to get data back from the database,
we need to use [`get_result`] or [`get_results`]. If you haven't explicitly called [`returning`],
these methods will return all of the columns on the table. Similar to [`load`] on a select statement,
you will need to specify the type you'd like to deserialize to (either a tuple or a struct with
`#[derive(Queryable)]`). You should use [`get_results`] when you are expecting more than one record back.
If you are only expecting a single record, you can call [`get_result`] instead.

It should be noted that receiving 0 rows from [`get_result`] is considered an error condition by default.
If you want to get back 0 or 1 row (e.g. have a return type of `QueryResult<Option<T>>`),
then you will need to call `.get_result(...).optional()`.

[`get_result`]: https://docs.diesel.rs/diesel/query_dsl/trait.RunQueryDsl.html#method.get_result
[`get_results`]: https://docs.diesel.rs/diesel/query_dsl/trait.RunQueryDsl.html#method.get_results
[`returning`]: https://docs.diesel.rs/diesel/query_builder/update_statement/struct.UpdateStatement.html#method.returning
[`load`]: https://docs.diesel.rs/diesel/query_dsl/trait.RunQueryDsl.html#method.load

Finally, if your struct has both `#[derive(AsChangeset)]` and `#[derive(Identifiable)]`,
you will be able to use the [`save_changes`] method. Unlike the other methods mentioned in this guide,
you do not explicitly build a query when using [`save_changes`].
Doing `foo.save_changes(&conn)` is equivalent to doing `diesel::update(&foo).set(&foo).get_result(&conn)`.
Like [`get_result`] and [`get_results`], you will need to specify the type you'd like to get back.

[`save_changes`]: https://docs.diesel.rs/diesel/query_dsl/trait.SaveChangesDsl.html#method.save_changes

All of the code for this guide can be found in executable form in [this Diesel example].

[this Diesel example]: https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_updates/src/lib.rs

:::
:::
:::
