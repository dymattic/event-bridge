/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RoomOut = {
    /**
     * IsPublic - open-join + directory-listed. Public rooms resolve
     * for any authed caller; private rooms only for members.
     */
    is_public?: boolean;
    /**
     * Kind is the bound entity kind (event|collab|group|group_channel|
     * dm). Omitted for DM responses.
     */
    kind?: string;
    /**
     * RaveID is the bound entity id. Omitted for DM responses.
     */
    rave_id?: string;
    /**
     * RoomID is the Matrix room id (!opaque:server).
     */
    room_id?: string;
};

