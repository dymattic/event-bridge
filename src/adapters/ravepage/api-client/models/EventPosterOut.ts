/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventPosterOut = {
    event_id?: string;
    file_size?: number;
    kind?: 'image' | 'video';
    media_upload_id?: string;
    /**
     * MimeType / FileSize are nullable in v1 because the events
     * worker has no media-ingest cross-worker contract. mime_type /
     * .file_size. v1 emits null + 0; FE that needs the values
     * fetches `/media/stream/{id}` headers.
     */
    mime_type?: string;
    url?: string;
};

