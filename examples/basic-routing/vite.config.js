import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    root: 'examples/basic-routing',
    plugins: [svelte({ configFile: false })],
})
