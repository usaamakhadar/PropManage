import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/test-utils';

test.describe('Authentication Tests', () => {
  test('User can log in successfully with valid credentials and log out', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || 'test.landlord@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'TestPassword123!';
    await loginUser(page, email, password);

    // Verify dashboard is shown
    await expect(page.locator('text=Dashboard-ka')).toBeVisible();

    // Click logout
    const logoutBtn = page.locator('button:has-text("Ka Bax")');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Verify redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('Invalid credentials displays error message', async ({ page }) => {
    await page.goto('/login');
    
    // Choose Somali or English language
    const somButton = page.locator('button:has-text("SOM")');
    await expect(somButton).toBeVisible();
    
    // Fill wrong details
    await page.locator('input[name="email"]').fill('wronguser@example.com');
    await page.locator('input[name="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    // Verify error message is displayed
    await expect(page.locator('text=Cillad ayaa dhacday')).toBeVisible({ timeout: 15000 });
  });
});
