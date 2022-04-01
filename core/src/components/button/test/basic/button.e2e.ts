import { expect } from '@playwright/test';
import { test } from '@ionic/playwright';

test.describe('button: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`button-diff-${page.getSnapshotSettings()}.png`);
  });
});
