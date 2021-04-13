---
title: "Configuring Diesel CLI"
lang: en-US
---

::: demo
::: content-wrapper
::: guide-wrapper

Diesel CLI is an optional tool Diesel provides to manage your
database schema. Its main two roles are to run database
migrations, and to create a Rust file which represents your
database schema.

The behavior of Diesel CLI can be configured through a toml file. By
default Diesel will look for `diesel.toml` in the same directory as
your `Cargo.toml` file. You can provide a different config file by
setting the `DIESEL_CONFIG_FILE` environment variable, or passing
`--config-file` on the command line. You can get a basic config file
with some defaults provided by running `diesel setup`.

As of Diesel 1.3, the file contains a single section,
`[print_schema]`. All fields in this file are optional.

## The `file` field

This field specifies the file where you want the Rust representation
of your schema to live. When this field is present, commands which
modify database schema (such as `diesel migration run`) will
automatically run `diesel print-schema`, and output its results to
this file.

This means that you can modify your database schema without having to
worry about running a separate command to update your Rust code. It is
highly recommended that you use this field, to ensure that the Rust
representation of your database schema is always in sync with what is
actually in your database. Typically this is set to `src/schema.rs`.

Unlike other fields, this doesn't actually modify the behavior of
`diesel print-schema`. `diesel print-schema` will always output your
schema to stdout, regardless of whether this field is present or not.

## The `with_docs` field

When this field is set to `true`, `diesel print-schema` will act as
though the `--with-docs` flag was passed by default. This places a doc
comment on all tables and columns.

## The `filter` field

This field specifies which tables should be output by `diesel
print-schema`. It corresponds to the `--only-tables` and
`--except-tables` on the command line. Its value should be a map with
one of those two keys. For example:

::: code-block

[diesel.toml]()

```toml
[print_schema]
# This will cause only the users and posts tables to be output
filter = { only_tables = ["users", "posts"] }

# This will cause all tables *except* the comments table to be
# output
filter = { except_tables = ["comments"] }
```

:::

## The `schema` field

Specifies which schema to use when searching for tables. When set,
`diesel print-schema` will always behave as though `--schema` were
passed. This field only affects PostgreSQL. If no value is provided,
the `public` schema will be searched.

## The `import_types` field

This field adds `use` statements to the top of every `table!`
declaration. When set, `diesel print-schema` will behave as if
`--import-types` were passed. When no value is given, only types from
`diesel::sql_types` will be imported.

::: code-block

[diesel.toml]()

```toml
[print_schema]
# Add types from `diesel_full_text_search` like `tsvector`
import_types = ["diesel::sql_types::*", "diesel_full_text_search::types::*"]
```

:::

## The `patch_file` field

Specifies a `.patch` file to be applied to your schema after it is
generated. Corresponds to the `--patch-file` option on the command
line. This option requires `patch` from diffutils to be installed on
your system.

We can't provide an option for every possible customization to this
file that you might want to make. This serves as a general purpose
catch-all for schema customizations.

The file should be a unified diff, which you can generate with `diff`
or `git diff`. It's highly recommended that you provide more than 3
context lines, especially if you have set `import_types`.

You can easily generate this file by making the changes you want to
`schema.rs`, and then running `git diff -U6 > src/schema.patch`.

:::
:::
:::
