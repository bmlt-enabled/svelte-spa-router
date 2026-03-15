import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    root: 'tests/app',
    plugins: [svelte()],
})
