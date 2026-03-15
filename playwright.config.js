import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests/e2e',
    use: {
        baseURL: 'http://localhost:5051',
    },
    webServer: {
        command: 'npx vite --config tests/app/vite.config.js --port 5051',
        port: 5051,
        reuseExistingServer: !process.env.CI,
    },
})
