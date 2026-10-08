import Ionicons from '@expo/vector-icons/Ionicons';
import type { IconSize } from '@nomos/tokens';
import { I18nManager, type StyleProp, type TextStyle } from 'react-native';

import { useTheme } from '../../theme';

/**
 * The icon set, by meaning rather than by glyph. Components and screens use
 * these names, so the underlying font (Ionicons today) can be swapped for a
 * NOMOS icon set later without touching call sites.
 */
export const iconGlyphs = {
  add: 'add',
  'arrow-back': 'arrow-back',
  'arrow-forward': 'arrow-forward',
  attach: 'attach',
  bell: 'notifications-outline',
  book: 'book-outline',
  building: 'business-outline',
  calendar: 'calendar-outline',
  camera: 'camera-outline',
  chat: 'chatbubble-outline',
  chats: 'chatbubbles-outline',
  check: 'checkmark',
  'check-circle': 'checkmark-circle',
  'chevron-back': 'chevron-back',
  'chevron-down': 'chevron-down',
  'chevron-forward': 'chevron-forward',
  'chevron-up': 'chevron-up',
  close: 'close',
  'close-circle': 'close-circle',
  copy: 'copy-outline',
  document: 'document-text-outline',
  download: 'download-outline',
  edit: 'create-outline',
  error: 'alert-circle',
  eye: 'eye-outline',
  'eye-off': 'eye-off-outline',
  filter: 'options-outline',
  globe: 'globe-outline',
  heart: 'heart-outline',
  home: 'home-outline',
  'id-card': 'id-card-outline',
  image: 'image-outline',
  info: 'information-circle',
  layers: 'layers-outline',
  link: 'link-outline',
  location: 'location-outline',
  lock: 'lock-closed-outline',
  logout: 'log-out-outline',
  mail: 'mail-outline',
  menu: 'menu',
  minus: 'remove',
  more: 'ellipsis-horizontal',
  'more-vertical': 'ellipsis-vertical',
  news: 'newspaper-outline',
  offline: 'cloud-offline-outline',
  person: 'person-outline',
  people: 'people-outline',
  qr: 'qr-code-outline',
  refresh: 'refresh',
  ribbon: 'ribbon-outline',
  scan: 'scan-outline',
  school: 'school-outline',
  search: 'search',
  send: 'send',
  settings: 'settings-outline',
  share: 'share-outline',
  shield: 'shield-outline',
  star: 'star-outline',
  success: 'checkmark-circle',
  time: 'time-outline',
  trash: 'trash-outline',
  verified: 'shield-checkmark',
  warning: 'warning',
} as const satisfies Record<string, keyof typeof Ionicons.glyphMap>;

export type IconName = keyof typeof iconGlyphs;

/** Glyphs that point along the reading direction and flip in right-to-left layouts. */
const directional: ReadonlySet<IconName> = new Set([
  'arrow-back',
  'arrow-forward',
  'chevron-back',
  'chevron-forward',
  'send',
  'logout',
]);

export interface IconProps {
  name: IconName;
  /** A size from the scale or a number in dp. Defaults to `md` (20). */
  size?: IconSize | number;
  /** Any colour. Defaults to the primary text colour. */
  color?: string;
  /**
   * Icons are decorative by default and hidden from screen readers. Give a
   * label only when the icon carries meaning on its own.
   */
  'aria-label'?: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

export function Icon({
  name,
  size = 'md',
  color,
  'aria-label': ariaLabel,
  style,
  testID,
}: IconProps) {
  const theme = useTheme();
  const px = typeof size === 'number' ? size : theme.sizes.icon[size];
  const flip = I18nManager.isRTL && directional.has(name);
  return (
    <Ionicons
      name={iconGlyphs[name]}
      size={px}
      color={color ?? theme.colors.text.primary}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      style={[flip && { transform: [{ scaleX: -1 }] }, style]}
      testID={testID}
    />
  );
}
