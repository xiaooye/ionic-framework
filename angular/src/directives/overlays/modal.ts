/* eslint-disable */
/* tslint:disable */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  NgZone,
  TemplateRef,
} from '@angular/core';
import { ProxyCmp, proxyOutputs } from '../angular-component-lib/utils';
import { defineCustomElement as defineIonModalCmp, IonModal as IonModalCmp } from '@ionic/core/components/ion-modal.js';

export declare interface IonModal extends IonModalCmp {}
@ProxyCmp({
  defineCustomElementFn: defineIonModalCmp,
  inputs: [
    'animated',
    'backdropBreakpoint',
    'backdropDismiss',
    'breakpoints',
    'cssClass',
    'enterAnimation',
    'event',
    'handle',
    'initialBreakpoint',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'presentingElement',
    'showBackdrop',
    'swipeToClose',
    'translucent',
    'trigger',
  ],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'],
})
@Component({
  selector: 'ion-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container [ngTemplateOutlet]="template" *ngIf="isCmpOpen"></ng-container>`,
  inputs: [
    'animated',
    'backdropBreakpoint',
    'backdropDismiss',
    'breakpoints',
    'cssClass',
    'enterAnimation',
    'event',
    'handle',
    'initialBreakpoint',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'presentingElement',
    'showBackdrop',
    'swipeToClose',
    'translucent',
    'trigger',
  ],
})
export class IonModal {
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  isCmpOpen: boolean = false;

  protected el: HTMLElement;

  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;

    this.el.addEventListener('willPresent', () => {
      this.isCmpOpen = true;
      c.detectChanges();
    });
    this.el.addEventListener('didDismiss', () => {
      this.isCmpOpen = false;
      c.detectChanges();
    });

    proxyOutputs(this, this.el, [
      'ionModalDidPresent',
      'ionModalWillPresent',
      'ionModalWillDismiss',
      'ionModalDidDismiss',
      'didPresent',
      'willPresent',
      'willDismiss',
      'didDismiss',
    ]);
  }
}
