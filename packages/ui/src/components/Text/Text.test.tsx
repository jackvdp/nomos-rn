import type { TextVariant } from '@nomos/tokens';

import { renderWithTheme, screen } from '../../test-utils';
import { Text } from './Text';

describe('Text', () => {
  test.each<TextVariant>(['display', 'headingLg', 'headingMd', 'headingSm'])(
    '%s is exposed as a heading',
    async (variant) => {
      await renderWithTheme(<Text variant={variant}>Upcoming training</Text>);
      expect(screen.getByRole('heading', { name: 'Upcoming training' })).toBeOnTheScreen();
    },
  );

  test.each<TextVariant>(['body', 'bodyStrong', 'label', 'caption'])(
    '%s is not a heading',
    async (variant) => {
      await renderWithTheme(<Text variant={variant}>Presiding officer</Text>);
      expect(screen.getByText('Presiding officer')).toBeOnTheScreen();
      expect(screen.queryByRole('heading')).toBeNull();
    },
  );

  test('lets an explicit role win over the heading default', async () => {
    await renderWithTheme(
      <Text variant="headingSm" role="alert">
        Session expired
      </Text>,
    );
    expect(screen.getByRole('alert', { name: 'Session expired' })).toBeOnTheScreen();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  test('passes through native Text props', async () => {
    await renderWithTheme(
      <Text numberOfLines={2} testID="summary" aria-label="Shift summary">
        Morning shift, Station 12
      </Text>,
    );
    const text = screen.getByTestId('summary');
    expect(text).toHaveProp('numberOfLines', 2);
    expect(text).toHaveAccessibleName('Shift summary');
  });
});
