# Diesel.rs ORM Website

## Local Setup

```
$ git clone https://github.com/sgrif/diesel.rs-website.git
$ cd diesel.rs-website
$ hugo server
```

## Project Structure

```
├── hugo.yaml
├── content
│   └── en
│       ├── guides
│       ├── api-documentation
│       ├── news
│       └── pages
├── data
│   └── en
│       ├── guides
│       │   └── sidebar.yml
│       ├── api-documentation
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

> [!NOTE] A note on deployment
> The master branch will automatically deploy via GitHub Pages.


## Contributing
Refer [CONTRIBUTING.md](CONTRIBUTING.md).