// vrcpop adapter capabilities. Extends the core VRCPOP_CAPS but downgrades
// `draft` to a tri-state: we may NOT verify draft support (user rule 2026-09-03:
// no test events on vrcpop). Evidence draft is real: draft cards
// (.event-card--draft), action=bulk-publish, and the site's own "Import from
// Discord" flow POSTs status:"draft" to action=create. Still 'expected-unverified'
// until the user's first real use confirms it. Publish stays an explicit toggle
// with a red "PUBLIC immediately" confirm in the UI.
import { VRCPOP_CAPS, type DraftSupport } from '../../core/capabilities';

export type { DraftSupport };

export interface VrcpopCaps extends Omit<typeof VRCPOP_CAPS, 'draft'> {
  draft: DraftSupport;
}

export const vrcpopCaps: VrcpopCaps = {
  ...VRCPOP_CAPS,
  draft: 'expected-unverified',
};
