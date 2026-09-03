/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
export type EventCollaboratorOut = {
    /**
     * CollaboratorID is the polymorphic FK to the collaborator
     * entity.
     */
    collaborator_id?: string;
    /**
     * CollaboratorType is one of `user|group|club|role|event` .
     */
    collaborator_type?: string;
    /**
     * EventID is the parent event reference - prefixed `evt_<uuid>`.
     */
    event_id?: EventID;
    /**
     * ID is the collab row's own UUID.
     */
    id?: string;
    /**
     * InvitedAt is the invitation timestamp.
     */
    invited_at?: string;
    /**
     * InvitedBy is the user who issued the invitation. JSON null
     * when NULL in DB .
     */
    invited_by?: string;
    /**
     * JSON null = "use default for
     * collaborator_type" (group=public, anything else=private). TRUE /
     * FALSE = explicit override.
     */
    public_visibility?: boolean;
    /**
     * Role is one of `owner|organizer|editor|viewer`.
     */
    role?: string;
    /**
     * Status is one of `pending|accepted|declined`.
     */
    status?: 'pending' | 'accepted' | 'declined';
};

