/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TracklistsByMediaOut = {
    /**
     * TracklistIDsByRef maps each external_ref that HAS links to its
     * bare tracklist uuids. Always non-nil; refs with no link are
     * absent. NOT omitempty - consumers must tell "no links" from
     * "field missing".
     */
    tracklist_ids_by_ref?: Record<string, Array<string>>;
};

