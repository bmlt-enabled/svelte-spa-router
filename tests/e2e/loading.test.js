import { test, expect } from '@playwright/test'

test('shows loading component while async route resolves', async ({ page }) => {
    await page.goto('/')
    await page.goto('/#/slow')

    // loading component visible immediately
    await expect(page.locator('#page-loading')).toBeVisible()
    await expect(page.locator('#page-slow')).not.toBeVisible()

    // actual component replaces it after load
    await expect(page.locator('#page-slow')).toBeVisible({ timeout: 2000 })
    await expect(page.locator('#page-loading')).not.toBeVisible()
})

test('loading component receives loadingParams', async ({ page }) => {
    await page.goto('/')
    await page.goto('/#/slow')

    await expect(page.locator('#page-loading')).toContainText(
        'Loading route...',
    )
})
