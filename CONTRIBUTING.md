# Contributing

## Setup

```sh
npm install
npx playwright install chromium
```

## Project structure

```
Router.svelte       # main router component + exported actions/helpers
active.svelte.js    # use:active svelte action
wrap.js             # wrap() helper for async routes and guards
regexparam.js       # vendored copy of regexparam (route pattern parser)
*.d.ts              # TypeScript declarations

examples/
  basic-routing/    # runnable Vite + Svelte 5 example app

tests/
  app/              # Vite + Svelte 5 app used by e2e tests
  unit/             # Vitest unit tests
  e2e/              # Playwright end-to-end tests
```

## Scripts

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `npm run lint`         | Run ESLint                                  |
| `npm run lint:fix`     | Auto-fix ESLint issues                      |
| `npm run format`       | Format all files with Prettier              |
| `npm run format:check` | Check formatting without writing            |
| `npm run test:unit`    | Run Vitest unit tests                       |
| `npm run test:e2e`     | Run Playwright e2e tests                    |
| `npm run test`         | Run all tests                               |
| `npm run dev:example`  | Start example app at http://localhost:5050  |
| `npm run dev:test`     | Start e2e test app at http://localhost:5051 |

## Code style

Prettier owns formatting. ESLint enforces logic/quality rules only. Before opening a PR, run:

```sh
npm run format
npm run lint
```

## Testing

Unit tests cover `wrap()` logic in `tests/unit/`. E2e tests cover routing behavior in a real browser via Playwright in `tests/e2e/`.

```sh
npm run test:unit        # fast, no browser needed
npm run test:e2e         # requires Chromium (installed via playwright install)
```

To run a single e2e test file:

```sh
npx playwright test tests/e2e/guards.test.js
```

To run e2e tests with the browser visible:

```sh
npx playwright test --headed
```

## Publishing

The `files` field in `package.json` controls what gets published, only the library source and type declarations, no dev tooling or tests.

To preview the package contents before publishing:

```sh
npm pack --dry-run
```

To publish:

```sh
npm publish --access public
```

Bump the version in `package.json` before publishing. This package follows [semver](https://semver.org/): breaking changes get a major bump, new features a minor, fixes a patch.
