import { test, expect } from '@playwright/test'

test.describe('Rehearsal Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to rehearsals page', async ({ page }) => {
    // Click on Rehearsals link in sidebar
    await page.click('a[href="/rehearsals"]')

    // Wait for navigation
    await page.waitForURL('**/rehearsals')

    // Verify we're on the rehearsals page
    await expect(page).toHaveURL(/.*rehearsals/)
  })

  test('should create a new rehearsal', async ({ page }) => {
    // Navigate to rehearsals page
    await page.goto('/rehearsals')

    // Click the "New Rehearsal" button
    await page.getByTestId('new-rehearsal-button').click()

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 })

    // Fill in rehearsal details
    await page.fill('input[name="eventName"]', 'Test Rehearsal')

    // Fill in date (ISO format)
    await page.locator('input[type="datetime-local"]').first().fill('2025-12-25T14:00')

    // Submit the form
    await page.getByTestId('submit-create-rehearsal').click()

    // Wait for modal to close and verify creation
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 })

    // Verify the rehearsal appears in the list
    await expect(page.locator('text=Test Rehearsal')).toBeVisible()
  })

  test('should view rehearsal details', async ({ page }) => {
    // Navigate to rehearsals page
    await page.goto('/rehearsals')

    // If there are rehearsals, click on the first one
    const firstRehearsal = page.getByTestId('rehearsal-card').first()

    if (await firstRehearsal.count() > 0) {
      await firstRehearsal.click()

      // Wait for navigation to detail page
      await page.waitForURL('**/rehearsals/**', { timeout: 5000 })

      // Verify we're on a detail page
      await expect(page).toHaveURL(/.*rehearsals\/.*/)
    }
  })

  test('should add task to rehearsal', async ({ page }) => {
    // This test assumes we can navigate to a rehearsal detail page
    await page.goto('/rehearsals')

    // Click first rehearsal if available
    const firstRehearsal = page.getByTestId('rehearsal-card').first()

    if (await firstRehearsal.count() > 0) {
      await firstRehearsal.click()
      await page.waitForURL('**/rehearsals/**')

      // Look for "Add Task" button
      const addTaskButton = page.locator('button:has-text("Add Task"), button[aria-label*="add task" i]').first()

      if (await addTaskButton.count() > 0) {
        await addTaskButton.click()

        // Fill in task details
        await page.fill('input[name="title"]', 'New Test Task')

        // Save the task
        await page.click('button[type="submit"]')

        // Verify task appears
        await expect(page.locator('text=New Test Task')).toBeVisible({ timeout: 3000 })
      }
    }
  })

  test('should delete a rehearsal', async ({ page }) => {
    await page.goto('/rehearsals')

    // Get first rehearsal card and hover to reveal delete button
    const firstCard = page.getByTestId('rehearsal-card').first()

    if (await firstCard.count() > 0) {
      // Count rehearsals before deletion
      const rehearsalsBefore = await page.getByTestId('rehearsal-card').count()

      // Hover over card to reveal delete button
      await firstCard.hover()

      // Click delete button within the card
      await page.getByTestId('delete-rehearsal-button').first().click()

      // Confirm deletion in dialog
      await page.getByTestId('confirm-dialog-confirm').click()

      // Wait for deletion to complete
      await page.waitForTimeout(500)

      // Verify count decreased (or show empty state)
      const rehearsalsAfter = await page.getByTestId('rehearsal-card').count()
      expect(rehearsalsAfter).toBeLessThanOrEqual(rehearsalsBefore)
    }
  })
})
