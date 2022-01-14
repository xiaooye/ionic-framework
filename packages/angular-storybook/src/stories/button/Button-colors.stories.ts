// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';

import { IonButton, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components/IonButton/Colors',
  component: IonButton,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, IonicModule.forRoot()],
    })
  ],
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {

  },
} as Meta;

interface CustomProps {
  label: string;
}

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<IonButton & CustomProps> = (args: IonButton & CustomProps) => ({
  props: args,
  template: `<ion-button color="${args.color}">${args.label}</ion-button>`
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
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

export const Success = Template.bind({});
Success.args = {
  color: 'success',
  label: 'Button',
};

export const Danger = Template.bind({});
Danger.args = {
  color: 'danger',
  label: 'Button',
};
