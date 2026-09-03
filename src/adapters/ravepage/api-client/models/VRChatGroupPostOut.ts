/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatGroupPostOut = {
    /**
     * Author user id.
     */
    authorId?: string;
    /**
     * ISO 8601 creation timestamp.
     */
    createdAt?: string;
    /**
     * Last editor user id.
     */
    editorId?: string;
    /**
     * Group id this post belongs to.
     */
    groupId?: string;
    /**
     * Post id.
     */
    id?: string;
    /**
     * Associated image file id.
     */
    imageId?: string;
    /**
     * Associated image URL.
     */
    imageUrl?: string;
    /**
     * Required role to view.
     */
    roleId?: string;
    /**
     * Post body text.
     */
    text?: string;
    /**
     * Post title.
     */
    title?: string;
    /**
     * ISO 8601 last update timestamp.
     */
    updatedAt?: string;
    /**
     * Post visibility.
     */
    visibility?: 'group' | 'public' | 'members';
};

