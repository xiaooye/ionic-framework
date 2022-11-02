import { raf } from "@utils/helpers";

import { defaultPlaceHolderChar } from "./constants";
import { adjustCaretPosition, conformToMask } from "./manipulation";
import type { MaskFormat, MaskVisibility } from "./types";
import { convertMaskToPlaceholder } from "./utils";

interface MaskConfig {
  inputElement: HTMLInputElement;
  mask: MaskFormat;
  maskVisibility: MaskVisibility;
  placeholderChar?: string;
}

function getSafeRawValue(inputValue: any) {
  if (typeof inputValue === "string") {
    return inputValue;
  } else if (typeof inputValue === "number") {
    return inputValue.toString();
  } else if (inputValue === null || inputValue === undefined) {
    return "";
  } else {
    throw new Error(
      "The 'value' provided to the mask needs to be a string or a number. The value " +
      `received was:\n\n ${JSON.stringify(inputValue)}`
    )
  }
}

const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

function safeSetSelection(element: HTMLInputElement, selectionPosition: number) {
  if (document.activeElement === element) {
    if (isAndroid) {
      raf(() => element.setSelectionRange(selectionPosition, selectionPosition, 'none'));
    } else {
      element.setSelectionRange(selectionPosition, selectionPosition, 'none')
    }
  }
}

// // TODO type config
export function createMaskInputElement(config: MaskConfig) {
  // Anything that we will need to keep between `update` calls, we will store in this `state` object.
  const state: any = {
    previousConformedValue: undefined,
    previousPlaceholder: undefined,
  }

  const update = (rawValue: string, { inputElement, mask, maskVisibility, placeholderChar = defaultPlaceHolderChar } = config) => {
    if (typeof rawValue === 'undefined') {
      // If `rawValue` is `undefined`, read from the `inputElement`.
      rawValue = inputElement.value;
    }

    if (rawValue === state.previousConformedValue) {
      /**
       * If `rawValue` equals `state.previousConformedValue` we don't
       * need to change anything.
       *
       * This check is here to handle controlled framework components
       * that repeat the `update` call on every render.
       */
      return;
    }

    if (typeof mask === 'boolean') {
      /**
     * In framework components that support reactivity,
     * it is possible to turn off masking by
     * passing `false` for `mask` after initialization.
     */
      return;
    }

    let placeholder;

    const showMask = maskVisibility !== 'never';

    if (mask instanceof Array) {
      /**
       * If the provided mask is an array, we can call
       * `convertMaskToPlaceholder` here once and we will
       * always have the correct `placeholder`.
       */
      placeholder = convertMaskToPlaceholder(mask, placeholderChar);
    }

    const safeRawValue = getSafeRawValue(rawValue);

    /**
     * `selectionEnd` indicates to us where the caret position is after
     * the user has type into the input.
     */
    const { selectionEnd: currentCaretPosition } = inputElement;

    /**
     * We need to know what the `previousConformedValue` and
     * `previousPlaceholder` is from the previous `update` call.
     */
    const { previousConformedValue, previousPlaceholder } = state;

    let caretTrapIndexes;

    /**
     * The following object will be passed to `conformToMask` to
     * determine how the `rawValue` will be conformed.
     */
    const conformToMaskConfig = {
      previousConformedValue,
      placeholder,
      currentCaretPosition,
    };

    const theMask = mask instanceof Array ? mask : mask.split('');

    const { conformedValue } = conformToMask(safeRawValue, theMask, conformToMaskConfig);

    const finalConformedValue = conformedValue;

    /**
     * After determining the conformed value, we will need to know
     * where to set the caret position.
     */
    const adjustedCaretPosition = adjustCaretPosition({
      previousConformedValue,
      previousPlaceholder,
      conformedValue: finalConformedValue,
      placeholder,
      rawValue: safeRawValue,
      currentCaretPosition,
      placeholderChar,
      caretTrapIndexes
    });

    const inputValueShouldBeEmpty = finalConformedValue === placeholder && adjustedCaretPosition === 0
    const emptyValue = showMask ? placeholder : '';
    const inputElementValue = (inputValueShouldBeEmpty) ? emptyValue : finalConformedValue

    state.previousConformedValue = inputElementValue ?? '' // store value for access for next time
    state.previousPlaceholder = placeholder

    if (inputElement.value === inputElementValue) {
      return
    }

    inputElement.value = inputElementValue ?? '';

    safeSetSelection(inputElement, adjustedCaretPosition);

  }

  return {
    state,
    update
  }
}

export type MaskInstance = ReturnType<typeof createMaskInputElement>;
