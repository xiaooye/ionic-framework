import { Animation } from '../../../interface';

export const handleCanDismiss = async (
  el: HTMLIonModalElement,
  animation: Animation,
) => {
  /**
   * If canDismiss is not a function
   * then we can return early. If canDismiss is `true`,
   * then canDismissBlocksGesture is `false` as canDismiss
   * will never interrupt the gesture. As a result,
   * this code block is never reached. If canDismiss is `false`,
   * then we never dismiss.
   */
  if (typeof el.canDismiss !== 'function') { return; }

  /**
   * Run the canDismiss callback.
   * If the function returns `true`,
   * then we can proceed with dismiss.
   */
  const shouldDismiss = await el.canDismiss();
  if (!shouldDismiss) { return; }

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

   console.log(animation)
  if (!animation.isRunning()) {
    el.dismiss(undefined, 'handler');
  } else {
    animation.onFinish(() => {
      el.dismiss(undefined, 'handler')
    }, { oneTimeCallback: true })
  }
}
