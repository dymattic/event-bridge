/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CampaignCollaboratorOut } from '../models/CampaignCollaboratorOut';
import type { CampaignCollaboratorUpsert } from '../models/CampaignCollaboratorUpsert';
import type { CampaignCreate } from '../models/CampaignCreate';
import type { CampaignDetail } from '../models/CampaignDetail';
import type { CampaignDuplicateIn } from '../models/CampaignDuplicateIn';
import type { CampaignOut } from '../models/CampaignOut';
import type { CampaignPlatformOut } from '../models/CampaignPlatformOut';
import type { CampaignPublishIn } from '../models/CampaignPublishIn';
import type { CampaignRunOut } from '../models/CampaignRunOut';
import type { CampaignStepCreate } from '../models/CampaignStepCreate';
import type { CampaignStepDetail } from '../models/CampaignStepDetail';
import type { CampaignStepPlatformOverrideOut } from '../models/CampaignStepPlatformOverrideOut';
import type { CampaignStepPlatformOverrideUpsert } from '../models/CampaignStepPlatformOverrideUpsert';
import type { CampaignStepPreview } from '../models/CampaignStepPreview';
import type { CampaignStepReorderIn } from '../models/CampaignStepReorderIn';
import type { CampaignStepUpdate } from '../models/CampaignStepUpdate';
import type { CampaignUpdate } from '../models/CampaignUpdate';
import type { DiscordTargetCreate } from '../models/DiscordTargetCreate';
import type { DiscordTargetOut } from '../models/DiscordTargetOut';
import type { EmailSenderCreate } from '../models/EmailSenderCreate';
import type { EmailSenderOut } from '../models/EmailSenderOut';
import type { EntityRevisionOut } from '../models/EntityRevisionOut';
import type { EntityRevisionSummary } from '../models/EntityRevisionSummary';
import type { PromoTaskMigrateIn } from '../models/PromoTaskMigrateIn';
import type { PublishStepResult } from '../models/PublishStepResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CampaignsService {
    /**
     * List Discord webhook targets for an owner
     * Returns all Discord webhook targets owned by the
     * specified (owner_type, owner_id) pair. Caller must be
     * the owner or admin.
     * @returns DiscordTargetOut OK
     * @throws ApiError
     */
    public static listCampaignDiscordTargets({
        ownerType,
        ownerId,
    }: {
        /**
         * Owner type (currently 'user'; group/performer pending cross-worker contracts)
         */
        ownerType: any,
        /**
         * Owner ID (prefixed or bare UUID)
         */
        ownerId: any,
    }): CancelablePromise<Array<DiscordTargetOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaign-discord-targets',
            query: {
                'owner_type': ownerType,
                'owner_id': ownerId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller does not own the entity`,
                422: `Invalid query or owner_type unsupported`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Register a Discord channel webhook for use in campaigns
     * Creates a reusable Discord webhook target owned by the
     * authenticated user. The webhook URL is stored verbatim
     * and returned to owner/admin on read . Currently accepts
     * `owner_type=user` only; group/performer owner_types
     * require pending cross-worker contracts.
     * @returns DiscordTargetOut Created
     * @throws ApiError
     */
    public static createCampaignDiscordTarget({
        requestBody,
    }: {
        /**
         * Target fields
         */
        requestBody: DiscordTargetCreate,
    }): CancelablePromise<DiscordTargetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaign-discord-targets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller is not the owning user`,
                422: `Validation failed or owner_type unsupported`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a Discord webhook target
     * Deletes the row. Returns 404 if no row exists; 403
     * if the caller is not the owner and not admin .
     * @returns void
     * @throws ApiError
     */
    public static deleteCampaignDiscordTarget({
        targetId,
    }: {
        /**
         * Discord target ID (cds_<uuid> or bare UUID)
         */
        targetId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/campaign-discord-targets/{target_id}',
            path: {
                'target_id': targetId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller does not own the entity`,
                404: `Target not found`,
                422: `Malformed target_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List campaign platforms
     * Anonymous-OK list of supported campaign platforms with capability flags.
     * @returns CampaignPlatformOut OK
     * @throws ApiError
     */
    public static listCampaignPlatforms(): CancelablePromise<Array<CampaignPlatformOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaign-platforms',
        });
    }
    /**
     * List registered email sender identities for an owner
     * Returns all email-sender rows owned by the specified
     * (owner_type, owner_id) pair.
     * @returns EmailSenderOut OK
     * @throws ApiError
     */
    public static listCampaignSenders({
        ownerType,
        ownerId,
    }: {
        /**
         * Owner type (currently 'user'; group/performer pending cross-worker contracts)
         */
        ownerType: any,
        /**
         * Owner ID (prefixed or bare UUID)
         */
        ownerId: any,
    }): CancelablePromise<Array<EmailSenderOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaign-senders',
            query: {
                'owner_type': ownerType,
                'owner_id': ownerId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller does not own the entity`,
                422: `Invalid query or owner_type unsupported`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Register an email sender identity for verification
     * Creates a reusable email-sender row owned by a
     * user/group/performer. The new row starts unverified
     * (verified=false); a separate verify flow promotes it.
     * Currently accepts `owner_type=user` only; group and
     * performer owner_types require pending cross-worker
     * contracts.
     * @returns EmailSenderOut Created
     * @throws ApiError
     */
    public static createCampaignSender({
        requestBody,
    }: {
        /**
         * Sender fields
         */
        requestBody: EmailSenderCreate,
    }): CancelablePromise<EmailSenderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaign-senders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller is not the owning user`,
                422: `Validation failed, duplicate email, or owner_type unsupported`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove an email sender identity
     * Deletes the row. 404 on miss; 403 on owner-mismatch .
     * @returns void
     * @throws ApiError
     */
    public static deleteCampaignSender({
        senderId,
    }: {
        /**
         * Email sender ID (csnd_<uuid> or bare UUID)
         */
        senderId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/campaign-senders/{sender_id}',
            path: {
                'sender_id': senderId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller does not own the entity`,
                404: `Sender not found`,
                422: `Malformed sender_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List campaigns visible to the caller
     * Returns campaigns the caller may view. Admin sees all.
     * @returns CampaignOut OK
     * @throws ApiError
     */
    public static listCampaigns({
        ownerType,
        ownerId,
        targetType,
        targetId,
        status,
        offset,
        limit,
    }: {
        /**
         * Filter by owner_type
         */
        ownerType?: any,
        /**
         * Filter by owner_id
         */
        ownerId?: any,
        /**
         * Filter by target_type
         */
        targetType?: any,
        /**
         * Filter by target_id
         */
        targetId?: any,
        /**
         * Filter by status (repeatable)
         */
        status?: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<CampaignOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns',
            query: {
                'owner_type': ownerType,
                'owner_id': ownerId,
                'target_type': targetType,
                'target_id': targetId,
                'status': status,
                'offset': offset,
                'limit': limit,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Invalid query param`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a new campaign (starts in draft)
     * Creates a campaign owned by the authenticated user.
     * Currently accepts `owner_type=user` only; group and
     * performer owner_types require pending cross-worker
     * contracts and return 422 at runtime if requested.
     * @returns CampaignOut Created
     * @throws ApiError
     */
    public static createCampaign({
        requestBody,
    }: {
        /**
         * Campaign fields
         */
        requestBody: CampaignCreate,
    }): CancelablePromise<CampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller is not the owning user`,
                422: `Validation failed or owner_type unsupported`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Archive (or hard-delete with admin) a campaign
     * Soft-deletes by flipping status to 'archived'. The
     * `?hard=true` variant removes the row entirely and
     * requires the caller to be an admin (403 otherwise).
     * @returns void
     * @throws ApiError
     */
    public static deleteCampaign({
        campaignId,
        hard,
    }: {
        /**
         * Campaign ID (prefixed or bare UUID)
         */
        campaignId: any,
        /**
         * true → delete row (admin only); default false → soft archive
         */
        hard?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/campaigns/{campaign_id}',
            path: {
                'campaign_id': campaignId,
            },
            query: {
                'hard': hard,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Only admin may hard-delete`,
                404: `Campaign not found or not visible to caller`,
                422: `Malformed campaign_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get one campaign (BOLA-gated)
     * Returns the campaign's detail view. BOLA-gated: a
     * non-owner non-admin caller sees 404 (not 403) to
     * avoid leaking campaign ID existence.
     * @returns CampaignDetail OK
     * @throws ApiError
     */
    public static getCampaign({
        campaignId,
    }: {
        /**
         * Campaign ID (prefixed 'cmp_<uuid>' or bare UUID)
         */
        campaignId: any,
    }): CancelablePromise<CampaignDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{campaign_id}',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign not found or not visible to caller`,
                422: `Malformed campaign_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update campaign fields (status transitions enforced)
     * Updates title / description / status / timezone /
     * default_body_md / default_media_upload_ids. Status
     * transitions are guarded by a closed lattice; invalid
     * transitions return 409 STATUS_TRANSITION.
     * @returns CampaignOut OK
     * @throws ApiError
     */
    public static updateCampaign({
        campaignId,
        requestBody,
    }: {
        /**
         * Campaign ID (prefixed or bare UUID)
         */
        campaignId: any,
        /**
         * Patch fields
         */
        requestBody: CampaignUpdate,
    }): CancelablePromise<CampaignOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/campaigns/{campaign_id}',
            path: {
                'campaign_id': campaignId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign not found or not visible to caller`,
                409: `Disallowed status transition`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List all access grants on a campaign
     * Returns every collaborator grant on the campaign.
     * BOLA-gated: non-owner non-admin sees 404 .
     * @returns CampaignCollaboratorOut OK
     * @throws ApiError
     */
    public static listCampaignCollaborators({
        campaignId,
    }: {
        /**
         * Campaign ID (cmp_<uuid> or bare UUID)
         */
        campaignId: any,
    }): CancelablePromise<Array<CampaignCollaboratorOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{campaign_id}/collaborators',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign not found or not visible to caller`,
                422: `Malformed campaign_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Grant a user or group access to a campaign
     * Creates a collaborator grant. 409 on duplicate
     * (campaign_id, principal_type, principal_id). The
     * `permissions` field overrides role defaults when set;
     * empty permission list falls back to role defaults .
     * @returns CampaignCollaboratorOut Created
     * @throws ApiError
     */
    public static addCampaignCollaborator({
        campaignId,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Collaborator fields
         */
        requestBody: CampaignCollaboratorUpsert,
    }): CancelablePromise<CampaignCollaboratorOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/collaborators',
            path: {
                'campaign_id': campaignId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign not found or not visible to caller`,
                409: `Principal already has a grant on this campaign`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revoke a collaborator grant
     * Removes the grant row. 404 on miss or non-manager.
     * @returns void
     * @throws ApiError
     */
    public static removeCampaignCollaborator({
        campaignId,
        collaboratorId,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Collaborator ID
         */
        collaboratorId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/campaigns/{campaign_id}/collaborators/{collaborator_id}',
            path: {
                'campaign_id': campaignId,
                'collaborator_id': collaboratorId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign or collaborator not found`,
                422: `Malformed ID`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a collaborator's role/permissions
     * Updates only the role + permissions; principal_type /
     * principal_id are ignored on PATCH .
     * @returns CampaignCollaboratorOut OK
     * @throws ApiError
     */
    public static updateCampaignCollaborator({
        campaignId,
        collaboratorId,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Collaborator ID (cmpc_<uuid> or bare UUID)
         */
        collaboratorId: any,
        /**
         * Updated fields
         */
        requestBody: CampaignCollaboratorUpsert,
    }): CancelablePromise<CampaignCollaboratorOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/campaigns/{campaign_id}/collaborators/{collaborator_id}',
            path: {
                'campaign_id': campaignId,
                'collaborator_id': collaboratorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign or collaborator not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Clone a campaign and its steps onto a new target
     * Copies the source campaign + its steps + per-step
     * overrides into a NEW campaign owned by the same
     * (owner_type, owner_id). Status of the new campaign is
     * always `draft`.
     * @returns CampaignOut Created
     * @throws ApiError
     */
    public static duplicateCampaign({
        campaignId,
        requestBody,
    }: {
        /**
         * Source campaign ID
         */
        campaignId: any,
        /**
         * Duplicate target
         */
        requestBody: CampaignDuplicateIn,
    }): CancelablePromise<CampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/duplicate',
            path: {
                'campaign_id': campaignId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List campaign revision history
     * Returns the campaign's revision timeline newest-first.
     * BOLA-gated: non-owner non-admin sees 404 .
     * `limit` is clamped to [1,200]; default 50. `offset`
     * defaults to 0.
     * @returns EntityRevisionSummary OK
     * @throws ApiError
     */
    public static listCampaignRevisions({
        campaignId,
        offset,
        limit,
    }: {
        /**
         * Campaign ID (cmp_<uuid> or bare UUID)
         */
        campaignId: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<EntityRevisionSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{campaign_id}/revisions',
            path: {
                'campaign_id': campaignId,
            },
            query: {
                'offset': offset,
                'limit': limit,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign not found or not visible to caller`,
                422: `Malformed campaign_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Fetch one campaign revision (full snapshot)
     * Returns the revision row including the JSONB snapshot.
     * BOLA-gated on the parent campaign; missing revision
     * number → 404.
     * @returns EntityRevisionOut OK
     * @throws ApiError
     */
    public static getCampaignRevision({
        campaignId,
        revisionNumber,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Revision number (1-based, monotonic)
         */
        revisionNumber: any,
    }): CancelablePromise<EntityRevisionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{campaign_id}/revisions/{revision_number}',
            path: {
                'campaign_id': campaignId,
                'revision_number': revisionNumber,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign or revision not found`,
                422: `Malformed campaign_id or revision_number`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revert a campaign to a prior revision
     * Loads the JSONB snapshot of the named revision and
     * applies it to the campaign row + steps + overrides.
     * Existing steps are deleted and recreated from the
     * snapshot. Returns the post-revert campaign detail. parity:
     * @returns CampaignDetail OK
     * @throws ApiError
     */
    public static revertCampaignRevision({
        campaignId,
        revisionNumber,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Revision number
         */
        revisionNumber: any,
    }): CancelablePromise<CampaignDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/revisions/{revision_number}/revert',
            path: {
                'campaign_id': campaignId,
                'revision_number': revisionNumber,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Campaign or revision not found`,
                422: `Malformed campaign_id, revision_number, or snapshot`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a step to a campaign
     * Adds a step to the campaign. The step REQUIRES an
     * explicit `scheduled_at` timestamp.
     * @returns CampaignStepDetail Created
     * @throws ApiError
     */
    public static createCampaignStep({
        campaignId,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step fields
         */
        requestBody: CampaignStepCreate,
    }): CancelablePromise<CampaignStepDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/steps',
            path: {
                'campaign_id': campaignId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Reorder steps in one round-trip
     * step_ids MUST list every step in the campaign exactly
     * once. 409 on mismatch.
     * @returns void
     * @throws ApiError
     */
    public static reorderCampaignSteps({
        campaignId,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Ordered step IDs
         */
        requestBody: CampaignStepReorderIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/steps/reorder',
            path: {
                'campaign_id': campaignId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Delete a step
     * @returns void
     * @throws ApiError
     */
    public static deleteCampaignStep({
        campaignId,
        stepId,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/campaigns/{campaign_id}/steps/{step_id}',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Update a step
     * @returns CampaignStepDetail OK
     * @throws ApiError
     */
    public static updateCampaignStep({
        campaignId,
        stepId,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
        /**
         * Patch fields
         */
        requestBody: CampaignStepUpdate,
    }): CancelablePromise<CampaignStepDetail> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/campaigns/{campaign_id}/steps/{step_id}',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Cancel a pending or scheduled step
     * @returns void
     * @throws ApiError
     */
    public static cancelCampaignStep({
        campaignId,
        stepId,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/steps/{step_id}/cancel',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Remove a per-platform override
     * @returns void
     * @throws ApiError
     */
    public static deleteCampaignStepOverride({
        campaignId,
        stepId,
        platform,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
        /**
         * Platform key
         */
        platform: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/campaigns/{campaign_id}/steps/{step_id}/overrides/{platform}',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
                'platform': platform,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Create or update a per-platform override for a step
     * @returns CampaignStepPlatformOverrideOut OK
     * @throws ApiError
     */
    public static upsertCampaignStepOverride({
        campaignId,
        stepId,
        platform,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
        /**
         * Platform key
         */
        platform: any,
        /**
         * Override fields
         */
        requestBody: CampaignStepPlatformOverrideUpsert,
    }): CancelablePromise<CampaignStepPlatformOverrideOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/campaigns/{campaign_id}/steps/{step_id}/overrides/{platform}',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
                'platform': platform,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Per-platform preview of a step, with character counts and warnings
     * @returns CampaignStepPreview OK
     * @throws ApiError
     */
    public static previewCampaignStep({
        campaignId,
        stepId,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
    }): CancelablePromise<Record<string, CampaignStepPreview>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{campaign_id}/steps/{step_id}/preview',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Publish a step right now, bypassing its scheduled_at
     * Flips the step to status=scheduled with scheduled_at=now
     * so the publisher worker picks it up on the next tick.
     * Returns 202 with `{"status":"scheduled","platforms":...}`
     * echoed back. The actual platform dispatch runs
     * out-of-band on the campaigns publisher worker.
     * parity:
     * @returns PublishStepResult Accepted
     * @throws ApiError
     */
    public static publishCampaignStepNow({
        campaignId,
        stepId,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
        /**
         * Optional platform subset
         */
        requestBody: CampaignPublishIn,
    }): CancelablePromise<PublishStepResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/steps/{step_id}/publish-now',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Retry failed platform runs for a step
     * Flips status to `scheduled` so the publisher worker
     * re-fires the step. 409 if current status is not
     * failed/partial_failure/published. parity:
     * @returns PublishStepResult Accepted
     * @throws ApiError
     */
    public static retryCampaignStep({
        campaignId,
        stepId,
        requestBody,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
        /**
         * Optional platform subset
         */
        requestBody: CampaignPublishIn,
    }): CancelablePromise<PublishStepResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/campaigns/{campaign_id}/steps/{step_id}/retry',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Publishing-attempt timeline for a step
     * @returns CampaignRunOut OK
     * @throws ApiError
     */
    public static listCampaignStepRuns({
        campaignId,
        stepId,
        offset,
        limit,
    }: {
        /**
         * Campaign ID
         */
        campaignId: any,
        /**
         * Step ID
         */
        stepId: any,
        /**
         * Pagination offset
         */
        offset?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<CampaignRunOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/campaigns/{campaign_id}/steps/{step_id}/runs',
            path: {
                'campaign_id': campaignId,
                'step_id': stepId,
            },
            query: {
                'offset': offset,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Convert this event's PromoTasks into a new Campaign
     * Creates an empty draft campaign anchored on the event.
     * Per-promo-task step seeding reads the events worker's
     * `event_promo_tasks` table, which requires a cross-worker
     * contract that is not yet wired - until then the
     * campaign is created with zero steps and the caller
     * adds steps via `POST /campaigns/{id}/steps`.
     * parity:
     * @returns CampaignOut Created
     * @throws ApiError
     */
    public static migrateEventPromoTasksToCampaign({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Migration target
         */
        requestBody: PromoTaskMigrateIn,
    }): CancelablePromise<CampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/promo-tasks/migrate-to-campaign',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
