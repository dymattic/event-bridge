/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileLinkID } from './ProfileLinkID';
export type ProfileLinkItem = {
    /**
     * DisplayOrder is the render order. Default 0.
     */
    display_order?: number;
    /**
     * ID is the canonical prefixed profile-link identifier. Wire
     * form: `plnk_<uuid>`. Maps to `profile_links.id`.
     */
    id?: ProfileLinkID;
    /**
     * Label is the optional display label. Null when unset.
     */
    label?: string;
    /**
     * LinkType is the typed link category. One of `website`, `store`,
     * `mailing_list`, `press_kit`, `linktree`, `discord`, `contact`,
     * `booking`, `donate`, `merch`, `custom`.
     */
    link_type?: string;
    /**
     * URL is the destination URL.
     */
    url?: string;
};

