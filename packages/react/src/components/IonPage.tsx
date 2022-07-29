import React, { useContext } from 'react';

import { NavContext } from '../contexts/NavContext';
import PageManager from '../routing/PageManager';

import { IonicReactProps } from './IonicReactProps';
import { createForwardRef } from './utils';

interface IonPageProps extends IonicReactProps {}

interface IonPageInternalProps extends IonPageProps {
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
}

const IonPageInternal: React.FC<IonPageInternalProps> = ({ children, forwardedRef, ...props }) => {
  const context = useContext(NavContext);
  const { className, ...restOfProps } = props;

  if (context.hasIonicRouter()) {
    return (
      <PageManager
        forwardedRef={forwardedRef}
        className={className ?? ''}
        routeInfo={context.routeInfo}
        {...restOfProps}
      >
        {children}
      </PageManager>
    );
  }
  return (
    <div
      ref={forwardedRef}
      className={className ? `ion-page ${className}` : 'ion-page'}
      {...restOfProps}
    >
      {children}
    </div>
  );
};

export const IonPage = createForwardRef<IonPageProps, unknown>(IonPageInternal, 'IonPage');
