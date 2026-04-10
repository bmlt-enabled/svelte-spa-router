import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('renders home route by default', async ({ page }) => {
    await expect(page.locator('#page-home')).toBeVisible()
})

test('navigates to about via link', async ({ page }) => {
    await page.click('#nav-about')
    await expect(page.locator('#page-about')).toBeVisible()
})

test('URL uses clean path without hash', async ({ page }) => {
    await page.click('#nav-about')
    await expect(page.locator('#page-about')).toBeVisible()
    expect(page.url()).toMatch(/\/about$/)
    expect(page.url()).not.toContain('#')
})

test('navigates to user route with params', async ({ page }) => {
    await page.click('#nav-user')
    await expect(page.locator('#page-user')).toContainText('User: world')
})

test('renders not-found for unknown route', async ({ page }) => {
    await page.goto('/does-not-exist')
    await expect(page.locator('#page-not-found')).toBeVisible()
})

test('push() navigates programmatically', async ({ page }) => {
    await page.click('#btn-push')
    await expect(page.locator('#page-about')).toBeVisible()
})

test('replace() navigates without adding history entry', async ({ page }) => {
    await page.click('#nav-about')
    await page.click('#btn-replace')
    await expect(page.locator('#page-about')).toBeVisible()
})

test('pop() goes back in history', async ({ page }) => {
    await page.click('#nav-about')
    await expect(page.locator('#page-about')).toBeVisible()
    await page.click('#btn-pop')
    await expect(page.locator('#page-home')).toBeVisible()
})

test('active action adds active class to matching link', async ({ page }) => {
    await expect(page.locator('#nav-home')).toHaveClass(/active/)
    await page.click('#nav-about')
    await expect(page.locator('#nav-about')).toHaveClass(/active/)
    await expect(page.locator('#nav-home')).not.toHaveClass(/active/)
})

test('lazy route loads async component', async ({ page }) => {
    await page.goto('/lazy')
    await expect(page.locator('#page-lazy')).toBeVisible()
})

test('failed condition fires onConditionsFailed', async ({ page }) => {
    await page.goto('/protected')
    await expect(page.locator('#conditions-failed')).toBeVisible()
    await expect(page.locator('#page-protected')).not.toBeVisible()
})
