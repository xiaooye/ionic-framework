import React from 'react';
import PropTypes from 'prop-types';

import { IonButton } from '@ionic/react';

import './button.css';

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, size, color, label, ...props }) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <IonButton
      type='button'
      size={size}
      color={color}
      {...props}>
      {label}
    </IonButton>
    // <section>
    //   <header>Sizes</header>
    //   <IonButton size="small">
    //     Small
    //   </IonButton>
    //   <IonButton>
    //     Default
    //   </IonButton>
    //   <IonButton size="large">
    //     Large
    //   </IonButton>
    // </section>
    // <button
    //   type="button"
    //   className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
    //   style={backgroundColor && { backgroundColor }}
    //   {...props}
    // >
    //   {label}
    // </button>
  );
};

Button.propTypes = {
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'default', 'large']),

  color: PropTypes.oneOf(['secondary', 'success', 'tertiary', 'danger', 'warning']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'default',
  onClick: undefined,
};
