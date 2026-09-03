/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClubShowcaseResult } from '../models/ClubShowcaseResult';
import type { PerformerShowcaseSummaryOut } from '../models/PerformerShowcaseSummaryOut';
import type { ShowcaseBackgroundAssignIn } from '../models/ShowcaseBackgroundAssignIn';
import type { ShowcaseBackgroundOut } from '../models/ShowcaseBackgroundOut';
import type { ShowcaseCollaboratorCreateIn } from '../models/ShowcaseCollaboratorCreateIn';
import type { ShowcaseCollaboratorItem } from '../models/ShowcaseCollaboratorItem';
import type { ShowcaseCollaboratorUpdateIn } from '../models/ShowcaseCollaboratorUpdateIn';
import type { ShowcasePageCreateIn } from '../models/ShowcasePageCreateIn';
import type { ShowcasePageListItem } from '../models/ShowcasePageListItem';
import type { ShowcasePageOut } from '../models/ShowcasePageOut';
import type { ShowcasePageUpdateIn } from '../models/ShowcasePageUpdateIn';
import type { ShowcaseSectionCreateIn } from '../models/ShowcaseSectionCreateIn';
import type { ShowcaseSectionItem } from '../models/ShowcaseSectionItem';
import type { ShowcaseSectionsReorderIn } from '../models/ShowcaseSectionsReorderIn';
import type { ShowcaseSectionUpdateIn } from '../models/ShowcaseSectionUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ShowcaseService {
    /**
     * Get the showcase page linked to this club
     * D-235b live port. Returns the showcase page (id, slug,
     * display_name, type, visibility, is_published) for a
     * club. 404 when the club has no showcase.
     * matching row only.
     * @returns ClubShowcaseResult OK
     * @throws ApiError
     */
    public static getClubShowcasePage({
        clubId,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
    }): CancelablePromise<ClubShowcaseResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clubs/{club_id}/showcase',
            path: {
                'club_id': clubId,
            },
            errors: {
                400: `Invalid club_id`,
                404: `Club or showcase not found`,
                502: `Upstream profiles worker unavailable`,
            },
        });
    }
    /**
     * Get the showcase page linked to this performer
     * Public read. Returns the linked showcase page summary
     * (id, slug, display_name, visibility flags) plus the
     * claiming user's username so the FE can pivot from the
     * performer-owned showcase to user-scoped resources.
     * @returns PerformerShowcaseSummaryOut OK
     * @throws ApiError
     */
    public static getPerformerShowcasePage({
        performerId,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
    }): CancelablePromise<PerformerShowcaseSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}/showcase',
            path: {
                'performer_id': performerId,
            },
            errors: {
                404: `Performer or showcase not found`,
                422: `Invalid performer_id`,
            },
        });
    }
    /**
     * List public showcase pages
     * Returns the visible+published showcase pages with optional type/owner_type filters. Cursor-based pagination using the opaque last-seen page id. Sort prefix `-` flips to descending. Anonymous-accepting; `user_role` is always `"viewer"` on listings.
     * @returns ShowcasePageListItem OK
     * @throws ApiError
     */
    public static listShowcasePages({
        type,
        ownerType,
        ownerId,
        limit,
        cursor,
        sort,
    }: {
        /**
         * Filter by page type (artist, club, venue, …)
         */
        type?: any,
        /**
         * Filter by owner type (user|group|performer|club)
         */
        ownerType?: any,
        /**
         * Filter to a single owning entity (usr_/grp_/perf_/club_ prefixed id or bare UUID). Managers of the entity also see its drafts/private pages.
         */
        ownerId?: any,
        /**
         * Max items (1..200, default 50)
         */
        limit?: any,
        /**
         * Opaque cursor (last-seen page UUID)
         */
        cursor?: any,
        /**
         * Sort field; prefix - for desc. Default -updated_at
         */
        sort?: any,
    }): CancelablePromise<Array<ShowcasePageListItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages',
            query: {
                'type': type,
                'owner_type': ownerType,
                'owner_id': ownerId,
                'limit': limit,
                'cursor': cursor,
                'sort': sort,
            },
            errors: {
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a showcase page
     * Create a new showcase CMS page owned by the calling user
     * (v1) or - admin-only - by any owner_type. Slug + display_name
     * are sanitised; (owner_type, slug) collision → 409. v1
     * owner_type whitelist: `user` is fully wired; group/club/
     * performer/label return 422 OWNER_TYPE_PENDING for non-admin
     * callers (cross-worker ownership arms pending). Returns
     * the persisted ShowcasePageOut with user_role=`owner`.
     * @returns ShowcasePageOut Created
     * @throws ApiError
     */
    public static createShowcasePage({
        requestBody,
    }: {
        /**
         * Showcase page create payload
         */
        requestBody: ShowcasePageCreateIn,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/showcase/pages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / IDs`,
                401: `Authentication required`,
                403: `Cannot create page for this entity`,
                409: `Slug already exists for this owner_type`,
                422: `Invalid owner_type / slug / OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get showcase page for a club
     * Returns the full `ShowcasePageOut` for the showcase owned by the given club. Anonymous-accepting; visibility-gated. v1: PUBLIC serves; PRIVATE 422 OWNER_TYPE_NOT_YET_PORTED.
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static getShowcasePageByClub({
        clubId,
    }: {
        /**
         * Club UUID
         */
        clubId: any,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/by-club/{club_id}',
            path: {
                'club_id': clubId,
            },
            errors: {
                404: `No showcase page for this club`,
                422: `Invalid club_id OR PRIVATE+non-user owner type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get showcase page by permalink code
     * Resolves a showcase page by its stable short_code permalink key. Anonymous-accepting; visibility-gated (published/public for anon; owner/collaborator get drafts; BOLA-safe 404 otherwise).
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static getShowcasePageByCode({
        shortCode,
    }: {
        /**
         * Showcase permalink code (base62)
         */
        shortCode: any,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/by-code/{short_code}',
            path: {
                'short_code': shortCode,
            },
            errors: {
                404: `Page not found`,
                422: `Invalid short_code`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get showcase page by owner type + slug
     * Returns the full `ShowcasePageOut` for the page resolved by `{owner_type}/{slug}`. Owner type must be one of user|group|performer|club. Anonymous-accepting; visibility-gated. PRIVATE pages of non-user owner types 422.
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static getShowcasePageByOwnerSlug({
        ownerType,
        slug,
    }: {
        /**
         * Owner type (user|group|performer|club)
         */
        ownerType: any,
        /**
         * URL slug within the owner-type namespace
         */
        slug: any,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/by-owner-slug/{owner_type}/{slug}',
            path: {
                'owner_type': ownerType,
                'slug': slug,
            },
            errors: {
                404: `Page not found`,
                422: `Invalid owner_type or slug OR PRIVATE+non-user owner type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get showcase page for a performer
     * Returns the full `ShowcasePageOut` for the showcase owned by the given performer. Anonymous-accepting; visibility-gated (BOLA-safe: private + non-owner → 404). v1 minimum-viable: PUBLIC pages of any owner type serve normally; PRIVATE pages of `owner_type='performer'` 422 OWNER_TYPE_NOT_YET_PORTED until the performer-claim cross-worker contract wires.
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static getShowcasePageByPerformer({
        performerId,
    }: {
        /**
         * Performer id (UUID or perf_<uuid>)
         */
        performerId: any,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/by-performer/{performer_id}',
            path: {
                'performer_id': performerId,
            },
            errors: {
                404: `No showcase page for this performer`,
                422: `Invalid performer_id OR PRIVATE+non-user owner type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get showcase page by global slug
     * Resolves a showcase page by its globally-unique slug (owner_type NOT required). Anonymous-accepting; visibility-gated (published/public for anon; owner/collaborator get drafts; BOLA-safe 404 otherwise).
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static getShowcasePageBySlug({
        slug,
    }: {
        /**
         * Global showcase slug
         */
        slug: any,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/by-slug/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                404: `Page not found`,
                422: `Invalid slug`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List showcase pages the caller can access
     * Returns owner + direct-user-collaborator pages for the
     * caller (v1). Group / performer / club / label arms
     * pending Contract 4 cross-worker fan-out - pages shared
     * via those routes are NOT included in v1.
     * @returns ShowcasePageListItem OK
     * @throws ApiError
     */
    public static listMyShowcasePages(): CancelablePromise<Array<ShowcasePageListItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/mine',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a showcase page
     * Hard-delete the page + cascade children (sections,
     * collaborators) at the DB layer. Owner role required .
     * @returns void
     * @throws ApiError
     */
    public static deleteShowcasePage({
        pageId,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/showcase/pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            errors: {
                400: `Invalid page_id`,
                401: `Authentication required`,
                403: `Owner role required`,
                404: `Showcase page not found`,
                422: `OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a showcase page by ID
     * Returns the full ShowcasePageOut (page + sections + collaborators + user_role + page/schema versions) for the given page UUID. Byte-identical envelope to the by-slug / by-code / by-owner-slug resolvers - all five share one builder. `sections` carries the page's real sections in order; `collaborators` is populated for owner/editor callers and null for viewers. Anonymous-accepting. Visibility-gated: private or unpublished pages are visible only to callers who own the page (user owners directly, group/performer/club owners via the cross-worker authorizer); everyone else gets the same 404 as on missing rows (BOLA-safe - never leaks existence).
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static getShowcasePage({
        pageId,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            errors: {
                404: `Showcase page not found (or private-non-owner - BOLA-safe)`,
                422: `Invalid page_id OR owner_type not yet ported (group/performer/club PRIVATE)`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Patch a showcase page
     * Partial update of a page. Editor-or-owner required
     * (Contract 4). Sub-resource lists (sections,
     * collaborators) are NOT included in the response -
     * callers must hit the dedicated sub-resource endpoints.
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static patchShowcasePage({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Showcase page update payload
         */
        requestBody: ShowcasePageUpdateIn,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/showcase/pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / page_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this page`,
                404: `Showcase page not found`,
                422: `OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a showcase page
     * @returns ShowcasePageOut OK
     * @throws ApiError
     */
    public static updateShowcasePage({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Showcase page update payload
         */
        requestBody: ShowcasePageUpdateIn,
    }): CancelablePromise<ShowcasePageOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/showcase/pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / page_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this page`,
                404: `Showcase page not found`,
                422: `OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get showcase page background
     * Returns the resolved background media descriptor + canonical stream URL. Sets weak ETag `W/"showcase-bg-{page_id}-{upload_id}"` + `Cache-Control: public, max-age=300`. Viewer-or-better required (BOLA-safe). 404 when background is unset OR the linked media is missing.
     * @returns ShowcaseBackgroundOut OK
     * @throws ApiError
     */
    public static getShowcaseBackground({
        pageId,
    }: {
        /**
         * Showcase page id (UUID or shp_<uuid>)
         */
        pageId: any,
    }): CancelablePromise<ShowcaseBackgroundOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/{page_id}/background',
            path: {
                'page_id': pageId,
            },
            errors: {
                404: `Page or background missing`,
                422: `Invalid page_id OR PRIVATE+non-user owner type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Assign a showcase page background
     * Sets the background_media_upload_id + derived
     * background_media_kind on a page. Editor-or-owner
     * required (Contract 4). 422 when the upload mime is
     * not image/video OR a video upload exceeds 10MB.
     * Mirrors parity at
     * @returns ShowcaseBackgroundOut OK
     * @throws ApiError
     */
    public static assignShowcaseBackground({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Showcase background assign payload
         */
        requestBody: ShowcaseBackgroundAssignIn,
    }): CancelablePromise<ShowcaseBackgroundOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/showcase/pages/{page_id}/background',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / IDs`,
                401: `Authentication required`,
                403: `Editor required OR caller not upload owner`,
                404: `Page or upload not found`,
                422: `Quarantined / invalid mime / video too large / OWNER_TYPE_PENDING`,
                500: `Internal error`,
                502: `Upload-attachable resolver unavailable`,
            },
        });
    }
    /**
     * List showcase collaborators
     * Editor-or-owner required. Returns 403 on viewer-role caller (page IS visible - not an existence oracle). Anonymous → 404 (BOLA-safe).
     * @returns ShowcaseCollaboratorItem OK
     * @throws ApiError
     */
    public static listShowcaseCollaborators({
        pageId,
    }: {
        /**
         * Showcase page id (UUID or shp_<uuid>)
         */
        pageId: any,
    }): CancelablePromise<Array<ShowcaseCollaboratorItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/{page_id}/collaborators',
            path: {
                'page_id': pageId,
            },
            errors: {
                401: `Authentication required`,
                403: `Editor or owner role required`,
                404: `Showcase page not found`,
                422: `Invalid page_id OR PRIVATE+non-user owner type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a showcase collaborator
     * Grant access to a showcase page. **Owner role required**
     * (stricter than the editor surface - only the page owner
     * + admin can manage collaborators). 409 on duplicate
     * (page, principal_type, principal_id). Mirrors
     * parity at
     * @returns ShowcaseCollaboratorItem Created
     * @throws ApiError
     */
    public static addShowcaseCollaborator({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Showcase collaborator create payload
         */
        requestBody: ShowcaseCollaboratorCreateIn,
    }): CancelablePromise<ShowcaseCollaboratorItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/showcase/pages/{page_id}/collaborators',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / IDs`,
                401: `Authentication required`,
                403: `Owner role required`,
                404: `Showcase page not found`,
                409: `Collaborator already exists`,
                422: `Invalid role / principal_type / OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a showcase collaborator
     * Idempotent - returns 204 on both hit and miss . **Owner
     * role required** on the page.
     * @returns void
     * @throws ApiError
     */
    public static removeShowcaseCollaborator({
        pageId,
        collaboratorId,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Collaborator UUID
         */
        collaboratorId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/showcase/pages/{page_id}/collaborators/{collaborator_id}',
            path: {
                'page_id': pageId,
                'collaborator_id': collaboratorId,
            },
            errors: {
                400: `Invalid IDs`,
                401: `Authentication required`,
                403: `Owner role required`,
                404: `Showcase page not found`,
                422: `OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a showcase collaborator
     * Patch role + min_group_role on a collaborator grant.
     * **Owner role required** on the page. 404 when the
     * collaborator row is missing or scoped to another page.
     * Mirrors parity at
     * @returns ShowcaseCollaboratorItem OK
     * @throws ApiError
     */
    public static updateShowcaseCollaborator({
        pageId,
        collaboratorId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Collaborator UUID
         */
        collaboratorId: any,
        /**
         * Showcase collaborator update payload
         */
        requestBody: ShowcaseCollaboratorUpdateIn,
    }): CancelablePromise<ShowcaseCollaboratorItem> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/showcase/pages/{page_id}/collaborators/{collaborator_id}',
            path: {
                'page_id': pageId,
                'collaborator_id': collaboratorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / IDs`,
                401: `Authentication required`,
                403: `Owner role required`,
                404: `Page or collaborator not found`,
                422: `Invalid role / OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List showcase sections
     * Returns the page's sections ordered by `order_index`. Viewer-or-better required (BOLA-safe: missing page OR no role → 404).
     * @returns ShowcaseSectionItem OK
     * @throws ApiError
     */
    public static listShowcaseSections({
        pageId,
    }: {
        /**
         * Showcase page id (UUID or shp_<uuid>)
         */
        pageId: any,
    }): CancelablePromise<Array<ShowcaseSectionItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/showcase/pages/{page_id}/sections',
            path: {
                'page_id': pageId,
            },
            errors: {
                404: `Showcase page not found`,
                422: `Invalid page_id OR PRIVATE+non-user owner type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a showcase section
     * Append a section to the page. Editor-or-owner required.
     * @returns ShowcaseSectionItem Created
     * @throws ApiError
     */
    public static createShowcaseSection({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Showcase section create payload
         */
        requestBody: ShowcaseSectionCreateIn,
    }): CancelablePromise<ShowcaseSectionItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/showcase/pages/{page_id}/sections',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / page_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this page`,
                404: `Showcase page not found`,
                422: `OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Reorder showcase sections
     * Bulk-update section order_index. Editor-or-owner
     * required. Items not in the payload are untouched.
     * Empty payload → 204 no-op .
     * @returns void
     * @throws ApiError
     */
    public static reorderShowcaseSections({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Sections reorder payload
         */
        requestBody: ShowcaseSectionsReorderIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/showcase/pages/{page_id}/sections/order',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / page_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this page`,
                404: `Showcase page not found`,
                422: `Invalid order_index OR OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a showcase section
     * Idempotent - returns 204 on both hit and miss . Editor-or-owner required. v1 only `owner_type='user'` page rows reach the delete; group/performer/club owner types 422 OWNER_TYPE_NOT_YET_PORTED until the cross-worker membership contracts wire.
     * @returns void
     * @throws ApiError
     */
    public static deleteShowcaseSection({
        pageId,
        sectionId,
    }: {
        /**
         * Showcase page id (UUID or shp_<uuid>)
         */
        pageId: any,
        /**
         * Showcase section UUID
         */
        sectionId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/showcase/pages/{page_id}/sections/{section_id}',
            path: {
                'page_id': pageId,
                'section_id': sectionId,
            },
            errors: {
                401: `Authentication required`,
                403: `Editor or owner role required`,
                404: `Showcase page not found`,
                422: `Invalid id OR PRIVATE+non-user owner type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a showcase section
     * Replace mutable fields on a section. Editor-or-owner
     * required (Contract 4). Nil-pointer / absent body fields
     * are unchanged. Mirrors parity at
     * @returns ShowcaseSectionItem OK
     * @throws ApiError
     */
    public static updateShowcaseSection({
        pageId,
        sectionId,
        requestBody,
    }: {
        /**
         * Showcase page UUID
         */
        pageId: any,
        /**
         * Showcase section UUID
         */
        sectionId: any,
        /**
         * Showcase section update payload
         */
        requestBody: ShowcaseSectionUpdateIn,
    }): CancelablePromise<ShowcaseSectionItem> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/showcase/pages/{page_id}/sections/{section_id}',
            path: {
                'page_id': pageId,
                'section_id': sectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / IDs`,
                401: `Authentication required`,
                403: `Not authorised to edit this page`,
                404: `Section or page not found`,
                422: `OWNER_TYPE_PENDING`,
                500: `Internal error`,
            },
        });
    }
}
