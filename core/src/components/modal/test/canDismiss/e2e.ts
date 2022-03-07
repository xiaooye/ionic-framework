import { newE2EPage } from '@stencil/core/testing';

describe('modal - canDismiss handler', () => {
  let page;
  beforeEach(async () => {
    page = await newE2EPage({ url: '/src/components/modal/test/canDismiss?ionic:_testing=true' });
  });

  describe('regular modal', () => {
    it('should dismiss when canDismiss is true', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is false', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
    it('should dismiss when canDismiss is Promise<true>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is Promise<false>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
  });

  describe('card modal', () => {
    beforeEach(async () => {
      await page.click('#radio-card');
    });

    it('should dismiss when canDismiss is true', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is false', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
    it('should dismiss when canDismiss is Promise<true>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is Promise<false>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
  });

  describe('sheet modal', () => {
    beforeEach(async () => {
      await page.click('#radio-sheet');
    });

    it('should dismiss when canDismiss is true', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is true', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
    it('should dismiss when canDismiss is Promise<true>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is Promise<false>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
  });
});
