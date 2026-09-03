/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComponentExport } from '../models/ComponentExport';
import type { ComponentImport } from '../models/ComponentImport';
import type { ComponentInstallOut } from '../models/ComponentInstallOut';
import type { ComponentInstallRequest } from '../models/ComponentInstallRequest';
import type { ComponentInstallStatsOut } from '../models/ComponentInstallStatsOut';
import type { ComponentRatingCreateIn } from '../models/ComponentRatingCreateIn';
import type { ComponentRatingOut } from '../models/ComponentRatingOut';
import type { ComponentRatingsListResponse } from '../models/ComponentRatingsListResponse';
import type { PresetExport } from '../models/PresetExport';
import type { PresetFromShowcaseRequest } from '../models/PresetFromShowcaseRequest';
import type { PresetImport } from '../models/PresetImport';
import type { PresetInstallOut } from '../models/PresetInstallOut';
import type { PresetInstallRequest } from '../models/PresetInstallRequest';
import type { PresetInstallStatsOut } from '../models/PresetInstallStatsOut';
import type { PresetRatingCreateIn } from '../models/PresetRatingCreateIn';
import type { PresetRatingOut } from '../models/PresetRatingOut';
import type { PresetRatingsListResponse } from '../models/PresetRatingsListResponse';
import type { StylePresetCreateIn } from '../models/StylePresetCreateIn';
import type { StylePresetOut } from '../models/StylePresetOut';
import type { StylePresetUpdateIn } from '../models/StylePresetUpdateIn';
import type { WorkshopAcquireOut } from '../models/WorkshopAcquireOut';
import type { WorkshopBrowseResponse } from '../models/WorkshopBrowseResponse';
import type { WorkshopComponentCreateIn } from '../models/WorkshopComponentCreateIn';
import type { WorkshopComponentOut } from '../models/WorkshopComponentOut';
import type { WorkshopComponentUpdateIn } from '../models/WorkshopComponentUpdateIn';
import type { WorkshopInstallOut } from '../models/WorkshopInstallOut';
import type { WorkshopInstallRequest } from '../models/WorkshopInstallRequest';
import type { WorkshopInstallStatsOut } from '../models/WorkshopInstallStatsOut';
import type { WorkshopItemCreateIn } from '../models/WorkshopItemCreateIn';
import type { WorkshopItemFromShowcaseRequest } from '../models/WorkshopItemFromShowcaseRequest';
import type { WorkshopItemOut } from '../models/WorkshopItemOut';
import type { WorkshopItemUpdateIn } from '../models/WorkshopItemUpdateIn';
import type { WorkshopLibraryResponse } from '../models/WorkshopLibraryResponse';
import type { WorkshopRatingCreateIn } from '../models/WorkshopRatingCreateIn';
import type { WorkshopRatingOut } from '../models/WorkshopRatingOut';
import type { WorkshopRatingsListResponse } from '../models/WorkshopRatingsListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkshopService {
    /**
     * Browse all published Workshop items
     * Anonymous-OK. Unified preset+component browse with
     * filters: type, category, tags (comma list), price_type,
     * q (substring).
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshop({
        limit,
        cursor,
        sort,
        type,
        category,
        tags,
        priceType,
        q,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * popular|recent|rating|title (prefix - to reverse)
         */
        sort?: any,
        /**
         * preset|component|all
         */
        type?: any,
        /**
         * Category slug filter
         */
        category?: any,
        /**
         * Comma-separated tag list
         */
        tags?: any,
        /**
         * free|premium|all
         */
        priceType?: any,
        /**
         * Substring search
         */
        q?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop',
            query: {
                'limit': limit,
                'cursor': cursor,
                'sort': sort,
                'type': type,
                'category': category,
                'tags': tags,
                'price_type': priceType,
                'q': q,
            },
        });
    }
    /**
     * List Workshop items by author
     * Anonymous-OK. Returns published items by the supplied
     * author.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopByAuthor({
        userId,
        limit,
        cursor,
        type,
    }: {
        /**
         * Author user id (UUID or usr_<uuid>)
         */
        userId: any,
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * preset|component|all
         */
        type?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/by-author/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
                'type': type,
            },
            errors: {
                422: `Invalid user_id`,
            },
        });
    }
    /**
     * Create a workshop component
     * Authed. Inserts a new reusable showcase background
     * component owned by the caller. Slug must be globally
     * unique (case-sensitive) - 409 on conflict. Defaults to
     * draft (`is_published=false`) and `price_type=free`.
     * @returns WorkshopComponentOut Created
     * @throws ApiError
     */
    public static createComponent({
        requestBody,
    }: {
        /**
         * Component payload
         */
        requestBody: WorkshopComponentCreateIn,
    }): CancelablePromise<WorkshopComponentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/components',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                409: `Slug already exists`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Import a workshop component from JSON
     * Authed. Installs an external component payload as the
     * caller's new (unpublished, free) component. Same slug-
     * uniqueness gate as `createComponent`.
     * @returns WorkshopComponentOut Created
     * @throws ApiError
     */
    public static importComponent({
        requestBody,
    }: {
        /**
         * Portable component payload
         */
        requestBody: ComponentImport,
    }): CancelablePromise<WorkshopComponentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/components/import',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                409: `Slug already exists`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * List components installed by the current user
     * Authed. Returns a bare array (no next_cursor wrapper)
     * per
     * @returns ComponentInstallOut OK
     * @throws ApiError
     */
    public static listInstalledComponents({
        limit,
        cursor,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<Array<ComponentInstallOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/components/installed',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid cursor`,
            },
        });
    }
    /**
     * Get a workshop component by slug
     * Anonymous-OK.
     * @returns WorkshopComponentOut OK
     * @throws ApiError
     */
    public static getComponentBySlug({
        slug,
    }: {
        /**
         * Component slug
         */
        slug: any,
    }): CancelablePromise<WorkshopComponentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/components/slug/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                404: `Component not found`,
            },
        });
    }
    /**
     * Delete a workshop component
     * Authed. Owner-or-admin only (403 otherwise). CASCADE
     * removes ratings + installations.
     * @returns void
     * @throws ApiError
     */
    public static deleteComponent({
        componentId,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workshop/components/{component_id}',
            path: {
                'component_id': componentId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not the component owner`,
                404: `Component not found`,
                422: `Invalid component_id`,
            },
        });
    }
    /**
     * Get a workshop component by ID
     * Anonymous-OK. Returns the full component shape
     * including render_data / param_schema.
     * @returns WorkshopComponentOut OK
     * @throws ApiError
     */
    public static getComponent({
        componentId,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
    }): CancelablePromise<WorkshopComponentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/components/{component_id}',
            path: {
                'component_id': componentId,
            },
            errors: {
                404: `Component not found`,
                422: `Invalid component_id`,
            },
        });
    }
    /**
     * Update a workshop component
     * Authed. Owner-or-admin only (403 otherwise). PATCH
     * semantics - only supplied fields change. Recomputes
     * content_hash when render_data is in the patch.
     * @returns WorkshopComponentOut OK
     * @throws ApiError
     */
    public static updateComponent({
        componentId,
        requestBody,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
        /**
         * Component patch payload
         */
        requestBody: WorkshopComponentUpdateIn,
    }): CancelablePromise<WorkshopComponentOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/workshop/components/{component_id}',
            path: {
                'component_id': componentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not the component owner`,
                404: `Component not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Export a workshop component as portable JSON
     * Anonymous-OK. Returns the JSON-roundtripable form for
     * later import.
     * @returns ComponentExport OK
     * @throws ApiError
     */
    public static exportComponent({
        componentId,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
    }): CancelablePromise<ComponentExport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/components/{component_id}/export',
            path: {
                'component_id': componentId,
            },
            errors: {
                404: `Component not found`,
                422: `Invalid component_id`,
            },
        });
    }
    /**
     * Fork a published workshop component
     * Authed. Clones a published component into a new owner-
     * copy with the supplied slug. Source must be published
     * (400 otherwise). Slug uniqueness gate is shared with
     * create - 409 on collision.
     * @returns WorkshopComponentOut Created
     * @throws ApiError
     */
    public static forkComponent({
        componentId,
        slug,
    }: {
        /**
         * Source component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
        /**
         * Slug for the new fork
         */
        slug: any,
    }): CancelablePromise<WorkshopComponentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/components/{component_id}/fork',
            path: {
                'component_id': componentId,
            },
            query: {
                'slug': slug,
            },
            errors: {
                400: `Cannot fork an unpublished component`,
                401: `Authentication required`,
                404: `Component not found`,
                409: `Slug already exists`,
                422: `Invalid component_id or slug`,
            },
        });
    }
    /**
     * Install a component on a showcase section
     * Authed. Attaches the component as the section's
     * background and writes the install row. Caller must own
     * the target showcase page (403 otherwise; 404 if the
     * section is gone).
     * @returns ComponentInstallOut Created
     * @throws ApiError
     */
    public static installComponent({
        componentId,
        requestBody,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
        /**
         * Install target payload
         */
        requestBody: ComponentInstallRequest,
    }): CancelablePromise<ComponentInstallOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/components/{component_id}/install',
            path: {
                'component_id': componentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `You do not own this showcase page`,
                404: `Component or section not found`,
                422: `Invalid component_id or target_id`,
            },
        });
    }
    /**
     * Get install stats for a workshop component
     * Anonymous-OK. Returns the lifetime install count.
     * @returns ComponentInstallStatsOut OK
     * @throws ApiError
     */
    public static getComponentInstallStats({
        componentId,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
    }): CancelablePromise<ComponentInstallStatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/components/{component_id}/installations',
            path: {
                'component_id': componentId,
            },
            errors: {
                422: `Invalid component_id`,
            },
        });
    }
    /**
     * Rate a workshop component (upsert)
     * Authed. Inserts or updates the caller's rating (1..5)
     * for the component. Recomputes the denormalized
     * rating_avg + rating_count on the component.
     * @returns ComponentRatingOut Created
     * @throws ApiError
     */
    public static rateComponent({
        componentId,
        requestBody,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
        /**
         * Rating payload
         */
        requestBody: ComponentRatingCreateIn,
    }): CancelablePromise<ComponentRatingOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/components/{component_id}/rate',
            path: {
                'component_id': componentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Component not found`,
                422: `Rating out of range`,
            },
        });
    }
    /**
     * List ratings for a workshop component
     * Anonymous-OK. Cursor-paginated; newest first.
     * @returns ComponentRatingsListResponse OK
     * @throws ApiError
     */
    public static listComponentRatings({
        componentId,
        limit,
        cursor,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<ComponentRatingsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/components/{component_id}/ratings',
            path: {
                'component_id': componentId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                422: `Invalid component_id or cursor`,
            },
        });
    }
    /**
     * Uninstall a component from a showcase section
     * Authed. Idempotent - silent 204 when no matching
     * install row exists. Strips the component-background
     * fields from the section config.
     * @returns void
     * @throws ApiError
     */
    public static uninstallComponent({
        componentId,
        targetId,
    }: {
        /**
         * Component ID (UUID or wkc_<uuid>)
         */
        componentId: any,
        /**
         * Target section ID (UUID or shs_<uuid>)
         */
        targetId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workshop/components/{component_id}/uninstall',
            path: {
                'component_id': componentId,
            },
            query: {
                'target_id': targetId,
            },
            errors: {
                401: `Authentication required`,
                403: `You do not own this showcase page`,
                404: `Component not found`,
                422: `Invalid component_id or target_id`,
            },
        });
    }
    /**
     * Get featured/curated Workshop items
     * Anonymous-OK. Filters to is_featured=true.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopFeatured({
        limit,
        cursor,
        type,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * preset|component|all
         */
        type?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/featured',
            query: {
                'limit': limit,
                'cursor': cursor,
                'type': type,
            },
        });
    }
    /**
     * Browse published Workshop items
     * Anonymous-OK. Polymorphic browse over all item kinds with
     * filters: kind, category, tags (comma list), price_type,
     * q (substring), sort (popular|recent|rating|title).
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopItems({
        limit,
        cursor,
        sort,
        kind,
        category,
        tags,
        priceType,
        q,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * popular|recent|rating|title (prefix - to reverse)
         */
        sort?: any,
        /**
         * Item kind filter (preset|component|…)
         */
        kind?: any,
        /**
         * Category slug filter
         */
        category?: any,
        /**
         * Comma-separated tag list
         */
        tags?: any,
        /**
         * free|premium|donation|all
         */
        priceType?: any,
        /**
         * Substring search
         */
        q?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items',
            query: {
                'limit': limit,
                'cursor': cursor,
                'sort': sort,
                'kind': kind,
                'category': category,
                'tags': tags,
                'price_type': priceType,
                'q': q,
            },
        });
    }
    /**
     * Create a Workshop item
     * Authed. Inserts a new item owned by the caller. Slug is
     * unique per kind (409 on conflict); derived from the title
     * when omitted. Defaults to draft + free.
     * @returns WorkshopItemOut Created
     * @throws ApiError
     */
    public static createWorkshopItem({
        requestBody,
    }: {
        /**
         * Item payload
         */
        requestBody: WorkshopItemCreateIn,
    }): CancelablePromise<WorkshopItemOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/items',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                409: `Slug already exists for kind`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Featured Workshop items
     * Anonymous-OK. Filters to is_featured=true.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopItemsFeatured({
        limit,
        kind,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Item kind filter
         */
        kind?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/featured',
            query: {
                'limit': limit,
                'kind': kind,
            },
        });
    }
    /**
     * Snapshot a showcase page into a preset item
     * Authed. Owner-or-admin of the page. Captures the page
     * theme + per-section styles into a new preset-kind item.
     * @returns WorkshopItemOut Created
     * @throws ApiError
     */
    public static workshopItemFromShowcase({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page ID (UUID or shw_<uuid>)
         */
        pageId: any,
        /**
         * Snapshot payload
         */
        requestBody: WorkshopItemFromShowcaseRequest,
    }): CancelablePromise<WorkshopItemOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/items/from-showcase/{page_id}',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `You do not own this showcase page`,
                404: `Showcase page not found`,
                409: `Slug already exists`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * List the caller's acquired Workshop items (1D.2)
     * Authed. Returns items in the caller's personal library.
     * @returns WorkshopLibraryResponse OK
     * @throws ApiError
     */
    public static listWorkshopLibrary({
        limit,
        cursor,
        kind,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * Item kind filter
         */
        kind?: any,
    }): CancelablePromise<WorkshopLibraryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/library',
            query: {
                'limit': limit,
                'cursor': cursor,
                'kind': kind,
            },
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * List my Workshop items (drafts included)
     * Authed. Returns the caller's own items - drafts visible.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopItemsMy({
        limit,
        kind,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Item kind filter
         */
        kind?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/my',
            query: {
                'limit': limit,
                'kind': kind,
            },
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Most-installed Workshop items
     * Anonymous-OK. Ranked by install_count desc.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopItemsPopular({
        limit,
        kind,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Item kind filter
         */
        kind?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/popular',
            query: {
                'limit': limit,
                'kind': kind,
            },
        });
    }
    /**
     * Newest Workshop items
     * Anonymous-OK. Ordered by created_at desc.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopItemsRecent({
        limit,
        kind,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Item kind filter
         */
        kind?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/recent',
            query: {
                'limit': limit,
                'kind': kind,
            },
        });
    }
    /**
     * Search Workshop items
     * Anonymous-OK. ILIKE on title + description + shared filters.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static searchWorkshopItems({
        q,
        limit,
        kind,
        category,
        tags,
        priceType,
    }: {
        /**
         * Substring search
         */
        q?: any,
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Item kind filter
         */
        kind?: any,
        /**
         * Category filter
         */
        category?: any,
        /**
         * Comma-separated tag list
         */
        tags?: any,
        /**
         * free|premium|donation|all
         */
        priceType?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/search',
            query: {
                'q': q,
                'limit': limit,
                'kind': kind,
                'category': category,
                'tags': tags,
                'price_type': priceType,
            },
        });
    }
    /**
     * Get a Workshop item by slug
     * Anonymous-OK. Optional `kind` query disambiguates a slug
     * shared across kinds.
     * @returns WorkshopItemOut OK
     * @throws ApiError
     */
    public static getWorkshopItemBySlug({
        slug,
        kind,
    }: {
        /**
         * Item slug
         */
        slug: any,
        /**
         * Item kind (disambiguates shared slugs)
         */
        kind?: any,
    }): CancelablePromise<WorkshopItemOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/slug/{slug}',
            path: {
                'slug': slug,
            },
            query: {
                'kind': kind,
            },
            errors: {
                404: `Item not found`,
            },
        });
    }
    /**
     * Delete a Workshop item
     * Authed. Owner-or-admin only. CASCADE removes installs,
     * ratings, library entries + entitlements.
     * @returns void
     * @throws ApiError
     */
    public static deleteWorkshopItem({
        itemId,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workshop/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not the item owner`,
                404: `Item not found`,
                422: `Invalid item_id`,
            },
        });
    }
    /**
     * Get a Workshop item by ID
     * Anonymous-OK. Paid items return metadata-only (definition
     * omitted) unless the caller holds an entitlement.
     * @returns WorkshopItemOut OK
     * @throws ApiError
     */
    public static getWorkshopItem({
        itemId,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
    }): CancelablePromise<WorkshopItemOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                404: `Item not found`,
                422: `Invalid item_id`,
            },
        });
    }
    /**
     * Update a Workshop item
     * Authed. Owner-or-admin only. PATCH semantics - only
     * supplied fields change. Recomputes content_hash when the
     * definition changes on a component-kind item.
     * @returns WorkshopItemOut OK
     * @throws ApiError
     */
    public static updateWorkshopItem({
        itemId,
        requestBody,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
        /**
         * Item patch payload
         */
        requestBody: WorkshopItemUpdateIn,
    }): CancelablePromise<WorkshopItemOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/workshop/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not the item owner`,
                404: `Item not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Acquire a Workshop item into the caller's library (1D.2)
     * Authed. Free items grant an entitlement immediately; paid
     * items require a pre-existing entitlement (402).
     * @returns WorkshopAcquireOut OK
     * @throws ApiError
     */
    public static acquireWorkshopItem({
        itemId,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
    }): CancelablePromise<WorkshopAcquireOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/items/{item_id}/acquire',
            path: {
                'item_id': itemId,
            },
            errors: {
                401: `Authentication required`,
                402: `Entitlement required`,
                404: `Item not found`,
                422: `Invalid item_id`,
            },
        });
    }
    /**
     * Export a Workshop item
     * Anonymous-OK. Returns the item shape for JSON export.
     * Paid items export metadata-only without an entitlement.
     * @returns WorkshopItemOut OK
     * @throws ApiError
     */
    public static exportWorkshopItem({
        itemId,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
    }): CancelablePromise<WorkshopItemOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/{item_id}/export',
            path: {
                'item_id': itemId,
            },
            errors: {
                404: `Item not found`,
                422: `Invalid item_id`,
            },
        });
    }
    /**
     * Fork a published Workshop item
     * Authed. Clones a published item into a caller-owned copy.
     * Source must be published (400 otherwise). Slug unique per
     * kind (409); derived from the source title when omitted.
     * @returns WorkshopItemOut Created
     * @throws ApiError
     */
    public static forkWorkshopItem({
        itemId,
        slug,
    }: {
        /**
         * Source item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
        /**
         * Slug for the new fork
         */
        slug?: any,
    }): CancelablePromise<WorkshopItemOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/items/{item_id}/fork',
            path: {
                'item_id': itemId,
            },
            query: {
                'slug': slug,
            },
            errors: {
                400: `Cannot fork an unpublished item`,
                401: `Authentication required`,
                404: `Item not found`,
                409: `Slug already exists`,
                422: `Invalid item_id or slug`,
            },
        });
    }
    /**
     * Install a Workshop item on a target
     * Authed. Kind-dispatched: preset→showcase_page theme +
     * section styles; component→showcase_section config. Paid
     * items require an entitlement (402). Auto-acquires the item
     * into the caller's library.
     * @returns WorkshopInstallOut Created
     * @throws ApiError
     */
    public static installWorkshopItem({
        itemId,
        requestBody,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
        /**
         * Install target payload
         */
        requestBody: WorkshopInstallRequest,
    }): CancelablePromise<WorkshopInstallOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/items/{item_id}/install',
            path: {
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                402: `Entitlement required`,
                403: `Target not owned`,
                404: `Item or target not found`,
                422: `Invalid item_id or target`,
            },
        });
    }
    /**
     * Install stats for a Workshop item
     * Anonymous-OK. Lifetime install count.
     * @returns WorkshopInstallStatsOut OK
     * @throws ApiError
     */
    public static getWorkshopItemInstallStats({
        itemId,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
    }): CancelablePromise<WorkshopInstallStatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/{item_id}/installations',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Invalid item_id`,
            },
        });
    }
    /**
     * Rate a Workshop item (upsert)
     * Authed. Inserts or updates the caller's rating (1..5).
     * @returns WorkshopRatingOut Created
     * @throws ApiError
     */
    public static rateWorkshopItem({
        itemId,
        requestBody,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
        /**
         * Rating payload
         */
        requestBody: WorkshopRatingCreateIn,
    }): CancelablePromise<WorkshopRatingOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/items/{item_id}/rate',
            path: {
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Item not found`,
                422: `Rating out of range`,
            },
        });
    }
    /**
     * List ratings for a Workshop item
     * Anonymous-OK. Cursor-paginated; newest first.
     * @returns WorkshopRatingsListResponse OK
     * @throws ApiError
     */
    public static listWorkshopItemRatings({
        itemId,
        limit,
        cursor,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<WorkshopRatingsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/items/{item_id}/ratings',
            path: {
                'item_id': itemId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                422: `Invalid item_id or cursor`,
            },
        });
    }
    /**
     * Uninstall a Workshop item from a target
     * Authed. Idempotent - silent 204 when no install row
     * matches. Component-kind strips the section background.
     * @returns void
     * @throws ApiError
     */
    public static uninstallWorkshopItem({
        itemId,
        targetId,
    }: {
        /**
         * Item ID (UUID or wsi_<uuid>)
         */
        itemId: any,
        /**
         * Target id (UUID or prefixed)
         */
        targetId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workshop/items/{item_id}/uninstall',
            path: {
                'item_id': itemId,
            },
            query: {
                'target_id': targetId,
            },
            errors: {
                401: `Authentication required`,
                403: `Target not owned`,
                404: `Item not found`,
                422: `Invalid item_id or target_id`,
            },
        });
    }
    /**
     * List my Workshop items (drafts included)
     * Authed. Returns caller's own contributions - drafts
     * visible.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopMy({
        limit,
        cursor,
        type,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * preset|component|all
         */
        type?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/my',
            query: {
                'limit': limit,
                'cursor': cursor,
                'type': type,
            },
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Get most-installed Workshop items
     * Anonymous-OK. Ranked by install_count desc.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopPopular({
        limit,
        cursor,
        type,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * preset|component|all
         */
        type?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/popular',
            query: {
                'limit': limit,
                'cursor': cursor,
                'type': type,
            },
        });
    }
    /**
     * Create a style preset
     * Authed. Inserts a new owner-scoped style preset. Slug
     * must be globally unique - 409 on conflict. Defaults to
     * draft + free.
     * @returns StylePresetOut Created
     * @throws ApiError
     */
    public static createPreset({
        requestBody,
    }: {
        /**
         * Preset payload
         */
        requestBody: StylePresetCreateIn,
    }): CancelablePromise<StylePresetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/presets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                409: `Slug already exists`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Create a preset from an existing showcase page
     * Authed. Snapshots the page's theme + per-section styles
     * into a new preset owned by the caller. Page must be
     * caller-owned (403 otherwise).
     * @returns StylePresetOut Created
     * @throws ApiError
     */
    public static presetFromShowcase({
        pageId,
        requestBody,
    }: {
        /**
         * Showcase page ID (UUID or shw_<uuid>)
         */
        pageId: any,
        /**
         * Preset metadata
         */
        requestBody: PresetFromShowcaseRequest,
    }): CancelablePromise<StylePresetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/presets/from-showcase/{page_id}',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                403: `You do not own this showcase page`,
                404: `Showcase page not found`,
                409: `Slug already exists`,
                422: `Invalid page_id or payload`,
            },
        });
    }
    /**
     * Import a style preset from JSON
     * Authed. Installs an external preset payload as the
     * caller's new (unpublished, free) preset.
     * @returns StylePresetOut Created
     * @throws ApiError
     */
    public static importPreset({
        requestBody,
    }: {
        /**
         * Portable preset payload
         */
        requestBody: PresetImport,
    }): CancelablePromise<StylePresetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/presets/import',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                409: `Slug already exists`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * List presets installed by the current user
     * Authed. Returns a bare array per
     * @returns PresetInstallOut OK
     * @throws ApiError
     */
    public static listInstalledPresets({
        limit,
        cursor,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<Array<PresetInstallOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/presets/installed',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid cursor`,
            },
        });
    }
    /**
     * Get a style preset by slug
     * Anonymous-OK.
     * @returns StylePresetOut OK
     * @throws ApiError
     */
    public static getPresetBySlug({
        slug,
    }: {
        /**
         * Preset slug
         */
        slug: any,
    }): CancelablePromise<StylePresetOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/presets/slug/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                404: `Preset not found`,
            },
        });
    }
    /**
     * Delete a style preset
     * Authed. Owner-or-admin only. CASCADE removes ratings +
     * installations.
     * @returns void
     * @throws ApiError
     */
    public static deletePreset({
        presetId,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workshop/presets/{preset_id}',
            path: {
                'preset_id': presetId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not the preset owner`,
                404: `Preset not found`,
                422: `Invalid preset_id`,
            },
        });
    }
    /**
     * Get a style preset by ID
     * Anonymous-OK.
     * @returns StylePresetOut OK
     * @throws ApiError
     */
    public static getPreset({
        presetId,
    }: {
        /**
         * Preset ID (UUID or wkp_<uuid>)
         */
        presetId: any,
    }): CancelablePromise<StylePresetOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/presets/{preset_id}',
            path: {
                'preset_id': presetId,
            },
            errors: {
                404: `Preset not found`,
                422: `Invalid preset_id`,
            },
        });
    }
    /**
     * Update a style preset
     * Authed. Owner-or-admin only. PATCH semantics - only
     * supplied fields change.
     * @returns StylePresetOut OK
     * @throws ApiError
     */
    public static updatePreset({
        presetId,
        requestBody,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
        /**
         * Preset patch payload
         */
        requestBody: StylePresetUpdateIn,
    }): CancelablePromise<StylePresetOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/workshop/presets/{preset_id}',
            path: {
                'preset_id': presetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not the preset owner`,
                404: `Preset not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Export a style preset as portable JSON
     * Anonymous-OK.
     * @returns PresetExport OK
     * @throws ApiError
     */
    public static exportPreset({
        presetId,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
    }): CancelablePromise<PresetExport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/presets/{preset_id}/export',
            path: {
                'preset_id': presetId,
            },
            errors: {
                404: `Preset not found`,
                422: `Invalid preset_id`,
            },
        });
    }
    /**
     * Install a preset on a showcase page
     * Authed. Caller must own the target page. Applies the
     * preset's theme + per-section styles + writes the install
     * row.
     * @returns PresetInstallOut Created
     * @throws ApiError
     */
    public static installPreset({
        presetId,
        requestBody,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
        /**
         * Install target payload
         */
        requestBody: PresetInstallRequest,
    }): CancelablePromise<PresetInstallOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/presets/{preset_id}/install',
            path: {
                'preset_id': presetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `You do not own this showcase page`,
                404: `Preset or page not found`,
                422: `Invalid preset_id or target_id`,
            },
        });
    }
    /**
     * Get install stats for a style preset
     * Anonymous-OK.
     * @returns PresetInstallStatsOut OK
     * @throws ApiError
     */
    public static getPresetInstallStats({
        presetId,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
    }): CancelablePromise<PresetInstallStatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/presets/{preset_id}/installations',
            path: {
                'preset_id': presetId,
            },
            errors: {
                422: `Invalid preset_id`,
            },
        });
    }
    /**
     * Rate a style preset (upsert)
     * Authed. Inserts or updates the caller's rating (1..5).
     * Recomputes denormalized avg/count.
     * @returns PresetRatingOut Created
     * @throws ApiError
     */
    public static ratePreset({
        presetId,
        requestBody,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
        /**
         * Rating payload
         */
        requestBody: PresetRatingCreateIn,
    }): CancelablePromise<PresetRatingOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workshop/presets/{preset_id}/rate',
            path: {
                'preset_id': presetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Preset not found`,
                422: `Rating out of range`,
            },
        });
    }
    /**
     * List ratings for a style preset
     * Anonymous-OK. Cursor-paginated; newest first.
     * @returns PresetRatingsListResponse OK
     * @throws ApiError
     */
    public static listPresetRatings({
        presetId,
        limit,
        cursor,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<PresetRatingsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/presets/{preset_id}/ratings',
            path: {
                'preset_id': presetId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                422: `Invalid preset_id or cursor`,
            },
        });
    }
    /**
     * Uninstall a preset from a showcase page
     * Authed. Idempotent - silent 204 when no matching install
     * row exists.
     * @returns void
     * @throws ApiError
     */
    public static uninstallPreset({
        presetId,
        targetId,
    }: {
        /**
         * Preset ID
         */
        presetId: any,
        /**
         * Target showcase page ID (UUID or shw_<uuid>)
         */
        targetId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workshop/presets/{preset_id}/uninstall',
            path: {
                'preset_id': presetId,
            },
            query: {
                'target_id': targetId,
            },
            errors: {
                401: `Authentication required`,
                404: `Preset not found`,
                422: `Invalid preset_id or target_id`,
            },
        });
    }
    /**
     * Get newest Workshop items
     * Anonymous-OK. Ordered by created_at desc.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static browseWorkshopRecent({
        limit,
        cursor,
        type,
    }: {
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * preset|component|all
         */
        type?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/recent',
            query: {
                'limit': limit,
                'cursor': cursor,
                'type': type,
            },
        });
    }
    /**
     * Search Workshop items
     * Anonymous-OK. ILIKE on title + description, plus shared
     * filter set.
     * @returns WorkshopBrowseResponse OK
     * @throws ApiError
     */
    public static searchWorkshop({
        q,
        limit,
        cursor,
        sort,
        type,
        category,
        tags,
        priceType,
    }: {
        /**
         * Substring search
         */
        q?: any,
        /**
         * Page size 1..200 (default 50)
         */
        limit?: any,
        /**
         * Pagination cursor
         */
        cursor?: any,
        /**
         * popular|recent|rating|title
         */
        sort?: any,
        /**
         * preset|component|all
         */
        type?: any,
        /**
         * Category filter
         */
        category?: any,
        /**
         * Comma-separated tag list
         */
        tags?: any,
        /**
         * free|premium|all
         */
        priceType?: any,
    }): CancelablePromise<WorkshopBrowseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workshop/search',
            query: {
                'q': q,
                'limit': limit,
                'cursor': cursor,
                'sort': sort,
                'type': type,
                'category': category,
                'tags': tags,
                'price_type': priceType,
            },
        });
    }
}
