/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentKind } from './AttachmentKind';
export type AdminMediaPipelineAttachmentOut = {
    /**
     * EventID is the prefixed event id (event-* kinds only).
     */
    event_id?: string;
    /**
     * EventTitle is the event title at query time.
     */
    event_title?: string;
    /**
     * Kind is the attached-surface type.
     */
    kind?: AttachmentKind;
    /**
     * ProfileID is the prefixed profile id (profile-* kinds only).
     */
    profile_id?: string;
    /**
     * ProfileOwnerType is one of user/group/performer/club.
     */
    profile_owner_type?: string;
    /**
     * ProfilePublished mirrors the owning profile's published flag.
     */
    profile_published?: boolean;
    /**
     * ProfileSlug is the slug at query time.
     */
    profile_slug?: string;
    /**
     * ProfileVisibility mirrors the owning profile's visibility flag.
     */
    profile_visibility?: string;
    /**
     * Role is the event-media role (cover/gallery/...).
     */
    role?: string;
    /**
     * Slot is the profile-media slot (avatar/banner/logo/...).
     */
    slot?: string;
    /**
     * Variant is the media-variant id within the slot.
     */
    variant?: string;
};

