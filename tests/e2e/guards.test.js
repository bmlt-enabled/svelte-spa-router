import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('sync condition false blocks route and fires onConditionsFailed', async ({
    page,
}) => {
    await page.goto('/#/protected')
    await expect(page.locator('#conditions-failed')).toBeVisible()
    await expect(page.locator('#page-protected')).not.toBeVisible()
})

test('async condition true allows route to load', async ({ page }) => {
    await page.goto('/#/guarded-async')
    await expect(page.locator('#page-guarded')).toBeVisible()
    await expect(page.locator('#conditions-failed')).not.toBeVisible()
})

test('first failing condition prevents second condition from running', async ({
    page,
}) => {
    await page.goto('/#/guarded-multi')
    await expect(page.locator('#conditions-failed')).toBeVisible()
    const secondRan = await page.evaluate(() =>
        window.__wasSecondConditionCalled(),
    )
    expect(secondRan).toBe(false)
})

test('userData is passed to condition via detail', async ({ page }) => {
    await page.goto('/#/guarded-userdata')
    await expect(page.locator('#page-guarded')).toBeVisible()
})

test('onConditionsFailed receives route detail with userData', async ({
    page,
}) => {
    await page.goto('/#/protected')
    await expect(page.locator('#conditions-failed')).toBeVisible()
    // /protected has no userData, check the detail object is present but no userData shown
    await expect(page.locator('#conditions-failed-userdata')).not.toBeVisible()
})
