/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UsageMeterOut = {
    /**
     * FeatureKey is the feature key being metered.
     */
    feature_key?: string;
    /**
     * IncludedQuota is the combined plan+grant quota. nil =
     * unlimited.
     */
    included_quota?: number;
    /**
     * MeterKind is one of "gauge" | "daily" | "monthly".
     */
    meter_kind?: string;
    /**
     * PeriodEnd is the end of the current metering window.
     */
    period_end?: string;
    /**
     * PeriodStart is the start of the current metering window.
     */
    period_start?: string;
    /**
     * Remaining is the remaining quota (included_quota - value);
     * null when unlimited.
     */
    remaining?: number;
    /**
     * Unit is the unit label ("bytes", "minutes", "calls", ...). nil
     * for boolean gates.
     */
    unit?: string;
    /**
     * Value is the current cumulative value for the active period.
     */
    value?: number;
};

