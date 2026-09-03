/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchResolveIn } from '../models/BatchResolveIn';
import type { BatchResolveOut } from '../models/BatchResolveOut';
import type { BlueskyLinkIn } from '../models/BlueskyLinkIn';
import type { PressKitLookupIn } from '../models/PressKitLookupIn';
import type { PressKitLookupOut } from '../models/PressKitLookupOut';
import type { PressKitOut } from '../models/PressKitOut';
import type { ProfileBackgroundAssignIn } from '../models/ProfileBackgroundAssignIn';
import type { ProfileBackgroundOut } from '../models/ProfileBackgroundOut';
import type { ProfileCreateIn } from '../models/ProfileCreateIn';
import type { ProfileLinkCreateIn } from '../models/ProfileLinkCreateIn';
import type { ProfileLinkItem } from '../models/ProfileLinkItem';
import type { ProfileLinkUpdateIn } from '../models/ProfileLinkUpdateIn';
import type { ProfileMediaCreateIn } from '../models/ProfileMediaCreateIn';
import type { ProfileMediaSlot } from '../models/ProfileMediaSlot';
import type { ProfileMediaUpdateIn } from '../models/ProfileMediaUpdateIn';
import type { ProfilePageDefinition } from '../models/ProfilePageDefinition';
import type { ProfileSectionCreateIn } from '../models/ProfileSectionCreateIn';
import type { ProfileSectionItem } from '../models/ProfileSectionItem';
import type { ProfileSectionsReorderIn } from '../models/ProfileSectionsReorderIn';
import type { ProfileSectionUpdateIn } from '../models/ProfileSectionUpdateIn';
import type { ProfileSingletonMediaIn } from '../models/ProfileSingletonMediaIn';
import type { ProfileSummary } from '../models/ProfileSummary';
import type { ProfileUpdateIn } from '../models/ProfileUpdateIn';
import type { SchemasOut } from '../models/SchemasOut';
import type { SocialAccountListOut } from '../models/SocialAccountListOut';
import type { SocialAccountView } from '../models/SocialAccountView';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfilesService {
    /**
     * List social accounts linked to an owner
     * Returns the direct links for the owner entity -
     * parent-chain fallback is NOT applied here. Use
     * `GET /auth/social/accounts/{provider}?cascade=true`
     * to see what a campaign publisher would pick. Tokens
     * / passwords are NEVER returned.
     * @returns SocialAccountListOut OK
     * @throws ApiError
     */
    public static listSocialAccounts({
        ownerType,
        ownerId,
    }: {
        /**
         * Owner type: user, group, club, or performer
         */
        ownerType: any,
        /**
         * Owner UUID (or prefixed: usr_/grp_/club_/perf_)
         */
        ownerId: any,
    }): CancelablePromise<SocialAccountListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/social/accounts',
            query: {
                'owner_type': ownerType,
                'owner_id': ownerId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to manage owner`,
                404: `Owner not found`,
                422: `Invalid owner_type or owner_id`,
                500: `Internal error`,
                501: `owner_type group/club resolver unavailable in this runtime`,
                503: `Upstream worker (groups) unavailable`,
            },
        });
    }
    /**
     * Unlink the given provider for an owner
     * Removes the (owner_type, owner_id, provider) row.
     * NOT idempotent - a missing row returns 404.
     * parity at
     * @returns void
     * @throws ApiError
     */
    public static unlinkSocialAccount({
        provider,
        ownerType,
        ownerId,
    }: {
        /**
         * Provider name
         */
        provider: any,
        /**
         * Owner type
         */
        ownerType: any,
        /**
         * Owner UUID
         */
        ownerId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/social/accounts/{provider}',
            path: {
                'provider': provider,
            },
            query: {
                'owner_type': ownerType,
                'owner_id': ownerId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to manage owner`,
                404: `No account linked`,
                422: `Invalid owner_type or owner_id`,
                500: `Internal error`,
                501: `owner_type group/club resolver unavailable in this runtime`,
                503: `Upstream worker (groups) unavailable`,
            },
        });
    }
    /**
     * Get the effective social account for an owner + provider
     * Returns the account a campaign publisher would use.
     * Set `cascade=true` (default) to walk up to the parent
     * when no direct link exists on the owner; set
     * `cascade=false` to only check the owner itself.
     * Tokens / passwords are NEVER returned.
     * @returns SocialAccountView OK
     * @throws ApiError
     */
    public static getSocialAccount({
        provider,
        ownerType,
        ownerId,
        cascade,
    }: {
        /**
         * Provider name (x, bluesky, instagram, youtube, soundcloud)
         */
        provider: any,
        /**
         * Owner type: user, group, club, or performer
         */
        ownerType: any,
        /**
         * Owner UUID
         */
        ownerId: any,
        /**
         * Walk up the owner chain (default: true)
         */
        cascade?: any,
    }): CancelablePromise<SocialAccountView> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/social/accounts/{provider}',
            path: {
                'provider': provider,
            },
            query: {
                'owner_type': ownerType,
                'owner_id': ownerId,
                'cascade': cascade,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to manage owner`,
                404: `No matching account`,
                422: `Invalid owner_type or owner_id`,
                500: `Internal error`,
                501: `owner_type group/club resolver unavailable in this runtime`,
                503: `Upstream worker (groups) unavailable`,
            },
        });
    }
    /**
     * Link a Bluesky account to a user/group/club/performer
     * Authed-only. Validates handle + app password against
     * the configured PDS, encrypts the app password, and
     * persists a SocialAccount row with provider=bluesky.
     * Submit an app password from Bluesky Settings → App
     * Passwords, never the account's login password.
     * Tokens and passwords are NEVER returned.
     * @returns SocialAccountView OK
     * @throws ApiError
     */
    public static linkBlueskySocialAccount({
        requestBody,
    }: {
        /**
         * Bluesky link payload
         */
        requestBody: BlueskyLinkIn,
    }): CancelablePromise<SocialAccountView> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/social/bluesky/link',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid credentials / cross-owner duplicate`,
                401: `Authentication required`,
                403: `Cannot manage owner`,
                404: `Owner not found`,
                422: `Invalid owner_type or payload`,
                501: `owner_type group/club resolver unavailable in this runtime`,
                503: `Bluesky verifier not configured`,
            },
        });
    }
    /**
     * List profiles owned by the caller
     * Returns every profile the authenticated caller owns -
     * their personal user profile (`owner_type='user'`) plus
     * any performer profiles attached to performers they own
     * (`owner_type='performer'`). Group/club profiles are NOT
     * enumerated here .
     * @returns ProfileSummary OK
     * @throws ApiError
     */
    public static listMyProfiles(): CancelablePromise<Array<ProfileSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/profiles',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List supported profile types
     * Returns the supported profile types as plain strings.
     * Allowed values: artist, club, group, label, venue,
     * event_series, other.
     * @returns string OK
     * @throws ApiError
     */
    public static getProfileTypes(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile-types',
        });
    }
    /**
     * Create a new profile
     * The authenticated user becomes the creator. owner_type
     * defaults to "user"; performer/group/club ownership needs
     * an explicit owner_type + owner_id and passes the cross-
     * worker owner-authorization check. type=club and type=group
     * are org-shaped and REQUIRE an explicit owner_type (else
     * 422 OWNER_TYPE_REQUIRED_FOR_ORG_TYPE).
     * @returns ProfileSummary Created
     * @throws ApiError
     */
    public static createProfile({
        requestBody,
    }: {
        /**
         * Profile create payload
         */
        requestBody: ProfileCreateIn,
    }): CancelablePromise<ProfileSummary> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                409: `Slug taken`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Resolve profile by owner_type + slug
     * `include=page` (default) returns the lightweight
     * ProfileSummary. Anonymous-OK;
     * viewer_context is null for anonymous callers.
     * @returns ProfileSummary include=page
     * @throws ApiError
     */
    public static getProfileByOwnerSlug({
        ownerType,
        slug,
        include,
    }: {
        /**
         * Owner namespace: user|group|performer|club
         */
        ownerType: any,
        /**
         * Slug within owner namespace
         */
        slug: any,
        /**
         * `page` (default, ProfileSummary) | `full` (ProfilePageDefinition bundle)
         */
        include?: any,
    }): CancelablePromise<ProfileSummary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/by-owner-slug/{owner_type}/{slug}',
            path: {
                'owner_type': ownerType,
                'slug': slug,
            },
            query: {
                'include': include,
            },
            errors: {
                404: `Profile not found`,
                422: `Invalid owner_type or slug`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Resolve profile by owner_type + owner_id
     * Editor / context-nav lookup: returns the lightweight
     * ProfileSummary for the owning entity. The response
     * carries `slug` + `canonical_path` so the frontend can
     * redirect to the public page. For the full page bundle
     * call `GET /profiles/by-owner-slug/{owner_type}/{slug}`.
     * @returns ProfileSummary OK
     * @throws ApiError
     */
    public static getProfileByOwner({
        ownerType,
        ownerId,
    }: {
        /**
         * Owner namespace: user|group|performer|club
         */
        ownerType: any,
        /**
         * Owner entity UUID (prefixed `usr_/grp_/perf_/club_` or bare)
         */
        ownerId: any,
    }): CancelablePromise<ProfileSummary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/by-owner/{owner_type}/{owner_id}',
            path: {
                'owner_type': ownerType,
                'owner_id': ownerId,
            },
            errors: {
                404: `Owner has no profile yet`,
                422: `Invalid owner_type or owner_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Resolve profile page definition by bare slug
     * Returns the full ProfilePageDefinition (profile +
     * sections + page/schema versions) matching the slug.
     * Anonymous-accepting. Visibility-gated: private or
     * unpublished profiles are visible only to the owning
     * user; everyone else gets the same 404 the lookup
     * emits on missing rows (BOLA-safe). Returns 409 with
     * `code=AMBIGUOUS_SLUG` only when more than one owner_type
     * registers the slug AND the caller may view more than one
     * of them - a private/unpublished sibling never causes a
     * 409 and is never named in the body. Orphan rows filtered. stats/external_
     * platforms/upcoming/recent/related/social_accounts stay
     * null pending cross-worker contracts.
     * @returns ProfilePageDefinition OK
     * @throws ApiError
     */
    public static getProfileBySlug({
        slug,
        ownerType,
        include,
    }: {
        /**
         * Profile slug (lowercase, hyphens)
         */
        slug: any,
        /**
         * Disambiguator for ambiguous slugs: user|group|performer|club
         */
        ownerType?: any,
        /**
         * `full` (default) | `page` - both currently return the same shape (full aggregation pending cross-worker contracts)
         */
        include?: any,
    }): CancelablePromise<ProfilePageDefinition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/by-slug/{slug}',
            path: {
                'slug': slug,
            },
            query: {
                'owner_type': ownerType,
                'include': include,
            },
            errors: {
                404: `Profile not found`,
                409: `Ambiguous slug - use /profiles/by-owner-slug`,
                422: `Invalid slug`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Batch-resolve public press kits
     * Anonymous-accepting bulk variant of the press-kit read. Body carries up to 500 profile ids; the response maps bare-UUID profile id → press kit. Ids that are unknown, private, or unpublished are silently absent from the map — the endpoint never distinguishes "not found" from "not visible".
     * @returns PressKitLookupOut OK
     * @throws ApiError
     */
    public static lookupProfilePressKits({
        requestBody,
    }: {
        /**
         * Profile ids to resolve (bare UUID or pro_-prefixed)
         */
        requestBody: PressKitLookupIn,
    }): CancelablePromise<PressKitLookupOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles/press-kit/lookup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body, non-UUID id, or cap exceeded`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete profile (cascades child rows)
     * Caller must have edit access. Non-editors get 404.
     * Children (sections, media, links, M2M) cascade via FK.
     * @returns void
     * @throws ApiError
     */
    public static deleteProfile({
        profileId,
    }: {
        /**
         * Profile UUID
         */
        profileId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get a profile by ID (editable view)
     * Caller must have edit access via profile_users M2M (or admin).
     * Non-editor / unknown profile → 404 (BOLA).
     * @returns ProfilePageDefinition OK
     * @throws ApiError
     */
    public static getProfileById({
        profileId,
        include,
    }: {
        /**
         * Profile UUID
         */
        profileId: any,
        /**
         * `full` (default) or `page` - both currently return page envelope
         */
        include?: any,
    }): CancelablePromise<ProfilePageDefinition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            query: {
                'include': include,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Update profile (partial)
     * Caller must have edit access via profile_users M2M.
     * Unknown caller / non-editor → 404 (BOLA).
     * @returns ProfileSummary OK
     * @throws ApiError
     */
    public static patchProfile({
        profileId,
        requestBody,
    }: {
        /**
         * Profile UUID
         */
        profileId: any,
        /**
         * Update payload
         */
        requestBody: ProfileUpdateIn,
    }): CancelablePromise<ProfileSummary> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Update profile (replace verb, same partial semantics as PATCH)
     * Caller must have edit access via profile_users M2M.
     * Unknown caller / non-editor → 404 (BOLA).
     * @returns ProfileSummary OK
     * @throws ApiError
     */
    public static updateProfile({
        profileId,
        requestBody,
    }: {
        /**
         * Profile UUID
         */
        profileId: any,
        /**
         * Update payload
         */
        requestBody: ProfileUpdateIn,
    }): CancelablePromise<ProfileSummary> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Remove profile avatar
     * @returns void
     * @throws ApiError
     */
    public static deleteProfileAvatar({
        profileId,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}/avatar',
            path: {
                'profile_id': profileId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to edit profile`,
                404: `Profile not found`,
                422: `Malformed profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get profile avatar
     * Returns the avatar singleton slot, or 404 when none is
     * set. Public - no auth required.
     * @returns ProfileMediaSlot OK
     * @throws ApiError
     */
    public static getProfileAvatar({
        profileId,
    }: {
        /**
         * Profile ID (prefixed 'pro_<uuid>' or bare UUID)
         */
        profileId: any,
    }): CancelablePromise<ProfileMediaSlot> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/avatar',
            path: {
                'profile_id': profileId,
            },
            errors: {
                404: `Profile or avatar not found`,
                422: `Malformed profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Set profile avatar
     * Assign or replace the profile avatar. Idempotent.
     * @returns ProfileMediaSlot OK
     * @throws ApiError
     */
    public static setProfileAvatar({
        profileId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Upload to assign
         */
        requestBody: ProfileSingletonMediaIn,
    }): CancelablePromise<ProfileMediaSlot> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}/avatar',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit profile or upload ownership mismatch`,
                404: `Profile or upload not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get profile page background media
     * Public for published+public/unlisted profiles. Otherwise
     * editor-or-admin only. Returns 404 on missing-profile,
     * not-viewable, or no-background-set (BOLA-safe).
     * @returns ProfileBackgroundOut OK
     * @throws ApiError
     */
    public static getProfileBackground({
        profileId,
    }: {
        /**
         * Profile UUID
         */
        profileId: any,
    }): CancelablePromise<ProfileBackgroundOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/background',
            path: {
                'profile_id': profileId,
            },
            errors: {
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Assign profile background media
     * Caller must edit the profile AND own the upload (or be admin).
     * Video uploads must be <= 10MB.
     * @returns ProfileBackgroundOut OK
     * @throws ApiError
     */
    public static assignProfileBackground({
        profileId,
        requestBody,
    }: {
        /**
         * Profile UUID
         */
        profileId: any,
        /**
         * Background payload (`null` media_upload_id clears)
         */
        requestBody: ProfileBackgroundAssignIn,
    }): CancelablePromise<ProfileBackgroundOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/profiles/{profile_id}/background',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Upload ownership mismatch`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Remove profile banner
     * @returns void
     * @throws ApiError
     */
    public static deleteProfileBanner({
        profileId,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}/banner',
            path: {
                'profile_id': profileId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to edit profile`,
                404: `Profile not found`,
                422: `Malformed profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get profile banner
     * Returns the banner singleton slot, or 404 when none is
     * set. Public - no auth required.
     * @returns ProfileMediaSlot OK
     * @throws ApiError
     */
    public static getProfileBanner({
        profileId,
    }: {
        /**
         * Profile ID (prefixed 'pro_<uuid>' or bare UUID)
         */
        profileId: any,
    }): CancelablePromise<ProfileMediaSlot> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/banner',
            path: {
                'profile_id': profileId,
            },
            errors: {
                404: `Profile or banner not found`,
                422: `Malformed profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Set profile banner
     * Assign or replace the profile banner. Idempotent.
     * @returns ProfileMediaSlot OK
     * @throws ApiError
     */
    public static setProfileBanner({
        profileId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Upload to assign
         */
        requestBody: ProfileSingletonMediaIn,
    }): CancelablePromise<ProfileMediaSlot> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}/banner',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit profile or upload ownership mismatch`,
                404: `Profile or upload not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List profile custom links
     * Returns every entity-authored custom link on the
     * profile. Platform OAuth-backed accounts (X / Bluesky
     * / IG / YT / SC / Twitch) live in `social_accounts`
     * on the GET-profile response, not here. Public - no
     * auth required.
     * @returns ProfileLinkItem OK
     * @throws ApiError
     */
    public static listProfileLinks({
        profileId,
    }: {
        /**
         * Profile ID (prefixed 'pro_<uuid>' or bare UUID)
         */
        profileId: any,
    }): CancelablePromise<Array<ProfileLinkItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/links',
            path: {
                'profile_id': profileId,
            },
            errors: {
                404: `Profile not found`,
                422: `Malformed profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a custom link to a profile
     * Adds a typed custom link (website / store /
     * mailing_list / press_kit / linktree / discord /
     * contact / booking / donate / merch / custom) to the
     * profile. Caller must be admin or a member of
     * profile_users.
     * @returns ProfileLinkItem Created
     * @throws ApiError
     */
    public static createProfileLink({
        profileId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Link payload
         */
        requestBody: ProfileLinkCreateIn,
    }): CancelablePromise<ProfileLinkItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles/{profile_id}/links',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a custom link from a profile
     * Idempotent - returns 204 even when the link was
     * already absent or belongs to another profile .
     * @returns void
     * @throws ApiError
     */
    public static deleteProfileLink({
        profileId,
        linkId,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Link row ID
         */
        linkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}/links/{link_id}',
            path: {
                'profile_id': profileId,
                'link_id': linkId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile not found`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update fields on a profile link
     * Patch fields on an existing link - link_type, url,
     * label, display_order. All fields optional; only
     * provided fields are written. Cross-profile id-grab
     * returns 404 (the link is matched on
     * (link_id, profile_id) -
     * @returns ProfileLinkItem OK
     * @throws ApiError
     */
    public static patchProfileLink({
        profileId,
        linkId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Link row ID (prefixed 'plnk_<uuid>' or bare UUID)
         */
        linkId: any,
        /**
         * Optional patch fields
         */
        requestBody: ProfileLinkUpdateIn,
    }): CancelablePromise<ProfileLinkItem> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/profiles/{profile_id}/links/{link_id}',
            path: {
                'profile_id': profileId,
                'link_id': linkId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile or link not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List profile media slots
     * Returns every media slot attached to the profile (avatar,
     * banner, and one or more named logo variants). Public -
     * no auth required.
     * @returns ProfileMediaSlot OK
     * @throws ApiError
     */
    public static listProfileMedia({
        profileId,
    }: {
        /**
         * Profile ID (prefixed 'pro_<uuid>' or bare UUID)
         */
        profileId: any,
    }): CancelablePromise<Array<ProfileMediaSlot>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/media',
            path: {
                'profile_id': profileId,
            },
            errors: {
                404: `Profile not found`,
                422: `Malformed profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Attach a media upload to a profile slot
     * Attach an existing MediaUpload to a profile slot.
     * Avatar/banner are singletons; logos are unconstrained.
     * Returns 409 on a second avatar/banner POST.
     * @returns ProfileMediaSlot Created
     * @throws ApiError
     */
    public static createProfileMedia({
        profileId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Slot, variant, upload_id, display_order
         */
        requestBody: ProfileMediaCreateIn,
    }): CancelablePromise<ProfileMediaSlot> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles/{profile_id}/media',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this profile or upload ownership mismatch`,
                404: `Profile or media upload not found`,
                409: `Singleton slot already exists`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a profile media slot
     * Detach a media slot from a profile. Idempotent - returns
     * 204 even when the slot was already absent.
     * @returns void
     * @throws ApiError
     */
    public static deleteProfileMedia({
        profileId,
        mediaId,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Profile media row ID
         */
        mediaId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}/media/{media_id}',
            path: {
                'profile_id': profileId,
                'media_id': mediaId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile not found`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a profile media slot
     * Patch fields on an existing slot - replace the underlying
     * upload, rename the variant, or reorder it. Slot category
     * is immutable.
     * @returns ProfileMediaSlot OK
     * @throws ApiError
     */
    public static patchProfileMedia({
        profileId,
        mediaId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Profile media row ID (prefixed 'pmd_<uuid>' or bare UUID)
         */
        mediaId: any,
        /**
         * Optional patch fields
         */
        requestBody: ProfileMediaUpdateIn,
    }): CancelablePromise<ProfileMediaSlot> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/profiles/{profile_id}/media/{media_id}',
            path: {
                'profile_id': profileId,
                'media_id': mediaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this profile or upload ownership mismatch`,
                404: `Profile or media slot not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a profile's public press kit
     * Anonymous-accepting aggregated read: avatar/banner/logo media slots, EPK press photos and EPK logos, structured social links, and profile links in one call. Private or unpublished profiles return 404 for non-owners (BOLA-safe).
     * @returns PressKitOut OK
     * @throws ApiError
     */
    public static getProfilePressKit({
        profileId,
    }: {
        /**
         * Profile ID (pro_<uuid> or bare UUID)
         */
        profileId: any,
    }): CancelablePromise<PressKitOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/press-kit',
            path: {
                'profile_id': profileId,
            },
            errors: {
                404: `Profile not found`,
                422: `Invalid profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List profile sections
     * Returns every ordered content block on the profile.
     * Caller must be admin or a member of profile_users .
     * @returns ProfileSectionItem OK
     * @throws ApiError
     */
    public static listProfileSections({
        profileId,
    }: {
        /**
         * Profile ID (prefixed 'pro_<uuid>' or bare UUID)
         */
        profileId: any,
    }): CancelablePromise<Array<ProfileSectionItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profiles/{profile_id}/sections',
            path: {
                'profile_id': profileId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile not found`,
                422: `Malformed profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a profile section
     * Creates a new ordered content block. type is required.
     * title + variant are HTML-stripped server-side. Caller
     * must be admin or a member of profile_users.
     * @returns ProfileSectionItem Created
     * @throws ApiError
     */
    public static createProfileSection({
        profileId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Section payload
         */
        requestBody: ProfileSectionCreateIn,
    }): CancelablePromise<ProfileSectionItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profiles/{profile_id}/sections',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Bulk reorder profile sections
     * Updates `order_index` on a list of sections in one
     * round-trip. Provide `items: [{section_id, order_index}]`.
     * Either `section_id` or `id` is accepted as the row key . Unknown ids / cross-profile id grabs
     * are silently skipped. Returns 204 on success.
     * @returns void
     * @throws ApiError
     */
    public static reorderProfileSections({
        profileId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Reorder payload
         */
        requestBody: ProfileSectionsReorderIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}/sections/order',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a profile section
     * Idempotent - returns 204 even when the section was
     * already absent or belongs to another profile .
     * @returns void
     * @throws ApiError
     */
    public static deleteProfileSection({
        profileId,
        sectionId,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Section ID
         */
        sectionId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profiles/{profile_id}/sections/{section_id}',
            path: {
                'profile_id': profileId,
                'section_id': sectionId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile not found`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a profile section
     * Partial update - only provided fields are written.
     * title + variant are HTML-stripped server-side. Cross-
     * profile id grabs return 404 (the section is matched
     * on (section_id, profile_id)).
     * @returns ProfileSectionItem OK
     * @throws ApiError
     */
    public static updateProfileSection({
        profileId,
        sectionId,
        requestBody,
    }: {
        /**
         * Profile ID
         */
        profileId: any,
        /**
         * Section ID (prefixed 'prs_<uuid>' or bare UUID)
         */
        sectionId: any,
        /**
         * Optional patch fields
         */
        requestBody: ProfileSectionUpdateIn,
    }): CancelablePromise<ProfileSectionItem> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profiles/{profile_id}/sections/{section_id}',
            path: {
                'profile_id': profileId,
                'section_id': sectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this profile`,
                404: `Profile or section not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Batch resolve section data
     * @returns BatchResolveOut OK
     * @throws ApiError
     */
    public static resolveBatchPost({
        requestBody,
    }: {
        /**
         * Batch query payload
         */
        requestBody: BatchResolveIn,
    }): CancelablePromise<BatchResolveOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/resolve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get section schemas (JSON Schema)
     * Returns JSONSchema for theme tokens and for each
     * supported section type. Frontends use these to build
     * dynamic forms and validate configs client-side.
     * @returns SchemasOut OK
     * @throws ApiError
     */
    public static listSectionSchemas(): CancelablePromise<SchemasOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/schemas',
        });
    }
}
