/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VideoCutIn = {
    /**
     * Duration is the optional cut length. Ignored when EndTime is
     * set.
     */
    duration?: string;
    /**
     * EndTime is the optional cut end. When set, Duration is
     * ignored.
     */
    end_time?: string;
    /**
     * StartTime is the cut start (`HH:MM:SS` or seconds). Required.
     */
    start_time?: string;
    /**
     * UploadID is the source media-upload identifier (UUID or
     * `upl_<uuid>`). Required.
     */
    upload_id?: string;
};

