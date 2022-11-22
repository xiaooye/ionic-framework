import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: label placement start', () => {
  test('label should appear on the starting side of the textarea', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" value="example@ionic.io" label-placement="start"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-placement-start-${page.getSnapshotSettings()}.png`);
  });

  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="start"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-start-long-label-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: label placement end', () => {
  test('label should appear on the ending side of the textarea', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" value="example@ionic.io" label-placement="end"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-placement-end-${page.getSnapshotSettings()}.png`);
  });
  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="end"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-end-long-label-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: label placement fixed', () => {
  test('label should appear on the starting side of the textarea, have a fixed width, and show ellipses', async ({
    page,
  }) => {
    await page.setContent(`
      <ion-textarea label="Email Email Email Email Email Email" value="example@ionic.io" label-placement="fixed"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-placement-fixed-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('textarea: label placement stacked', () => {
  test('label should appear above the textarea when there is a value', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" value="example@ionic.io" label-placement="stacked"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-stacked-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear above the textarea when there is a no value', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" label-placement="stacked"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-stacked-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="stacked"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-stacked-long-label-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: label placement floating', () => {
  test('label should appear above the textarea when there is a value', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" value="example@ionic.io" label-placement="floating"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear on top of the textarea and hide the textarea when there is a no value', async ({
    page,
  }) => {
    await page.setContent(`
      <ion-textarea label="Email" label-placement="floating" placeholder="example@ionic.io"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear on top of the textarea when the textarea is focused', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email" label-placement="floating" placeholder="example@ionic.io"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    const nativeInput = textarea.locator('input');

    await nativeInput.click();
    await page.waitForChanges();

    expect(await textarea.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `textarea-focused-placement-floating-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-long-label-${page.getSnapshotSettings()}.png`
    );
  });

  test('long label should truncate with outline', async ({ page, skip }) => {
    skip.mode('ios', 'This style only appears on MD');
    await page.setContent(`
      <ion-textarea fill="outline" label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-long-label-outline-${page.getSnapshotSettings()}.png`
    );
  });
  test('long label should truncate with solid', async ({ page, skip }) => {
    skip.mode('ios', 'This style only appears on MD');
    await page.setContent(`
      <ion-textarea fill="solid" label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-long-label-solid-${page.getSnapshotSettings()}.png`
    );
  });
});
