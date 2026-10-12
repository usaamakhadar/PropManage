import { test, expect } from '@playwright/test';
import { loginUser, createTestProperty, createTestUnit } from '../helpers/test-utils';

test.describe('Unit Management CRUD Tests', () => {
  test('User can create a property and unit, and verify status is vacant', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || 'test.landlord@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'TestPassword123!';
    await loginUser(page, email, password);

    const timestamp = Date.now();
    const propertyName = `Building ${timestamp}`;
    const unitNumber = `Apt ${timestamp}`;

    // Create Property
    await createTestProperty(page, propertyName);

    // Create Unit
    await createTestUnit(page, propertyName, unitNumber, '350');

    // Click Guryaha in sidebar to view list
    const propertiesTab = page.locator('button:has-text("Guryaha")');
    await expect(propertiesTab).toBeVisible();
    await propertiesTab.click();

    // Verify Property name is visible
    await expect(page.locator(`text=${propertyName}`)).toBeVisible();

    // Verify Unit number is visible
    await expect(page.locator(`text=${unitNumber}`)).toBeVisible();

    // Verify unit status is vacant (Bannaan)
    const unitRow = page.locator('div.flex.justify-between.items-center').filter({ hasText: unitNumber }).first();
    await expect(unitRow.locator('text=Bannaan')).toBeVisible();
  });
});
