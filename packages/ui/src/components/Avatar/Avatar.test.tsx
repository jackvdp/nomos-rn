import { fireEvent, renderWithTheme, screen } from '../../test-utils';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  test('is an image labelled with the name and shows initials', async () => {
    await renderWithTheme(<Avatar name="Amara Okafor" />);
    expect(screen.getByRole('img', { name: 'Amara Okafor' })).toBeOnTheScreen();
    expect(screen.getByText('AO')).toBeOnTheScreen();
  });

  test('uses one initial for a single-word name', async () => {
    await renderWithTheme(<Avatar name="  yusuf " />);
    expect(screen.getByText('Y')).toBeOnTheScreen();
  });

  test('adds the verified label when verified', async () => {
    await renderWithTheme(
      <Avatar
        name="Northshire Electoral Commission"
        shape="rounded"
        verified
        verifiedLabel="Verified institution"
      />,
    );
    expect(
      screen.getByRole('img', { name: 'Northshire Electoral Commission, Verified institution' }),
    ).toBeOnTheScreen();
  });

  test('replaces the initials once the image loads', async () => {
    await renderWithTheme(
      <Avatar name="Priya Raman" source={{ uri: 'file:///priya.jpg' }} testID="avatar" />,
    );
    expect(screen.getByText('PR')).toBeOnTheScreen();
    await fireEvent(screen.getByTestId('avatar-image', { includeHiddenElements: true }), 'load');
    expect(screen.queryByText('PR')).not.toBeOnTheScreen();
  });

  test('falls back to initials when the image fails to load', async () => {
    await renderWithTheme(
      <Avatar name="Daniel Mwangi" source={{ uri: 'file:///missing.jpg' }} testID="avatar" />,
    );
    await fireEvent(screen.getByTestId('avatar-image', { includeHiddenElements: true }), 'error');
    expect(screen.queryByTestId('avatar-image', { includeHiddenElements: true })).not.toBeOnTheScreen();
    expect(screen.getByText('DM')).toBeOnTheScreen();
  });

  test('prefers an explicit accessibility label', async () => {
    await renderWithTheme(<Avatar name="" aria-label="Unknown member" />);
    expect(screen.getByRole('img', { name: 'Unknown member' })).toBeOnTheScreen();
  });
});
