/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicIncidentOut } from './PublicIncidentOut';
import type { PublicMaintenanceOut } from './PublicMaintenanceOut';
import type { ServiceHealthOut } from './ServiceHealthOut';
export type PublicStatusOut = {
    /**
     * CheckedAt is the ISO 8601 UTC timestamp of when the snapshot
     * was taken. The FE renders "as of N seconds ago" against
     * wall-clock.
     */
    checked_at?: string;
    /**
     * Incidents is currently-active incidents + those resolved in
     * the last 24h. Empty list when no incidents are open.
     */
    incidents?: Array<PublicIncidentOut>;
    /**
     * Maintenance is public-visible maintenance windows. Empty list
     * when none are open / upcoming / recently-completed.
     */
    maintenance?: Array<PublicMaintenanceOut>;
    /**
     * Services is always exactly six entries in a fixed order: auth,
     * events, media, discovery, social, realtime. The FE relies on
     * positional rendering without hashing the list.
     */
    services?: Array<ServiceHealthOut>;
    /**
     * Status is the overall public status - worst across all
     * Services per ServiceStatus severity ordering.
     */
    status?: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage' | 'under_maintenance';
};

