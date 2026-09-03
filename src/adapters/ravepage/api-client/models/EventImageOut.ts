/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventImageID } from './EventImageID';
import type { UserID } from './UserID';
export type EventImageOut = {
    /**
     * Caption is the optional image caption.
     */
    caption?: string;
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * EventID is the parent event reference - prefixed `evt_<uuid>`.
     */
    event_id?: EventID;
    /**
     * ID is the canonical prefixed image identifier. Wire form:
     * `evi_<uuid>`.
     */
    id?: EventImageID;
    /**
     * ImageType is the optional category (`gallery | flyer | banner |
     * poster`). JSON null when NULL in DB.
     */
    image_type?: string;
    /**
     * SortOrder is the integer sort key.
     */
    sort_order?: number;
    /**
     * UploadedByUserID is the user who uploaded this image - prefixed
     * `usr_<uuid>`. JSON null when NULL in DB. parity at
     */
    uploaded_by_user_id?: UserID;
    /**
     * URL is the image URL.
     */
    url?: string;
};

