/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatGroupGalleryOut = {
    /**
     * Creation timestamp.
     */
    createdAt?: string;
    /**
     * Gallery description.
     */
    description?: string;
    /**
     * Gallery id.
     */
    id?: string;
    /**
     * Whether the gallery is members only.
     */
    membersOnly?: boolean;
    /**
     * Gallery name.
     */
    name?: string;
    /**
     * Role ids with auto-approve.
     */
    roleIdsToAutoApprove?: Array<string>;
    /**
     * Role ids that can manage.
     */
    roleIdsToManage?: Array<string>;
    /**
     * Role ids that can submit.
     */
    roleIdsToSubmit?: Array<string>;
    /**
     * Role ids that can view.
     */
    roleIdsToView?: Array<string>;
    /**
     * Last update timestamp.
     */
    updatedAt?: string;
};

