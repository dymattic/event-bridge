/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrganizerOptionOut = {
    /**
     * ID - bare-UUID string of the organizer entity.
     */
    id?: string;
    /**
     * Name - display name. For type=user, the username. For groups/
     * clubs, the entity's name column.
     */
    name?: string;
    /**
     * Role - string granting organizer access.
     */
    role?: string;
    /**
     * Type - `CalendarEntityType` string: "user" | "group" | "club".
     */
    type?: 'user' | 'group' | 'club' | 'role' | 'event';
};

