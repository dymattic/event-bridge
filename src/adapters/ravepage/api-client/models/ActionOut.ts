/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActionSubjectOut } from './ActionSubjectOut';
export type ActionOut = {
    action?: string;
    actor_kind?: string;
    actor_user_id?: string;
    after?: Array<number>;
    before?: Array<number>;
    family?: string;
    http_method?: string;
    http_path?: string;
    id?: string;
    occurred_at?: string;
    operation_id?: string;
    request_payload?: Array<number>;
    result_summary?: string;
    snapshot?: Array<number>;
    status_code?: number;
    subjects?: Array<ActionSubjectOut>;
    trace_id?: string;
    verb?: string;
};

