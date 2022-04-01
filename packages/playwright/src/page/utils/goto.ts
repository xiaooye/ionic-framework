import type { Page, TestInfo } from "@playwright/test";

/**
 * Extended version of Playwright's page.goto method.
 * Automatically waits for the Stencil components to be hydrated
 * before proceeding with the test.
 */
export default async function (page: Page, url: string, testInfo: TestInfo, originalGoto: typeof page.goto) {
  const { mode, rtl } = testInfo.project.metadata;

  const splitUrl = url.split('?');
  const paramsString = splitUrl[1];

  /**
   * This allows developers to force a
   * certain mode or LTR/RTL config per test.
   */
  const urlToParams = new URLSearchParams(paramsString);
  const formattedMode = urlToParams.get('ionic:mode') ?? mode;
  const formattedRtl = urlToParams.get('rtl') ?? rtl;

  const formattedUrl = `${splitUrl[0]}?ionic:_testing=true&ionic:mode=${formattedMode}&rtl=${formattedRtl}`;

  const [_, response] = await Promise.all([
    page.waitForFunction(() => (window as any).stencilAppLoaded === true),
    originalGoto(formattedUrl)
  ]);

  return response;
}
