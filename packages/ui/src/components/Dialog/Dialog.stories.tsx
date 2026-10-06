import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Dialog, type DialogProps } from './Dialog';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  parameters: { fullscreen: true },
  args: {
    visible: false,
    onDismiss: () => {},
    title: 'Revoke credential?',
    message:
      'Amara Okafor will no longer be able to show this credential or sign in to the Northshire Electoral Commission workplace.',
    dismissable: true,
  },
  argTypes: {
    onDismiss: { action: 'dismissed' },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Opens the dialog from a button and closes it on dismiss or any action. */
function DialogDemo({
  triggerLabel = 'Open dialog',
  ...props
}: DialogProps & { triggerLabel?: string }) {
  const [visible, setVisible] = useState(props.visible);
  const close = () => setVisible(false);
  return (
    <Stack fill align="center" justify="center" padding="lg">
      <Button label={triggerLabel} onPress={() => setVisible(true)} />
      <Dialog
        {...props}
        visible={visible}
        onDismiss={() => {
          props.onDismiss();
          close();
        }}
        actions={props.actions?.map((action) => ({
          ...action,
          onPress: () => {
            action.onPress();
            close();
          },
        }))}
      />
    </Stack>
  );
}

const revokeActions: DialogProps['actions'] = [
  { label: 'Cancel', onPress: () => {} },
  { label: 'Revoke', variant: 'danger', onPress: () => {} },
];

export const Playground: Story = {
  args: { actions: revokeActions },
  render: (args) => <DialogDemo {...args} />,
};

export const RevokeCredential: Story = {
  args: { actions: revokeActions },
  render: (args) => <DialogDemo {...args} triggerLabel="Revoke credential" />,
};

export const LeaveWorkspace: Story = {
  args: {
    title: 'Leave workspace?',
    message:
      "You'll lose access to posts and files in Polling Day Coordination. A workspace admin can invite you back.",
    actions: [
      { label: 'Stay', onPress: () => {} },
      { label: 'Leave', variant: 'danger', onPress: () => {} },
    ],
  },
  render: (args) => <DialogDemo {...args} triggerLabel="Leave workspace" />,
};

export const StackedActions: Story = {
  args: {
    title: 'Save your availability?',
    message: 'You changed your availability for 14 November. Presiding officers see it straight away.',
    actions: [
      { label: 'Discard changes', variant: 'tertiary', onPress: () => {} },
      { label: 'Keep editing', onPress: () => {} },
      { label: 'Save availability', onPress: () => {} },
    ],
  },
  render: (args) => <DialogDemo {...args} triggerLabel="Edit availability" />,
};

export const RequiresAChoice: Story = {
  args: {
    title: 'Confirm your polling station',
    message: 'Your shift on 14 November is at Northshire Library, Station 14. Is that right?',
    dismissable: false,
    actions: [
      { label: 'No, change it', onPress: () => {} },
      { label: 'Yes', onPress: () => {} },
    ],
  },
  render: (args) => <DialogDemo {...args} triggerLabel="Confirm station" />,
};

export const WithContent: Story = {
  args: {
    title: 'Share with your workspace?',
    message: undefined,
    actions: [
      { label: 'Cancel', onPress: () => {} },
      { label: 'Share', onPress: () => {} },
    ],
    children: (
      <Text variant="bodySm" color="secondary">
        Visible to 24 members of Polling Day Coordination, including Daniel Mwangi and Priya Raman.
      </Text>
    ),
  },
  render: (args) => <DialogDemo {...args} triggerLabel="Share post" />,
};

/** Starts open, so the open state is visible without interaction (and covered by the smoke test). */
export const Open: Story = {
  args: { visible: true, actions: revokeActions },
  render: (args) => <DialogDemo {...args} triggerLabel="Open again" />,
};
