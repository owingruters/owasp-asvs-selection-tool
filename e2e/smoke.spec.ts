import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('app loads without console errors (CSP intact)', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'ASVS Selection Tool' })).toBeVisible();
  await expect(page.getByText('(345 shown)')).toBeVisible();
  expect(errors).toEqual([]);
});

test('select, save to a file, and open it again', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');

  await page.getByRole('checkbox', { name: 'Level 1' }).check();
  await page.getByRole('button', { name: /Select all shown/ }).click();
  await page.getByLabel('Name (company, team or project)').fill('Acme Payments');
  await page.getByLabel('Version of this selection').fill('v1');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save to file' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('acme-payments-v1.asvs.json');
  const path = await download.path();
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- path comes from Playwright's own download
  const saved = JSON.parse(readFileSync(path, 'utf8')) as {
    requirements: unknown[];
    asvsVersion: string;
  };
  expect(saved.asvsVersion).toBe('5.0.0');
  expect(saved.requirements).toHaveLength(70);

  await page.reload();
  await expect(page.getByText('0', { exact: true })).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles(path);
  await expect(
    page.getByRole('status').filter({ hasText: 'Opened "Acme Payments"' }),
  ).toBeVisible();
  await expect(page.getByText('70', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
