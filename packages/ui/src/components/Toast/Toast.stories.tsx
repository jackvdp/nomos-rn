import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, type ReactNode } from 'react';

import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { ToastProvider, useToast, type ToastOptions } from './Toast';

interface ToastPlaygroundProps extends Omit<ToastOptions, 'action'> {
  /** Adds an action with this label. */
  actionLabel?: string;
}

/** A screen with its own ToastProvider, as an app root would have. */
function Screen({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Stack fill align="center" justify="center" gap="md" padding="lg">
        {children}
      </Stack>
    </ToastProvider>
  );
}

function PlaygroundTrigger({ actionLabel, ...options }: ToastPlaygroundProps) {
  const toast = useToast();
  return (
    <Button
      label="Show toast"
      onPress={() =>
        toast.show({
          ...options,
          action: actionLabel ? { label: actionLabel, onPress: () => {} } : undefined,
        })
      }
    />
  );
}

function ToastPlayground(props: ToastPlaygroundProps) {
  return (
    <Screen>
      <PlaygroundTrigger {...props} />
    </Screen>
  );
}

const meta = {
  title: 'Feedback/Toast',
  component: ToastPlayground,
  parameters: { fullscreen: true },
  args: {
    message: 'Post published to Northshire Electoral Commission',
    tone: 'success',
    duration: 4000,
    actionLabel: 'View',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'brand', 'info', 'success', 'warning', 'danger'],
    },
    duration: { control: { type: 'number', min: 0, step: 500 } },
  },
} satisfies Meta<typeof ToastPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function ToneButtons() {
  const toast = useToast();
  const examples: (ToastOptions & { button: string })[] = [
    { button: 'Neutral', tone: 'neutral', message: 'Link copied' },
    { button: 'Info', tone: 'info', message: 'Polling station opens at 07:00 tomorrow' },
    { button: 'Success', tone: 'success', message: 'Availability sent to Daniel Mwangi' },
    {
      button: 'Warning',
      tone: 'warning',
      message: "You're offline. Your post will send when you reconnect.",
    },
    {
      button: 'Danger',
      tone: 'danger',
      message: "Couldn't upload your ID document",
      action: { label: 'Retry', onPress: () => {} },
    },
    { button: 'Brand', tone: 'brand', message: 'Welcome to the Northshire workplace' },
  ];
  return (
    <>
      {examples.map(({ button, ...options }) => (
        <Button
          key={button}
          label={button}
          variant="secondary"
          onPress={() => toast.show(options)}
        />
      ))}
    </>
  );
}

export const Tones: Story = {
  render: () => (
    <Screen>
      <ToneButtons />
    </Screen>
  ),
};

function UndoDemo() {
  const toast = useToast();
  return (
    <Button
      label="Delete draft"
      variant="danger"
      leadingIcon="trash"
      onPress={() =>
        toast.show({
          message: 'Draft deleted',
          icon: 'trash',
          action: {
            label: 'Undo',
            onPress: () => toast.show({ message: 'Draft restored', tone: 'success' }),
          },
        })
      }
    />
  );
}

export const WithAction: Story = {
  render: () => (
    <Screen>
      <UndoDemo />
    </Screen>
  ),
};

const colleagues = ['Amara Okafor', 'Daniel Mwangi', 'Priya Raman', 'Joseph Mensah', 'Lena Novak'];

function StackDemo() {
  const toast = useToast();
  return (
    <>
      <Text variant="bodySm" color="secondary" align="center">
        Up to three show at once; the rest wait their turn.
      </Text>
      <Button
        label="Sync 5 shift changes"
        onPress={() =>
          colleagues.forEach((name) =>
            toast.show({ message: `Shift updated for ${name}`, tone: 'info', duration: 2500 }),
          )
        }
      />
    </>
  );
}

export const Stacking: Story = {
  render: () => (
    <Screen>
      <StackDemo />
    </Screen>
  ),
};

function StickyOnMount() {
  const toast = useToast();
  useEffect(() => {
    const id = toast.show({
      message: "You're offline. Changes will sync when you reconnect.",
      tone: 'warning',
      icon: 'offline',
      duration: 0,
    });
    return () => toast.hide(id);
  }, [toast]);
  return (
    <Text variant="bodySm" color="secondary" align="center">
      Toasts with duration 0 stay until dismissed.
    </Text>
  );
}

/** Shows a sticky toast straight away, so the toast itself is visible (and smoke-tested). */
export const Sticky: Story = {
  render: () => (
    <Screen>
      <StickyOnMount />
    </Screen>
  ),
};
