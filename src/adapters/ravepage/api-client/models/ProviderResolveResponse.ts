/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderResolveHit } from './ProviderResolveHit';
export type ProviderResolveResponse = {
    /**
     * Hits - resolved provider ids. Non-nil (empty ⇒ `[]`). An item with
     * no hit for a provider simply has no entry - the CALLER stamps the
     * no-result so it doesn't re-ask inside its TTL.
     */
    hits?: Array<ProviderResolveHit>;
    /**
     * QueriedProviders - which providers were ACTUALLY asked. A provider
     * missing here was skipped (no credentials / gated off), so the
     * caller must NOT stamp a no-result for it - the absence of a hit
     * means "not asked", not "not found".
     */
    queried_providers?: Array<string>;
    /**
     * SkippedProviders maps a skipped provider to the reason
     * ("no_credentials", "gated_off", "unsupported_lookup",
     * "upstream_degraded"). upstream_degraded means the provider WAS
     * asked but errored mid-batch (429/5xx/transport): any hits it
     * produced are still in Hits and valid, but the caller MUST NOT
     * stamp no-results for it - a degraded upstream's silence is not
     * evidence of absence.
     */
    skipped_providers?: Record<string, string>;
};

