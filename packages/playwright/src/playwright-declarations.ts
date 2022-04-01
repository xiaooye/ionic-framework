import type { Page, Response } from "@playwright/test";

export interface E2EPage extends Page {
  goto: (url: string) => Promise<null | Response>;
  setIonViewport: () => Promise<void>;
  getSnapshotSettings: () => string;
}
