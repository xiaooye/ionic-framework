import { AfterViewInit, ElementRef, Injector, OnDestroy, Directive, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormControl } from '@ionic/core';
import { Subscription } from 'rxjs';

import { raf } from '../../util/util';

@Directive()
export class ValueAccessor implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private onChange: (value: any) => void = () => {
    /**/
  };
  private onTouched: () => void = () => {
    /**/
  };
  protected lastValue: any;
  private statusChanges?: Subscription;
  private initialized = false;

  @Input() ngModel: any;

  constructor(protected injector: Injector, protected el: ElementRef) { }

  get formControlEl(): HTMLElement & FormControl<any> {
    return this.el.nativeElement;
  }

  writeValue(value: any): void {
    if (typeof this.ngModel !== 'undefined' || this.initialized) {
      this.updateValue(value);
    }

    if (!this.initialized && typeof this.ngModel === 'undefined') {
      const chain = [];
      if (typeof window.customElements !== 'undefined') {
        chain.push(window.customElements.whenDefined(this.el.nativeElement.tagName.toLowerCase()));
      }
      if (typeof this.el.nativeElement.componentOnReady !== 'undefined') {
        chain.push(this.el.nativeElement.componentOnReady());
      }
      Promise.all(chain).then(() => this.updateValue(value));
      this.initialized = true;
    }
  }

  handleChangeEvent(el: HTMLElement, value: any): void {
    if (el === this.el.nativeElement) {
      if (value !== this.lastValue) {
        this.lastValue = value;
        this.onChange(value);
      }
      setIonicClasses(this.el);
    }
  }

  @HostListener('ionBlur', ['$event.target'])
  _handleBlurEvent(el: any): void {
    if (el === this.el.nativeElement) {
      this.onTouched();
      setIonicClasses(this.el);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    if (this.statusChanges) {
      this.statusChanges.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    let ngControl;
    try {
      ngControl = this.injector.get<NgControl>(NgControl);
    } catch {
      /* No FormControl or ngModel binding */
    }

    if (!ngControl) {
      return;
    }

    // Listen for changes in validity, disabled, or pending states
    if (ngControl.statusChanges) {
      this.statusChanges = ngControl.statusChanges.subscribe(() => setIonicClasses(this.el));
    }

    /**
     * TODO Remove this in favor of https://github.com/angular/angular/issues/10887
     * whenever it is implemented. Currently, Ionic's form status classes
     * do not react to changes when developers manually call
     * Angular form control methods such as markAsTouched.
     * This results in Ionic's form status classes being out
     * of sync with the ng form status classes.
     * This patches the methods to manually sync
     * the classes until this feature is implemented in Angular.
     */
    const formControl = ngControl.control as any;
    if (formControl) {
      const methodsToPatch = ['markAsTouched', 'markAllAsTouched', 'markAsUntouched', 'markAsDirty', 'markAsPristine'];
      methodsToPatch.forEach((method) => {
        if (formControl.get(method)) {
          const oldFn = formControl[method].bind(formControl);
          formControl[method] = (...params: any[]) => {
            oldFn(...params);
            setIonicClasses(this.el);
          };
        }
      });
    }
  }

  private updateValue(value: any) {
    if (typeof this.el.nativeElement.patchValue !== 'undefined') {
      this.formControlEl.patchValue(this.lastValue = value == null ? '' : value, {
        emitStyle: true
      });
      setIonicClasses(this.el);
    } else {
      console.log(`<${this.el.nativeElement.tagName.toLowerCase()}> must implement a patchValue function`);
    }
  }

}

export const setIonicClasses = (element: ElementRef): void => {
  raf(() => {
    const input = element.nativeElement as HTMLElement;
    const classes = getClasses(input);
    setClasses(input, classes);

    const item = input.closest('ion-item');
    if (item) {
      setClasses(item, classes);
    }
  });
};

const getClasses = (element: HTMLElement) => {
  const classList = element.classList;
  const classes = [];
  for (let i = 0; i < classList.length; i++) {
    const item = classList.item(i);
    if (item !== null && startsWith(item, 'ng-')) {
      classes.push(`ion-${item.substr(3)}`);
    }
  }
  return classes;
};

const setClasses = (element: HTMLElement, classes: string[]) => {
  const classList = element.classList;
  ['ion-valid', 'ion-invalid', 'ion-touched', 'ion-untouched', 'ion-dirty', 'ion-pristine'].forEach((c) =>
    classList.remove(c)
  );

  classes.forEach((c) => classList.add(c));
};

const startsWith = (input: string, search: string): boolean => {
  return input.substr(0, search.length) === search;
};
