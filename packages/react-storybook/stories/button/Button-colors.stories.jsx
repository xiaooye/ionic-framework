import React from 'react';

import { IonButton } from '@ionic/react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/IonButton/Colors',
  component: IonButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'warning', 'success', 'danger']
    }
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <IonButton {...args}>{args.label}</IonButton>;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  color: 'primary',
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  label: 'Button',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  color: 'tertiary',
  label: 'Button',
};

export const Warning = Template.bind({});
Warning.args = {
  color: 'warning',
  label: 'Button',
};

export const Danger = Template.bind({});
Danger.args = {
  color: 'danger',
  label: 'Button',
};

export const Success = Template.bind({});
Success.args = {
  color: 'success',
  label: 'Button',
};
