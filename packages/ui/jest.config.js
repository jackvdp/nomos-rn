/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Reanimated's worklets package runs its plain JavaScript build under Jest.
  resolver: 'react-native-worklets/jest/resolver',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-native-safe-area-context|storybook|@storybook/.*)',
  ],
};
