/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminIncidentCreateIn = {
    /**
     * AffectedServices is a non-empty list of public-service ids.
     */
    affected_services?: Array<string>;
    /**
     * Description is markdown notes; ≤10000 chars. Default empty.
     */
    description?: string;
    /**
     * Impact is one of minor / major / critical.
     */
    impact?: 'minor' | 'major' | 'critical';
    /**
     * InitialMessage seeds the first IncidentUpdate row; 1..2000
     * chars.
     */
    initial_message?: string;
    /**
     * StartedAt allows backdating a retrospective incident.
     */
    started_at?: string;
    /**
     * Status defaults to "investigating" when empty.
     */
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    /**
     * Title is the operator-facing headline; 1..255 chars.
     */
    title?: string;
};

