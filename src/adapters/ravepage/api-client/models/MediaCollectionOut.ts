/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MediaCollectionOut = {
    created_at?: string;
    /**
     * Description is nullable - `*string` so absent wire-emits `null`.
     */
    description?: string;
    /**
     * ID is the prefixed wire form "mco_<uuid>".
     */
    id?: string;
    /**
     * MediaTypeFilter is one of: any | image | video | audio.
     */
    media_type_filter?: string;
    name?: string;
    /**
     * OwnerGroupID is the prefixed wire form "grp_<uuid>" or nil.
     */
    owner_group_id?: string;
    /**
     * OwnerUserID is the prefixed wire form "usr_<uuid>" or nil.
     */
    owner_user_id?: string;
    updated_at?: string;
    /**
     * Visibility is one of: public | unlisted | private | shared | friends.
     */
    visibility?: 'public' | 'unlisted' | 'private' | 'shared' | 'friends';
};

