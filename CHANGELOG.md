# Changelog

## 5.0.9

- Fix router crash in sandboxed iframes (e.g. Google Sites) by catching `history.replaceState` errors. Hash-based navigation continues to work; scroll state persistence is silently skipped in sandboxed environments.

## 5.0.8 and earlier

- See [git history](https://github.com/bmlt-enabled/svelte-spa-router/commits/main) for previous changes.
