// Per-platform display metadata. Platform-neutral: identical shape per platform,
// fixed order vrc.tl, vrcpop.com, rave.page. PURE (no webext/settings imports) so
// node-run tests of lineup-bridge/event-filters can load it. rave.page's host and
// URLs derive from the configured instance -> platform-urls.ts (settings-bound).
import type { Platform } from '../../shared/agent-protocol';

export const PLATFORM_ORDER: readonly Platform[] = ['vrctl', 'vrcpop', 'ravepage'];

// Human name shown as the primary platform label.
export const PLATFORM_NAME: Record<Platform, string> = {
  vrctl: 'vrc.tl',
  vrcpop: 'vrcpop.com',
  ravepage: 'rave.page',
};

// Static hosts for the third-party platforms (secondary line). rave.page's host
// is configurable -> platform-urls.ts platformHost().
export const PLATFORM_HOST: Record<'vrctl' | 'vrcpop', string> = {
  vrctl: 'vrc.tl',
  vrcpop: 'vrcpop.com',
};

// Third-party hosts we act inside at human scale (pace reads); rave.page is our
// own API and is not throttled.
export const THIRD_PARTY: Record<Platform, boolean> = {
  vrctl: true,
  vrcpop: true,
  ravepage: false,
};

// Minimum gap between successive agent HTTP reads to the same third-party host.
export const READ_GAP_MS = 300;

// Public event-page URL builders for the third-party hosts (static, no settings).
// The PUBLIC share link, distinct from the owner's manage URL (-> platform-urls
// eventUrl). rave.page's public URL derives from the instance -> publicEventUrl.
// verified 2026-09-07: both return 200 with OG tags.
export const PUBLIC_EVENT_URL: Record<'vrctl' | 'vrcpop', (id: string) => string> = {
  vrctl: (id) => `https://vrc.tl/event/${id}`,
  vrcpop: (id) => `https://vrcpop.com/event/${id}`,
};

// Public performer profile URL (vrcpop slug-based).
export const PUBLIC_PERFORMER_URL = {
  vrcpop: (slug: string) => `https://vrcpop.com/u/${slug}`,
};
