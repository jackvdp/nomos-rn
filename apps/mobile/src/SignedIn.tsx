import { useTheme } from '@nomos/ui';
import {
  createNativeBottomTabNavigator,
  type NativeBottomTabIcon,
} from '@react-navigation/bottom-tabs/unstable';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useMemo } from 'react';
import { Platform } from 'react-native';

import { HomeScreen } from './home/HomeScreen';
import { WalletScreen } from './wallet/WalletScreen';

/** The tabs, and what each is given when it is opened: nothing, so far. */
export type TabParamList = {
  Home: undefined;
  Wallet: undefined;
};

// The tab bar is the platform's own, so on iOS 26 it is drawn in Liquid
// Glass. React Navigation still calls this navigator unstable: its options
// may change between releases.
const Tab = createNativeBottomTabNavigator<TabParamList>();

// The tabs' wording in one place, ready to move into translations.
const copy = {
  home: 'Home',
  wallet: 'Wallet',
};

// The platform draws the icons, so they cannot be `Icon` components. iOS has
// its own symbols, filled as they are in a tab bar; Android is given images
// of the app's icons, which it tints.
const icons = Platform.select<Record<'home' | 'wallet', NativeBottomTabIcon>>({
  ios: {
    home: { type: 'sfSymbol', name: 'house.fill' },
    wallet: { type: 'sfSymbol', name: 'wallet.pass.fill' },
  },
  default: {
    home: { type: 'image', source: require('../assets/tabs/home.png') },
    wallet: { type: 'image', source: require('../assets/tabs/wallet.png') },
  },
});

/** What a signed-in user sees: the app's screens, behind a tab bar. */
export function SignedIn() {
  const theme = useTheme();
  // React Navigation colours what it draws itself (the tab bar and the
  // background behind a screen) from its own theme, so it is given the app's.
  const navigationTheme = useMemo(() => {
    const base = theme.colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        // The selected tab.
        primary: theme.colors.text.link,
        background: theme.colors.bg.canvas,
        card: theme.colors.bg.surface,
        text: theme.colors.text.primary,
        border: theme.colors.border.default,
      },
    };
  }, [theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: copy.home, tabBarIcon: icons.home }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ tabBarLabel: copy.wallet, tabBarIcon: icons.wallet }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
