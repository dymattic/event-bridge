/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { oembedOut } from '../models/oembedOut';
import type { PreviewDTO } from '../models/PreviewDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PreviewService {
    /**
     * oEmbed 1.0 provider
     * Anonymous-public oEmbed endpoint over the /v1/preview
     * entity arms. `url` is a shared rave.page URL; its path
     * routes to the matching entity preview. `format` other
     * than json → 501 per spec. Unknown/unparseable url →
     * 404. maxwidth/maxheight accepted-ignored (type=link).
     * @returns oembedOut OK
     * @throws ApiError
     */
    public static getOEmbed({
        url,
        format,
        maxwidth,
        maxheight,
    }: {
        /**
         * Shared rave.page URL (encoded)
         */
        url: any,
        /**
         * Response format - only json supported
         */
        format?: any,
        /**
         * Accepted-ignored (oEmbed spec)
         */
        maxwidth?: any,
        /**
         * Accepted-ignored (oEmbed spec)
         */
        maxheight?: any,
    }): CancelablePromise<oembedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/oembed',
            query: {
                'url': url,
                'format': format,
                'maxwidth': maxwidth,
                'maxheight': maxheight,
            },
            errors: {
                404: `Unknown or unresolvable url`,
                501: `Unsupported format`,
                503: `Upstream worker unavailable`,
            },
        });
    }
    /**
     * Rich preview metadata for crawlers + link previews
     * Anonymous-public. Returns Open Graph + Twitter Card +
     * schema.org structured data for crawlers and link
     * previews. All 11 entity families are live:
     * events (real poster, credits, lineup with set times,
     * MusicEvent JSON-LD), the profile-backed family
     * profile / epk / artists / groups / venues, the music
     * family tracks / releases / tracklists / genres, and
     * showcase. Private/gated rows → 404 (BOLA-safe).
     * @returns PreviewDTO OK
     * @throws ApiError
     */
    public static getPreview({
        entity,
        slug,
    }: {
        /**
         * Entity family (tracklists, releases, groups, events, venues, genres, epk, artists, profile, tracks, showcase)
         */
        entity: any,
        /**
         * Entity slug, prefixed-ID, or raw UUID
         */
        slug: any,
    }): CancelablePromise<PreviewDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/preview/{entity}/{slug}',
            path: {
                'entity': entity,
                'slug': slug,
            },
            errors: {
                404: `Entity family not supported OR entity not found`,
                422: `Invalid slug/ref`,
                503: `Upstream worker unavailable (all arms except entity=events, which fails-closed-to-empty)`,
            },
        });
    }
}
