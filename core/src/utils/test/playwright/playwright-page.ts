import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestInfo,
  TestType,
} from '@playwright/test';
import { test as base } from '@playwright/test';

import { initPageEvents } from './page/event-spy';
import {
  getSnapshotSettings,
  goto as goToPage,
  setContent,
  setIonViewport,
  spyOnEvent,
  waitForChanges,
  locator,
} from './page/utils';
import type { LocatorOptions } from './page/utils';
import type { E2EPage, E2ESkip, BrowserNameOrCallback, SetIonViewportOptions } from './playwright-declarations';

type CustomTestArgs = PlaywrightTestArgs &
  PlaywrightTestOptions &
  PlaywrightWorkerArgs &
  PlaywrightWorkerOptions & {
    page: E2EPage;
    mode?: 'ios' | 'md';
    dir?: 'rtl' | 'ltr';
  };

type CustomFixtures = {
  page: E2EPage;
  skip: E2ESkip;
  mode: any;
  dir: any;
};

export type IonicTestOptions = {
  mode?: 'ios' | 'md';
  dir?: 'rtl' | 'ltr';
}

/**
 * Extends the base `page` test figure within Playwright.
 * @param page The page to extend.
 * @param testInfo The test info.
 * @returns The modified playwright page with extended functionality.
 */
export async function extendPageFixture(page: E2EPage, testInfo: TestInfo, testOptions: IonicTestOptions) {
  const originalGoto = page.goto.bind(page);
  const originalLocator = page.locator.bind(page);

  // Overridden Playwright methods
  page.goto = (url: string, options) => goToPage(page, url, options, testInfo, testOptions, originalGoto);
  page.setContent = (html: string) => setContent(page, html, testInfo);
  page.locator = (selector: string, options?: LocatorOptions) => locator(page, originalLocator, selector, options);

  // Custom Ionic methods
  page.getSnapshotSettings = () => getSnapshotSettings(page, testInfo, testOptions);
  page.setIonViewport = (options?: SetIonViewportOptions) => setIonViewport(page, options);
  page.waitForChanges = (timeoutMs?: number) => waitForChanges(page, timeoutMs);
  page.spyOnEvent = (eventName: string) => spyOnEvent(page, eventName);

  // Custom event behavior
  await initPageEvents(page);

  return page;
}

const testFixture: any = base.extend<CustomFixtures>({
  // Define an option and provide a default value.
  // We can later override it in the config.
  mode: ['md', { option: true }],
  dir: ['ltr', { option: true }],

  page: async ({ page, mode, dir }: CustomTestArgs, use: (r: E2EPage) => Promise<void>, testInfo: TestInfo) => {
    page = await extendPageFixture(page, testInfo, {
      mode,
      dir
    });
    await use(page);
  },
  skip: {
    rtl: (reason = 'The functionality that is being tested is not applicable to RTL layouts.') => {
      const testInfo: TestInfo = base.info();
      base.skip(testInfo.project.metadata.rtl === true, reason);
    },
    browser: (
      browserNameOrFunction: BrowserNameOrCallback,
      reason = `The functionality that is being tested is not applicable to this browser.`
    ) => {
      const browserName = base.info().project.use.browserName!;

      if (typeof browserNameOrFunction === 'function') {
        base.skip(browserNameOrFunction(browserName), reason);
      } else {
        base.skip(browserName === browserNameOrFunction, reason);
      }
    },
    mode: (mode: string, reason = `The functionality that is being tested is not applicable to ${mode} mode`) => {
      base.skip(base.info().project.metadata.mode === mode, reason);
    },
  },
});

export const testIonicMode = (mode: 'ios' | 'md', callback: () => void) => {
  // Run tests in this describe block with the specified mode
  base.describe(`${mode}`, async () => {
    await testFixture.use({ mode });
    callback();
  });
}

export const testIonicModes = (callback: () => void) => {
  testIonicMode('ios', callback);
  testIonicMode('md', callback);
}

export const test: TestType<PlaywrightTestArgs & PlaywrightTestOptions & CustomFixtures, PlaywrightWorkerArgs & PlaywrightWorkerOptions> = testFixture;
