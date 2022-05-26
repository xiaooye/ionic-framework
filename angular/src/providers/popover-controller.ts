import { ComponentFactoryResolver, Injector, Injectable, EnvironmentInjector } from '@angular/core';
import { PopoverOptions, popoverController } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

import { AngularDelegate } from './angular-delegate';

@Injectable()
export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {
  constructor(
    private angularDelegate: AngularDelegate,
    private resolver: ComponentFactoryResolver,
    private environmentInjector: EnvironmentInjector,
    private injector: Injector
  ) {
    super(popoverController);
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.resolver ?? this.environmentInjector, this.injector),
    });
  }
}
