/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventCollaboratorCreateIn = {
    /**
     * CollaboratorID is REQUIRED. Accepts bare UUID OR
     * `<prefix>_<uuid>` wire form.
     */
    collaborator_id?: string;
    /**
     * CollaboratorType is REQUIRED. One of `user|group|club|role|event`.
     */
    collaborator_type?: string;
    /**
     * invited_by: Optional[UUID] = Field(None)`.
     */
    invited_by?: string;
    /**
     * Role is REQUIRED. One of `owner|organizer|editor|viewer`.
     */
    role?: string;
};

