/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKImageRef } from './EPKImageRef';
import type { PressKitSocialLink } from './PressKitSocialLink';
import type { ProfileLinkItem } from './ProfileLinkItem';
import type { ProfileMediaSlot } from './ProfileMediaSlot';
export type PressKitOut = {
    /**
     * Avatar is the singleton avatar slot (variant IS NULL, tombstones
     * filtered). Null when unset.
     */
    avatar?: ProfileMediaSlot;
    /**
     * Banner is the singleton banner slot. Null when unset.
     */
    banner?: ProfileMediaSlot;
    /**
     * DisplayName is the profile display name echo.
     */
    display_name?: string;
    /**
     * EPKLogos are `promotion_images` with kind = 'logo' - the
     * EPK-curated logo pool, DISTINCT from the `profile_media` Logos pool
     * above (separate provenance, kept separate on purpose). Never null.
     */
    epk_logos?: Array<EPKImageRef>;
    /**
     * LegacyAvatarURL is the legacy `performers.image_url` fallback. Set
     * ONLY when Avatar is null AND owner_type='performer' AND the legacy
     * column is non-empty; null otherwise.
     */
    legacy_avatar_url?: string;
    /**
     * Links are the `profile_links` rows (link_type / url / label /
     * order). Never null.
     */
    links?: Array<ProfileLinkItem>;
    /**
     * Logos are ALL `profile_media` slot='logo' rows, every variant
     * (`square`, `wide`, `mono_light`, `mono_dark`, `alt`, …) preserved
     * per entry. Never null; `[]` when empty.
     */
    logos?: Array<ProfileMediaSlot>;
    /**
     * OwnerType is the owning-entity kind. One of `user`, `group`,
     * `performer`, `club`. Echoed so the FE needs no second call.
     */
    owner_type?: string;
    /**
     * PressPhotos are `promotion_images` with kind != 'logo'. Never null.
     */
    press_photos?: Array<EPKImageRef>;
    /**
     * ProfileID is the canonical prefixed profile id. Wire form:
     * `pro_<uuid>`.
     */
    profile_id?: string;
    /**
     * SocialLinks is the structured `social_accounts` projection (NOT the
     * freeform CRM regex the EPK by-slug endpoint uses). Never null.
     */
    social_links?: Array<PressKitSocialLink>;
};

