---
lang: "en-US"
title: "All About Selects"
css: ../assets/stylesheets/application.css
include-after: |
    <script src="../assets/javascripts/application.js"></script>
---

::: demo
::: content-wrapper
::: guide-wrapper

Most applications fall into a category called "CRUD" apps.
CRUD stands for "Create, Read, Update, Delete".
Diesel provides support for all four pieces,
but in this guide we're going to look at
the different ways to go about creating `SELECT` statements.

The examples for this guide are going to be shown for PostgreSQL,
but you can follow along with any backend.

This guide will cover how to construct `SELECT` statements using Diesel and 
it will also discuss how Diesel maps back query results to your Rust types.

For this guide, our schema will look like this:

::: code-block

[src/schema.rs]()

```rust
diesel::table! {
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

## Query Building

Diesel supports four ways of constructing `SELECT` queries:

* Call [`diesel::select`](https://docs.diesel.rs/2.3.x/diesel/fn.select.html) to construct a `SELECT` statement **without** `FROM` clause
* Call any method from the [`RunQueryDsl`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html) trait on a table type to directly execute a `SELECT * FROM table` statement.
* Call any method from the [`QueryDsl`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html) trait on a table type to construct a specific `SELECT` statement.
* Call [`HasQuery::query()`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.HasQuery.html#method.query) on a Rust type deriving the `HasQuery` trait

For this guide we mostly cover the third and fourth variant, as the first two variants are mostly useful for specific situations, while the other variants are the more general ones.

### `SELECT` Statements without `FROM` clause

Diesel allows to construct `SELECT` statements without `FROM` clauses via the [`diesel::select`](https://docs.diesel.rs/2.3.x/diesel/fn.select.html) function. This function can be used to construct simple queries.

For example you could query information about your PostgreSQL version via the following query:

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use diesel::expression::functions::declare_sql_function;

// Declare the `version()` SQL function
#[declare_sql_function]
extern "SQL" {
    fn version() -> Text;
}

let version_text = diesel::select(version()).get_result::<String>(connection)?;
println!("Running PostgreSQL: `{version_text}`");
```

:::

which is equivalent to the following SQL:

::: code-block

[query.sql]()
```SQL
SELECT version();
```

:::

This simple query already demonstrates several important aspects of constructing `SELECT` queries using Diesel:

1. Any query needs to end with a method from the [`RunQueryDsl`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html) trait to actually execute the query. The method decides how many results are returned. For this particular example we use the [`RunQueryDsl::get_result`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html#method.get_result) method as we already know that we only expect a single result.
2. Diesel performs a mapping from the SQL types returned by your query to compatible Rust types. This mapping needs to use compatible types on both sides. For this particular example we declared the `version()` function in such a way that it returns a [`Text`] value, which is compatible to Rust `String` values. See the [result mapping](#result-mapping) section of this guide for more details on this topic.

### `SELECT` statements via `RunQueryDsl`

The simplest way to construct a `SELECT` statement that loads data from a particular table is by calling any method from the [`RunQueryDsl`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html) trait on the corresponding table type. This always constructs simple `SELECT * FROM table` queries.

For example to load all data from a particular table you can use the following query:

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;
use chrono::NaiveDateTime;

// This returns a Vec<(i32, String, Option<String>, NaiveDateTime, NaiveDateTime)>
let all_users = users::table.load::<(i32, String, Option<String>, NaiveDateTime, NaiveDateTime)>(connection)?;

for user in all_users {
    println!("{}: {}", user.0, user.1); 
}
```

:::

which is equivalent to the following SQL query:

::: code-block

[query.sql]()

```SQL
SELECT id, name, hair_color, created_at, updated_at FROM users;
```

:::

By default Diesel will always select all columns listed in your [`table!`](https://docs.diesel.rs/2.3.x/diesel/macro.table.html) definition in the same order as listed there.

[`RunQueryDsl`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html) provides the following other methods:

* [`RunQueryDsl::load`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html#method.load) to load all data returned by the query into a `Vec`
* [`RunQueryDsl::get_results`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html#method.get_results) is equivalent to [`RunQueryDsl::load`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html#method.load) 
* [`RunQueryDsl::get_result`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html#method.get_result) just loads the first result returned by the query and drops any potential remaining result
* [`RunQueryDsl::first`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.RunQueryDsl.html#method.first) appends a `LIMIT 1` to your query and then loads the single result returned by your query.

Similarly to what we already discussed in the previous section Diesel expects that the Rust type used to store the query result in matches what is returned by the query. In this particular case the query returns multiple values for each row, so the Rust side uses a tuple to represent that. See the [Result Mapping](#result-mapping) section for different solutions and more details on this topic.

### `SELECT` statements via `QueryDsl`

To construct more complex `SELECT` statements you need to use the methods provided by the [`QueryDsl`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html) trait. Each of the methods provided by this trait corresponds to one specific clause in a `SELECT` statement. You can usually chain these methods as you like to construct arbitrary complex `SELECT` statements. If called more than once most methods will just replace the previous content for this particular part of the `SELECT` statement.

For example the following query selects all users with an hair color of `green` and orders them by the time of the last update of those data.

::: code-block

[srs/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;
use chrono::NaiveDateTime;

let users_with_green_hair = users::table.filter(users::hair_color.eq('green'))
    .order_by(users::updated_at.desc())
    .load::<(i32, String, Option<String>, NaiveDateTime, NaiveDateTime)>(connection)?;

for user in users_with_green_hair {
    println!("User {} has grean hair", user.1);
}
```

:::

This corresponds to the following SQL query:

::: code-block

[query.sql]()

```SQL
SELECT id, name, hair_color, created_at, updated_at FROM users
WHERE hair_color = $1
ORDER BY updated_at DESC;
```

:::

Diesel will always use bind values for to include user provided values in the generated query. This ensures that no user provided value can inject additional SQL in the generated query.

There are the following notable exceptions for methods that have requirements on the order you call them:

* [`QueryDsl::inner_join`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.inner_join) and [`QueryDsl::left_join`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.left_join) must be called before any column from the joined table is used in your query as otherwise Diesel doesn't know about them.
* [`QueryDsl::group_by`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.group_by) must be called before you call [`QueryDsl::select`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.select) as otherwise Diesel doesn't know which expressions are aggregated and which not.

Most methods of the [`QueryDsl`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html) trait like [`filter()`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.filter) or [`select()`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.select) accept SQL expressions. This enables you to construct various complex expressions via the different [`*ExpressionMethods`](https://docs.diesel.rs/2.3.x/diesel/expression_methods/index.html) traits provided by Diesel. Some of the traits and also the [`filter()`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.filter) function place additional constraints on the SQL side type of the expression. [`filter()`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.filter) always expects a boolean value, while for example any method of the [`TextExpressionMethods`](https://docs.diesel.rs/2.3.x/diesel/expression_methods/trait.TextExpressionMethods.html) trait expects you to call it on an expression of with a SQL side `TEXT` type.

For example the following constructs are valid expressions in Diesel:

* `users::name` represents a table column with the corresponding SQL side type
* `users::id.eq(42)` represents the expression `users.id = 42`
* `users::id.eq(users::age + users::age)` represents the expression `users.id = (users.age + users.age)`
* `42.into_sql::<Integer>().eq(users::id)` represents a comparision with the constant on the left side via the following SQL `$1 = users.id`
* `users::id.eq(users::id + 5).eq(false)` represents a chained expression including an arithmetic operation via the following SQL `(users.id = (users.id + 5)) = false`

Again you can mostly mix and match these function calls as wanted as long as you make sure your SQL side types line up correctly.

Using such [`QueryDsl::select`](https://docs.diesel.rs/2.3.x/diesel/prelude/trait.QueryDsl.html#method.select) allows you to customize the `SELECT` clause of your `SELECT` statement. For example the following query will use a `WINDOW` function as part of the select clause. Keep in mind that changing the `SELECT` clause of your query naturally changes what your query returns, which in turn affects the structure of your Rust side type.

::: code-block
[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;

let users = users::table.select((
    users::id,
    users::name,
    users::hair_color, 
    dsl::lag(users::id).partition_by(users::hair_color)
)).order_by(users::updated_at.asc())
  .load::<(i32, String, Option<String>, Option<i32>)(connection)?;

for user in users {
    println!("User {} has the hair color {:?}", user.1, user.2);
    if let Some(id) = users.3 {
        println!("The user with the {id} has the same hair color");
    }
}
```
:::

This is equivalent to the following SQL:

::: code-block

[query.sql]()

```SQL
SELECT id, name, hair_color, lag(id) OVER(PARTITION BY hair_color) FROM users ORDER BY updated_at ASC;
```

:::

### `SELECT` statements via `HasQuery::query()`

The [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) macro allows you to associate a particular query with your Rust side type. This ensures that query is always prepopulated with the correct select clause to match your Rust side data structure. 

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;

#[derive(HasQuery)]
#[diesel(table_name = users)]
struct User {
    name: String,
    hair_color: Option<String>,
    id: i32,
}

// This now returns a `Vec<User>`, which is automatically infered
// by using `User::query()` to construct your query
let users_with_green_hair = User::query()
    .filter(users::hair_color.eq("green"))
    .order_by(users::updated_at.desc())
    .load(conn)?;
```

:::

which is equivalent to the following SQL:

::: code-block

[query.sql]()

```SQL
SELECT name, hair_color, id FROM users WHERE hair_color = $1 ORDER BY updated_at DESC;
```
:::

By default the derive constructs a base query using the provided table including a `SELECT` clause matching the fields of your struct. These fields are mapped to the relevant table columns. 

The [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) derive macro also allows to customize both the field mapping and also the base query construction via attributes. The macro nevertheless will always apply a `SELECT` clause matching your struct definition to the provided base query, so make sure that the base query actually fits that `SELECT` clause.

To mirror the example from the previous section you would need to write code like this:

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;

#[derive(HasQuery)]
#[diesel(base_query = users::table.order_by(users::updated_at.asc()))]
struct CustomUser {
    id: i32,
    name: String,
    hair_color: Option<String>,
    #[diesel(select_expression = dsl::lag(users::id).partition_by(users::hair_color))]
    last_user_with_same_hair_color: Option<i32>,
}

let users = Users::query().load(connection)?;

for user in users {
    println!("User {} has the hair color {:?}", user.name, user.hair_color);
    if let Some(id) = users.last_user_with_same_hair_color {
        println!("The user with the {id} has the same hair color");
    }
}
```
:::

## Result Mapping

Diesel maps results of queries to Rust types. This is an important difference to the table based mapping performed by most ORM's. As result you usually end up with several Rust types belonging to the same table in your Diesel code base. At the same time a single Rust type can belong to several tables (e.g. via joins). This pattern gives you the necessary flexibility to both select only what you really need and also to evolve specific queries based on your needs and not what the table model expects you have.

As mentioned several times before Diesel performs checks at compile times to verify that the result returned by a particular query matches the Rust side data structure it is trying to load the result into. If there is a mismatch this will lead to a compilation error. Specifically Diesel checks that:

* The number of returned fields match
* The order of fields match in your query and in your Rust side type
* The SQL side type of each field is compatible with the Rust type at this position.

At the most basic level Diesel allows to map query results directly to basic Rust types. For queries returning only a single field you can directly use the field type like this:

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;

let ids: Vec<i32> = users::table.select(users::id).load::<i32>(connection)?;
```
:::

You can usually get a list of supported Rust types for a particular SQL side type by checking out the Diesel API documentation of that particular SQL type. This example uses the `users::id` column in your select type. This column is of the type `Integer` so you would need to check the documentation of [`diesel::sql_types::Integer`](https://docs.diesel.rs/2.3.x/diesel/sql_types/struct.Integer.html) to get a list of all compatible Rust side types.

For queries returning more than one field you can use tuples to represent the result type like this:

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;

let id_and_name: Vec<(i32, String)> = users::table.select((users::id, users::name)).load(connection)?;
```
:::

<aside class = "aside aside--note">
<header class = "aside__header">Single element tuple results:</header>

::: aside__text
Diesel also allows to return single element tuple results for queries only returning a single field by also using a single element tuple in your select clause like this: `users::table.select((users::id, )).load::<(i32,)>(connection)` 

Note that the `,` turns the parenthesized expression into a single element tuple.
:::

</aside>

It is also possible to nest tuples by applying the same nesting both in the SQL representation and the Rust representation:

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;
    
users::table.select((users::id, users::name, (users::id, users::name)))
    .load::<(i32, String, (i32, String))>(connection)?;
```
:::

This feature is particularly useful if you want to seperate values from different tables later on.
    
<aside class = "aside aside--note">
<header class = "aside__header">Maximal supported tuple sizes:</header>

::: aside__text
Due to limitations of the Rust Language Diesel only supports tuples up to a certain number of elements. If you use the default feature set this number will be 32, if you disable the default features this number decreases to 16. There are additional features (`64-column-tables` and `128-column-tables`) that increase the number of elements in a tuple to the number specified in the feature name. Note that a larger supported maximum size of tuples has impacts on the time required to compile Diesel and also to compile your code. So whenever possible choose a smaller size.
:::

</aside>


Mapping query results to tuples is a good idea if your query returns a small number of columns and you plan to destruct the returned result directly. Otherwise it's often a better idea to map query results to Rust structs. This gives you named fields, which in turn makes it harder to mix up the meaning of an particular field.

Diesel provides a [`#[derive(Queryable)`](https://docs.diesel.rs/2.3.x/diesel/deserialize/derive.Queryable.html) proc macro derive to easily map query results to a rust data type. The assumption of this derive is simple: It gets a tuple of values (as shown before) and maps each field of the tuple to the field of the struct in the order of the struct fields. So the first tuple field is mapped to the first struct field and so on.

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;
    
#[derive(Queryable)]
struct User {
    id: i32,
    name: String,
}

let users: Vec<User> = users::table.select((users::id, users::name)).load::<User>(connection)?;
```
:::

Diesel performs checks if the returned types match your struct and fail compilation if that's for any of the reasons listed before is not the case.  [`#[derive(Queryable)]`](https://docs.diesel.rs/2.3.x/diesel/deserialize/derive.Queryable.html) is the most low level way to map query results provided by Diesel to Rust data structures. It offers the largest level of control at the cost of the worst compilation errors if something goes wrong.

To improve this situation Diesel provides a [`#[derive(Selectable)]`](https://docs.diesel.rs/2.3.x/diesel/expression/derive.Selectable.html) proc macro derive. This derive allows to associate a `SELECT` clause with your Rust struct. It also provides a way to check on struct field level if each field is compatible with the corresponding SQL side type. You usually combine this derive with [`#[derive(Queryable)]`](https://docs.diesel.rs/2.3.x/diesel/deserialize/derive.Queryable.html) like this:

::: code-block

[src/lib.rs]()

```rust
use diesel::prelude::*;
use crate::schema::users;
    
#[derive(Queryable, Selectable)]
#[diesel(table_name = users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
struct User {
    id: i32,
    name: String,
}

let users: Vec<User> = users::table.select(User::as_select()).load(connection)?;
```
:::


By calling `.select(User::as_select())` you instruct Diesel to construct whatever `SELECT` clause matches your Rust side type. This locks in the query result type to be only `User` as long as you do not call `.select()` again. The `#[diesel(check_for_backend(diesel::pg::Pg))]` attribute generates additional optional code to improve error messages for the case of a field mismatch for the PostgreSQL backend. You can also pass several backends at once to this attribute by chaining them: `#[diesel(check_for_backend(diesel::pg::Pg, diesel::sqlite::Sqlite))]`. This will generate the necessary check code for all listed backends.

The [`#[derive(Selectable)]`](https://docs.diesel.rs/2.3.x/diesel/expression/derive.Selectable.html) macro allows to nest other types implementing `Selectable` via the `#[diesel(embed)]` attribute. It will construct a nested select clause as shown before for tuples.

The `#[diesel(select_expression = users::id.eq(42))]` attribute allows you to provide custom select expressions for specific fields. By default the derive interprets the field name as column name of the corresponding table. The [API Documentation](https://docs.diesel.rs/2.3.x/diesel/expression/trait.Selectable.html#examples) of the trait provides several examples for these attributes.

The [`#[derive(Seletable)]`](https://docs.diesel.rs/2.3.x/diesel/expression/derive.Selectable.html) marco still requires you to take care to manually apply the right select clause and line it up with [`#[derive(Queryable)]`](https://docs.diesel.rs/2.3.x/diesel/deserialize/derive.Queryable.html). The [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) macro presented before takes another step and essentially combines both derives into a single derive with some additional functionality added.
    
```rust
use diesel::prelude::*;
use crate::schema::users;
    
#[derive(HasQuery)]
#[diesel(table_name = users)]
struct User {
    id: i32,
    name: String,
}

let users: Vec<User> = User::query().load(connection)?;
```

Notable differences are to `#[derive(Selectable)]` and `#[derive(Queryable)]` are:

* [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) automatically performs the checks for improved error messages for all enabled backends
* [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) provides a `User::query()` method to easily construct the correct query
* [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) accepts a `#[diesel(base_query)]` attribute to associate a specific more complex base query with the particular struct. The default base query is just `users::table`, either based on the explicitly specified table name or based on the infered table name.

We recommend to use [`#[derive(HasQuery)]`](https://docs.diesel.rs/2.3.x/diesel/prelude/derive.HasQuery.html) in any place that is covered by what this derive provided and only fall back to [`#[derive(Queryable)]`](https://docs.diesel.rs/2.3.x/diesel/deserialize/derive.Queryable.html) and [`#[derive(Selectable)]`](https://docs.diesel.rs/2.3.x/diesel/expression/derive.Selectable.html) for more specific use cases.

:::
:::
:::
