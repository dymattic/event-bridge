// Settings-dependent platform URL helpers. rave.page's host/URLs derive from the
// configured instance (runtime/settings -> webext storage), so this module is
// NOT node-importable. Pure display constants live in platform-meta.ts - keep
// them apart so pure modules (lineup-bridge, event-filters) stay node-testable.
import type { Platform } from '../../shared/agent-protocol';
import { getRavepageInstance } from '../../runtime/settings';
import { PLATFORM_HOST } from './platform-meta';

// Host shown as a secondary line. rave.page reads the configured app instance.
export async function platformHost(platform: Platform): Promise<string> {
  if (platform === 'ravepage') return new URL((await getRavepageInstance()).appOrigin).host;
  return PLATFORM_HOST[platform];
}

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
