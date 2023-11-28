import { test, expect } from '@playwright/test';

test('check poem has expected text and that search params working - if broken check buttons', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).getByRole('button').click();
  await page.getByLabel('email').click();
  await page.getByLabel('email').fill('scarlett2000@btinternet.com');
  await page.getByLabel('email').press('Tab');
  await page.getByLabel('Password').fill('tesstess');
  await page.getByLabel('Password').press('Enter');
  await page.getByRole('heading', { name: 'Wild Geese' }).click();

  await expect(page.locator('main')).toContainText(
    'You do not have to be good.'
  );

  await page.getByText('You do not have to be good.').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page).toHaveURL('http://localhost:3000/1/responses?prompt=2');
});
