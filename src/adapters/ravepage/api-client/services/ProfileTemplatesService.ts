/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileTemplateCreateIn } from '../models/ProfileTemplateCreateIn';
import type { ProfileTemplateOut } from '../models/ProfileTemplateOut';
import type { ProfileTemplateUpdateIn } from '../models/ProfileTemplateUpdateIn';
import type { TemplateShareIn } from '../models/TemplateShareIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileTemplatesService {
    /**
     * List layout templates for a profile type
     * Returns available section blueprints for a given profile type. Anonymous callers receive PUBLIC templates only; authed callers also receive owned + shared templates. Type query param is required.
     * @returns ProfileTemplateOut OK
     * @throws ApiError
     */
    public static listProfileTemplates({
        type,
    }: {
        /**
         * Profile type (artist, club, group, label, venue, event_series, other)
         */
        type: any,
    }): CancelablePromise<Array<ProfileTemplateOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile-templates',
            query: {
                'type': type,
            },
            errors: {
                422: `Missing or invalid \`type\` query param`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a new profile template
     * Owner is the calling user. `is_public` is admin-only - non-admins setting it true are silently coerced to false .
     * @returns ProfileTemplateOut Created
     * @throws ApiError
     */
    public static createProfileTemplate({
        requestBody,
    }: {
        /**
         * Template payload
         */
        requestBody: ProfileTemplateCreateIn,
    }): CancelablePromise<ProfileTemplateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profile-templates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                422: `Missing required field`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a profile template
     * Owner-or-admin. Returns 204 even if the row is already absent .
     * @returns void
     * @throws ApiError
     */
    public static deleteProfileTemplate({
        templateId,
    }: {
        /**
         * Template UUID
         */
        templateId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profile-templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not allowed to delete this template`,
                422: `Invalid template_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a template by ID
     * Anonymous callers can read PUBLIC templates. Owners + users granted via /share can read non-public templates. Admins bypass.
     * @returns ProfileTemplateOut OK
     * @throws ApiError
     */
    public static getProfileTemplateById({
        templateId,
    }: {
        /**
         * Template UUID
         */
        templateId: any,
    }): CancelablePromise<ProfileTemplateOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile-templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            errors: {
                403: `Not allowed to view this template`,
                404: `Template not found`,
                422: `Invalid template_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a profile template
     * Owner-or-admin. Non-admin setting `is_public=true` → 403 with "Only admins can publish templates".
     * @returns ProfileTemplateOut OK
     * @throws ApiError
     */
    public static updateProfileTemplate({
        templateId,
        requestBody,
    }: {
        /**
         * Template UUID
         */
        templateId: any,
        /**
         * Partial update payload
         */
        requestBody: ProfileTemplateUpdateIn,
    }): CancelablePromise<ProfileTemplateOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/profile-templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to edit this template`,
                404: `Template not found`,
                422: `Invalid template_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unshare a template with users
     * Owner-or-admin. Idempotently removes `template_shares` rows for every user_id in the body. Silent 204 on missing template .
     * @returns void
     * @throws ApiError
     */
    public static unshareProfileTemplate({
        templateId,
        requestBody,
    }: {
        /**
         * Template UUID
         */
        templateId: any,
        /**
         * User ids to revoke (bare UUID or usr_<uuid>)
         */
        requestBody: TemplateShareIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profile-templates/{template_id}/share',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to unshare this template`,
                422: `Invalid user_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Share a template with users
     * Owner-or-admin. Idempotently grants `template_shares` rows for every user_id in the body. 404 on missing template .
     * @returns void
     * @throws ApiError
     */
    public static shareProfileTemplate({
        templateId,
        requestBody,
    }: {
        /**
         * Template UUID
         */
        templateId: any,
        /**
         * User ids to share with (bare UUID or usr_<uuid>)
         */
        requestBody: TemplateShareIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profile-templates/{template_id}/share',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Not allowed to share this template`,
                404: `Template not found`,
                422: `Invalid user_id`,
                500: `Internal error`,
            },
        });
    }
}
