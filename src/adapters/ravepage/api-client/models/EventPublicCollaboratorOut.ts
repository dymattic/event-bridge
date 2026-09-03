/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventPublicCollaboratorOut = {
    /**
     * CollaboratorID is the polymorphic FK to the collaborator entity.
     */
    collaborator_id?: string;
    /**
     * CollaboratorType is one of `user|group|club|role|event`.
     * Today the public endpoint surfaces only `group` by default; the
     * type stays in the response so the FE can render `user` etc.
     * when a creator has explicitly opted an individual in.
     */
    collaborator_type?: string;
    /**
     * Role is one of `owner|organizer|editor|viewer`.
     */
    role?: string;
};

