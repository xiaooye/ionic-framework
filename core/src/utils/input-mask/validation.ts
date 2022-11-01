import { printIonWarning } from "@utils/logging";

import type { MaskFormat } from "./types";

/**
 * Validates if a mask placeholder is valid.
 *
 * @param placeholder The placeholder to validate.
 * @param mask The mask to validate the placeholder against.
 */
export const isMaskPlaceholderValid = (placeholder: string, mask: MaskFormat): boolean => {
  let valid = false;
  if (mask !== undefined) {
    if (placeholder.length === 1) {
      valid = true;
    } else {
      if (typeof mask === 'string') {
        /**
         * If the mask is a string, the placeholder can either be a
         * single character or the same length as the mask.
         */
        valid = placeholder.length === mask.length;
      }
      else if (Array.isArray(mask)) {
        /**
         * If the mask is an array, the placeholder must be the same
         * length as the mask.
         */
        valid = placeholder.length === mask.length;
      }
    }
  }
  return valid;
}

export const validateMaskPlaceholder = (placeholder: string | undefined, mask?: MaskFormat): boolean => {
  if (mask === undefined || placeholder === undefined) {
    return true;
  }
  if (!isMaskPlaceholderValid(placeholder, mask)) {
    printIonWarning('The placeholder character must be a single character or the same length as the mask.');
    return false;
  }
  return true;
}
