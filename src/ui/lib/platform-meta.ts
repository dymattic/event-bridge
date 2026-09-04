// Per-platform display metadata + "open on platform" URL builders. Platform-
// neutral: identical shape per platform, fixed order vrc.tl, vrcpop.com, rave.page.
import type { Platform } from '../../shared/agent-protocol';

export const PLATFORM_ORDER: readonly Platform[] = ['vrctl', 'vrcpop', 'ravepage'];

// Human name shown as the primary platform label.
export const PLATFORM_NAME: Record<Platform, string> = {
  vrctl: 'vrc.tl',
  vrcpop: 'vrcpop.com',
  ravepage: 'rave.page',
};

// Host shown as a secondary line (dev host for rave.page).
export const PLATFORM_HOST: Record<Platform, string> = {
  vrctl: 'vrc.tl',
  vrcpop: 'vrcpop.com',
  ravepage: 'development.rave.page',
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

// "Open on platform" URL to the user's own manage/detail surface for an event.
// vrcpop needs the owning group id for the club-scoped manage URL.
export function eventUrl(platform: Platform, id: string, groupId?: string): string {
  switch (platform) {
    case 'ravepage':
      return `https://development.rave.page/events/${id}`;
    case 'vrcpop':
      return groupId ? `https://vrcpop.com/manage/club/${groupId}/events/${id}` : 'https://vrcpop.com/dashboard';
    case 'vrctl':
      return `https://vrc.tl/admin/event/detail/${id}`;
  }
}
