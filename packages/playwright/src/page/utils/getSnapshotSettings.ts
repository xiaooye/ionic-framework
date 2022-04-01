import type { Page, TestInfo } from "@playwright/test";

/**
 * Returns metadata that can be used to create an unique
 * screenshot URL.
 * For example, used to differentiate between iOS in LTR mode
 * and iOS in RTL mode.
 */
export default function (page: Page, testInfo: TestInfo) {
  const url = page.url();
  const splitUrl = url.split('?');
  const paramsString = splitUrl[1];

  const { mode, rtl } = testInfo.project.metadata;

  /**
   * Account for custom settings when overriding
   * the mode/rtl setting. Fall back to the
   * project metadata if nothing was found. This
   * will happen if you call page.getSnapshotSettings
   * before page.goto.
   */
  const urlToParams = new URLSearchParams(paramsString);
  const formattedMode = urlToParams.get('ionic:mode') ?? mode;
  const formattedRtl = urlToParams.get('rtl') ?? rtl;

  /**
   * If encoded in the search params, the rtl value
   * can be `'true'` instead of `true`.
   */
  const rtlString = formattedRtl === true || formattedRtl === 'true' ? 'rtl' : 'ltr';
  return `${formattedMode}-${rtlString}`;
}
