// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';

import { IonButton, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components/IonButton',
  component: IonButton,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, IonicModule.forRoot()],
    })
  ],
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    disabled: { type: 'boolean' },
    strong: { type: 'boolean' },
    expand: {
      control: { type: 'select' },
      options: ['full', 'block']
    },
    fill: {
      control: { type: 'select' },
      options: ['clear', 'outline', 'solid', 'default']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'warning', 'success', 'danger']
    },
  },
  parameters: {
    actions: {
      argTypesRegex: '^on.*',
      handles: ['click', 'ionFocus', 'ionBlur']
    }
  },
} as Meta;

interface CustomProps {
  label: string;
}

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<IonButton & CustomProps> = (args: IonButton & CustomProps) => ({
  props: args,
  template: `<ion-button>${args.label}</ion-button>`
});

export const Playground = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Playground.args = {
  label: 'Button',
};

