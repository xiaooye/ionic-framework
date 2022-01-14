// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Components/IonButton/Colors',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
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
};

const argsToString = (args) => {
  let props = '';
  for (const key of Object.keys(args)) {
    props += `${key}="${args[key]}" `;
  }
  return props;
}

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template = (args) => `<ion-button ${argsToString(args)}>${args.label}</ion-button>`;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
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
