/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaCollectionCreateIn } from '../models/MediaCollectionCreateIn';
import type { MediaCollectionItemCreateIn } from '../models/MediaCollectionItemCreateIn';
import type { MediaCollectionItemOut } from '../models/MediaCollectionItemOut';
import type { MediaCollectionOut } from '../models/MediaCollectionOut';
import type { MediaCollectionShareCreateIn } from '../models/MediaCollectionShareCreateIn';
import type { MediaCollectionShareOut } from '../models/MediaCollectionShareOut';
import type { MediaCollectionUpdateIn } from '../models/MediaCollectionUpdateIn';
import type { SignedCollectionLinkOut } from '../models/SignedCollectionLinkOut';
import type { SignedCollectionLinkRequestIn } from '../models/SignedCollectionLinkRequestIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaCollectionsService {
    /**
     * List media collections
     * List collections visible to the caller. Owner sees their own rows regardless of visibility; non-owners see `public`/`unlisted` rows. Optional filters: owner_user_id, owner_group_id.
     * @returns MediaCollectionOut OK
     * @throws ApiError
     */
    public static listMediaCollections({
        ownerUserId,
        ownerGroupId,
    }: {
        /**
         * Filter by owner user UUID or usr_<uuid>
         */
        ownerUserId?: any,
        /**
         * Filter by owner group UUID or grp_<uuid>
         */
        ownerGroupId?: any,
    }): CancelablePromise<Array<MediaCollectionOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-collections',
            query: {
                'owner_user_id': ownerUserId,
                'owner_group_id': ownerGroupId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid filter`,
            },
        });
    }
    /**
     * Create a media collection
     * Create a new user-owned media collection.
     * @returns MediaCollectionOut OK
     * @throws ApiError
     */
    public static createMediaCollection({
        requestBody,
    }: {
        /**
         * Create payload
         */
        requestBody: MediaCollectionCreateIn,
    }): CancelablePromise<MediaCollectionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-collections',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Missing/invalid fields OR group-owner arm`,
            },
        });
    }
    /**
     * Delete a media collection
     * Delete an owner-owned collection. Non-owner returns 404 (BOLA-safe).
     * @returns void
     * @throws ApiError
     */
    public static deleteMediaCollection({
        collectionId,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/media-collections/{collection_id}',
            path: {
                'collection_id': collectionId,
            },
            errors: {
                401: `Authentication required`,
                404: `Collection not found`,
                422: `Invalid collection_id OR group-owner arm`,
            },
        });
    }
    /**
     * Get a media collection
     * Retrieve a single media collection by ID. Owner sees every collection regardless of visibility. Non-owners see public + unlisted only; private/shared/friends + group-owned return 404 (BOLA-safe) .
     * @returns MediaCollectionOut OK
     * @throws ApiError
     */
    public static getMediaCollection({
        collectionId,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
    }): CancelablePromise<MediaCollectionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-collections/{collection_id}',
            path: {
                'collection_id': collectionId,
            },
            errors: {
                401: `Authentication required`,
                404: `Collection not found`,
                422: `Invalid collection_id`,
            },
        });
    }
    /**
     * Update a media collection
     * Partial update of name, description, visibility, or media_type_filter. Owner-only; non-owner returns 404 (BOLA-safe).
     * @returns MediaCollectionOut OK
     * @throws ApiError
     */
    public static updateMediaCollection({
        collectionId,
        requestBody,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
        /**
         * Update payload
         */
        requestBody: MediaCollectionUpdateIn,
    }): CancelablePromise<MediaCollectionOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/media-collections/{collection_id}',
            path: {
                'collection_id': collectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Collection not found`,
                422: `Invalid collection_id, invalid enum, OR group-owner arm`,
            },
        });
    }
    /**
     * List items in a collection
     * Returns the upload-link rows in a collection, ordered by `sort_order ASC, created_at ASC`. Caller must be able to view the collection (owner or public/unlisted) - otherwise BOLA-safe 404.
     * @returns MediaCollectionItemOut OK
     * @throws ApiError
     */
    public static listCollectionItems({
        collectionId,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
    }): CancelablePromise<Array<MediaCollectionItemOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-collections/{collection_id}/items',
            path: {
                'collection_id': collectionId,
            },
            errors: {
                401: `Authentication required`,
                404: `Collection not found (BOLA-safe)`,
                422: `Invalid collection_id`,
            },
        });
    }
    /**
     * Add an item to a collection
     * Add an existing media upload to an owner-owned collection. Validates upload ownership (must match collection owner) and media-type filter. Non-owner of the collection returns 404 (BOLA-safe). Non-owner of the upload also returns 404 (BOLA-safe - never leaks that the upload exists).
     * @returns MediaCollectionItemOut OK
     * @throws ApiError
     */
    public static addCollectionItem({
        collectionId,
        requestBody,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
        /**
         * Item create payload (media_upload_id required)
         */
        requestBody: MediaCollectionItemCreateIn,
    }): CancelablePromise<MediaCollectionItemOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-collections/{collection_id}/items',
            path: {
                'collection_id': collectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Collection not found (BOLA-safe) OR upload-ownership mismatch`,
                409: `Upload already exists in this collection`,
                422: `Invalid IDs, media-type mismatch, OR group-owner arm`,
            },
        });
    }
    /**
     * Remove an item from a collection
     * Remove a media-upload link from an owner-owned collection. Does NOT delete the underlying upload. Non-owner of the collection returns 404 (BOLA-safe).
     * @returns void
     * @throws ApiError
     */
    public static removeCollectionItem({
        collectionId,
        itemId,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
        /**
         * Item UUID or mci_<uuid>
         */
        itemId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/media-collections/{collection_id}/items/{item_id}',
            path: {
                'collection_id': collectionId,
                'item_id': itemId,
            },
            errors: {
                401: `Authentication required`,
                404: `Collection or item not found (BOLA-safe)`,
                422: `Invalid IDs OR group-owner arm`,
            },
        });
    }
    /**
     * List collection shares
     * Returns all share grants on a collection, newest-first. Owner-only - non-owner returns 404 (BOLA-safe).
     * @returns MediaCollectionShareOut OK
     * @throws ApiError
     */
    public static listCollectionShares({
        collectionId,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
    }): CancelablePromise<Array<MediaCollectionShareOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media-collections/{collection_id}/shares',
            path: {
                'collection_id': collectionId,
            },
            errors: {
                401: `Authentication required`,
                404: `Collection not found (BOLA-safe)`,
                422: `Invalid collection_id`,
            },
        });
    }
    /**
     * Share a collection with a user or group
     * Upsert a share grant. (target_type, target_id) is unique per collection - re-posting updates permission + expires_at. Owner-only on parent collection (BOLA-safe 404 for non-owner). target_type ∈ {user, group}; permission ∈ {viewer, editor}.
     * @returns MediaCollectionShareOut OK
     * @throws ApiError
     */
    public static createCollectionShare({
        collectionId,
        requestBody,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
        /**
         * Share create payload
         */
        requestBody: MediaCollectionShareCreateIn,
    }): CancelablePromise<MediaCollectionShareOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-collections/{collection_id}/shares',
            path: {
                'collection_id': collectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Collection not found (BOLA-safe)`,
                422: `Invalid IDs or enum values`,
            },
        });
    }
    /**
     * Revoke a collection share
     * Delete a share row. Owner-only on parent collection - non-owner returns 404 (BOLA-safe).
     * @returns void
     * @throws ApiError
     */
    public static removeCollectionShare({
        collectionId,
        shareId,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
        /**
         * Share UUID
         */
        shareId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/media-collections/{collection_id}/shares/{share_id}',
            path: {
                'collection_id': collectionId,
                'share_id': shareId,
            },
            errors: {
                401: `Authentication required`,
                404: `Collection or share not found (BOLA-safe)`,
                422: `Invalid IDs`,
            },
        });
    }
    /**
     * Generate a signed share link
     * Mint a time-limited HMAC-signed token granting read access to a collection. TTL is clamped to [60s, server max (24h default)]. Owner-only - non-owner returns 404 (BOLA-safe). The returned share_url is consumed by `GET /media-collections/shared/{token}` (handled by media-delivery worker).
     * @returns SignedCollectionLinkOut OK
     * @throws ApiError
     */
    public static createCollectionSignedLink({
        collectionId,
        requestBody,
    }: {
        /**
         * Collection UUID or mco_<uuid>
         */
        collectionId: any,
        /**
         * Optional TTL override
         */
        requestBody?: SignedCollectionLinkRequestIn,
    }): CancelablePromise<SignedCollectionLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media-collections/{collection_id}/signed-link',
            path: {
                'collection_id': collectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Collection not found (BOLA-safe)`,
                422: `Invalid collection_id OR secret unset`,
            },
        });
    }
}
