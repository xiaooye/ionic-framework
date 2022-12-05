import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
// TODO(FW-2845) - Use @utils/forms and @utils/logging when https://github.com/ionic-team/stencil/issues/3826 is resolved
import { checkmarkOutline, removeOutline, ellipseOutline } from 'ionicons/icons';

import { getIonMode } from '../../global/ionic-global';
import type { Color, Gesture, GestureDetail, Mode, StyleEventDetail, ToggleChangeEventDetail } from '../../interface';
import type { LegacyFormController } from '../../utils/forms';
import { createLegacyFormController } from '../../utils/forms';
import { getAriaLabel, renderHiddenInput, inheritAriaAttributes } from '../../utils/helpers';
import type { Attributes } from '../../utils/helpers';
import { printIonWarning } from '../../utils/logging';
import { hapticSelection } from '../../utils/native/haptic';
import { isRTL } from '../../utils/rtl';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - The label text to associate with the toggle. Use the "labelPlacement" property to control where the label is placed relative to the toggle.
 *
 * @part track - The background track of the toggle.
 * @part handle - The toggle handle, or knob, used to change the checked state.
 */
@Component({
  tag: 'ion-toggle',
  styleUrls: {
    ios: 'toggle.ios.scss',
    md: 'toggle.md.scss',
  },
  shadow: true,
})
export class Toggle implements ComponentInterface {
  private inputId = `ion-tg-${toggleIds++}`;
  private gesture?: Gesture;
  private focusEl?: HTMLElement;
  private lastDrag = 0;
  private legacyFormController!: LegacyFormController;
  private inheritedAttributes: Attributes = {};

  // This flag ensures we log the deprecation warning at most once.
  private hasLoggedDeprecationWarning = false;

  @Element() el!: HTMLIonToggleElement;

  @State() activated = false;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If `true`, the toggle is selected.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If `true`, the user cannot interact with the toggle.
   */
  @Prop() disabled = false;

  /**
   * The value of the toggle does not mean if it's checked or not, use the `checked`
   * property for that.
   *
   * The value of a toggle is analogous to the value of a `<input type="checkbox">`,
   * it's only used when the toggle participates in a native `<form>`.
   */
  @Prop() value?: string | null = 'on';

  /**
   * Enables the on/off accessibility switch labels within the toggle.
   */
  @Prop() enableOnOffLabels: boolean | undefined = undefined;

  /**
   * Where to place the label relative to the input.
   * `'start'`: The label will appear to the left of the toggle in LTR and to the right in RTL.
   * `'end'`: The label will appear to the right of the toggle in LTR and to the left in RTL.
   * `'fixed'`: The label has the same behavior as `'start'` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' = 'start';

  /**
   * Set the `legacy` property to `true` to forcibly use the legacy form control markup.
   * Ionic will only opt components in to the modern form markup when they are
   * using either the `aria-label` attribute or the default slot that contains
   * the label text. As a result, the `legacy` property should only be used as
   * an escape hatch when you want to avoid this automatic opt-in behavior.
   * Note that this property will be removed in an upcoming major release
   * of Ionic, and all form components will be opted-in to using the modern form markup.
   */
  @Prop() legacy?: boolean;

  /**
   * How to pack the label and toggle within a line.
   * `'start'`: The label and toggle will appear on the left in LTR and
   * on the right in RTL.
   * `'end'`: The label and toggle will appear on the right in LTR and
   * on the left in RTL.
   * `'space-between'`: The label and toggle will appear on opposite
   * ends of the line with space between the two elements.
   */
  @Prop() justify: 'start' | 'end' | 'space-between' = 'space-between';

  /**
   * Emitted when the user switches the toggle on or off. Does not emit
   * when programmatically changing the value of the `checked` property.
   */
  @Event() ionChange!: EventEmitter<ToggleChangeEventDetail>;

  /**
   * Emitted when the toggle has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the toggle loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('disabled')
  disabledChanged() {
    this.emitStyle();
    if (this.gesture) {
      this.gesture.enable(!this.disabled);
    }
  }

  private toggleChecked() {
    const { checked, value } = this;

    const isNowChecked = !checked;
    this.checked = isNowChecked;

    this.ionChange.emit({
      checked: isNowChecked,
      value,
    });
  }

  async connectedCallback() {
    const { el } = this;

    this.legacyFormController = createLegacyFormController(el);

    this.gesture = (await import('../../utils/gesture')).createGesture({
      el,
      gestureName: 'toggle',
      gesturePriority: 100,
      threshold: 5,
      passive: false,
      onStart: () => this.onStart(),
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev),
    });
    this.disabledChanged();
  }

  disconnectedCallback() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  componentWillLoad() {
    this.emitStyle();

    if (!this.legacyFormController.hasLegacyControl()) {
      this.inheritedAttributes = {
        ...inheritAriaAttributes(this.el),
      };
    }
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive-disabled': this.disabled,
    });
  }

  private onStart() {
    this.activated = true;

    // touch-action does not work in iOS
    this.setFocus();
  }

  private onMove(detail: GestureDetail) {
    if (shouldToggle(isRTL(this.el), this.checked, detail.deltaX, -10)) {
      this.toggleChecked();
      hapticSelection();
    }
  }

  private onEnd(ev: GestureDetail) {
    this.activated = false;
    this.lastDrag = Date.now();
    ev.event.preventDefault();
    ev.event.stopImmediatePropagation();
  }

  private getValue() {
    return this.value || '';
  }

  private setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }

  private onClick = (ev: Event) => {
    ev.preventDefault();

    if (this.lastDrag + 300 < Date.now()) {
      this.toggleChecked();
    }
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private getSwitchLabelIcon = (mode: Mode, checked: boolean) => {
    if (mode === 'md') {
      return checked ? checkmarkOutline : removeOutline;
    }
    return checked ? removeOutline : ellipseOutline;
  };

  private renderOnOffSwitchLabels(mode: Mode, checked: boolean) {
    const icon = this.getSwitchLabelIcon(mode, checked);

    return (
      <ion-icon
        class={{
          'toggle-switch-icon': true,
          'toggle-switch-icon-checked': checked,
        }}
        icon={icon}
      ></ion-icon>
    );
  }

  private renderToggleControl() {
    const mode = getIonMode(this);

    const { enableOnOffLabels, checked } = this;
    return (
      <div class="toggle-icon" part="track">
        {/* The iOS on/off labels are rendered outside of .toggle-icon-wrapper,
         since the wrapper is translated when the handle is interacted with and
         this would move the on/off labels outside of the view box */}
        {enableOnOffLabels &&
          mode === 'ios' && [this.renderOnOffSwitchLabels(mode, true), this.renderOnOffSwitchLabels(mode, false)]}
        <div class="toggle-icon-wrapper">
          <div class="toggle-inner" part="handle">
            {enableOnOffLabels && mode === 'md' && this.renderOnOffSwitchLabels(mode, checked)}
          </div>
        </div>
      </div>
    );
  }

  private get hasLabel() {
    return this.el.textContent !== '';
  }

  render() {
    const { legacyFormController } = this;

    return legacyFormController.hasLegacyControl() ? this.renderLegacyToggle() : this.renderToggle();
  }

  private renderToggle() {
    const { activated, color, checked, disabled, el, justify, labelPlacement, inputId, name } = this;

    const mode = getIonMode(this);
    const value = this.getValue();
    const rtl = isRTL(el) ? 'rtl' : 'ltr';
    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    return (
      <Host
        onClick={this.onClick}
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'toggle-activated': activated,
          'toggle-checked': checked,
          'toggle-disabled': disabled,
          [`toggle-justify-${justify}`]: true,
          [`toggle-label-placement-${labelPlacement}`]: true,
          [`toggle-${rtl}`]: true,
        })}
      >
        <label class="toggle-wrapper">
          <div
            class={{
              'label-text-wrapper': true,
              'label-text-wrapper-hidden': !this.hasLabel,
            }}
          >
            <slot></slot>
          </div>
          <div class="native-wrapper">{this.renderToggleControl()}</div>
          <input
            type="checkbox"
            role="switch"
            aria-checked={`${checked}`}
            checked={checked}
            disabled={disabled}
            id={inputId}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            ref={(focusEl) => (this.focusEl = focusEl)}
            {...this.inheritedAttributes}
          />
        </label>
      </Host>
    );
  }

  private renderLegacyToggle() {
    if (!this.hasLoggedDeprecationWarning) {
      printIonWarning(
        `Using ion-toggle with an ion-label has been deprecated. To migrate, remove the ion-label and pass your label directly into ion-toggle instead.

Example: <ion-toggle>Email:</ion-toggle>

For toggles that do not have a visible label, developers should use "aria-label" so screen readers can announce the purpose of the toggle.`,
        this.el
      );

      if (this.legacy) {
        printIonWarning(
          `ion-toggle is being used with the "legacy" property enabled which will forcibly enable the legacy form markup. This property will be removed in an upcoming major release of Ionic where this form control will use the modern form markup.

Developers can dismiss this warning by removing their usage of the "legacy" property and using the new toggle syntax.`,
          this.el
        );
      }

      this.hasLoggedDeprecationWarning = true;
    }

    const { activated, color, checked, disabled, el, inputId, name } = this;
    const mode = getIonMode(this);
    const { label, labelId, labelText } = getAriaLabel(el, inputId);
    const value = this.getValue();
    const rtl = isRTL(el) ? 'rtl' : 'ltr';

    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    return (
      <Host
        onClick={this.onClick}
        aria-labelledby={label ? labelId : null}
        aria-checked={`${checked}`}
        aria-hidden={disabled ? 'true' : null}
        role="switch"
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'toggle-activated': activated,
          'toggle-checked': checked,
          'toggle-disabled': disabled,
          'legacy-toggle': true,
          interactive: true,
          [`toggle-${rtl}`]: true,
        })}
      >
        {this.renderToggleControl()}
        <label htmlFor={inputId}>{labelText}</label>
        <input
          type="checkbox"
          role="switch"
          aria-checked={`${checked}`}
          disabled={disabled}
          id={inputId}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          ref={(focusEl) => (this.focusEl = focusEl)}
        />
      </Host>
    );
  }
}

const shouldToggle = (rtl: boolean, checked: boolean, deltaX: number, margin: number): boolean => {
  if (checked) {
    return (!rtl && margin > deltaX) || (rtl && -margin < deltaX);
  } else {
    return (!rtl && -margin < deltaX) || (rtl && margin > deltaX);
  }
};

let toggleIds = 0;
