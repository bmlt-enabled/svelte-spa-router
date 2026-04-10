import { defineConfig } from '@playwright/test'

export default defineConfig({
    projects: [
        {
            name: 'hash-mode',
            testDir: './tests/e2e',
            use: {
                baseURL: 'http://localhost:5051',
            },
        },
        {
            name: 'path-mode',
            testDir: './tests/e2e-path',
            use: {
                baseURL: 'http://localhost:5052',
            },
        },
        {
            name: 'basepath-mode',
            testDir: './tests/e2e-basepath',
            use: {
                baseURL: 'http://localhost:5053',
            },
        },
    ],
    webServer: [
        {
            command: 'npx vite --config tests/app/vite.config.js --port 5051',
            port: 5051,
            reuseExistingServer: !process.env.CI,
        },
        {
            command:
                'npx vite --config tests/app-path/vite.config.js --port 5052',
            port: 5052,
            reuseExistingServer: !process.env.CI,
        },
        {
            command:
                'npx vite --config tests/app-basepath/vite.config.js --port 5053',
            port: 5053,
            reuseExistingServer: !process.env.CI,
        },
    ],
})
