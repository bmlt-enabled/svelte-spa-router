# Changelog

## 5.2.0 (April 30, 2026)

* **Type definition fixes** — fixed drift between `.d.ts` files and the JS/Svelte sources:
  * Removed obsolete deprecated Readable store exports (`loc`, `location`, `querystring`, `params`) from `Router.d.ts` — these no longer exist in `Router.svelte`; consumers should use the `router` object instead.
  * Added missing `restoreScroll` export to `Router.d.ts`.
  * Added missing `destroy` method to the `link` action's return type.
  * Fixed `WrappedComponent.component` type to `AsyncSvelteComponent` (it's a function, not a Component).
  * Added missing `inactiveClassName` field to the `ActiveOptions` JSDoc typedef in `active.svelte.js`.

## 5.1.1 (April 10, 2026)

* **`basePath` support for path-based routing** — new optional `basePath` parameter on `setHashMode()` and `basePath` prop on the Router component. When set, the router automatically strips the base path from incoming URLs and prepends it to outgoing ones (`push`, `replace`, `use:link`). App code works with clean paths like `/` and `/slug` without any prefix awareness. Fully backwards compatible — omitting `basePath` behaves exactly as before.

## 5.1.0 (April 10, 2026)

* **Path-based routing (History API)** — new `hashMode` prop and `setHashMode()` function to enable clean URLs without the `#` fragment. All APIs (`push`, `pop`, `replace`, `use:link`) work the same in both modes.

## 5.0.10

* Initial fork from [pjaudiomv/svelte-spa-router](https://github.com/pjaudiomv/svelte-spa-router) with Svelte 5 support.
