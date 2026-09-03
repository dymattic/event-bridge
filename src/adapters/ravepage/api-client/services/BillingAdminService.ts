/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminPlanFeatureOut } from '../models/AdminPlanFeatureOut';
import type { AdminPlanOut } from '../models/AdminPlanOut';
import type { FeatureFlagOut } from '../models/FeatureFlagOut';
import type { FeatureFlagOverrideOut } from '../models/FeatureFlagOverrideOut';
import type { FeatureFlagOverrideUpsertIn } from '../models/FeatureFlagOverrideUpsertIn';
import type { FeatureFlagUpsertIn } from '../models/FeatureFlagUpsertIn';
import type { FeatureGrantCreateIn } from '../models/FeatureGrantCreateIn';
import type { FeatureGrantOut } from '../models/FeatureGrantOut';
import type { PlanCreateIn } from '../models/PlanCreateIn';
import type { PlanFeatureUpsertIn } from '../models/PlanFeatureUpsertIn';
import type { PlanUpdateIn } from '../models/PlanUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingAdminService {
    /**
     * List feature grants on a billing account
     * Admin-only. Returns every grant on the account, ordered DESC by `granted_at`. By default expired grants are filtered out; pass `include_expired=true` to include them.
     * @returns FeatureGrantOut OK
     * @throws ApiError
     */
    public static adminListFeatureGrants({
        accountId,
        includeExpired,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
        /**
         * Include grants past their `expires_at`
         */
        includeExpired?: any,
    }): CancelablePromise<Array<FeatureGrantOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/billing/accounts/{account_id}/grants',
            path: {
                'account_id': accountId,
            },
            query: {
                'include_expired': includeExpired,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid account id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Issue a feature grant to a billing account
     * Admin-only. Creates a FeatureGrant layered on top of the account's plan. Useful for promotions, trial extensions, goodwill credits. Quotas are additive across (plan quota + all non-expired grants).
     * @returns FeatureGrantOut Created
     * @throws ApiError
     */
    public static adminCreateFeatureGrant({
        accountId,
        requestBody,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
        /**
         * Grant payload
         */
        requestBody: FeatureGrantCreateIn,
    }): CancelablePromise<FeatureGrantOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/billing/accounts/{account_id}/grants',
            path: {
                'account_id': accountId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Unknown feature_key`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Billing account not found`,
                422: `Invalid request body`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revoke a feature grant
     * Admin-only. Hard-deletes the grant row (no soft-delete; the audit row is the durable trail). Returns 204 No Content on success.
     * @returns void
     * @throws ApiError
     */
    public static adminRevokeFeatureGrant({
        grantId,
    }: {
        /**
         * Feature grant ID (bare UUID or `fgr_<uuid>`)
         */
        grantId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/billing/grants/{grant_id}',
            path: {
                'grant_id': grantId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Feature grant not found`,
                422: `Invalid grant id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List all billing plans (admin)
     * Admin-only. Every plan incl. inactive + non-public, with per-feature quotas and overage pricing. The public pricing catalog is `GET /billing/plans`.
     * @returns AdminPlanOut OK
     * @throws ApiError
     */
    public static adminListBillingPlans(): CancelablePromise<Array<AdminPlanOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/billing/plans',
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a billing plan
     * Admin-only. `code` is immutable after create. Defaults: vat_rate_bps=1900, billing_period=month, is_active=true, is_public=true. Duplicate code → 409.
     * @returns AdminPlanOut Created
     * @throws ApiError
     */
    public static adminCreateBillingPlan({
        requestBody,
    }: {
        /**
         * Plan payload
         */
        requestBody: PlanCreateIn,
    }): CancelablePromise<AdminPlanOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/billing/plans',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                409: `Plan code already exists`,
                422: `Invalid payload`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a billing plan
     * Admin-only. Hard delete; plan features cascade. Blocked with 409 when ANY subscription (incl. canceled) references the plan - retire with `is_active=false` instead.
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteBillingPlan({
        planId,
    }: {
        /**
         * Plan ID (bare UUID or `pln_<uuid>`)
         */
        planId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/billing/plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Plan not found`,
                409: `Plan has subscriptions`,
                422: `Invalid plan id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a billing plan
     * Admin-only partial update (omitted fields untouched). `code` is immutable. Retire a plan with `is_active=false` instead of deleting once subscriptions exist.
     * @returns AdminPlanOut OK
     * @throws ApiError
     */
    public static adminUpdateBillingPlan({
        planId,
        requestBody,
    }: {
        /**
         * Plan ID (bare UUID or `pln_<uuid>`)
         */
        planId: any,
        /**
         * Partial update
         */
        requestBody: PlanUpdateIn,
    }): CancelablePromise<AdminPlanOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/billing/plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Plan not found`,
                422: `Invalid payload`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a plan feature
     * Admin-only. Removes the (plan, feature) row - subscribers lose the feature/quota at next entitlement resolution.
     * @returns void
     * @throws ApiError
     */
    public static adminDeletePlanFeature({
        planId,
        featureKey,
    }: {
        /**
         * Plan ID (bare UUID or `pln_<uuid>`)
         */
        planId: any,
        /**
         * FeatureKey enum value
         */
        featureKey: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/billing/plans/{plan_id}/features/{feature_key}',
            path: {
                'plan_id': planId,
                'feature_key': featureKey,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Plan feature not found`,
                422: `Invalid plan id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upsert a plan feature
     * Admin-only. Sets included quota, unit (defaults to the feature's canonical unit), and overage price for one feature on one plan. Upserts on (plan_id, feature_key).
     * @returns AdminPlanFeatureOut OK
     * @throws ApiError
     */
    public static adminUpsertPlanFeature({
        planId,
        featureKey,
        requestBody,
    }: {
        /**
         * Plan ID (bare UUID or `pln_<uuid>`)
         */
        planId: any,
        /**
         * FeatureKey enum value
         */
        featureKey: any,
        /**
         * Feature payload
         */
        requestBody: PlanFeatureUpsertIn,
    }): CancelablePromise<AdminPlanFeatureOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/billing/plans/{plan_id}/features/{feature_key}',
            path: {
                'plan_id': planId,
                'feature_key': featureKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Unknown feature_key`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Plan not found`,
                422: `Invalid payload`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List feature flags
     * Admin-only. Full registry: global default, paywall bit, platform-cost metadata, live override count per feature key.
     * @returns FeatureFlagOut OK
     * @throws ApiError
     */
    public static adminListFeatureFlags(): CancelablePromise<Array<FeatureFlagOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/features',
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a feature-flag override
     * Admin-only. Hard-deletes the override; resolution falls back to the group override / global default.
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteFeatureFlagOverride({
        overrideId,
    }: {
        /**
         * Override ID (bare UUID or `ffo_<uuid>`)
         */
        overrideId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/features/overrides/{override_id}',
            path: {
                'override_id': overrideId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Override not found`,
                422: `Invalid override id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upsert a feature flag
     * Admin-only. Creates or updates the registry row for a known FeatureKey: global default, paywall bit, display metadata, platform-cost metadata (unit_cost_eur_micros / cost_unit / cost_notes - fed by the infra-mgmt Hetzner cost surface). Omitted fields keep their stored values.
     * @returns FeatureFlagOut OK
     * @throws ApiError
     */
    public static adminUpsertFeatureFlag({
        featureKey,
        requestBody,
    }: {
        /**
         * FeatureKey enum value (e.g. `cf_stream.live_ingest_enabled`)
         */
        featureKey: any,
        /**
         * Partial upsert
         */
        requestBody: FeatureFlagUpsertIn,
    }): CancelablePromise<FeatureFlagOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/features/{feature_key}',
            path: {
                'feature_key': featureKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Unknown feature_key`,
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid request body`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List overrides for a feature flag
     * Admin-only. Group + user scoped overrides, newest first. Expired overrides filtered unless `include_expired=true`.
     * @returns FeatureFlagOverrideOut OK
     * @throws ApiError
     */
    public static adminListFeatureFlagOverrides({
        featureKey,
        includeExpired,
    }: {
        /**
         * FeatureKey enum value
         */
        featureKey: any,
        /**
         * Include overrides past their `expires_at`
         */
        includeExpired?: any,
    }): CancelablePromise<Array<FeatureFlagOverrideOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/features/{feature_key}/overrides',
            path: {
                'feature_key': featureKey,
            },
            query: {
                'include_expired': includeExpired,
            },
            errors: {
                400: `Unknown feature_key`,
                401: `Authentication required`,
                403: `Admin role required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upsert a scoped feature-flag override
     * Admin-only. Per-group or per-user enable/disable that wins over the global default (user scope wins over group scope). Upserts on (feature_key, scope_type, scope_id).
     * @returns FeatureFlagOverrideOut OK
     * @throws ApiError
     */
    public static adminUpsertFeatureFlagOverride({
        featureKey,
        requestBody,
    }: {
        /**
         * FeatureKey enum value
         */
        featureKey: any,
        /**
         * Override payload
         */
        requestBody: FeatureFlagOverrideUpsertIn,
    }): CancelablePromise<FeatureFlagOverrideOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/features/{feature_key}/overrides',
            path: {
                'feature_key': featureKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Unknown feature_key`,
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid scope`,
                500: `Internal error`,
            },
        });
    }
}
