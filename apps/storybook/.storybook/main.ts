import type { StorybookConfig } from '@storybook/react-native-web-vite';

// Browser Storybook for the same stories, rendered through react-native-web.
// Useful for reviewing the library on a desktop or sharing a static build.
// The on-device Storybook in ../.rnstorybook remains the source of truth for
// how components look and behave on iOS and Android.
const main: StorybookConfig = {
  stories: ['../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
};

export default main;
