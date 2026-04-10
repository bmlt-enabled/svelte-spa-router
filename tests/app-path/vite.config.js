import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    root: 'tests/app-path',
    plugins: [
        svelte({ configFile: false }),
        {
            // SPA fallback: serve index.html for all unmatched routes
            name: 'spa-fallback',
            configureServer(server) {
                server.middlewares.use((req, _res, next) => {
                    // Let Vite handle assets and HMR
                    if (
                        req.url.startsWith('/@') ||
                        req.url.startsWith('/src/') ||
                        req.url.startsWith('/node_modules/') ||
                        req.url.includes('.')
                    ) {
                        return next()
                    }
                    // Rewrite all other paths to index.html
                    req.url = '/'
                    next()
                })
            },
        },
    ],
})
