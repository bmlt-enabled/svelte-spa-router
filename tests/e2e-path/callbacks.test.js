import { test, expect } from '@playwright/test'

test('onRouteLoading fires with current location', async ({ page }) => {
    await page.goto('/about')

    await expect(page.locator('#route-loading-location')).toHaveText('/about')
})

test('onRouteLoaded fires with correct location', async ({ page }) => {
    await page.goto('/about')

    await expect(page.locator('#route-loaded-location')).toHaveText('/about')
})

test('onRouteLoaded fires for each navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#route-loaded-location')).toHaveText('/')

    await page.click('#nav-about')
    await expect(page.locator('#route-loaded-location')).toHaveText('/about')
})

test('onRouteEvent receives payload from route component', async ({ page }) => {
    await page.goto('/event')
    await expect(page.locator('#page-event')).toBeVisible()

    await page.click('#btn-fire-event')
    await expect(page.locator('#route-event-payload')).toHaveText(
        '{"message":"hello"}',
    )
})
