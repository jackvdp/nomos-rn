import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';

import { Stack } from '../Stack';
import { Text } from '../Text';
import {
  SegmentedControl,
  type SegmentedControlOption,
  type SegmentedControlProps,
} from './SegmentedControl';

function ControlledSegmentedControl(props: SegmentedControlProps) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return (
    <SegmentedControl
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const sections: SegmentedControlOption[] = [
  { value: 'feed', label: 'Feed' },
  { value: 'events', label: 'Events' },
  { value: 'courses', label: 'Courses' },
];

const meta = {
  title: 'Forms/SegmentedControl',
  component: SegmentedControl,
  args: {
    options: sections,
    value: 'feed',
    size: 'md',
    fullWidth: false,
    'aria-label': 'Workplace sections',
    onChange: () => {},
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  render: (args) => <ControlledSegmentedControl {...args} />,
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md">
      <ControlledSegmentedControl {...args} size="sm" />
      <ControlledSegmentedControl {...args} size="md" />
    </Stack>
  ),
};

export const WithIcons: Story = {
  args: {
    options: [
      { value: 'feed', label: 'Feed', icon: 'news' },
      { value: 'events', label: 'Events', icon: 'calendar' },
      { value: 'courses', label: 'Courses', icon: 'school' },
    ],
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'completed', label: 'Completed' },
      { value: 'expired', label: 'Expired', disabled: true },
    ],
    value: 'upcoming',
  },
};

const content = {
  feed: 'Amara Okafor posted an update to Northshire Electoral Commission.',
  events: 'Poll worker briefing, Thursday 18:00 at Ward 12 community hall.',
  courses: 'Poll worker training: Module 3 is 60% complete.',
} as const;

function WorkplaceHome() {
  const [section, setSection] = useState<keyof typeof content>('feed');
  return (
    <Stack gap="lg">
      <Stack gap="xxs">
        <Text variant="overline" color="secondary">
          Northshire Electoral Commission
        </Text>
        <Text variant="headingLg">Workplace</Text>
      </Stack>
      <SegmentedControl
        aria-label="Workplace sections"
        options={[
          { value: 'feed', label: 'Feed', icon: 'news' },
          { value: 'events', label: 'Events', icon: 'calendar' },
          { value: 'courses', label: 'Courses', icon: 'school' },
        ]}
        value={section}
        onChange={setSection}
        fullWidth
      />
      <Text>{content[section]}</Text>
    </Stack>
  );
}

export const Workplace: Story = {
  render: () => <WorkplaceHome />,
};
