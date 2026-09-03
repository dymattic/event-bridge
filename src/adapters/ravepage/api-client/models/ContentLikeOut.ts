/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LikeID } from './LikeID';
export type ContentLikeOut = {
    content_id?: string;
    /**
     * ContentType is the polymorphic kind tag. One of:
     * event | media_upload | release | tracklist | performer |
     * group | profile. ..]` enforces this set
     * at the input boundary; the wire shape is a plain string.
     */
    content_type?: string;
    /**
     * CreatedAt is the like-creation timestamp in RFC3339Nano /
     * ISO-8601 with timezone offset.
     */
    created_at?: string;
    /**
     * ID is the prefixed like-row identifier (`lik_<uuid>`).
     */
    id?: LikeID;
    user_id?: string;
};

