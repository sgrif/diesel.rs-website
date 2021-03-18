# Diesel

> Find a mistake on this website? Submit an issue or send a pull request [here](https://github.com/sgrif/diesel.rs-website)!

Diesel is a Safe, Extensible ORM and Query Builder for [Rust](https://www.rust-lang.org).
Diesel is the most productive way to interact with databases in Rust
because of its safe and composable abstractions over queries.

## Why did we make Diesel?

### Preventing Runtime Errors

We don't want to waste time tracking down runtime errors. We achieve this
by having Diesel eliminate the possibility of incorrect database interactions at compile time.

### Built for Performance

Diesel offers a high level query builder and lets you think about your problems in Rust, not SQL.
Our focus on zero-cost abstractions allows Diesel to run your query and load your data even faster than C.

### Productive and Extensible

Unlike Active Record and other ORMs, Diesel is designed to be abstracted over.
Diesel enables you to write reusable code and think in terms of your problem domain and not SQL.

## Examples

### Simple queries

Simple queries are a complete breeze. Loading all users from a database:

Rust code:

```rust
users::table.load(&connection);
```

Executed SQL:

```sql
SELECT * FROM users;
```

Loading all the posts for a user:

Rust code:

```rust
Post::belonging_to(user).load(&connection);
```

Executed SQL:

```sql
SELECT * FROM posts WHERE user_id = 1;
```

### Complex queries

Diesel's powerful query builder helps you construct queries as simple or complex
as you need, at 0 cost.

Rust code:

```rust
let versions = Version::belonging_to(krate)
    .select(id)
    .order(num.desc())
    .limit(5);
let downloads = version_downloads
    .filter(date.gt(now - 90.days()))
    .filter(version_id.eq(any(versions)))
    .order(date)
    .load::<Download>(&conn)?;
```

Executed SQL:

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

### Less Boilerplate

Diesel codegen generates boilerplate for you. It lets you focus on your business logic,
not mapping to and from SQL rows.

That means you can write this:

With Diesel:

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

Instead of this:

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

### Inserting Data

It's not just about reading data. Diesel makes it easy to use structs for new records.

Rust code:

```rust
#[derive(Insertable)]
#[table_name="users"]
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
    .execute(&connection);
```

Executed SQL:

```sql
INSERT INTO users (name, hair_color) VALUES
  ('Sean', 'Black'),
  ('Gordon', DEFAULT)
```

If you need data from the rows you inserted, just change execute to `get_result` or `get_results`.
Diesel will take care of the rest.

Rust code:

```rust
let new_users = vec![
    NewUser { name: "Sean", hair_color: Some("Black") },
    NewUser { name: "Gordon", hair_color: None },
];

let inserted_users = insert_into(users)
    .values(&new_users)
    .get_results::<User>(&connection);
```

Executed SQL:

```sql
INSERT INTO users (name, hair_color) VALUES
  ('Sean', 'Black'),
  ('Gordon', DEFAULT)
  RETURNING *
```

### Updating Data

Diesel's codegen can generate several ways to update a row,
letting you encapsulate your logic in the way that makes sense for your app.

Modifying a struct:

```rust
post.published = true;
post.save_changes(&connection);
```

One-off batch changes:

```rust
update(users.filter(email.like("%@spammer.com")))
    .set(banned.eq(true))
    .execute(&connection);
```

Using a struct for encapsulation:

```rust
update(Settings::belonging_to(current_user))
    .set(&settings_form)
    .execute(&connection);
```

### Ergonomic Raw SQL

There will always be certain queries that are just easier to write as raw SQL,
or can't be expressed with the query builder. Even in these cases, Diesel provides
an easy to use API for writing raw SQL.

Running raw SQL:

```rust
#[derive(QueryableByName)]
#[table_name = "users"]
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
    .load::<User>(conn)?;
```
