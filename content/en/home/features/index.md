---
headless: true

title: See it in action
description: Compare how Diesel transforms complex SQL into readable, safe Rust code.
---

{{< accordion-vertical-tabs label="Select feature" count="7" tabHeight="3.75rem">}}
{{< tab label="Simple Queries" >}}

Simple queries are a complete breeze. Loading all users from a database:

```rust {title="Rust"}
users::table.load(&mut connection)
```

```sql {title="Executed SQL"}
SELECT * FROM users;
```

Loading all the posts for a user:

```rust {title="Rust"}
Post::belonging_to(user).load(&mut connection)
```

```sql {title="Executed SQL"}
SELECT * FROM posts WHERE user_id = 1;
```

{{< /tab >}}
{{< tab label="Complex Queries" >}}

Diesel's powerful query builder helps you construct queries as simple or complex as you need, at zero cost.

```rust {title="Rust"}
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

```sql {title="Executed SQL"}
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

{{< /tab >}}
{{< tab label="Less Boilerplate" >}}

Diesel codegen generates boilerplate for you. It lets you focus on your business logic, not mapping to and from SQL rows.

With Diesel:

```rust {title="Rust"}
#[derive(Queryable)]
pub struct Download {
    id: i32,
    version_id: i32,
    downloads: i32,
    counted: i32,
    date: SystemTime,
}
```

Without Diesel:

```rust {title="Rust"}
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

{{< /tab >}}
{{< tab label="Inserting Data" >}}

It's not just about reading data. Diesel makes it easy to use structs for new records.

```rust {title="Rust"}
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

```sql {title="Executed SQL"}
INSERT INTO users (name, hair_color) VALUES
  ('Sean', 'Black'),
  ('Gordon', DEFAULT)
```

{{< /tab >}}
{{< tab label="Updating Data" >}}

Diesel's codegen can generate several ways to update a row, letting you encapsulate your logic in the way that makes sense for your app.

Modifying a struct:

```rust {title="Rust"}
post.published = true;
post.save_changes(&mut connection);
```

One-off batch changes:

```rust {title="Rust"}
update(users.filter(email.like("%@spammer.com")))
    .set(banned.eq(true))
    .execute(&mut connection)
```

Using a struct for encapsulation:

```rust {title="Rust"}
update(Settings::belonging_to(current_user))
    .set(&settings_form)
    .execute(&mut connection)
```

{{< /tab >}}
{{< tab label="Ergonomic Multidatabase support" >}}

Diesel allows to ergonomically abstract over different database backends while keeping all of it's compile time guarantees.

```rust {title="Rust"}
#[derive(diesel::MultiConnection)]
enum DatabaseConnection {
    Sqlite(diesel::SqliteConnection),
    Postgres(diesel::PgConnection),
}

let mut connection = DatabaseConnection::establish("postgres://localhost/diesel")?;

let all_users = users::table.load::<User>(connection)?;

match connection {
    DatabaseConnection::Sqlite(connection) => {
        perform_sqlite_specific_query(connection)?;
    }
    DatabaseConnection::Postgres(connection) => {
        perform_postgres_specific_query(connection)?;
    }
}
```

{{< /tab >}}
{{< tab label="Ergonomic Raw SQL" >}}

There will always be certain queries that are just easier to write as raw SQL, or can't be expressed with the query builder. Even in these cases, Diesel provides an easy to use API for writing raw SQL.

```rust {title="Rust"}
#[derive(QueryableByName)]
#[diesel(table_name = users)]
struct User {
    id: i32,
    name: String,
    organization_id: i32,
}

sql_query(include_str!("complex_users_by_organization.sql"))
    .bind::<Integer, _>(organization_id)
    .bind::<BigInt, _>(offset)
    .bind::<BigInt, _>(limit)
    .load::<User>(&mut conn)?;
```

{{< /tab >}}
{{< /accordion-vertical-tabs >}}
