/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderResolveItem } from './ProviderResolveItem';
export type ProviderResolveRequest = {
    /**
     * Items - the tracks to resolve (1-50). Over-long batches are
     * truncated, not rejected.
     */
    items?: Array<ProviderResolveItem>;
    /**
     * Providers - restrict the lookup to these provider keys. Empty ⇒
     * every provider this worker currently has credentials for.
     */
    providers?: Array<string>;
};

