import { I18nManager } from 'react-native';

import { renderWithTheme, screen } from '../../test-utils';
import { Icon } from './Icon';

describe('Icon', () => {
  afterEach(() => jest.restoreAllMocks());

  test('is hidden from screen readers by default', async () => {
    await renderWithTheme(<Icon name="location" testID="icon" />);
    expect(screen.queryByTestId('icon')).toBeNull();
    expect(screen.getByTestId('icon', { includeHiddenElements: true })).not.toBeVisible();
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('is exposed as an image when labelled', async () => {
    await renderWithTheme(<Icon name="verified" aria-label="Verified" />);
    expect(screen.getByRole('img', { name: 'Verified' })).toBeVisible();
  });

  test('takes sizes from the scale or in dp', async () => {
    await renderWithTheme(
      <>
        <Icon name="bell" size="lg" testID="scale" />
        <Icon name="bell" size={30} testID="dp" />
      </>,
    );
    expect(screen.getByTestId('scale', { includeHiddenElements: true })).toHaveStyle({ fontSize: 24 });
    expect(screen.getByTestId('dp', { includeHiddenElements: true })).toHaveStyle({ fontSize: 30 });
  });

  test('mirrors directional icons in right-to-left layouts', async () => {
    jest.replaceProperty(I18nManager, 'isRTL', true);
    await renderWithTheme(
      <>
        <Icon name="chevron-forward" testID="chevron" />
        <Icon name="add" testID="add" />
      </>,
    );
    const mirrored = { transform: [{ scaleX: -1 }] };
    expect(screen.getByTestId('chevron', { includeHiddenElements: true })).toHaveStyle(mirrored);
    expect(screen.getByTestId('add', { includeHiddenElements: true })).not.toHaveStyle(mirrored);
  });
});
