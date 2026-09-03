/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingAccessOut = {
    /**
     * Attached - true when a recording claims this upload as its hosted
     * audio. False means "not a recording upload"; every other field is
     * zero-valued and the caller keeps its own authz.
     */
    attached?: boolean;
    /**
     * CallerCanRead - THE verdict. tracks evaluated its set-visibility
     * gate (owner bypass, then public/unlisted → anyone, logged_in →
     * any authed caller, private → owner only, unknown → closed).
     */
    caller_can_read?: boolean;
    /**
     * CallerIsOwner - the caller owns the recording. Lets the consumer
     * pick a cache posture (owner reads are never CDN-cacheable).
     */
    caller_is_owner?: boolean;
    /**
     * PublicCacheable - true only when the grant came from a
     * public/unlisted recording, i.e. the bytes may be cached by a
     * shared cache. False for owner/logged_in grants and for
     * Attached=false.
     */
    public_cacheable?: boolean;
    /**
     * RecordingID - bare-UUID string of the owning recording. Empty
     * when Attached=false.
     */
    recording_id?: string;
    /**
     * Visibility - the recording's read-audience policy. Empty when
     * Attached=false. Observability/caching input; do NOT re-derive
     * access from it - use CallerCanRead.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

