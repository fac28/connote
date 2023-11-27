import { test, expect } from '@playwright/test';

test('login with known user', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).getByRole('button').click();
  await page.locator('.group > .relative > .inline-flex').first().click();
  await page.getByLabel('email').fill('scarlett2000@btinternet.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('tesstess');
  await page.getByLabel('Login').getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('http://localhost:3000/poemLibrary');
});

test('go to answered poem', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).getByRole('button').click();
  await page.locator('.group > .relative > .inline-flex').first().click();
  await page.getByLabel('email').fill('scarlett2000@btinternet.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('tesstess');
  await page.getByLabel('Login').getByRole('button', { name: 'Login' }).click();

  await page
    .locator('span')
    .filter({ hasText: '-11-20Mary OliverWild Geese' })
    .getByRole('img')
    .click();
  await expect(page).toHaveURL('http://localhost:3000/1/responses');
});

test('go to unanswered poem', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).getByRole('button').click();
  await page.locator('.group > .relative > .inline-flex').first().click();
  await page.getByLabel('email').fill('scarlett2000@btinternet.com');
  await page.getByLabel('email').press('Tab');
  await page.getByLabel('Password').fill('tesstess');
  await page.getByLabel('Password').press('Tab');
  await page
    .getByLabel('Login')
    .getByRole('button', { name: 'Login' })
    .press('Enter');
  await page.getByText('-11-22Derek WalcottStar').click();
  await expect(page).toHaveURL('http://localhost:3000/3/prompts');
});
