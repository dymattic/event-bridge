/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VRChatFileVersionOut } from './VRChatFileVersionOut';
export type VRChatFileOut = {
    /**
     * File extension.
     */
    extension?: string;
    /**
     * File id.
     */
    id?: string;
    /**
     * MIME type.
     */
    mimeType?: string;
    /**
     * File name.
     */
    name?: string;
    /**
     * Owner user id.
     */
    ownerId?: string;
    /**
     * File tags (icon, gallery, etc.).
     */
    tags?: Array<string>;
    /**
     * File versions.
     */
    versions?: Array<VRChatFileVersionOut>;
};

