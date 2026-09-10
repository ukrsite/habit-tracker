# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.ts >> can navigate to Google OAuth
- Location: e2e/ui.spec.ts:11:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /accounts\.google\.com/
Received string:  "http://localhost:3000/api/auth/google"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:3000/api/auth/google"

```

```yaml
- text: "{\"error\":\"Google OAuth not configured\"}"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('login page loads', async ({ page }) => {
  4  |   await page.goto('/');
  5  |   // Should redirect to login if not authenticated
  6  |   await expect(page).toHaveURL(/\/login/);
  7  |   await expect(page.locator('text=Continue with Google')).toBeVisible();
  8  |   await expect(page.locator('text=Continue with GitHub')).toBeVisible();
  9  | });
  10 | 
  11 | test('can navigate to Google OAuth', async ({ page }) => {
  12 |   await page.goto('/login');
  13 |   const googleButton = page.locator('text=Continue with Google');
  14 |   await expect(googleButton).toBeVisible();
  15 |   // Click and verify redirect to Google
  16 |   const navigationPromise = page.waitForNavigation();
  17 |   await googleButton.click();
  18 |   await navigationPromise;
> 19 |   await expect(page).toHaveURL(/accounts\.google\.com/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  20 | });
  21 | 
  22 | test('can navigate to GitHub OAuth', async ({ page }) => {
  23 |   await page.goto('/login');
  24 |   const githubButton = page.locator('text=Continue with GitHub');
  25 |   await expect(githubButton).toBeVisible();
  26 |   // Click and verify redirect to GitHub
  27 |   const navigationPromise = page.waitForNavigation();
  28 |   await githubButton.click();
  29 |   await navigationPromise;
  30 |   await expect(page).toHaveURL(/github\.com/);
  31 | });
  32 | 
```