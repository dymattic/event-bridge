/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkPreviewOut } from '../models/LinkPreviewOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LinkPreviewService {
    /**
     * Resolve a rich preview for an external link
     * Server-side fetch of a user-supplied URL, returning
     * OpenGraph / Twitter Card / native metadata for a link
     * preview card. The fetch happens from our infrastructure,
     * so the viewer's IP address is never disclosed to the
     * linked site.
     *
     * Images are returned ONLY as `proxy_url` values on this
     * origin. The third-party image URL is deliberately not
     * present in the response: rendering it directly would
     * leak the viewer's IP to the image host and defeat the
     * purpose of the endpoint.
     *
     * anonymous-allowed, fail-closed: a caller with no user
     * identity may resolve ONLY a URL on the worker's
     * compiled-in allowlist (the manifesto reference library
     * and the federation partner links). Any other URL - and
     * equally a missing, malformed, oversize or non-public
     * one, none of which could have matched - plus an empty
     * allowlist or the ops kill switch, all answer the SAME
     * 401, byte-identical to the 401 an unauthenticated
     * caller gets today, so the arm is not a probe surface.
     * Authed callers keep the 422 diagnostics. The
     * allowlist is committed source embedded at build time;
     * it has no runtime input path. Anonymous callers run on
     * their own smaller rate tier, keyed on the gateway's
     * client tag, and get `Cache-Control: public`.
     *
     * Results are cached server-side; `cache_ttl_seconds`
     * tells the client how long it may reuse one.
     * @returns LinkPreviewOut OK
     * @throws ApiError
     */
    public static resolveLinkPreview({
        url,
    }: {
        /**
         * Absolute http(s) URL to preview
         */
        url: any,
    }): CancelablePromise<LinkPreviewOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/link-preview',
            query: {
                'url': url,
            },
            errors: {
                401: `Missing or invalid credentials, or an anonymous caller asked for anything the allowlist does not cover - including a missing or malformed URL`,
                422: `Authed callers only: URL missing, malformed, or pointing at a non-public target`,
                429: `Rate limit exceeded`,
                502: `Link target unreachable`,
            },
        });
    }
    /**
     * Proxy a preview image
     * Streams an image discovered during a link-preview
     * resolve, fetched by us so the viewer's browser never
     * contacts the third-party host.
     *
     * `ref` is the opaque signed reference returned as
     * `proxy_url`; arbitrary URLs are not accepted, which is
     * what stops this being an open proxy. Only raster image
     * types are served - SVG is refused because it is a
     * script-bearing document and would be same-origin XSS.
     *
     * anonymous-allowed, fail-closed: a caller with no user
     * identity may fetch ONLY a reference minted by a resolve
     * of an allowlisted page - the reference carries that
     * audience scope under the same signature as the URL.
     * Any other reference answers 404, never 403, so the
     * endpoint is not a token oracle. The ops kill switch and
     * an empty allowlist answer 401, as an endpoint with no
     * anonymous arm does.
     * @returns binary Image bytes
     * @throws ApiError
     */
    public static getLinkPreviewImage({
        ref,
    }: {
        /**
         * Opaque signed image reference from a resolve response
         */
        ref: any,
    }): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/link-preview/image/{ref}',
            path: {
                'ref': ref,
            },
            errors: {
                401: `Missing or invalid credentials, or the anonymous arm is closed`,
                404: `Unknown, forged, expired or wrong-audience reference`,
                422: `Target not permitted, or not a supported image`,
                429: `Rate limit exceeded`,
                502: `Image host unreachable`,
            },
        });
    }
}
