/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistAccess } from './PlaylistAccess';
import type { PlaylistItemOut } from './PlaylistItemOut';
import type { PlaylistVisibility } from './PlaylistVisibility';
export type PlaylistOut = {
    /**
     * Access flags how the caller sees this playlist (owner|shared|public).
     */
    access?: PlaylistAccess;
    /**
     * CreatedAt is the RFC3339 creation timestamp.
     */
    created_at?: string;
    /**
     * Description (empty when unset).
     */
    description?: string;
    /**
     * ID is the prefixed playlist id (`pl_<uuid>`).
     */
    id?: string;
    /**
     * Items, present only when requested (`?include=items`) or on the
     * replace-all items response.
     */
    items?: Array<PlaylistItemOut>;
    /**
     * OwnerUserID is the owning user.
     */
    owner_user_id?: string;
    /**
     * SharedRole is the caller's accepted-grant role (viewer|editor),
     * null when access is not grant-derived.
     */
    shared_role?: string;
    /**
     * Title.
     */
    title?: string;
    /**
     * UpdatedAt is the RFC3339 last-write timestamp.
     */
    updated_at?: string;
    /**
     * Visibility: public | unlisted | private.
     */
    visibility?: PlaylistVisibility;
};

