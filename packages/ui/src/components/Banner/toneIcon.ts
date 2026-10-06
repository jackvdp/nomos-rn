import type { Tone } from '@nomos/tokens';

import type { IconName } from '../Icon';

/** Default icon per tone, shared by Banner and Toast so colour is never the only signal. */
export const toneIcon: Record<Tone, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  neutral: 'info',
  brand: 'info',
};
