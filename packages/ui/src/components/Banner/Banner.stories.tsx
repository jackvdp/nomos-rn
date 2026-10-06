import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import { Button } from '../Button';
import { Stack } from '../Stack';
import { Banner } from './Banner';

const meta = {
  title: 'Feedback/Banner',
  component: Banner,
  args: {
    tone: 'info',
    title: 'Polling station change',
    message: 'Northshire Library is now Station 14. Your shift time is unchanged.',
    dismissLabel: 'Dismiss',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger', 'neutral', 'brand'],
    },
    onDismiss: { action: 'dismissed' },
  },
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="md">
      <Banner {...args} tone="info" title="Info" message="Training materials were updated on 2 October." />
      <Banner {...args} tone="success" title="Success" message="Your availability for 14 November was sent." />
      <Banner {...args} tone="warning" title="Warning" message="Your credential expires in 14 days." />
      <Banner {...args} tone="danger" title="Danger" message="We couldn't save your timesheet." />
      <Banner {...args} tone="neutral" title="Neutral" message="This workspace is read-only during the count." />
      <Banner {...args} tone="brand" title="Brand" message="New: message presiding officers directly." />
    </Stack>
  ),
};

export const MessageOnly: Story = {
  args: { title: undefined, message: 'Posts in this workspace are visible to Northshire staff only.' },
};

export const WithAction: Story = {
  args: {
    tone: 'warning',
    title: 'Credential expires soon',
    message: 'Your credential expires in 14 days.',
    action: { label: 'Renew it', onPress: () => {} },
  },
};

function DismissibleDemo() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return <Button label="Show banner again" variant="secondary" onPress={() => setVisible(true)} />;
  }
  return (
    <Banner
      tone="success"
      title="You're verified"
      message="Northshire Electoral Commission confirmed you as a presiding officer."
      onDismiss={() => setVisible(false)}
    />
  );
}

export const Dismissible: Story = {
  render: () => <DismissibleDemo />,
};

export const NomosUsage: Story = {
  render: () => (
    <Stack gap="md">
      <Banner
        tone="neutral"
        icon="offline"
        message="You're offline. Changes will sync when you reconnect."
      />
      <Banner
        tone="warning"
        message="Your credential expires in 14 days."
        action={{ label: 'Renew it', onPress: () => {} }}
        onDismiss={() => {}}
      />
      <Banner
        tone="danger"
        title="Upload failed"
        message="Amara Okafor's ID document couldn't be uploaded on this connection."
        action={{ label: 'Try again', onPress: () => {} }}
      />
    </Stack>
  ),
};
