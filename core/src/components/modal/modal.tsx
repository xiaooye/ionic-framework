import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import type {
  Animation,
  AnimationBuilder,
  ComponentProps,
  ComponentRef,
  FrameworkDelegate,
  ModalAttributes,
  ModalHandleBehavior,
  OverlayEventDetail,
} from '../../interface';
import { CoreDelegate, attachComponent, detachComponent } from '../../utils/framework-delegate';
import {
  activeAnimations,
  dismiss,
  eventMethod,
  prepareOverlay,
  present,
} from '../../utils/overlays';

import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';


// TODO(FW-2832): types

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed inside of the `.modal-content` element.
 *
 * @part backdrop - The `ion-backdrop` element.
 * @part content - The wrapper element for the default slot.
 * @part handle - The handle that is displayed at the top of the sheet modal when `handle="true"`.
 */
@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss',
  },
  shadow: true,
})
export class Modal implements ComponentInterface {
  private coreDelegate: FrameworkDelegate = CoreDelegate();
  private currentTransition?: Promise<any>;

  private inline = false;
  private workingDelegate?: FrameworkDelegate;

  // Reference to the user's provided modal content
  private usersElement?: HTMLElement;

  lastFocus?: HTMLElement;
  animation?: Animation;

  @State() presented = false;

  @Element() el!: HTMLIonModalElement;

  /** @internal */
  @Prop() hasController = false;

  /** @internal */
  @Prop() overlayIndex!: number;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = true;

  /**
   * Animation to use when the modal is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the modal is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * The breakpoints to use when creating a sheet modal. Each value in the
   * array must be a decimal between 0 and 1 where 0 indicates the modal is fully
   * closed and 1 indicates the modal is fully open. Values are relative
   * to the height of the modal, not the height of the screen. One of the values in this
   * array must be the value of the `initialBreakpoint` property.
   * For example: [0, .25, .5, 1]
   */
  @Prop() breakpoints?: number[];

  /**
   * A decimal value between 0 and 1 that indicates the
   * initial point the modal will open at when creating a
   * sheet modal. This value must also be listed in the
   * `breakpoints` array.
   */
  @Prop() initialBreakpoint?: number;

  /**
   * A decimal value between 0 and 1 that indicates the
   * point after which the backdrop will begin to fade in
   * when using a sheet modal. Prior to this point, the
   * backdrop will be hidden and the content underneath
   * the sheet can be interacted with. This value is exclusive
   * meaning the backdrop will become active after the value
   * specified.
   */
  @Prop() backdropBreakpoint = 0;

  /**
   * The horizontal line that displays at the top of a sheet modal. It is `true` by default when
   * setting the `breakpoints` and `initialBreakpoint` properties.
   */
  @Prop() handle?: boolean;

  /**
   * The interaction behavior for the sheet modal when the handle is pressed.
   *
   * Defaults to `"none"`, which  means the modal will not change size or position when the handle is pressed.
   * Set to `"cycle"` to let the modal cycle between available breakpoints when pressed.
   *
   * Handle behavior is unavailable when the `handle` property is set to `false` or
   * when the `breakpoints` property is not set (using a fullscreen or card modal).
   */
  @Prop() handleBehavior?: ModalHandleBehavior = 'none';

  /**
   * The component to display inside of the modal.
   * @internal
   */
  @Prop() component?: ComponentRef;

  /**
   * The data to pass to the modal component.
   * @internal
   */
  @Prop() componentProps?: ComponentProps;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   * @internal
   */
  @Prop() cssClass?: string | string[];

  /**
   * If `true`, the modal will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * If `true`, a backdrop will be displayed behind the modal.
   * This property controls whether or not the backdrop
   * darkens the screen when the modal is presented.
   * It does not control whether or not the backdrop
   * is active or present in the DOM.
   */
  @Prop() showBackdrop = true;

  /**
   * If `true`, the modal will animate.
   */
  @Prop() animated = true;

  /**
   * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
   * @deprecated - To prevent modals from dismissing, use canDismiss instead.
   */
  @Prop() swipeToClose = false;

  /**
   * The element that presented the modal. This is used for card presentation effects
   * and for stacking multiple modals on top of each other. Only applies in iOS mode.
   */
  @Prop() presentingElement?: HTMLElement;

  /**
   * Additional attributes to pass to the modal.
   */
  @Prop() htmlAttributes?: ModalAttributes;

  /**
   * If `true`, the modal will open. If `false`, the modal will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the modalController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the modal dismisses. You will need to do that in your code.
   */
  @Prop() isOpen = false;

  /**
   * An ID corresponding to the trigger element that
   * causes the modal to open when clicked.
   */
  @Prop() trigger: string | undefined;

  /**
   * If `true`, the component passed into `ion-modal` will
   * automatically be mounted when the modal is created. The
   * component will remain mounted even when the modal is dismissed.
   * However, the component will be destroyed when the modal is
   * destroyed. This property is not reactive and should only be
   * used when initially creating a modal.
   *
   * Note: This feature only applies to inline modals in JavaScript
   * frameworks such as Angular, React, and Vue.
   */
  @Prop() keepContentsMounted = false;

  /**
   * TODO (FW-937)
   * This needs to default to true in the next
   * major release. We default it to undefined
   * so we can force the card modal to be swipeable
   * when using canDismiss.
   */

  /**
   * Determines whether or not a modal can dismiss
   * when calling the `dismiss` method.
   *
   * If the value is `true` or the value's function returns `true`, the modal will close when trying to dismiss.
   * If the value is `false` or the value's function returns `false`, the modal will not close when trying to dismiss.
   */
  @Prop() canDismiss?: undefined | boolean | ((data?: any, role?: string) => Promise<boolean>);

  /**
   * Emitted after the modal has presented.
   */
  @Event({ eventName: 'ionModalDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted after the modal has dismissed.
   */
  @Event({ eventName: 'ionModalDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;


  connectedCallback() {
    const { el } = this;
    prepareOverlay(el);
  }

  /**
   * Determines whether or not an overlay
   * is being used inline or via a controller/JS
   * and returns the correct delegate.
   * By default, subsequent calls to getDelegate
   * will use a cached version of the delegate.
   * This is useful for calling dismiss after
   * present so that the correct delegate is given.
   */
  private getDelegate(force = false) {
    if (this.workingDelegate && !force) {
      return {
        delegate: this.workingDelegate,
        inline: this.inline,
      };
    }

    /**
     * If using overlay inline
     * we potentially need to use the coreDelegate
     * so that this works in vanilla JS apps.
     * If a developer has presented this component
     * via a controller, then we can assume
     * the component is already in the
     * correct place.
     */
    const parentEl = this.el.parentNode as HTMLElement | null;
    const inline = (this.inline = parentEl !== null && !this.hasController);
    const delegate = (this.workingDelegate = inline ? this.delegate || this.coreDelegate : this.delegate);

    return { inline, delegate };
  }

  /**
   * Determines whether or not the
   * modal is allowed to dismiss based
   * on the state of the canDismiss prop.
   */
  private async checkCanDismiss(data?: any, role?: string) {
    const { canDismiss } = this;

    /**
     * TODO (FW-937) - Remove the following check in
     * the next major release of Ionic.
     */
    if (canDismiss === undefined) {
      return true;
    }

    if (typeof canDismiss === 'function') {
      return canDismiss(data, role);
    }

    return canDismiss;
  }

  /**
   * Present the modal overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    if (this.presented) {
      return;
    }

    /**
     * When using an inline modal
     * and dismissing a modal it is possible to
     * quickly present the modal while it is
     * dismissing. We need to await any current
     * transition to allow the dismiss to finish
     * before presenting again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }


    const { inline, delegate } = this.getDelegate(true);
    this.usersElement = await attachComponent(
      delegate,
      this.el,
      this.component,
      ['ion-page'],
      this.componentProps,
      inline
    );

    this.el.classList.add('show-modal');

    this.currentTransition = present<ModalPresentOptions>(this as any, 'modalEnter', mdEnterAnimation, mdEnterAnimation, {
      presentingEl: this.presentingElement,
      backdropBreakpoint: this.backdropBreakpoint,
    });


    await this.currentTransition;

    this.currentTransition = undefined;
  }

  /**
   * Dismiss the modal overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {

    /**
     * When using an inline modal
     * and presenting a modal it is possible to
     * quickly dismiss the modal while it is
     * presenting. We need to await any current
     * transition to allow the present to finish
     * before dismissing again.
     */
    if (this.currentTransition !== undefined) {
      await this.currentTransition;
    }

    const enteringAnimation = activeAnimations.get(this as any) || [];

    this.currentTransition = dismiss<ModalDismissOptions>(
      this as any,
      data,
      role,
      'modalLeave',
      mdLeaveAnimation,
      mdLeaveAnimation,
      {
        presentingEl: this.presentingElement,
        backdropBreakpoint: 0,
      }
    );

    const dismissed = await this.currentTransition;

    if (dismissed) {
      const { delegate } = this.getDelegate();
      await detachComponent(delegate, this.usersElement);

      this.el.classList.remove('show-modal');

      if (this.animation) {
        this.animation.destroy();
      }

      enteringAnimation.forEach((ani) => ani.destroy());
    }
    this.currentTransition = undefined;
    this.animation = undefined;
    this.usersElement = undefined;
    console.log('cleared')
    return dismissed;
  }

  /**
   * Move a sheet style modal to a specific breakpoint. The breakpoint value must
   * be a value defined in your `breakpoints` array.
   */
  @Method()
  async setCurrentBreakpoint(breakpoint: number): Promise<void> {

  }

  /**
   * Returns the current breakpoint of a sheet style modal
   */
  @Method()
  async getCurrentBreakpoint(): Promise<number | undefined> {
    return 0;
  }

  private onLifecycle = (modalEvent: CustomEvent) => {
    const LIFECYCLE_MAP: any = {
      ionModalDidPresent: 'ionViewDidEnter',
      ionModalWillPresent: 'ionViewWillEnter',
      ionModalWillDismiss: 'ionViewWillLeave',
      ionModalDidDismiss: 'ionViewDidLeave',
    };

    const el = this.usersElement;
    const name = LIFECYCLE_MAP[modalEvent.type];
    if (el && name) {
      const ev = new CustomEvent(name, {
        bubbles: false,
        cancelable: false,
        detail: modalEvent.detail,
      });
      el.dispatchEvent(ev);
    }
  };

  render() {
    const mode = getIonMode(this);

    return (
      <Host
        class={{
          [mode]: true,
          'overlay-hidden': true,
        }}
        onIonModalDidPresent={this.onLifecycle}
        onIonModalWillPresent={this.onLifecycle}
        onIonModalWillDismiss={this.onLifecycle}
        onIonModalDidDismiss={this.onLifecycle}
      >
        <div class="modal-wrapper ion-overlay-wrapper">
          <slot></slot>
        </div>
      </Host>
    );
  }
}



interface ModalOverlayOptions {
  /**
   * The element that presented the modal.
   */
  presentingEl?: HTMLElement;
  /**
   * The current breakpoint of the sheet modal.
   */
  currentBreakpoint?: number;
  /**
   * The point after which the backdrop will being
   * to fade in when using a sheet modal.
   */
  backdropBreakpoint: number;
}

type ModalPresentOptions = ModalOverlayOptions;
type ModalDismissOptions = ModalOverlayOptions;
