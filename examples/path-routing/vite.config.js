import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    root: 'examples/path-routing',
    plugins: [
        svelte({ configFile: false }),
        {
            // SPA fallback: serve index.html for unmatched routes so the History API
            // can take over. Required when running with `hashMode={false}`. In
            // production, configure your web server to do the equivalent.
            name: 'spa-fallback',
            configureServer(server) {
                server.middlewares.use((req, _res, next) => {
                    if (
                        req.url.startsWith('/@') ||
                        req.url.startsWith('/src/') ||
                        req.url.startsWith('/node_modules/') ||
                        req.url.includes('.')
                    ) {
                        return next()
                    }
                    req.url = '/'
                    next()
                })
            },
        },
    ],
})
