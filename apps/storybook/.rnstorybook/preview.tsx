import type { Preview } from '@storybook/react-native';

import { withNomosTheme } from '../decorators';

const preview: Preview = {
  decorators: [withNomosTheme],
  parameters: {
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
