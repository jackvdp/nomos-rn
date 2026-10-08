import { renderWithTheme, screen } from '../../test-utils';
import { AvatarGroup } from './AvatarGroup';

const people = [
  { name: 'Amara Okafor' },
  { name: 'Daniel Mwangi' },
  { name: 'Priya Raman' },
  { name: 'Tomás Ferreira' },
  { name: 'Leilani Kahale' },
];

describe('AvatarGroup', () => {
  test('shows up to max avatars and a +N overflow', async () => {
    await renderWithTheme(<AvatarGroup avatars={people} max={3} />);
    expect(screen.getByText('AO', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('PR', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.queryByText('TF', { includeHiddenElements: true })).not.toBeOnTheScreen();
    expect(screen.getByText('+2', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  test('summarises the group in one accessibility label', async () => {
    await renderWithTheme(<AvatarGroup avatars={people} max={2} />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('img')).toHaveAccessibleName('Amara Okafor, Daniel Mwangi and 3 more');
  });

  test('counts members beyond the loaded avatars with total', async () => {
    await renderWithTheme(<AvatarGroup avatars={people.slice(0, 3)} total={128} />);
    expect(screen.getByText('+125', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  test('has no overflow avatar when everyone fits', async () => {
    await renderWithTheme(<AvatarGroup avatars={people.slice(0, 2)} />);
    expect(screen.getByRole('img', { name: 'Amara Okafor, Daniel Mwangi' })).toBeOnTheScreen();
    expect(screen.queryByText(/^\+/, { includeHiddenElements: true })).not.toBeOnTheScreen();
  });

  test('uses the formatters for translated text', async () => {
    await renderWithTheme(
      <AvatarGroup
        avatars={people}
        max={1}
        formatOverflow={(n) => `${n}+`}
        formatAccessibilityLabel={(names, n) => `${names[0]} y ${n} más`}
      />,
    );
    expect(screen.getByText('4+', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByRole('img', { name: 'Amara Okafor y 4 más' })).toBeOnTheScreen();
  });
});
