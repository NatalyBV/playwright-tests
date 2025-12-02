import { Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
}
