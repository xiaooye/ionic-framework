import type { Animation, ModalAnimationOptions } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export const iosEnterAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions): Animation => {
  const baseAnimation = createAnimation('entering-base')
    //.addElement(baseEl)

  return baseAnimation;
};
