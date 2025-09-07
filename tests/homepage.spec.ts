import { test, expect } from '@playwright/test';

test.describe('BuyRight Homepage', () => {
  test('homepage loads and displays main elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check for BuyRight branding
    await expect(page.locator('text=BuyRight')).toBeVisible();

    // Check for main navigation or content
    // Since the middleware redirects authenticated users, check for login/register options
    const hasLoginButton = await page.locator('text=Login').first().isVisible().catch(() => false);
    const hasRegisterButton = await page.locator('text=Register').first().isVisible().catch(() => false);
    const hasDashboard = await page.locator('text=Dashboard').first().isVisible().catch(() => false);

    // Should have either auth buttons OR dashboard (if already logged in)
    expect(hasLoginButton || hasRegisterButton || hasDashboard).toBe(true);
  });

  test('page has proper meta title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BuyRight/);
  });

  test('page loads without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000);
    
    // Filter out common development warnings
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('webpack') && 
      !error.includes('hydration')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that page still loads and is responsive
    await expect(page.locator('body')).toBeVisible();
    
    // Check for mobile-friendly navigation (hamburger menu or mobile layout)
    const mobileNav = await page.locator('[data-testid="mobile-nav"]').isVisible().catch(() => false);
    const responsiveLayout = await page.locator('.mobile-card, .sm\\:, .md\\:').first().isVisible().catch(() => false);
    
    // Should have some mobile-responsive elements
    expect(mobileNav || responsiveLayout).toBe(true);
  });
});