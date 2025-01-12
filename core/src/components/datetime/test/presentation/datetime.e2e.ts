import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: presentation', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    await page.waitForSelector('.datetime-ready');

    const datetime = page.locator('ion-datetime');

    const compares = [];
    const presentations = ['date-time', 'time-date', 'time', 'date', 'month-year', 'month', 'year'];

    for (const presentation of presentations) {
      await page.locator('select').selectOption(presentation);
      await page.waitForChanges();
      compares.push({
        presentation,
        screenshot: datetime,
      });
    }

    for (const compare of compares) {
      await expect(compare.screenshot).toHaveScreenshot(
        `datetime-presentation-${compare.presentation}-diff-${page.getSnapshotSettings()}.png`
      );
    }
  });

  test('presentation: time: should emit ionChange', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    const ionChangeSpy = await page.spyOnEvent('ionChange');
    await page.locator('select').selectOption('time');
    await page.waitForChanges();

    await page.locator('text=AM').click();

    await ionChangeSpy.next();

    expect(ionChangeSpy.length).toBe(1);
  });

  test('presentation: month-year: should emit ionChange', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    const ionChangeSpy = await page.spyOnEvent('ionChange');
    await page.locator('select').selectOption('month-year');
    await page.waitForChanges();

    await page.locator('text=April').click();

    await ionChangeSpy.next();

    expect(ionChangeSpy.length).toBe(1);
  });

  test('presentation: month: should emit ionChange', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    const ionChangeSpy = await page.spyOnEvent('ionChange');
    await page.locator('select').selectOption('month');
    await page.waitForChanges();

    await page.locator('text=April').click();

    await ionChangeSpy.next();

    expect(ionChangeSpy.length).toBe(1);
  });

  test('presentation: year: should emit ionChange', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    const ionChangeSpy = await page.spyOnEvent('ionChange');
    await page.locator('select').selectOption('year');
    await page.waitForChanges();

    await page.locator('text=2021').click();

    await ionChangeSpy.next();

    expect(ionChangeSpy.length).toBe(1);
  });

  test('switching presentation should close month/year picker', async ({ page, skip }) => {
    await skip.rtl();

    await page.setContent(`
      <ion-datetime presentation="date"></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const datetime = page.locator('ion-datetime');
    const monthYearButton = page.locator('ion-datetime .calendar-month-year');
    await monthYearButton.click();

    await expect(datetime).toHaveClass(/show-month-and-year/);

    await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.presentation = 'time'));
    await page.waitForChanges();

    await expect(datetime).not.toHaveClass(/show-month-and-year/);
  });
});

test.describe('datetime: presentation: time', () => {
  test.beforeEach(async ({ skip }) => {
    skip.rtl();
    skip.mode('md');
  });

  test('changing value from AM to AM should update the text', async ({ page }) => {
    const timePickerFixture = new TimePickerFixture(page);
    await timePickerFixture.goto('04:20:00');

    await timePickerFixture.setValue('11:03:00');
    await timePickerFixture.expectTime(11, 3, 'am');
  });

  test('changing value from AM to PM should update the text', async ({ page }) => {
    const timePickerFixture = new TimePickerFixture(page);
    await timePickerFixture.goto('05:30:00');

    await timePickerFixture.setValue('16:40:00');
    await timePickerFixture.expectTime(16, 40, 'pm');
  });

  test('changing the value from PM to AM should update the text', async ({ page }) => {
    const timePickerFixture = new TimePickerFixture(page);
    await timePickerFixture.goto('16:40:00');

    await timePickerFixture.setValue('04:20:00');
    await timePickerFixture.expectTime(4, 20, 'am');
  });

  test('changing the value from PM to PM should update the text', async ({ page }) => {
    const timePickerFixture = new TimePickerFixture(page);
    await timePickerFixture.goto('16:40:00');

    await timePickerFixture.setValue('19:32:00');
    await timePickerFixture.expectTime(19, 32, 'pm');
  });
});

class TimePickerFixture {
  readonly page: E2EPage;

  private timePicker!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(value: string) {
    await this.page.setContent(`
      <ion-datetime presentation="time" value="${value}"></ion-datetime>
    `);
    await this.page.waitForSelector('.datetime-ready');
    this.timePicker = this.page.locator('ion-datetime');
  }

  async setValue(value: string) {
    await this.timePicker.evaluate((el: HTMLIonDatetimeElement, newValue: string) => {
      el.value = newValue;
    }, value);

    await this.page.waitForChanges();
  }

  async expectTime(hour: number, minute: number, ampm: string) {
    const pickerColumns = this.timePicker.locator('ion-picker-column-internal');

    await expect(pickerColumns.nth(0)).toHaveJSProperty('value', hour);
    await expect(pickerColumns.nth(1)).toHaveJSProperty('value', minute);
    await expect(pickerColumns.nth(2)).toHaveJSProperty('value', ampm);
  }
}
