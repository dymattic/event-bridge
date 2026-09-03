/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderHealth } from './ProviderHealth';
export type ExternalAPIHealth = {
    providers?: Array<ProviderHealth>;
    status?: 'ok' | 'degraded' | 'down' | 'unknown' | 'disabled';
};

