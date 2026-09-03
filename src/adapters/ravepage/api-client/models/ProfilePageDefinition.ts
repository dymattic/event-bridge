/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileExternalPlatforms } from './ProfileExternalPlatforms';
import type { ProfileLinkItem } from './ProfileLinkItem';
import type { ProfileMediaSlot } from './ProfileMediaSlot';
import type { ProfilePresence } from './ProfilePresence';
import type { ProfileRecent } from './ProfileRecent';
import type { ProfileRelatedOut } from './ProfileRelatedOut';
import type { ProfileSectionItem } from './ProfileSectionItem';
import type { ProfileSocialAccount } from './ProfileSocialAccount';
import type { ProfileStatsCounters } from './ProfileStatsCounters';
import type { ProfileSummary } from './ProfileSummary';
import type { ProfileUpcoming } from './ProfileUpcoming';
import type { ProfileViewerContext } from './ProfileViewerContext';
export type ProfilePageDefinition = {
    external_platforms?: ProfileExternalPlatforms;
    links?: Array<ProfileLinkItem>;
    /**
     * Always a non-nil slice (empty `[]`
     * when the profile has none) so the FE codegen emits real
     * interfaces, not `unknown`.
     */
    media?: Array<ProfileMediaSlot>;
    page_version?: number;
    /**
     * Each pointer ships JSON `null`
     * when the owner type doesn't carry it OR its (cross-worker) loader
     * is unwired. Replaces the prior `json.RawMessage` placeholders so
     * the FE codegen emits named interfaces (no `Record<string,any>`).
     */
    presence?: ProfilePresence;
    profile?: ProfileSummary;
    recent?: ProfileRecent;
    related?: ProfileRelatedOut;
    schema_version?: number;
    sections?: Array<ProfileSectionItem>;
    social_accounts?: Array<ProfileSocialAccount>;
    stats?: ProfileStatsCounters;
    upcoming?: ProfileUpcoming;
    viewer_context?: ProfileViewerContext;
};

