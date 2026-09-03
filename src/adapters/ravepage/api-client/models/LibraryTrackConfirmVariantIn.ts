/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LibraryTrackConfirmVariantIn = {
    /**
     * VersionLabel is the optional free-text version qualifier for the
     * minted child track ("VIP Mix", "Extended", "Bootleg"). nil/empty
     * mints an unlabelled child (still distinct via parent_track_id).
     * Max 255 chars (mirrors tracks.version_label bound).
     */
    version_label?: string;
};

