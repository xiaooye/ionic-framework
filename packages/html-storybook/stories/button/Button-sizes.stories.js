// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Components/IonButton/Sizes',
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

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
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
