/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LinkVerifyResult = {
    /**
     * CanonicalID is the platform's own resource id: the YouTube video id
     * or the SoundCloud numeric track id. "" when not found.
     */
    canonical_id?: string;
    /**
     * Checked is true iff the producer actually queried the platform for
     * this item. false = unsupported platform / no client / quota or rate
     * limit - the caller MUST NOT treat Exists=false as a disown when
     * Checked is false.
     */
    checked?: boolean;
    /**
     * Exists is true iff the platform confirmed the resource is present
     * and visible to an anonymous client. Meaningful only when Checked.
     */
    exists?: boolean;
    /**
     * OwnerID is the owning account's id: the YouTube channel id or the
     * SoundCloud numeric user id. "" when unknown. For SoundCloud this is
     * matched against identity's SoundCloudLinkOut.ProviderID.
     */
    owner_id?: string;
    /**
     * OwnerName is the owning account's handle/display: the YouTube
     * channel title or the SoundCloud owner permalink (username). For
     * SoundCloud this is matched against identity's
     * SoundCloudLinkOut.ProviderUsername.
     */
    owner_name?: string;
    /**
     * Platform echoes the item's platform.
     */
    platform?: string;
    /**
     * Ref echoes the request item's Ref.
     */
    ref?: string;
    /**
     * Title is the resource title (display + audit). "" when unknown.
     */
    title?: string;
    /**
     * URL echoes the item's url.
     */
    url?: string;
};

