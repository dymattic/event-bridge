/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventInvitationID } from './EventInvitationID';
import type { UserID } from './UserID';
export type EventInvitationOut = {
    /**
     * CreatedAt is the invitation creation timestamp.
     */
    created_at?: string;
    /**
     * EventID is the parent event reference - prefixed `evt_<uuid>`.
     */
    event_id?: EventID;
    /**
     * ID is the canonical prefixed invitation identifier. Wire form:
     * `evi_<uuid>`.
     */
    id?: EventInvitationID;
    /**
     * InviteeUserID is the recipient - prefixed `usr_<uuid>`.
     */
    invitee_user_id?: UserID;
    /**
     * InviterUserID is the sender - prefixed `usr_<uuid>`.
     */
    inviter_user_id?: UserID;
    /**
     * Message is the optional inviter note. JSON null when NULL in DB.
     */
    message?: string;
    /**
     * RespondedAt is set when the invitation transitioned out of
     * pending (accepted / declined / revoked). JSON null on pending.
     */
    responded_at?: string;
    /**
     * Status is one of `pending|accepted|declined|revoked`.
     */
    status?: 'pending' | 'accepted' | 'declined' | 'revoked';
};

