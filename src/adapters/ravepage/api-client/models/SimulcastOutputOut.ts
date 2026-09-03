/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SimulcastOutputOut = {
    /**
     * CfOutputUID is the opaque Cloudflare output UID.
     */
    cf_output_uid?: string;
    /**
     * CreatedAt / UpdatedAt are non-null ORM timestamps.
     */
    created_at?: string;
    /**
     * DestinationURL is the destination RTMP(S) URL.
     */
    destination_url?: string;
    /**
     * Enabled mirrors `enabled` - whether the output is enabled.
     */
    enabled?: boolean;
    id?: string;
    /**
     * LiveInputID is `cfli_<uuid>` - parent live-input ID.
     */
    live_input_id?: string;
    updated_at?: string;
};

