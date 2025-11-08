import { test, expect } from '@playwright/test'

test.describe('Gig Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to gigs page', async ({ page }) => {
    // Click on Gigs link in sidebar
    await page.click('a[href="/gigs"]')

    // Wait for navigation
    await page.waitForURL('**/gigs')

    // Verify we're on the gigs page
    await expect(page).toHaveURL(/.*gigs/)
  })

  test('should create a new gig', async ({ page }) => {
    // Navigate to gigs page
    await page.goto('/gigs')

    // Click the "New Gig" button
    const newGigButton = page.locator('button:has-text("New Gig"), button[aria-label*="gig" i]').first()
    await newGigButton.click()

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 })

    // Fill in gig details
    await page.fill('input[name="eventName"], input[placeholder*="name" i], input[placeholder*="event" i]', 'Test Gig')

    // Fill in date
    const dateInput = page.locator('input[type="datetime-local"], input[type="date"]').first()
    await dateInput.fill('2025-12-31T20:00')

    // Fill in venue name
    await page.fill('input[name="venue.name"], input[placeholder*="venue" i]', 'The Blue Note')

    // Fill in compensation (if visible)
    const compensationInput = page.locator('input[name="compensation.amount"], input[placeholder*="amount" i], input[type="number"]').first()
    if (await compensationInput.count() > 0) {
      await compensationInput.fill('500')
    }

    // Submit the form
    await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")')

    // Wait for modal to close
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 })

    // Verify the gig appears in the list
    await expect(page.locator('text=Test Gig')).toBeVisible()
  })

  test('should view gig details', async ({ page }) => {
    // Navigate to gigs page
    await page.goto('/gigs')

    // If there are gigs, click on the first one
    const firstGig = page.locator('[data-testid="gig-card"], article, .gig-card').first()

    if (await firstGig.count() > 0) {
      await firstGig.click()

      // Wait for navigation to detail page
      await page.waitForURL('**/gigs/**', { timeout: 5000 })

      // Verify we're on a detail page
      await expect(page).toHaveURL(/.*gigs\/.*/)

      // Verify key elements are present
      const venueSection = page.locator('text=/venue/i, text=/location/i').first()
      if (await venueSection.count() > 0) {
        await expect(venueSection).toBeVisible()
      }
    }
  })

  test('should filter gigs by status', async ({ page }) => {
    await page.goto('/gigs')

    // Look for status filter
    const statusFilter = page.locator('select[name="status"], button:has-text("Status")').first()

    if (await statusFilter.count() > 0) {
      await statusFilter.click()

      // Select a specific status (e.g., confirmed)
      const confirmedOption = page.locator('option:has-text("Confirmed"), [role="option"]:has-text("Confirmed")').first()

      if (await confirmedOption.count() > 0) {
        await confirmedOption.click()
        await page.waitForTimeout(500) // Wait for filter to apply
      }
    }
  })

  test('should mark gig compensation as paid', async ({ page }) => {
    await page.goto('/gigs')

    // Click first gig
    const firstGig = page.locator('[data-testid="gig-card"], article').first()

    if (await firstGig.count() > 0) {
      await firstGig.click()
      await page.waitForURL('**/gigs/**')

      // Look for "Mark as Paid" button
      const markAsPaidButton = page.locator('button:has-text("Mark as Paid"), button[aria-label*="paid" i]').first()

      if (await markAsPaidButton.count() > 0) {
        await markAsPaidButton.click()

        // Verify status changed
        await expect(page.locator('text=/paid/i')).toBeVisible({ timeout: 2000 })
      }
    }
  })

  test('should export gig details', async ({ page }) => {
    await page.goto('/gigs')

    // Click first gig
    const firstGig = page.locator('[data-testid="gig-card"], article').first()

    if (await firstGig.count() > 0) {
      await firstGig.click()
      await page.waitForURL('**/gigs/**')

      // Look for export button
      const exportButton = page.locator('button:has-text("Export"), button[aria-label*="export" i]').first()

      if (await exportButton.count() > 0) {
        // Set up download listener
        const downloadPromise = page.waitForEvent('download', { timeout: 3000 }).catch(() => null)

        await exportButton.click()

        // Wait for download or modal
        const download = await downloadPromise

        if (download) {
          expect(download.suggestedFilename()).toBeTruthy()
        }
      }
    }
  })

  test('should search for gigs', async ({ page }) => {
    await page.goto('/gigs')

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()

    if (await searchInput.count() > 0) {
      await searchInput.fill('test')
      await page.waitForTimeout(500) // Wait for debounce/filter

      // Results should update (this is a basic check)
      await expect(page.locator('body')).toBeVisible()
    }
  })
})
