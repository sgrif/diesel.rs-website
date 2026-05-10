# Diesel.rs ORM Website

## Local Setup

```
$ git clone https://github.com/sgrif/diesel.rs-website.git
$ cd diesel.rs-website
$ hugo build
$ pagefind --site public
$ hugo server
```

## Production Build

```
$ hugo build --minify
$ pagefind --site public
```

## Project Structure

```
├── hugo.yaml
├── content
│   └── en
│       ├── guides
│       ├── changelog
│       ├── news
│       └── pages
├── data
│   └── en
│       ├── guides
│       │   └── sidebar.yml
│       ├── changelog
│       │   └── sidebar.yml
│       └── news
│           └── sidebar.yml
├── layouts
├── assets
│   ├── css
│   └── js
└── static
    ├── images
    └── site.webmanifest
```
