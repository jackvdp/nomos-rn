import { renderWithTheme, screen } from '../../test-utils';
import { ContextLabel } from './ContextLabel';

describe('ContextLabel', () => {
  test('shows the name and the audience', async () => {
    await renderWithTheme(
      <ContextLabel kind="organisation" name="Northshire Electoral Commission" audience="Members only" />,
    );
    expect(screen.getByText('Northshire Electoral Commission')).toBeOnTheScreen();
    expect(screen.getByText('Members only')).toBeOnTheScreen();
  });

  test('combines name and audience into one accessibility label', async () => {
    await renderWithTheme(
      <ContextLabel kind="network" name="NOMOS Network" audience="Public to the Network" />,
    );
    expect(screen.getByLabelText('NOMOS Network, Public to the Network')).toBeOnTheScreen();
  });

  test('reads just the name without an audience', async () => {
    await renderWithTheme(<ContextLabel kind="workspace" name="Polling logistics workspace" />);
    expect(screen.getByLabelText('Polling logistics workspace')).toBeOnTheScreen();
  });

  test('passes the kind to formatAccessibilityLabel', async () => {
    const kinds = { organisation: 'Organisation', network: 'Network', workspace: 'Workspace' };
    await renderWithTheme(
      <ContextLabel
        kind="workspace"
        name="Polling logistics workspace"
        audience="Members only"
        formatAccessibilityLabel={({ kind, name, audience }) => `${kinds[kind]}: ${name}. ${audience}`}
      />,
    );
    expect(
      screen.getByLabelText('Workspace: Polling logistics workspace. Members only'),
    ).toBeOnTheScreen();
  });
});
