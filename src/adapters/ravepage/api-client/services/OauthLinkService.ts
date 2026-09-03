/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudConnectIn } from '../models/SoundCloudConnectIn';
import type { SoundCloudConnectOut } from '../models/SoundCloudConnectOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OauthLinkService {
    /**
     * Connect SoundCloud (data features)
     * Starts a SoundCloud authorization for the logged-in user
     * through the broker. Returns `auth_url` - the FE navigates
     * there; after consent the captured SoundCloud token is
     * stored for the user and the browser returns to
     * `frontend_redirect_uri` with `?linked=soundcloud`.
     * @returns SoundCloudConnectOut OK
     * @throws ApiError
     */
    public static connectSoundCloud({
        requestBody,
    }: {
        /**
         * Optional FE return URL
         */
        requestBody?: SoundCloudConnectIn,
    }): CancelablePromise<SoundCloudConnectOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/soundcloud/connect',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
