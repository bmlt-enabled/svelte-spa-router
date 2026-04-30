# Changelog

## 5.2.2 (April 30, 2026)

* Widened `RouteDetail.params` and `RouterState.params` to include `RegExpExecArray` — when a RegExp route matches, the runtime sets `params` to the regex `exec()` result, not a `Record<string, string>`. The type now reflects the actual runtime contract.
* **Svelte check** — added `npm run test:svelte-check` (and a corresponding CI step) that runs `svelte-check` against `Router.svelte` to catch drift between the component's `<script module>` exports and `Router.d.ts`.
* **JSDoc and internal type hygiene** — `Router.svelte` and `active.svelte.js` now type-check cleanly under strict mode. Changes are internal-only (no public API changes):
  * `Router.svelte`:
    * Annotated `Router` class fields (`_removeListener: (() => void) | null`, `_params`).
    * Removed `@private` from `_setupListener` since it's legitimately called by `setHashMode`.
    * Added JSDoc parameter/return types to internal helpers `linkOpts`, `updateLinkHref`, `clickHandler`, `popStateChanged`, `dispatchNextTick`.
    * `RouteItem` constructor accepts `string | RegExp` (matches runtime); `_keys` typed `string[] | false`; `match()` return type now accurately reflects regex-route behavior (`Record<string, string | null> | RegExpExecArray | null`).
    * `RouteDetail` JSDoc uses `import('svelte').Component<any, any>` instead of unresolved `SvelteComponent` reference.
    * `checkConditions` JSDoc return type corrected from `boolean` to `Promise<boolean>` (it's an `async` method).
    * `routesList`, `previousScrollState`, `componentObj`, `component`, `componentParams` annotated.
    * `$props()` destructure has an explicit `@type` referencing `RouterProps`.
    * Renamed local `props` to `routeProps` to avoid shadowing the `$props` rune.
  * `active.svelte.js`:
    * Added an `ActiveNode` typedef and annotated `nodes`, `location`, `checkActive`, and `toggleClasses`.
    * Refactored option normalization to a `normalized` local instead of mutating the parameter, so type narrowing carries through.
* **Public-surface JSDoc fixes** brought into alignment with `Router.d.ts`:
  * `LinkActionOpts.href` and `LinkActionOpts.disabled` JSDoc properties marked optional (they were incorrectly required in JSDoc).
  * `Location.querystring` JSDoc tightened from optional `string?` to required `string`.
* `replaceState` calls now pass `''` instead of `undefined` for the unused/title parameter (DOM-correct; behavior unchanged since the spec ignores this argument).
* **Dependabot** — added `.github/dependabot.yml` for weekly npm and GitHub Actions updates.
* CI now uses `npm ci` instead of `npm install` for reproducible installs.

## 5.2.1 (April 30, 2026)

* Tightened `Location.querystring` and `RouterState.querystring` from `string | undefined` to `string` — the implementation always returns a string (empty when absent), so consumers no longer need to null-check.
* `Location` interface is now exported.
* Added missing `inactiveClassName` field to the `ActiveOptions` JSDoc typedef in `active.svelte.js`.
* **Type smoke test** — added `npm run test:types` (and a corresponding CI step) that type-checks a public-API smoke test plus the JSDoc on `wrap.js` and `regexparam.js`. Future drift between the `.d.ts` files and the source will fail CI.
* **Path-routing example** — added a new `examples/path-routing` example demonstrating `hashMode={false}`, runnable with `npm run dev:example-path`.
* **Docs** — documented the manually-callable `restoreScroll` export in `AdvancedUsage.md`.

## 5.2.0 (April 30, 2026)

* **Type definition fixes** — fixed drift between `.d.ts` files and the JS/Svelte sources:
  * Removed obsolete deprecated Readable store exports (`loc`, `location`, `querystring`, `params`) from `Router.d.ts` — these no longer exist in `Router.svelte`; consumers should use the `router` object instead.
  * Added missing `restoreScroll` export to `Router.d.ts`.
  * Added missing `destroy` method to the `link` action's return type.
  * Fixed `WrappedComponent.component` type to `AsyncSvelteComponent` (it's a function, not a Component).

## 5.1.1 (April 10, 2026)

* **`basePath` support for path-based routing** — new optional `basePath` parameter on `setHashMode()` and `basePath` prop on the Router component. When set, the router automatically strips the base path from incoming URLs and prepends it to outgoing ones (`push`, `replace`, `use:link`). App code works with clean paths like `/` and `/slug` without any prefix awareness. Fully backwards compatible — omitting `basePath` behaves exactly as before.

## 5.1.0 (April 10, 2026)

* **Path-based routing (History API)** — new `hashMode` prop and `setHashMode()` function to enable clean URLs without the `#` fragment. All APIs (`push`, `pop`, `replace`, `use:link`) work the same in both modes.

## 5.0.10

* Initial fork from [pjaudiomv/svelte-spa-router](https://github.com/pjaudiomv/svelte-spa-router) with Svelte 5 support.
