import { Animation } from '../../../interface';

export const handleCanDismiss = async (
  el: HTMLIonModalElement,
  animation: Animation,
  step: number,
  maxStep: number
) => {
  /**
   * If the swiped >25% of the way
   * to the max step, then we should
   * check canDismiss. 25% was chosen
   * to avoid accidental swipes.
   *
   * Also, if canDismiss is not a function
   * then we can return early. If canDismiss is `true`,
   * then canDismissBlocksGesture is `false` as canDismiss
   * will never interrupt the gesture. As a result,
   * this code block is never reached. If canDismiss is `false`,
   * then we never dismiss.
   */
  if (step <= (maxStep / 4)) return;
  if (typeof el.canDismiss !== 'function') return;

  /**
   * Run the canDismiss callback.
   * If the function returns `true`,
   * then we can proceed with dismiss.
   */
  const shouldDismiss = await el.canDismiss();
  if (!shouldDismiss) return;

  /**
   * If canDismiss resolved after the snap
   * back animation finished, we can
   * dismiss immediately.
   *
   * If canDismiss resolved before the snap
   * back animation finished, we need to
   * wait until the snap back animation is
   * done before dismissing.
   */

  if (animation.isFinished()) {
    el.dismiss(undefined, 'handler');
  } else {
    animation.onFinish(() => {
      el.dismiss(undefined, 'handler')
    }, { oneTimeCallback: true })
  }
}
