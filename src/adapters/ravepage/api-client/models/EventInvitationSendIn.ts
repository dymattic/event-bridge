/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventInvitationSendIn = {
    /**
     * InviteeUserIDs is the batch of user ids being invited. Accepts both bare UUID and
     * `usr_<uuid>` per project memory.
     */
    invitee_user_ids?: Array<string>;
    message?: string;
};

