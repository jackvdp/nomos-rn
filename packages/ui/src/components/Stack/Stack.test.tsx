import { Text } from 'react-native';

import { renderWithTheme, screen } from '../../test-utils';
import { lightTheme } from '../../theme';
import { Stack } from './Stack';

const { space } = lightTheme;

describe('Stack', () => {
  test('applies gap and padding from the spacing scale', async () => {
    await renderWithTheme(<Stack testID="stack" gap="lg" padding="xl" />);
    expect(screen.getByTestId('stack')).toHaveStyle({
      flexDirection: 'column',
      gap: space.lg,
      padding: space.xl,
    });
  });

  test('applies axis padding and the none step', async () => {
    await renderWithTheme(
      <Stack testID="stack" gap="none" paddingHorizontal="md" paddingVertical="xs" />,
    );
    expect(screen.getByTestId('stack')).toHaveStyle({
      gap: 0,
      paddingHorizontal: space.md,
      paddingVertical: space.xs,
    });
  });

  test('lays out a wrapping row with alignment', async () => {
    await renderWithTheme(
      <Stack testID="stack" direction="row" wrap align="center" justify="space-between" fill />,
    );
    expect(screen.getByTestId('stack')).toHaveStyle({
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    });
  });

  test('passes through View props and renders children', async () => {
    await renderWithTheme(
      <Stack testID="team" role="list" aria-label="Station team" style={{ opacity: 0.5 }}>
        <Text>Amara Okafor</Text>
        <Text>Priya Raman</Text>
      </Stack>,
    );
    const list = screen.getByTestId('team');
    expect(list).toHaveProp('role', 'list');
    expect(list).toHaveAccessibleName('Station team');
    expect(list).toHaveStyle({ opacity: 0.5 });
    expect(screen.getByText('Priya Raman')).toBeOnTheScreen();
  });
});
