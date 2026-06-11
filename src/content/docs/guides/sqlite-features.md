---
title: "SQLite-specific features"
description: "Hardening and tuning a SqliteConnection with Diesel's SQLite-only methods for sqlite3_db_config, resource limits, custom SQL functions, and auto-extensions."
lang: en-US
---

Diesel exposes a number of SQLite-only methods directly on
[`SqliteConnection`](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html).
They let you harden a connection against untrusted database files, tune SQLite's
built-in resource limits, register custom SQL functions with explicit behavior
flags, and apply configuration to every connection opened in your process. This
guide covers them together. Exact signatures live on the
[`SqliteConnection` API page](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteConnection.html)
and in the [`diesel::sqlite` module](https://docs.diesel.rs/main/diesel/sqlite/index.html).

## Connection hardening with sqlite3_db_config

SQLite exposes a family of per-connection switches through its
[`sqlite3_db_config()`](https://www.sqlite.org/c3ref/db_config.html) C API. Diesel
wraps the security-relevant ones as methods on `SqliteConnection`. The diagram
below groups them by what they protect against.

![Diesel SqliteConnection methods that wrap sqlite3_db_config, grouped by hardening concern](/images/sqlite_db_config.svg)

### set_defensive

This is the single most important hardening flag. Enabling defensive mode blocks
writes to shadow tables, rejects a set of dangerous PRAGMAs, and prevents unsafe
use of the deserialize interface. If you open database files you did not create,
turn this on first.

```rust
conn.set_defensive(true)?;
```

### set_trusted_schema

By default SQLite trusts the schema of the database it opens. Passing `false`
restricts the functions that schema objects (views, triggers, CHECK constraints,
DEFAULT expressions, generated columns, and expression indexes) are allowed to
call to those explicitly marked `INNOCUOUS`. See the function flags section below
for how to mark your own functions.

```rust
conn.set_trusted_schema(false)?;
```

### with_load_extension_enabled

Loading SQLite extensions is a powerful capability and is disabled by default.
Rather than leaving the `load_extension()` SQL function enabled for the lifetime
of the connection, Diesel offers a scoped helper. The function is enabled for the
duration of the closure and disabled again automatically when it returns, even on
error.

```rust
conn.with_load_extension_enabled(|conn| {
    diesel::sql_query("SELECT load_extension('my_extension')").execute(conn)
})?;
```

Note that this toggles the `load_extension()` SQL function only. It does not call
the `sqlite3_load_extension()` C API, which is a separate mechanism.

Extension loading may also be unavailable at the build level. If your SQLite
library was compiled with `SQLITE_OMIT_LOAD_EXTENSION`, the feature is omitted
entirely and enabling it at runtime has no effect. This is common in hardened or
minimal builds, so do not assume extension loading is available just because the
runtime switch exists.

### Double-quoted string literals

For historical compatibility SQLite accepts double-quoted strings as string
literals, which hides typos in identifiers and is a common source of bugs. You can
turn this misfeature off independently for DML and DDL statements, and query the
current state.

```rust
conn.set_double_quoted_strings_dml(false)?;
conn.set_double_quoted_strings_ddl(false)?;

assert!(!conn.are_double_quoted_strings_dml_enabled()?);
assert!(!conn.are_double_quoted_strings_ddl_enabled()?);
```

### Other db_config switches

The remaining switches follow the same pattern. Each takes a `bool` and returns a
`QueryResult<()>`.

- `set_fts3_tokenizer_enabled` controls the two-argument `fts3_tokenizer()`
  function, which can be a code-execution vector.
- `set_writable_schema` controls direct writes to `sqlite_schema`.
- `set_attach_create_enabled` and `set_attach_write_enabled` control whether
  `ATTACH` may create new files or attach writable databases.
- `set_triggers_enabled` and `set_views_enabled` enable or disable triggers and
  views entirely.
- `set_foreign_keys_enabled` toggles foreign key enforcement.

### Recommended recipe

For most applications that may touch untrusted data, the following is a good
baseline. Extension loading is already off by default, so enable it only when you
need it via `with_load_extension_enabled`.

```rust
conn.set_defensive(true)?;
conn.set_trusted_schema(false)?;
conn.set_recommended_security_limits();
```

## Resource limits

SQLite enforces a set of [run-time limits](https://www.sqlite.org/limits.html)
such as the maximum length of a string or BLOB, the maximum length of an SQL
statement, the number of columns in a table, and the depth of an expression tree.
Diesel exposes these through `set_limit` and `get_limit`, keyed by the
[`SqliteLimit`](https://docs.diesel.rs/main/diesel/sqlite/enum.SqliteLimit.html)
enum.

```rust
use diesel::sqlite::SqliteLimit;

let previous = conn.set_limit(SqliteLimit::SqlLength, 1_000_000);
let current = conn.get_limit(SqliteLimit::SqlLength);
```

`SqliteLimit` covers length, SQL statement length, column count, expression depth,
and several others. Rather than tuning each one by hand, you can call
`set_recommended_security_limits`, which applies conservative defaults across the
relevant limits in one call.

```rust
conn.set_recommended_security_limits();
```

## Custom SQL functions and behavior flags

When you define a custom SQL function with
[`#[declare_sql_function]`](https://docs.diesel.rs/main/diesel/expression/functions/attr.declare_sql_function.html),
Diesel generates a helper module named after the function with a `_utils` suffix.
That module contains the functions you use to register your implementation on a
connection.

- `register_impl` registers a deterministic implementation. It takes an `Fn`.
- `register_nondeterministic_impl` registers a non-deterministic implementation.
  It takes an `FnMut`, which is what you want for something like a random number
  generator.
- `register_impl_with_behavior` registers an implementation with explicit
  behavior flags. It takes the connection, a `SqliteFunctionBehavior` value, and
  the closure.

```rust
use diesel::expression::functions::declare_sql_function;
use diesel::sql_types::Integer;

#[declare_sql_function]
extern "SQL" {
    fn add_one(x: Integer) -> Integer;
}

// deterministic
add_one_utils::register_impl(conn, |x: i32| x + 1)?;
```

The behavior flags come from
[`SqliteFunctionBehavior`](https://docs.diesel.rs/main/diesel/sqlite/struct.SqliteFunctionBehavior.html),
which is a set of bitflags. The diagram below shows how they interact with the
trusted-schema setting described earlier.

![SqliteFunctionBehavior flags and how DIRECTONLY and INNOCUOUS interact with trusted schema](/images/sqlite_function_flags.svg)

- `DETERMINISTIC` declares that the function returns the same output for the same
  input within a single statement, which lets SQLite cache and hoist calls.
- `INNOCUOUS` declares that the function is safe to call from schema objects. Under
  `set_trusted_schema(false)` only `INNOCUOUS` functions may be called from views,
  triggers, and similar contexts. Only mark a function `INNOCUOUS` if it has no
  side effects and reveals no internal state.
- `DIRECTONLY` declares the opposite. The function may not be called from views,
  triggers, or other schema objects, only from top-level SQL you issue directly.
  Use this for functions with side effects or that expose application state.
- `SUBTYPE` declares that the function reads the subtype of one of its arguments.

```rust
use diesel::sqlite::SqliteFunctionBehavior;

add_one_utils::register_impl_with_behavior(
    conn,
    SqliteFunctionBehavior::DETERMINISTIC | SqliteFunctionBehavior::INNOCUOUS,
    |x: i32| x + 1,
)?;
```

### Aggregate functions

Aggregate functions are declared with the same attribute and a type that
implements
[`SqliteAggregateFunction`](https://docs.diesel.rs/main/diesel/sqlite/trait.SqliteAggregateFunction.html).
The generated `register_impl` takes only the connection (the implementation type is
supplied as a type parameter), and `register_impl_with_behavior` additionally takes
a `SqliteFunctionBehavior`.

```rust
my_aggregate_utils::register_impl::<MyAggregate, _>(conn)?;

my_aggregate_utils::register_impl_with_behavior::<MyAggregate, _>(
    conn,
    SqliteFunctionBehavior::DETERMINISTIC,
)?;
```

## Auto-extensions

Registering hardening settings or custom functions on every connection by hand is
error prone. SQLite's
[auto-extension](https://www.sqlite.org/c3ref/auto_extension.html) mechanism runs a
callback for every new connection opened in the process. Diesel exposes it through
three free functions in `diesel::sqlite`.

- `register_auto_extension` registers a callback that receives each new
  `SqliteConnection`.
- `cancel_auto_extension` removes a previously registered callback.
- `reset_auto_extension` removes all of them.

```rust
use diesel::sqlite::{register_auto_extension, SqliteConnection};
use diesel::QueryResult;

fn harden(conn: &mut SqliteConnection) -> QueryResult<()> {
    conn.set_defensive(true)?;
    conn.set_trusted_schema(false)?;
    conn.set_recommended_security_limits();
    Ok(())
}

register_auto_extension(harden)?;
```

With this in place the hardening recipe (or your custom function registrations)
runs automatically for every SQLite connection your process opens, including those
created by a connection pool, so you do not have to apply it at each call site.
