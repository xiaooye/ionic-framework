import { create } from '@storybook/theming';

export default create({
  base: 'light',

  // UI
  appBorderRadius: 4,

  // Text colors
  textColor: 'rgb(68, 91, 120)',

  // Typography
  fontBase: 'Söhne, "Helvetica Neue", Helvetica, Arial, sans-serif',

  // Toolbar
  barBg: '#428cff',
  barTextColor: '#f4f5f8',
  barSelectedColor: 'white',

  // Form colors
  inputBorder: 'rgb(206, 214, 224)',
  inputTextColor: 'rgb(34, 45, 58)',

  brandTitle: 'Ionic UI',
  brandUrl: 'https://ionic.io/docs/',
  brandImage: '/logo.png'
});
