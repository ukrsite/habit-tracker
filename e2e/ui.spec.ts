import { test, expect } from '@playwright/test';

test('login page loads', async ({ page }) => {
  await page.goto('/');
  // Should redirect to login if not authenticated
  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('text=Continue with Google')).toBeVisible();
  await expect(page.locator('text=Continue with GitHub')).toBeVisible();
});

test('can navigate to Google OAuth', async ({ page }) => {
  await page.goto('/login');
  const googleButton = page.locator('text=Continue with Google');
  await expect(googleButton).toBeVisible();
  // Click and verify redirect to Google
  const navigationPromise = page.waitForNavigation();
  await googleButton.click();
  await navigationPromise;
  await expect(page).toHaveURL(/accounts\.google\.com/);
});

test('can navigate to GitHub OAuth', async ({ page }) => {
  await page.goto('/login');
  const githubButton = page.locator('text=Continue with GitHub');
  await expect(githubButton).toBeVisible();
  // Click and verify redirect to GitHub
  const navigationPromise = page.waitForNavigation();
  await githubButton.click();
  await navigationPromise;
  await expect(page).toHaveURL(/github\.com/);
});
