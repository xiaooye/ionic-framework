import { PlaywrightTestArgs, PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions, test as base, TestInfo } from '@playwright/test';

import type { E2EPage } from '../playwright-declarations';

import goToPage from './utils/goto';
import getSnapshotSettings from './utils/getSnapshotSettings';
import setIonViewport from './utils/setIonViewport';

type CustomTestArgs = PlaywrightTestArgs & PlaywrightTestOptions & PlaywrightWorkerArgs & PlaywrightWorkerOptions & {
  page: E2EPage
}

type CustomFixtures = {
  page: E2EPage
};

export const test = base.extend<CustomFixtures>({
  page: async ({ page }: CustomTestArgs, use: (r: E2EPage) => Promise<void>, testInfo: TestInfo) => {
    const originalGoto = page.goto.bind(page);

    page.goto = url => goToPage(page, url, testInfo, originalGoto);
    page.getSnapshotSettings = () => getSnapshotSettings(page, testInfo);
    page.setIonViewport = () => setIonViewport(page);

    await use(page);
  },
});
