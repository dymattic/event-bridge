/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileSectionID } from './ProfileSectionID';
export type ProfileSectionItem = {
    /**
     * ClientID is an optional identifier for the client app managing
     * this section. Null when unset.
     */
    client_id?: string;
    /**
     * Config is the free-form section configuration. Empty object when
     * unset.
     */
    config?: Array<number>;
    /**
     * ID is the canonical prefixed profile-section identifier. Wire
     * form: `prs_<uuid>`. Maps to `profile_sections.id`.
     */
    id?: ProfileSectionID;
    /**
     * IsEnabled is true when the section is currently active.
     */
    is_enabled?: boolean;
    /**
     * Layout is the free-form layout configuration. Empty object when
     * unset.
     */
    layout?: Array<number>;
    /**
     * OrderIndex is the ordering index within the profile (ascending).
     */
    order_index?: number;
    /**
     * Title is the optional display title. Null when unset.
     */
    title?: string;
    /**
     * Type is the free-form section type discriminator (e.g.
     * `markdown`, `video`, `links`, `tracklist`).
     */
    type?: string;
    /**
     * Variant is the optional section variant / template key. Null
     * when unset.
     */
    variant?: string;
    /**
     * Visibility is the visibility scope. One of `public`, `unlisted`,
     * `private`.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

