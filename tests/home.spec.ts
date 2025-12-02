import { test, expect } from '@playwright/test';
import { login } from './helper/login';

test.describe('Home page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test.describe('Login page', () => {

    test('User is able to successfully log in', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');
      await expect(page.getByTestId('title')).toBeVisible();
      await expect(page.getByTestId('title')).toHaveText('Products');
    });

    test('Locked out User is not able to log in', async ({ page }) => {
      await login(page, 'locked_out_user', 'secret_sauce');

      const error = page.locator('h3[data-test="error"]');
      await expect(error).toBeVisible();
      await expect(error).toContainText('Epic sadface: Sorry, this user has been locked out.');

      await expect(page.getByTestId('title')).not.toBeVisible();
    });
  });

  test.describe('Products page', () => {

    test('User is able to successfully log out', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');

      await page.locator('#react-burger-menu-btn').click();
      await page.getByTestId('logout-sidebar-link').click();

      await expect(page.getByTestId('login-button')).toBeVisible();
      await expect(page.getByTestId('title')).not.toBeVisible();
    });

    test('User is able to add an item to the cart', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');

      const item = page.locator('[data-test="inventory-item-description"]').filter({
        has: page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Bike Light' })
      });

      await item.locator('button[data-test^="add-to-cart"]').click();

      await expect(item.locator('button[data-test^="add-to-cart"]')).toHaveCount(0);
      await expect(item.locator('button[data-test^="remove"]')).toBeVisible();

      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    });

    test('User is able to add a few items to the cart', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');

      const add = async (name: string) => {
        const item = page.locator('[data-test="inventory-item-description"]').filter({
          has: page.locator('[data-test="inventory-item-name"]', { hasText: name })
        });
        await item.locator('button[data-test^="add-to-cart"]').click();
      };

      await add('Sauce Labs Bike Light');
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

      await add('Sauce Labs Bolt T-Shirt');
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

      await add('Sauce Labs Backpack');
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');
    });

    test('User is able to remove an item from the cart', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');

      const addBtn = (name: string) =>
        page.locator('[data-test="inventory-item-description"]').filter({
          has: page.locator('[data-test="inventory-item-name"]', { hasText: name })
        });

      await addBtn('Sauce Labs Backpack').locator('button[data-test^="add-to-cart"]').click();
      await addBtn('Sauce Labs Bike Light').locator('button[data-test^="add-to-cart"]').click();

      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

      await addBtn('Sauce Labs Bike Light').locator('button[data-test^="remove"]').click();

      await expect(addBtn('Sauce Labs Bike Light').locator('button[data-test^="remove"]')).toHaveCount(0);
      await expect(addBtn('Sauce Labs Bike Light').locator('button[data-test^="add-to-cart"]')).toBeVisible();

      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    });

    test('User is able to view the item', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');

      const item = page.locator('.inventory_item').filter({
        has: page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' })
      });

      await item.locator('a[data-test*="img-link"]').click();
      await page.getByTestId('back-to-products').click();

      await expect(page.getByTestId('title')).toHaveText('Products');
    });
  });

  test.describe('Item page', () => {

    test('User is able to add an item from the item page', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');

      await page.locator('.inventory_item')
        .filter({ has: page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' }) })
        .locator('a[data-test*="img-link"]')
        .click();

      await page.locator('button[data-test^="add-to-cart"]').click();

      await expect(page.locator('button[data-test^="add-to-cart"]')).toHaveCount(0);
      await expect(page.locator('button[data-test^="remove"]')).toBeVisible();
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    });

    test('User is able to remove an item from the item page', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');

      await page.locator('.inventory_item')
        .filter({ has: page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' }) })
        .locator('a[data-test*="img-link"]')
        .click();

      await page.locator('button[data-test^="add-to-cart"]').click();
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

      await page.locator('button[data-test^="remove"]').click();

      await expect(page.locator('button[data-test^="remove"]')).toHaveCount(0);
      await expect(page.locator('button[data-test^="add-to-cart"]')).toBeVisible();
      await expect(page.locator('a[data-test="shopping-cart-link"] span[data-test="shopping-cart-badge"]')).toHaveCount(0);
    });
  });

  test.describe('Footer section', () => {

    test.beforeEach(async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');
      await page.locator('footer[data-test="footer"]').scrollIntoViewIfNeeded();
    });

    test('Twitter link points to a working external page', async ({ page }) => {
      const href = await page.getByTestId('social-twitter').getAttribute('href');
      expect(href).toBe('https://twitter.com/saucelabs');

      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);
    });

    test('Facebook link points to a working external page', async ({ page }) => {
      const href = await page.getByTestId('social-facebook').getAttribute('href');
      expect(href).toBe('https://www.facebook.com/saucelabs');

      const response = await page.request.get(href!, { failOnStatusCode: false });
      expect([200, 400]).toContain(response.status());
    });

    test('LinkedIn link points to a working external page', async ({ page }) => {
      const href = await page.getByTestId('social-linkedin').getAttribute('href');
      expect(href).toBe('https://www.linkedin.com/company/sauce-labs/');

      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);
    });
  });

});
