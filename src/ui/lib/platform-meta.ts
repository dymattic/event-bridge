// Per-platform display metadata + "open on platform" URL builders. Platform-
// neutral: identical shape per platform, fixed order vrc.tl, vrcpop.com, rave.page.
// rave.page's host/URLs derive from the configured instance (settings), so no
// rave.page host is hardcoded here.
import type { Platform } from '../../shared/agent-protocol';
import { getRavepageInstance } from '../../runtime/settings';

export const PLATFORM_ORDER: readonly Platform[] = ['vrctl', 'vrcpop', 'ravepage'];

// Human name shown as the primary platform label.
export const PLATFORM_NAME: Record<Platform, string> = {
  vrctl: 'vrc.tl',
  vrcpop: 'vrcpop.com',
  ravepage: 'rave.page',
};

// Static hosts for the third-party platforms (secondary line). rave.page's host
// is configurable → use platformHost().
export const PLATFORM_HOST: Record<'vrctl' | 'vrcpop', string> = {
  vrctl: 'vrc.tl',
  vrcpop: 'vrcpop.com',
};

// Host shown as a secondary line. rave.page reads the configured app instance.
export async function platformHost(platform: Platform): Promise<string> {
  if (platform === 'ravepage') return new URL((await getRavepageInstance()).appOrigin).host;
  return PLATFORM_HOST[platform];
}

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
// vrcpop needs the owning group id for the club-scoped manage URL. rave.page uses
// the configured app instance, so this is async.
export async function eventUrl(platform: Platform, id: string, groupId?: string): Promise<string> {
  switch (platform) {
    case 'ravepage':
      return `${(await getRavepageInstance()).appOrigin}/events/${id}`;
    case 'vrcpop':
      return groupId ? `https://vrcpop.com/manage/club/${groupId}/events/${id}` : 'https://vrcpop.com/dashboard';
    case 'vrctl':
      return `https://vrc.tl/admin/event/detail/${id}`;
  }
}
