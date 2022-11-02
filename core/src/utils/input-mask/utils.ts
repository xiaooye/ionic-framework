import { defaultPlaceHolderChar } from "./constants";

export function convertMaskToPlaceholder(mask: (string | RegExp)[] = [], placeholderChar = defaultPlaceHolderChar) {
  if (mask.indexOf(placeholderChar) !== -1) {
    // throw error
    return;
  }
  return mask.map(char => char instanceof RegExp ? placeholderChar : char).join('');
}
