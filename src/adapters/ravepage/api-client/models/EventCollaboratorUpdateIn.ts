/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventCollaboratorUpdateIn = {
    /**
     * Absent = leave
     * untouched. TRUE = always public. FALSE = always private. There
     * is no "reset to type-default NULL" path via PUT - moderators set
     * the explicit value they want.
     */
    public_visibility?: boolean;
    /**
     * Role is optional. One of `owner|organizer|editor|viewer` when
     * non-nil.
     */
    role?: string;
    /**
     * Status is optional. One of `pending|accepted|declined` when
     * non-nil.
     */
    status?: 'pending' | 'accepted' | 'declined';
};

