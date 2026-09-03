/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OgImagesService {
    /**
     * OG image (fallback render)
     * Anonymous-public crawler endpoint. Returns a 1200x630
     * PNG suitable for og:image / twitter:image. Currently
     * renders a synthetic brand+entity+slug card; future
     * cycles will 302-redirect to source images once cross-
     * worker resolver contracts land. Rate-limited per IP.
     * @returns binary PNG bytes
     * @throws ApiError
     */
    public static getOgImage({
        entity,
        slugVer,
    }: {
        /**
         * Entity family (tracklists, releases, groups, events, venues, genres, epk, artists, profile)
         */
        entity: any,
        /**
         * Content-addressed slug, e.g. my-event_v17
         */
        slugVer: any,
    }): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/og/{entity}/{slug_ver}.png',
            path: {
                'entity': entity,
                'slug_ver': slugVer,
            },
            errors: {
                404: `Entity family not supported`,
                422: `Slug exceeds maximum length`,
                429: `Per-caller rate limit exceeded`,
            },
        });
    }
}
