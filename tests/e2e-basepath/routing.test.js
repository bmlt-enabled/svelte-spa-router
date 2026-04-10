import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/app')
})

test('renders home route at basePath', async ({ page }) => {
    await expect(page.locator('#page-home')).toBeVisible()
})

test('URL includes basePath prefix', async ({ page }) => {
    expect(page.url()).toMatch(/\/app\/?$/)
})

test('navigates to about via link — URL has basePath prefix', async ({
    page,
}) => {
    await page.click('#nav-about')
    await expect(page.locator('#page-about')).toBeVisible()
    expect(page.url()).toMatch(/\/app\/about$/)
    expect(page.url()).not.toContain('#')
})

test('navigates to user route with params', async ({ page }) => {
    await page.click('#nav-user')
    await expect(page.locator('#page-user')).toContainText('User: world')
    expect(page.url()).toMatch(/\/app\/user\/world$/)
})

test('push() prepends basePath to URL', async ({ page }) => {
    await page.click('#btn-push')
    await expect(page.locator('#page-about')).toBeVisible()
    expect(page.url()).toMatch(/\/app\/about$/)
})

test('replace() prepends basePath to URL', async ({ page }) => {
    await page.click('#btn-replace')
    await expect(page.locator('#page-about')).toBeVisible()
    expect(page.url()).toMatch(/\/app\/about$/)
})

test('pop() goes back in history', async ({ page }) => {
    await page.click('#nav-about')
    await expect(page.locator('#page-about')).toBeVisible()
    await page.click('#btn-pop')
    await expect(page.locator('#page-home')).toBeVisible()
})

test('direct navigation to basePath + route works', async ({ page }) => {
    await page.goto('/app/about')
    await expect(page.locator('#page-about')).toBeVisible()
})

test('direct navigation to basePath + param route works', async ({ page }) => {
    await page.goto('/app/user/alice')
    await expect(page.locator('#page-user')).toContainText('User: alice')
})

test('active action adds active class to matching link', async ({ page }) => {
    await expect(page.locator('#nav-home')).toHaveClass(/active/)
    await page.click('#nav-about')
    await expect(page.locator('#nav-about')).toHaveClass(/active/)
    await expect(page.locator('#nav-home')).not.toHaveClass(/active/)
})

test('route-loaded callback receives path without basePath', async ({
    page,
}) => {
    await page.click('#nav-about')
    await expect(page.locator('#route-loaded-location')).toContainText('/about')
})
