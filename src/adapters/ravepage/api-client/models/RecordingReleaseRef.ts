/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingReleaseRef = {
    /**
     * ReleaseID is the linked release id (`rel_<uuid>`).
     */
    release_id?: string;
    /**
     * ReleaseType buckets the release; empty when unset.
     */
    release_type?: string;
    /**
     * Title is the release title.
     */
    title?: string;
    /**
     * Visibility is the release's read-audience policy.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

