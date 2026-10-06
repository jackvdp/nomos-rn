/**
 * Renders every story in both colour schemes. Catches crashes, missing
 * providers and broken args across the whole library without a test per
 * story. Behaviour belongs in each component's own test file.
 */
import { composeStories } from '@storybook/react';
import fs from 'node:fs';
import path from 'node:path';
import type { ComponentType } from 'react';

import { renderWithTheme } from './test-utils';

function findStoryFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findStoryFiles(full);
    return /\.stories\.tsx$/.test(entry.name) ? [full] : [];
  });
}

const storyFiles = findStoryFiles(__dirname);

test('finds story files', () => {
  expect(storyFiles.length).toBeGreaterThan(0);
});

describe.each(storyFiles.map((file) => [path.relative(__dirname, file), file]))('%s', (_name, file) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const stories = composeStories(require(file)) as Record<string, ComponentType>;
  const cases = Object.entries(stories).flatMap(([storyName, Story]) =>
    (['light', 'dark'] as const).map((scheme) => ({ storyName, scheme, Story })),
  );

  test.each(cases)('$storyName renders in $scheme', async ({ Story, scheme }) => {
    const { toJSON } = await renderWithTheme(<Story />, { colorScheme: scheme });
    expect(toJSON()).not.toBeNull();
  });
});
