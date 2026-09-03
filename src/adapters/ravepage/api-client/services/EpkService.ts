/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKBySlugOut } from '../models/EPKBySlugOut';
import type { EPKCreateIn } from '../models/EPKCreateIn';
import type { EPKOut } from '../models/EPKOut';
import type { EPKUpdateIn } from '../models/EPKUpdateIn';
import type { PublicEPKOut } from '../models/PublicEPKOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EpkService {
    /**
     * List EPKs for the current user
     * Authenticated. Returns every EPK owned by the caller,
     * optionally filtered by profile_id.
     * @returns EPKOut OK
     * @throws ApiError
     */
    public static listEpks({
        profileId,
    }: {
        /**
         * Filter by profile UUID
         */
        profileId?: any,
    }): CancelablePromise<Array<EPKOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/epk',
            query: {
                'profile_id': profileId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid profile_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create an EPK
     * Authenticated. The caller must be one of the target
     * profile's owners. Slug must be unique.
     * @returns EPKOut Created
     * @throws ApiError
     */
    public static createEpk({
        requestBody,
    }: {
        /**
         * EPK create payload
         */
        requestBody: EPKCreateIn,
    }): CancelablePromise<EPKOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/epk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorized to manage this profile's EPK`,
                409: `EPK slug already exists`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get an EPK by ID
     * Anonymous-accepting. Public EPKs viewable by anyone;
     * private EPKs visible to the owner or profile owners.
     * @returns EPKOut OK
     * @throws ApiError
     */
    public static getEpkById({
        epkId,
    }: {
        /**
         * EPK UUID
         */
        epkId: any,
    }): CancelablePromise<EPKOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/epk/by-id/{epk_id}',
            path: {
                'epk_id': epkId,
            },
            errors: {
                403: `Not authorized`,
                404: `EPK not found`,
                422: `Invalid epk_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get rich public EPK JSON by slug (Spec 1.0)
     * Anonymous-accepting. Returns the canonical EPK JSON
     * for the FE premium /epk page. Query `variant`
     * ("full"/"short") controls the payload size; `lang`
     * ("en"/"de") is accepted for ETag namespacing.
     * @returns PublicEPKOut OK
     * @throws ApiError
     */
    public static getPublicEpk({
        slug,
        lang,
        variant,
    }: {
        /**
         * EPK or Profile slug
         */
        slug: any,
        /**
         * Locale
         */
        lang?: any,
        /**
         * Payload variant
         */
        variant?: any,
    }): CancelablePromise<PublicEPKOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/epk/public/{slug}',
            path: {
                'slug': slug,
            },
            query: {
                'lang': lang,
                'variant': variant,
            },
            errors: {
                403: `Not authorized`,
                404: `EPK or Profile not found`,
                422: `Invalid query params`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete an EPK
     * Authenticated. Caller must own the EPK or be a
     * profile owner. Silent 204 on missing row.
     * @returns void
     * @throws ApiError
     */
    public static deleteEpk({
        epkId,
    }: {
        /**
         * EPK UUID
         */
        epkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/epk/{epk_id}',
            path: {
                'epk_id': epkId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not authorized`,
                422: `Invalid epk_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update an EPK
     * Authenticated. Caller must own the EPK or one of the
     * associated profile's owners. Patch semantics - only
     * supplied fields change.
     * @returns EPKOut OK
     * @throws ApiError
     */
    public static updateEpk({
        epkId,
        requestBody,
    }: {
        /**
         * EPK UUID (bare or `epk_<uuid>`)
         */
        epkId: any,
        /**
         * Patch payload
         */
        requestBody: EPKUpdateIn,
    }): CancelablePromise<EPKOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/epk/{epk_id}',
            path: {
                'epk_id': epkId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorized`,
                404: `EPK not found`,
                409: `EPK slug already exists`,
                422: `Invalid epk_id OR validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get EPK merged JSON by slug
     * Anonymous-accepting. Resolves either a dedicated EPK
     * (slug → EPK) or a Profile (slug → profile); returns
     * the merged dict in either case.
     * @returns EPKBySlugOut OK
     * @throws ApiError
     */
    public static getEpkBySlug({
        slug,
    }: {
        /**
         * EPK or Profile slug
         */
        slug: any,
    }): CancelablePromise<EPKBySlugOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/epk/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                403: `Not authorized`,
                404: `EPK or Profile not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * PDF retired - fetch JSON + render client-side
     * Server-side PDF rendering is retired. This endpoint returns 410 Gone with a `Location: /epk/{slug}` header; fetch that JSON resource and render the PDF on the client.
     * @returns void
     * @throws ApiError
     */
    public static getEpkPdf({
        slug,
    }: {
        /**
         * EPK slug
         */
        slug: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/epk/{slug}/pdf',
            path: {
                'slug': slug,
            },
            errors: {
                410: `Gone`,
            },
        });
    }
}
