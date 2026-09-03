/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApiUsageLogOut = {
    duration_ms?: number;
    endpoint?: string;
    error_message?: string;
    failed_payload_id?: string;
    failed_response_body?: string;
    failed_response_body_truncated?: boolean;
    failed_response_headers?: Array<number>;
    id?: string;
    method?: string;
    response_error?: string;
    service?: string;
    status_code?: number;
    success?: boolean;
    timestamp?: string;
    triggered_by?: string;
};

