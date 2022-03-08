import { Animation } from '../../../interface';
import { getTimeGivenProgression } from '../../../utils/animation/cubic-bezier';
import { GestureDetail, createGesture } from '../../../utils/gesture';
import { clamp } from '../../../utils/helpers';

import { handleCanDismiss } from './utils';

// Defaults for the card swipe animation
export const SwipeToCloseDefaults = {
  MIN_PRESENTING_SCALE: 0.93,
};

export const createSwipeToCloseGesture = (
  el: HTMLIonModalElement,
  animation: Animation,
  onDismiss: () => void
) => {
  const height = el.offsetHeight;
  let isOpen = false;
  let canDismissBlocksGesture = false;
  const canDismissMaxStep = 0.20;

  const canStart = (detail: GestureDetail) => {
    const target = detail.event.target as HTMLElement | null;

    if (target === null ||
       !(target as any).closest) {
      return true;
    }

    const contentOrFooter = target.closest('ion-content, ion-footer');
    if (contentOrFooter === null) {
      return true;
    }
    // Target is in the content or the footer so do not start the gesture.
    // We could be more nuanced here and allow it for content that
    // does not need to scroll.
    return false;
  };

  const onStart = () => {
    /**
     * If canDismiss is anything other than `true`
     * then users should be able to swipe down
     * until a threshold is hit. At that point,
     * the card modal should not proceed any further.
     */
    canDismissBlocksGesture = el.canDismiss !== true;
    animation.progressStart(true, (isOpen) ? 1 : 0);
  };

  const onMove = (detail: GestureDetail) => {
    const step = detail.deltaY / height;
    /**
     * TODO: Add easing
     * Allowing a max step of 15% of the viewport
     * height is roughly the same as what iOS allows.
     */

    const maxStep = canDismissBlocksGesture ? canDismissMaxStep : 0.9999;
    const processedStep = canDismissBlocksGesture ? calculateSpringStep(step / maxStep) : step;

    const clampedStep = clamp(0.0001, processedStep, maxStep);

    animation.progressStep(clampedStep);
  };

  const onEnd = (detail: GestureDetail) => {
    const velocity = detail.velocityY;
    const maxStep = canDismissBlocksGesture ? canDismissMaxStep : 0.9999;
    const step = detail.deltaY / height;

    const processedStep = canDismissBlocksGesture ? calculateSpringStep(step / maxStep) : step;

    const clampedStep = clamp(0.0001, processedStep, maxStep);

    const threshold = (detail.deltaY + velocity * 1000) / height;

    /**
     * If canDismiss blocks
     * the swipe gesture, then the
     * animation can never complete until
     * canDismiss is checked.
     */
    const shouldComplete = !canDismissBlocksGesture && threshold >= 0.5;
    let newStepValue = (shouldComplete) ? -0.001 : 0.001;

    if (!shouldComplete) {
      animation.easing('cubic-bezier(1, 0, 0.68, 0.28)');
      newStepValue += getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], clampedStep)[0];
    } else {
      animation.easing('cubic-bezier(0.32, 0.72, 0, 1)');
      newStepValue += getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], clampedStep)[0];
    }

    const duration = (shouldComplete) ? computeDuration(step * height, velocity) : computeDuration((1 - clampedStep) * height, velocity);
    isOpen = shouldComplete;

    gesture.enable(false);

    animation
      .onFinish(() => {
        if (!shouldComplete) {
          gesture.enable(true);
        }
      })
      .progressEnd((shouldComplete) ? 1 : 0, newStepValue, duration);

    /**
     * If the canDismiss value blocked the gesture
     * from proceeding, then we should ignore whatever
     * shouldComplete is. Whether or not the modal
     * animation should complete is now determined by
     * canDismiss.
     *
     * If the user swiped >25% of the way
     * to the max step, then we should
     * check canDismiss. 25% was chosen
     * to avoid accidental swipes.
     */
    if (canDismissBlocksGesture && clampedStep > (maxStep / 4)) {
      handleCanDismiss(el, animation);
    } else if (shouldComplete) {
      onDismiss();
    }
  };

  const gesture = createGesture({
    el,
    gestureName: 'modalSwipeToClose',
    gesturePriority: 40,
    direction: 'y',
    threshold: 10,
    canStart,
    onStart,
    onMove,
    onEnd
  });
  return gesture;
};

const computeDuration = (remaining: number, velocity: number) => {
  return clamp(400, remaining / Math.abs(velocity * 1.1), 500);
};

/**
 * This function lets us simulate a realistic spring-like animation
 * when swiping down on the modal.
 * We can represent the position of the spring as a function of time: x = f(t)
 * t = time, x = position
 * The derivative of the position yields the velocity.
 * The derivative of the velocity yields the acceleration.
 * We know that at t = 0, the position is 0: f(0) = 0
 * We also know that at this point, the spring does not move. Therefore,
 * we also know that the velocity is 0: f'(0) = 0.
 *
 * Now, we need to figure out the acceleration which is f"(t).
 * To do this we need to define two values:
 * 1. The spring force, k: This force pulls a spring back into its equilibrium position.
 * 2. The dampening force, c: This force slows down the motion over time. Without it, a spring would oscillate forever.
 *
 * We derive the following differential equation to find acceleration:
 *
 * f"(t) = -k * (f(t) - 1) - c * f'(t)
 *
 * This value is what we plug into our `progressStep` call.
 * We cheat a bit and hardcode the formula we do not need to calculate
 * all of this on the fly:
 * f(0) = 0
 * f'(0) = 0
 * k = 0.57
 * c = 15
 */
const calculateSpringStep = (t: number) => {
  return 0.00255275 * 2.71828**(-14.9619 * t) - 1.00255 * 2.71828**(-0.0380968 * t) + 1
}
