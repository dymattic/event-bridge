/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileCreateIn = {
    background_media_upload_id?: string;
    bio_md?: string;
    client_id?: string;
    crm?: Array<number>;
    display_name?: string;
    is_published?: boolean;
    owner_id?: string;
    owner_type?: string;
    slug?: string;
    theme?: Array<number>;
    /**
     * artist|club|group|label|venue|event_series|other
     */
    type?: string;
    /**
     * public|unlisted|private
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

