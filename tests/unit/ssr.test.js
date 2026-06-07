import { describe, it, expect } from 'vitest'
import { compile } from 'svelte/compiler'
import { render } from 'svelte/server'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Regression guard for the "window is not defined" SSR/prerender crash:
// `Router.svelte` must be importable (and SSR-renderable) in a non-browser
// environment. The module-level `router` singleton runs `getLocation()` and
// `_setupListener()` on import, both of which touch `window`. These tests run
// under vitest's default `node` environment, where `window` is undefined.
// See ItalyPaleAle/svelte-spa-router#352.
describe('SSR / non-browser import', () => {
    const routerPath = fileURLToPath(
        new URL('../../Router.svelte', import.meta.url),
    )

    // Compile Router.svelte to server output and import the result. Done once
    // and shared by the assertions below.
    async function importServerRouter() {
        const src = readFileSync(routerPath, 'utf8')
        const { js } = compile(src, {
            generate: 'server',
            filename: 'Router.svelte',
            runes: true,
        })
        const outPath = fileURLToPath(
            new URL('./.router.ssr.mjs', import.meta.url),
        )
        writeFileSync(outPath, js.code)
        try {
            return await import(/* @vite-ignore */ outPath)
        } finally {
            rmSync(outPath, { force: true })
        }
    }

    it('there is no `window` in this environment', () => {
        expect(typeof window).toBe('undefined')
    })

    it('imports without throwing "window is not defined"', async () => {
        const mod = await importServerRouter()
        expect(typeof mod.default).toBe('function')
        // The singleton initialized with the SSR-safe default location.
        expect(mod.router.location).toBe('/')
        expect(mod.router.querystring).toBe('')
    })

    it('SSR-renders without touching the DOM', async () => {
        const { default: Router } = await importServerRouter()
        const out = render(Router, { props: { routes: {} } })
        expect(out).toBeTypeOf('object')
        expect(typeof out.body).toBe('string')
    })
})
