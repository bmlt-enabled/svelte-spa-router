# Documentation site

This folder contains the documentation for [`@bmlt-enabled/svelte-spa-router`](https://github.com/bmlt-enabled/svelte-spa-router), built with [Docusaurus](https://docusaurus.io/) and branded with the BMLT coral palette. It is deployed to Cloudflare Pages.

## Local development

```bash
cd docs
npm install
npm start
```

This starts a local dev server at http://localhost:3000 with hot reload.

## Build

```bash
npm run build      # outputs static site to ./build
npm run serve      # serve the built site locally
```

## Structure

- `docs/` — Markdown content (docs-only mode; served at the site root)
- `docs/advanced/` — advanced-usage pages
- `sidebars.js` — sidebar order and grouping
- `docusaurus.config.js` — site config, navbar, footer
- `src/css/custom.css` — BMLT coral theme (primary `#ef562f`)
- `static/img/` — logo, favicon, social card

## Deployment (Cloudflare Pages)

The site is provisioned via the [`bmlt-enabled/cloudflare-pages`](https://github.com/bmlt-enabled/cloudflare-pages) Terraform config. The Pages project builds this repo with:

- **Root directory:** `docs`
- **Build command:** `npm run build`
- **Build output directory:** `build`
