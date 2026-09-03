/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncidentID } from './IncidentID';
import type { PublicIncidentUpdateOut } from './PublicIncidentUpdateOut';
export type PublicIncidentOut = {
    /**
     * AffectedServices is the list of public-service ids affected.
     */
    affected_services?: Array<string>;
    /**
     * ID is the prefixed incident identifier (inc_<uuid>).
     */
    id?: IncidentID;
    /**
     * Impact is the severity badge: minor | major | critical.
     */
    impact?: 'minor' | 'major' | 'critical';
    /**
     * LatestUpdate is the most recent timeline entry; nil when none.
     */
    latest_update?: PublicIncidentUpdateOut;
    /**
     * ResolvedAt is when the incident was resolved; nil while open.
     */
    resolved_at?: string;
    /**
     * StartedAt is when the incident started.
     */
    started_at?: string;
    /**
     * Status is one of: investigating | identified | monitoring | resolved.
     */
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    /**
     * Title is the operator-facing headline.
     */
    title?: string;
};

