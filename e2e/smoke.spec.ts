import { expect, test } from '@playwright/test';

test('app loads without console errors (CSP intact)', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'ASVS Selection Tool' })).toBeVisible();
  expect(errors).toEqual([]);
});
