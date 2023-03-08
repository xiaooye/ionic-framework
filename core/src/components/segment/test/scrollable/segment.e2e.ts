import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: scrollable', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.setContent(`
      <ion-segment scrollable="true" value="2">
        <ion-segment-button value="1">
          <ion-label>First</ion-label>
        </ion-segment-button>
        <ion-segment-button value="2">
          <ion-label>Second</ion-label>
        </ion-segment-button>
        <ion-segment-button value="3">
          <ion-label>Third</ion-label>
        </ion-segment-button>
        <ion-segment-button value="4">
          <ion-label>Fourth</ion-label>
        </ion-segment-button>
        <ion-segment-button value="5">
          <ion-label>Fifth</ion-label>
        </ion-segment-button>
        <ion-segment-button value="6">
          <ion-label>Sixth</ion-label>
        </ion-segment-button>
        <ion-segment-button value="7">
          <ion-label>Seventh</ion-label>
        </ion-segment-button>
        <ion-segment-button value="8">
          <ion-label>Eigth</ion-label>
        </ion-segment-button>
        <ion-segment-button value="9">
          <ion-label>Nineth</ion-label>
        </ion-segment-button>
      </ion-segment>
    `);

    const segment = page.locator('ion-segment');

    expect(await segment.screenshot()).toMatchSnapshot(`segment-scrollable-${page.getSnapshotSettings()}.png`);
  });
});
