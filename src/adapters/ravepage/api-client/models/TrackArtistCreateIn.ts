/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackArtistCreateIn = {
    /**
     * PerformerID - REQUIRED. The performer to attach. Accepts bare
     * UUID or `perf_<uuid>`.
     */
    performer_id?: string;
    /**
     * Position - OPTIONAL. position = Field(default=0, ge=0)`. nil → 0.
     * Negative values rejected with 422.
     */
    position?: number;
    /**
     * Role - OPTIONAL. role = Field(default="primary", max_length=30)`.
     * nil → "primary"; empty string → "primary" . Max 30 codepoints.
     */
    role?: string;
};

