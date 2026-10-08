import type { Preview } from '@storybook/react-native-web-vite';

import { withNomosTheme } from '../decorators';

const preview: Preview = {
  decorators: [withNomosTheme],
  globalTypes: {
    theme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          'Layout',
          'Typography',
          'Actions',
          'Forms',
          'Display',
          'Feedback',
          'Overlays',
          'NOMOS',
          'Patterns',
        ],
      },
    },
  },
};

export default preview;
