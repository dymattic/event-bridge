/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionImageOut } from '../models/PromotionImageOut';
import type { PromotionImageUpdateIn } from '../models/PromotionImageUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PromotionMediaService {
    /**
     * Delete a promotional image
     * Idempotent owner-only delete. Admin claims bypass ownership.
     * @returns void
     * @throws ApiError
     */
    public static deletePromotionImage({
        imageId,
    }: {
        /**
         * Image id (UUID or img_<uuid>)
         */
        imageId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/media/images/{image_id}',
            path: {
                'image_id': imageId,
            },
            errors: {
                401: `Authentication required`,
                403: `Forbidden`,
                422: `Invalid image_id`,
                503: `profiles upstream unavailable`,
            },
        });
    }
    /**
     * Get a promotional image by id
     * Returns the raw image bytes inline. Public images may be fetched anonymously; non-public images require the owner OR a profiles cross-worker membership match on the linked profile.
     * @returns string Image bytes
     * @throws ApiError
     */
    public static getPromotionImage({
        imageId,
        asDownload,
    }: {
        /**
         * Image id (UUID or img_<uuid>)
         */
        imageId: any,
        /**
         * Force download instead of inline display
         */
        asDownload?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media/images/{image_id}',
            path: {
                'image_id': imageId,
            },
            query: {
                'as_download': asDownload,
            },
            errors: {
                403: `Forbidden`,
                404: `Image not found`,
                422: `Validation failed`,
                503: `profiles upstream unavailable`,
            },
        });
    }
    /**
     * Update promotional image metadata
     * Owner-only partial update of kind / alt_text / is_public. Admin claims bypass ownership.
     * @returns PromotionImageOut OK
     * @throws ApiError
     */
    public static updatePromotionImage({
        imageId,
        requestBody,
    }: {
        /**
         * Image id (UUID or img_<uuid>)
         */
        imageId: any,
        /**
         * Partial update fields
         */
        requestBody: PromotionImageUpdateIn,
    }): CancelablePromise<PromotionImageOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/media/images/{image_id}',
            path: {
                'image_id': imageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Forbidden`,
                404: `Image not found`,
                422: `Invalid image_id or body`,
                503: `profiles upstream unavailable`,
            },
        });
    }
    /**
     * List promotional images for a profile
     * Member-only enumeration of a profile's promo images.
     * @returns PromotionImageOut OK
     * @throws ApiError
     */
    public static listProfilePromotionImages({
        profileId,
        kind,
    }: {
        /**
         * Profile id (UUID or pro_<uuid>)
         */
        profileId: any,
        /**
         * Filter by kind
         */
        kind?: any,
    }): CancelablePromise<Array<PromotionImageOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/media/profiles/{profile_id}/images',
            path: {
                'profile_id': profileId,
            },
            query: {
                'kind': kind,
            },
            errors: {
                401: `Authentication required`,
                403: `Not a member of profile`,
                422: `Invalid profile_id`,
                503: `profiles upstream unavailable`,
            },
        });
    }
    /**
     * Upload a promotional image
     * Accepts a multipart image upload (logo / banner / gallery / other) and persists the bytes inline in the database. 10 MiB cap. MIME type is sniffed server-side; the client Content-Type header is not trusted. Filename path components are stripped before storage. profile_id and profile_slug are mutually exclusive.
     * @returns PromotionImageOut OK
     * @throws ApiError
     */
    public static uploadPromotionImage({
        formData,
    }: {
        formData: {
            /**
             * Accessibility alt-text
             */
            alt_text?: string;
            /**
             * Image bytes; max 10 MiB
             */
            file: Blob;
            /**
             * Default true
             */
            is_public?: boolean;
            /**
             * logo|banner|gallery|other
             */
            kind?: string;
            /**
             * Profile UUID or pro_<uuid>; caller must be a member
             */
            profile_id?: string;
            /**
             * Profile slug; resolved cross-worker
             */
            profile_slug?: string;
        },
    }): CancelablePromise<PromotionImageOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid multipart body`,
                401: `Authentication required`,
                403: `Not a member of profile`,
                404: `profile_slug does not match a profile`,
                409: `profile_slug matches multiple profiles`,
                413: `File exceeds 10 MiB`,
                422: `Validation failed`,
                500: `Internal error`,
                503: `profiles upstream unavailable`,
            },
        });
    }
}
