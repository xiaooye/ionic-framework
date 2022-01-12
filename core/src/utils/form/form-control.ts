
export interface FormControl<ValueType> {
  /**
   * The value of the form control.
   */
  value?: ValueType;
  /**
   * Update the native input value.
   * @param newValue The updated value.
   * @param options Configurations to prevent `ionChange` event emission.
   */
  patchValue(newValue: ValueType, options?: FormControlPatchValueOptions): Promise<void>;
}

export interface FormControlPatchValueOptions {
  emitEvent?: boolean;
  emitStyle?: boolean;
}
