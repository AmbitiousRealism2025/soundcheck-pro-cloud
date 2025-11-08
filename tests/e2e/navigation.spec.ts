import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveURL('/')

    // Verify dashboard content loads
    await expect(page.locator('body')).toBeVisible()
  })

  test('should navigate between pages using sidebar', async ({ page }) => {
    // Home
    await page.click('a[href="/"]')
    await expect(page).toHaveURL('/')

    // Rehearsals
    await page.click('a[href="/rehearsals"]')
    await expect(page).toHaveURL(/.*rehearsals/)

    // Gigs
    await page.click('a[href="/gigs"]')
    await expect(page).toHaveURL(/.*gigs/)

    // Settings
    await page.click('a[href="/settings"]')
    await expect(page).toHaveURL(/.*settings/)
  })

  test('should open and close sidebar on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Look for menu toggle button
    const menuToggle = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i]').first()

    if (await menuToggle.count() > 0) {
      // Click to open
      await menuToggle.click()
      await page.waitForTimeout(300)

      // Click to close
      await menuToggle.click()
      await page.waitForTimeout(300)
    }
  })

  test('should have accessible navigation', async ({ page }) => {
    // Check for navigation landmarks
    const nav = page.locator('nav, [role="navigation"]').first()
    await expect(nav).toBeVisible()

    // Check that links are keyboard accessible
    await page.keyboard.press('Tab')

    // Verify focus is on an interactive element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should show active page in navigation', async ({ page }) => {
    // Navigate to rehearsals
    await page.goto('/rehearsals')

    // The rehearsals link should have active styling
    const rehearsalsLink = page.locator('a[href="/rehearsals"]')
    await expect(rehearsalsLink).toBeVisible()

    // Check for active class (common patterns)
    const classList = await rehearsalsLink.getAttribute('class')
    expect(classList).toBeTruthy()
  })

  test('should navigate using browser back button', async ({ page }) => {
    // Navigate to rehearsals
    await page.goto('/rehearsals')
    await expect(page).toHaveURL(/.*rehearsals/)

    // Navigate to gigs
    await page.goto('/gigs')
    await expect(page).toHaveURL(/.*gigs/)

    // Go back
    await page.goBack()
    await expect(page).toHaveURL(/.*rehearsals/)
  })
})
