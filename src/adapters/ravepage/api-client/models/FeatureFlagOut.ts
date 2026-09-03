/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeatureFlagOut = {
    /**
     * CostNotes is free-text cost rationale (source, date, Hetzner
     * line items).
     */
    cost_notes?: string;
    /**
     * CostUnit labels UnitCostEurMicros (e.g. "eur_per_gb_month",
     * "eur_per_minute"). Null when no cost recorded.
     */
    cost_unit?: string;
    created_at?: string;
    /**
     * Description is the admin-editor help text.
     */
    description?: string;
    /**
     * DisplayName is the admin-editor label.
     */
    display_name?: string;
    /**
     * EnabledDefault is the global default when no override matches.
     */
    enabled_default?: boolean;
    /**
     * FeatureKey is the stable feature key (FeatureKey enum value).
     */
    feature_key?: string;
    /**
     * IsPaywalled - when true, `allowed` additionally requires an
     * entitlement (plan feature or grant) on the caller's billing
     * account.
     */
    is_paywalled?: boolean;
    /**
     * OverrideCount is the number of live (non-expired) overrides.
     */
    override_count?: number;
    /**
     * UnitCostEurMicros is the platform's own cost per CostUnit in
     * micro-EUR (1_000_000 = 1 EUR). Cost METADATA for the billing
     * plan editor - never charged to users directly. Null = unknown.
     */
    unit_cost_eur_micros?: number;
    updated_at?: string;
    /**
     * UpdatedByUserID is "usr_<uuid>" of the last admin editor, null
     * for seed rows.
     */
    updated_by_user_id?: string;
};

