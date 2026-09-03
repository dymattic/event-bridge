/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UploadAttachableIn = {
    /**
     * IsAdmin - the caller's admin flag derived from the gateway-
     * signed claim's roles. Skips arms 2/4 when true. Trust comes
     * from the gateway being the sole JWT verifier.
     */
    is_admin?: boolean;
    /**
     * TargetID - the parent resource the upload is being attached
     * to. For v1 both target kinds point at an event, so this is
     * `evt_<uuid>` or bare UUID.
     */
    target_id?: string;
    /**
     * TargetKind - discriminates upload-vs-collection AND which
     * parent table the editor check resolves against.
     */
    target_kind?: 'event_media_link' | 'event_collection_link';
    /**
     * UploadID - the `media_uploads.id` OR `media_collections.id`
     * being attached. Discriminated by `TargetKind`:
     *
     * - `event_media_link` → UploadID is a `media_uploads.id`
     * (`upl_<uuid>` or bare UUID)
     * - `event_collection_link` → UploadID is a `media_collections.id`
     * (`mcl_<uuid>` or bare UUID)
     *
     * The handler trims the prefix before parsing.
     */
    upload_id?: string;
    /**
     * UserID - the caller whose attach predicate is being evaluated.
     * Accepts bare-UUID or `usr_<uuid>` form.
     */
    user_id?: string;
};

