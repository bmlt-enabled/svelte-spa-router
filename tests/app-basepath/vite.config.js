import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    root: 'tests/app-basepath',
    plugins: [
        svelte({ configFile: false }),
        {
            // SPA fallback: serve index.html for all /app/* routes
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
                    // Rewrite all /app/* paths to index.html
                    if (req.url.startsWith('/app')) {
                        req.url = '/'
                    }
                    next()
                })
            },
        },
    ],
})
