/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupGenreFamily } from './GroupGenreFamily';
import type { GroupID } from './GroupID';
import type { GroupTypeOut } from './GroupTypeOut';
import type { MediaUploadID } from './MediaUploadID';
export type GroupWithMembershipRoleOut = {
    /**
     * AvatarURL is the **legacy** plain-URL avatar field. The
     * canonical avatar lives in profiles via `ProfileMedia`
     * - when absent on this field, the FE consults the profile
     * media slots.
     */
    avatar_url?: string;
    /**
     * BackgroundMediaKind is `image` or `video`. Optional.
     */
    background_media_kind?: string;
    /**
     * BackgroundMediaUploadID is the prefixed media-upload
     * reference for the group's background. Optional.
     */
    background_media_upload_id?: MediaUploadID;
    /**
     * BannerURL is the **legacy** plain-URL banner field. Same
     * transition note as AvatarURL.
     */
    banner_url?: string;
    /**
     * BioMD is the markdown biography. Optional.
     */
    bio_md?: string;
    /**
     * CanEdit is true when the authenticated viewer may modify this
     * group (group_memberships.role in the organizer set -
     * admin/owner/manager, mirroring the _assert_group_admin authz
     * path).
     */
    can_edit?: boolean;
    /**
     * CanOrganizeEvents is true iff the lower-cased role is in
     * {"admin", "manager", "owner"} .
     */
    can_organize_events?: boolean;
    /**
     * CreatedAt + UpdatedAt are ISO-8601 timestamps with
     * timezone offset.
     */
    created_at?: string;
    /**
     * Description is the freeform description. Pointer so absent
     * marshals as JSON `null` .
     */
    description?: string;
    /**
     * Genres is the derived genre families (count-desc, capped at 5),
     * computed by the groups group_genre_families_recompute sweep from
     * the genre_families of performers on the lineups of events this
     * group hosts. Additive; non-nil (empty array, never null) so the
     * FE shape is stable for un-recomputed rows.
     */
    genres?: Array<GroupGenreFamily>;
    /**
     * ID is the canonical prefixed group identifier. Wire form:
     * `grp_<uuid>`.
     */
    id?: GroupID;
    /**
     * IsPublic defaults to true. Required on the wire.
     */
    is_public?: boolean;
    /**
     * Location is the group's location string. Optional.
     */
    location?: string;
    /**
     * MembershipRole is the viewer's role string in this group
     * (`group_memberships.role`). id`) guarantees a
     * row exists when this DTO is returned.
     */
    membership_role?: string;
    /**
     * MyRole is the viewer's coarse edit role. Null for anonymous
     * viewers, non-editors, and list responses.
     */
    my_role?: 'owner' | 'editor' | 'collaborator' | 'viewer';
    /**
     * Name is the unique group name. Required.
     */
    name?: string;
    /**
     * Platform is the platform tag (e.g. "vrchat", "discord",
     * "twitch"). Optional.
     */
    platform?: 'vrchat' | 'discord' | 'twitch';
    /**
     * Relationship is the coarse viewer↔group relationship. Null for
     * anonymous viewers and list responses; "none" for an
     * authenticated non-member.
     */
    relationship?: 'owner' | 'editor' | 'collaborator' | 'none';
    /**
     * Types is the group-type catalogue tags. ALWAYS marshals as
     * an array - empty list is `[]`, never `null`.
     */
    types?: Array<GroupTypeOut>;
    updated_at?: string;
    /**
     * VRChatGroupID is the 1:1 VRChat group identifier (NOT a
     * prefixed-ID - it's an opaque VRChat-issued string).
     */
    vrchat_group_id?: string;
    /**
     * WebsiteURL is the group's website URL. Optional.
     */
    website_url?: string;
};

