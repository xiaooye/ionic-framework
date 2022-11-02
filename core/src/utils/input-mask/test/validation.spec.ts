import { isMaskPlaceholderValid } from '../validation';

describe('isMaskPlaceholderValid', () => {

  test('should return true if placeholder is a single character', () => {
    const placeholder = '_';

    expect(isMaskPlaceholderValid(placeholder, '9999')).toBe(true);
    expect(isMaskPlaceholderValid(placeholder, ['9', '9', '9', '9'])).toBe(true);
    expect(isMaskPlaceholderValid(placeholder, [
      new RegExp(/d/),
      new RegExp(/d/),
      new RegExp(/d/),
      new RegExp(/d/),
    ])).toBe(true);
  });

  test('should return true if placeholder is the same length as the mask', () => {
    const placeholder = '____';

    expect(isMaskPlaceholderValid(placeholder, '9999')).toBe(true);
    expect(isMaskPlaceholderValid(placeholder, ['9', '9', '9', '9'])).toBe(true);
    expect(isMaskPlaceholderValid(placeholder, [
      new RegExp(/d/),
      new RegExp(/d/),
      new RegExp(/d/),
      new RegExp(/d/),
    ])).toBe(true);
  });

  test('should return false if placeholder is not the same length as the mask and is not a single character', () => {
    const placeholder = '___'; // 3 characters

    expect(isMaskPlaceholderValid(placeholder, '9999')).toBe(false);
    expect(isMaskPlaceholderValid(placeholder, ['9', '9', '9', '9'])).toBe(false);
    expect(isMaskPlaceholderValid(placeholder, [
      new RegExp(/d/),
      new RegExp(/d/),
      new RegExp(/d/),
      new RegExp(/d/),
    ])).toBe(false);
  });

});
