import { test, expect } from '@playwright/test';

test.describe('button: basic screenshot', () => {

  test('mode: ios', async ({ page }) => {
    await page.goto('http://localhost:3333/src/components/button/test/basic?ionic:mode=ios');

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('screenshot-ios.png');
  });

  test('mode: md', async ({ page }) => {
    await page.goto('http://localhost:3333/src/components/button/test/basic');

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('screenshot.png');
  });

});

