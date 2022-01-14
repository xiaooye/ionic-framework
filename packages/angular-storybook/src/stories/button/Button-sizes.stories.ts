// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';

import { IonButton, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components/IonButton/Sizes',
  component: IonButton,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, IonicModule.forRoot()],
    })
  ],
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
    },
  },
} as Meta;

interface CustomProps {
  label: string;
}

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<IonButton & CustomProps> = (args: IonButton & CustomProps) => ({
  props: args,
  template: `<ion-button size=${args.size}>${args.label}</ion-button>`
});

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Default.args = {
  size: 'default',
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
