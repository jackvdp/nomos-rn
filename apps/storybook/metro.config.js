// Expo detects the npm workspace and watches packages/ automatically (SDK 52+),
// so the only addition here is Storybook's story loader.
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(getDefaultConfig(__dirname));
