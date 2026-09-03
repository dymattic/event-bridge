/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileViewerContext } from './ProfileViewerContext';
export type ProfileSummary = {
    background_media_kind?: string;
    background_media_upload_id?: string;
    bio_md?: string;
    canonical_path?: string;
    client_id?: string;
    crm?: Array<number>;
    display_name?: string;
    id?: string;
    is_published?: boolean;
    owner_group_id?: string;
    owner_type?: string;
    owner_user_id?: string;
    slug?: string;
    theme?: Array<number>;
    type?: string;
    /**
     * ViewerContext is the per-caller viewer overlay (can_edit /
     * relationship / is_following), server-authoritative so the FE
     * stops inferring edit rights client-side. Mirrors the
     * ProfilePageDefinition.ViewerContext field (the aggregated bundle)
     * but stamped onto the LEAN projection served by
     * GET /profiles/by-owner-slug (include=page). Null for anonymous
     * viewers (keeps the read CDN-cacheable) and for list responses
     * (by-owner / list-mine leave it zero-valued to avoid a per-row
     * probe - the FE only needs the edit signal on the single-GET).
     */
    viewer_context?: ProfileViewerContext;
    visibility?: 'public' | 'unlisted' | 'private';
};

