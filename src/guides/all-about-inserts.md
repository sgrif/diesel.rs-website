---
lang: "en-US"
title: "All About Inserts"
---

::: demo
::: content-wrapper
::: guide-wrapper

Most applications fall into a category called "CRUD" apps.
CRUD stands for "Create, Read, Update, Delete".
Diesel provides support for all four pieces,
but in this guide we're going to look at
the different ways to go about creating `INSERT` statements.

The examples for this guide are going to be shown for PostgreSQL,
but you can follow along with any backend.
The full code examples for all backends are linked at the bottom of this guide.

An insert statement always starts with [`insert_into`].
The first argument to this function is the table you're inserting into.

[`insert_into`]: https://docs.diesel.rs/diesel/fn.insert_into.html

For this guide, our schema will look like this:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L16-L26
)

```rust
table! {
    users {
        id -> Integer,
        name -> Text,
        hair_color -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}
```

:::

Since our functions are going to only operate on the `users` table,
we can put `use schema::users::dsl::*;` at the top of our function,
which will let us write `insert_into(users)` instead of
`insert_into(users::table)`.
If you're importing `table::dsl::*`,
make sure it's always inside a function, not the top of your module.

If all of the columns on a table have a default,
the simplest thing we can do is call [`.default_values`].
We could write a function that ran that query like this:

[`.default_values`]: https://docs.diesel.rs/diesel/query_builder/insert_statement/struct.IncompleteInsertStatement.html#method.default_values

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L47-L49)

```rust
use schema::users::dsl::*;

insert_into(users).default_values().execute(conn)
```

:::

It's worth noting that this code will still compile,
even if you don't have default values on all of your columns.
Diesel will ensure that the value you're assigning has the right type,
but it can't validate whether the column has a default,
any constraints that could fail,
or any triggers that could fire.

We can use [`debug_query`] to inspect the generated SQL.
The exact SQL that is generated may differ depending on the backend you're using.
If we run `println!("{}", debug_query::<Pg, _>(&our_query));`,
we'll see the following:

[`debug_query`]: https://docs.diesel.rs/diesel/fn.debug_query.html

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L57)


```sql
INSERT INTO "users" DEFAULT VALUES -- binds: []
```

:::

If we want to actually provide values, we can call [`.values`] instead.
There are a lot of different arguments we can provide here.
The simplest is a single column/value pair using [`.eq`].

[`.values`]: https://docs.diesel.rs/diesel/query_builder/insert_statement/struct.IncompleteInsertStatement.html#method.values
[`.eq`]: https://docs.diesel.rs/diesel/expression_methods/trait.ExpressionMethods.html#method.eq

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L62-L64
)

```rust
use schema::users::dsl::*;

insert_into(users).values(name.eq("Sean")).execute(conn)
```

:::

This will generate the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L72-L73)

```sql
INSERT INTO "users" ("name") VALUES ($1)
-- binds ["Sean"]
```

:::

If we want to provide values for more than one column, we can pass a tuple.

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L80-L82)

```rust
insert_into(users)
    .values((name.eq("Tess"), hair_color.eq("Brown")))
    .execute(conn)
```

:::

This will generate the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L90-L91)

```sql
INSERT INTO "users" ("name", "hair_color")
VALUES ($1, $2) -- binds: ["Tess", "Brown"]
```

:::

## Insertable

Working with tuples is the typical way to do an insert
if you just have some values that you want to stick in the database.
But what if your data is coming from another source,
like a web form deserialized by Serde?
It'd be annoying to have to write
`(name.eq(user.name), hair_color.eq(user.hair_color))`.

Diesel provides the [`Insertable`] trait for this case.
`Insertable` maps your struct to columns in the database.
We can derive this automatically by adding `#[derive(Insertable)]` to our type.

[`Insertable`]: https://docs.diesel.rs/diesel/prelude/trait.Insertable.html

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L30-L35)

```rust
use schema::users;

#[derive(Deserialize, Insertable)]
#[table_name = "users"]
pub struct UserForm<'a> {
    name: &'a str,
    hair_color: Option<&'a str>,
}
```

:::

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L98-L103)

```rust
use schema::users::dsl::*;

let json = r#"{ "name": "Sean", "hair_color": "Black" }"#;
let user_form = serde_json::from_str::<UserForm>(json)?;

insert_into(users).values(&user_form).execute(conn)?;

Ok(())
```

:::

This will generate the same SQL as if we had used a tuple.

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L113-L114)

```sql
INSERT INTO "users" ("name", "hair_color")
VALUES ($1, $2) -- binds: ["Sean", "Black"]
```

:::

If one of the fields is `None`, the default value will be inserted for that field.

::: code-block
[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L119-L126)

```rust
use schema::users::dsl::*;

let json = r#"{ "name": "Ruby", "hair_color": null }"#;
let user_form = serde_json::from_str::<UserForm>(json)?;

insert_into(users).values(&user_form).execute(conn)?;

Ok(())
```

:::

That will generate the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L136-L137)

```sql
INSERT INTO "users" ("name", "hair_color")
VALUES ($1, DEFAULT) -- binds: ["Ruby"]
```

:::

## Batch Insert

If we want to insert more than one row at a time,
we can do that by passing a `&Vec` or slice of any of the forms used above.
Keep in mind that you're always passing a reference here.

On backends that support the `DEFAULT` keyword (all backends except SQLite),
the data will be inserted in a single query.
On SQLite, one query will be performed per row.

For example, if we wanted to insert two rows with a single value,
we can just use a `Vec`.

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L142-L146)

```rust
use schema::users::dsl::*;

insert_into(users)
    .values(&vec![name.eq("Sean"), name.eq("Tess")])
    .execute(conn)
```
:::

Which generates the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L155-L156)

```sql
INSERT INTO "users" ("name") VALUES ($1), ($2)
-- binds ["Sean", "Tess"]
```

:::

Note that on SQLite, you won't be able to use `debug_query` for this,
since it doesn't map to a single query. You can inspect each row like this:

::: code-block

[src/lib.rs]()

```rust
for row in &values {
    let query = insert_into(users).values(row);
    println!("{}", debug_query::<Sqlite, _>(&query));
}
```

:::

If we wanted to use `DEFAULT` for some of our rows, we can use an option here.


::: code-block 

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L161-L165)

```rust
use schema::users::dsl::*;

insert_into(users)
    .values(&vec![Some(name.eq("Sean")), None])
    .execute(conn)
```

:::

Note that the type here is `Option<Eq<Column, Value>>` not `Eq<Column, Option<Value>>`.
Doing `column.eq(None)` would insert `NULL` not `DEFAULT`.
This generates the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L174-L175)

```sql
INSERT INTO "users" ("name") VALUES ($1), (DEFAULT)
-- binds ["Sean"]
```

:::

We can do the same thing with tuples.

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L180-L187)

```rust
use schema::users::dsl::*;

insert_into(users)
    .values(&vec![
        (name.eq("Sean"), hair_color.eq("Black")),
        (name.eq("Tess"), hair_color.eq("Brown")),
    ])
    .execute(conn)
```

:::

Which generates the following SQL:


::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L199-L201)

```sql
INSERT INTO "users" ("name", "hair_color")
VALUES ($1, $2), ($3, $4)
-- binds: ["Sean", "Black", "Tess", "Brown"]
```

:::

Once again, we can use an `Option` for any of the fields to insert `DEFAULT`.

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L206-L213)

```rust
use schema::users::dsl::*;

insert_into(users)
    .values(&vec![
        (name.eq("Sean"), Some(hair_color.eq("Black"))),
        (name.eq("Ruby"), None),
    ])
    .execute(conn)
```

:::

Which generates the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L225-L227)

```sql
INSERT INTO "users" ("name", "hair_color")
VALUES ($1, $2), ($3, DEFAULT)
-- binds: ["Sean", "Black", "Ruby"]
```

:::

Finally, `Insertable` structs can be used for batch insert as well.

::: code-block 

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L232-L242)

```rust
use schema::users::dsl::*;

let json = r#"[
    { "name": "Sean", "hair_color": "Black" },
    { "name": "Tess", "hair_color": "Brown" }
]"#;
let user_form = serde_json::from_str::<Vec<UserForm>>(json)?;

insert_into(users).values(&user_form).execute(conn)?;

Ok(())
```

:::

This generates the same SQL as if we had used a tuple:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L225-L227)

```sql
INSERT INTO "users" ("name", "hair_color")
VALUES ($1, $2), ($3, $4)
-- binds: ["Sean", "Black", "Tess", "Brown"]
```

:::

## The `RETURNING` Clause

On backends that support the `RETURNING` clause (such as PostgreSQL),
we can get data back from our insert as well.
MySQL and SQLite do not support `RETURNING` clauses.
To get back all of the inserted rows,
we can call [`.get_results`] instead of [`.execute`].

[`.get_results`]: https://docs.diesel.rs/diesel/query_dsl/trait.RunQueryDsl.html#method.get_results
[`.execute`]: https://docs.diesel.rs/diesel/query_dsl/trait.RunQueryDsl.html#method.execute

Given this struct:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L37-L44)

```rust
#[derive(Queryable, PartialEq, Debug)]
struct User {
    id: i32,
    name: String,
    hair_color: Option<String>,
    created_at: SystemTime,
    updated_at: SystemTime,
}
```

:::

We can use `get_results` with this test:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L265-L295)

```rust
use diesel::select;
use schema::users::dsl::*;

let now = select(diesel::dsl::now).get_result::<SystemTime>(&conn)?;

let inserted_users = insert_into(users)
    .values(&vec![
        (id.eq(1), name.eq("Sean")),
        (id.eq(2), name.eq("Tess")),
    ])
    .get_results(&conn)?;

let expected_users = vec![
    User {
        id: 1,
        name: "Sean".into(),
        hair_color: None,
        created_at: now,
        updated_at: now,
    },
    User {
        id: 2,
        name: "Tess".into(),
        hair_color: None,
        created_at: now,
        updated_at: now,
    },
];
assert_eq!(expected_users, inserted_users);
```

:::

To inspect the SQL generated by `.get_results` or `.get_result`,
we will need to call `.as_query` before passing it to `debug_query`.
The query in the last test generates the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L306-L309)

```sql
INSERT INTO "users" ("id", "name")
VALUES ($1, $2), ($3, $4)
RETURNING "users"."id", "users"."name", "users"."hair_color",
          "users"."created_at", "users"."updated_at"
-- binds: [1, "Sean", 2, "Tess"]
```

:::

You'll notice that we've never given an explicit value for `created_at` and
`updated_at` in any of our examples.
With Diesel, you typically won't set those values in Rust.
Typically these columns get set with `DEFAULT CURRENT_TIMESTAMP`,
and a trigger is used to change `updated_at` on updates.
If you're using PostgreSQL, you can use a built-in trigger
by running `SELECT diesel_manage_updated_at('users');` in a migration.

If we expect one row instead of multiple, we can call `.get_result` instead of
`.get_results`.

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L317-L335)

```rust
use diesel::select;
use schema::users::dsl::*;

let now = select(diesel::dsl::now).get_result::<SystemTime>(&conn)?;

let inserted_user = insert_into(users)
    .values((id.eq(3), name.eq("Ruby")))
    .get_result(&conn)?;

let expected_user = User {
    id: 3,
    name: "Ruby".into(),
    hair_color: None,
    created_at: now,
    updated_at: now,
};
assert_eq!(expected_user, inserted_user);
```

:::

This generates the same SQL as `get_results`:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L347-L350)

```sql
INSERT INTO "users" ("id", "name") VALUES ($1, $2)
RETURNING "users"."id", "users"."name", "users"."hair_color",
          "users"."created_at", "users"."updated_at"
-- binds: [3, "Ruby"]
```

:::

Finally, if we only want a single column back, we can call `.returning()` explicitly.
This code would return the inserted ID:

::: code-block

[src/lib.rs]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L355-L360)

```rust
use schema::users::dsl::*;

insert_into(users)
    .values(name.eq("Ruby"))
    .returning(id)
    .get_result(conn)
```

:::

Which generates the following SQL:

::: code-block

[Generated SQL]( https://github.com/diesel-rs/diesel/blob/v1.4.4/examples/postgres/all_about_inserts/src/lib.rs#L368-L370)

```sql
INSERT INTO "users" ("name") VALUES ($1)
RETURNING "users"."id"
-- binds: ["Ruby"]
```

:::

## "Upsert"

Every type of insert statement covered in this guide can also be used for
"insert or update" queries, also known as "upsert".
The specifics of upsert are covered extensively in the API documentation.

For PostgreSQL, see the [`pg::upsert`] module.
For MySQL and SQLite, upsert is done via `REPLACE`.
See [`replace_into`] for details.

Diesel does not have support for MySQL's `ON DUPLICATE KEY` conflict,
as its results are non-deterministic, and unsafe with replication.

[`pg::upsert`]: https://docs.diesel.rs/diesel/pg/upsert/index.html
[`replace_into`]: https://docs.diesel.rs/diesel/fn.replace_into.html

## Conclusion

While there are a lot of examples in this guide,
ultimately the only difference between various kinds of insert statements
is the argument passed to `.values`.

All examples in this guide are run as part of Diesel's test suite.
You can find the full code examples for each backend at these links:

- [PostgreSQL]
- [MySQL]
- [SQLite]

[PostgreSQL]: https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/postgres/all_about_inserts
[MySQL]: https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/mysql/all_about_inserts
[SQLite]: https://github.com/diesel-rs/diesel/tree/v1.4.4/examples/sqlite/all_about_inserts


:::
:::
:::
