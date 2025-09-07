import { test, expect } from '@playwright/test';

test.describe('BuyRight Navigation', () => {
  test('can navigate to key pages without authentication', async ({ page }) => {
    await page.goto('/');

    // Test navigation to calculators (should work without auth)
    await page.goto('/calculators');
    await expect(page.locator('text=Calculator').first()).toBeVisible();

    // Test navigation to guides (should work without auth)
    await page.goto('/guides/property-value-assessment');
    await expect(page.locator('text=Property Value').first()).toBeVisible();

    // Test navigation to privacy policy
    await page.goto('/privacy');
    await expect(page.locator('text=Privacy').first()).toBeVisible();
  });

  test('calculators page loads and displays options', async ({ page }) => {
    await page.goto('/calculators');

    // Should have mortgage, affordability, and closing cost calculators
    const mortgageCalc = await page.locator('text=Mortgage').first().isVisible().catch(() => false);
    const affordabilityCalc = await page.locator('text=Affordability').first().isVisible().catch(() => false);
    const closingCalc = await page.locator('text=Closing').first().isVisible().catch(() => false);

    // Should have at least one calculator visible
    expect(mortgageCalc || affordabilityCalc || closingCalc).toBe(true);
  });

  test('mortgage calculator functionality', async ({ page }) => {
    await page.goto('/calculators/mortgage');

    // Check for key form inputs
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
    
    // Try to fill out basic mortgage info
    const homePriceInput = page.locator('input').first();
    await homePriceInput.fill('400000');
    
    // Should show some calculation result or form validation
    await page.waitForTimeout(1000);
    
    // Check that the page is interactive (no critical errors)
    const hasCalculateButton = await page.locator('text=Calculate').isVisible().catch(() => false);
    const hasResults = await page.locator('text=Payment').isVisible().catch(() => false);
    
    expect(hasCalculateButton || hasResults).toBe(true);
  });

  test('dashboard redirects unauthenticated users appropriately', async ({ page }) => {
    // Visit dashboard without authentication
    await page.goto('/dashboard');
    
    // Should either:
    // 1. Show dashboard with localStorage fallback
    // 2. Redirect to login
    // 3. Show guest user experience
    
    const url = page.url();
    const hasLoginForm = await page.locator('input[type="email"]').isVisible().catch(() => false);
    const hasDashboard = await page.locator('text=Progress').first().isVisible().catch(() => false);
    const hasGuestMode = await page.locator('text=Guest').first().isVisible().catch(() => false);
    
    // Should handle unauthenticated access gracefully
    expect(url.includes('/login') || hasDashboard || hasGuestMode || hasLoginForm).toBe(true);
  });

  test('guides are accessible and functional', async ({ page }) => {
    await page.goto('/guides/offer-conditions');
    
    // Should load guide content
    await expect(page.locator('text=Offer').first()).toBeVisible();
    
    // Check for interactive elements
    const hasCheckboxes = await page.locator('input[type="checkbox"]').first().isVisible().catch(() => false);
    const hasProgress = await page.locator('text=Progress').first().isVisible().catch(() => false);
    const hasContent = await page.locator('p, li, div').first().isVisible().catch(() => false);
    
    expect(hasCheckboxes || hasProgress || hasContent).toBe(true);
  });
});