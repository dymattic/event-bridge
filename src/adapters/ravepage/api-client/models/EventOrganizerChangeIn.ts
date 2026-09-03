/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventOrganizerChangeIn = {
    /**
     * OrganizerID - target organizer reference. Accepts a bare UUID OR
     * a prefixed wire form (`usr_`/`grp_`/`clb_<uuid>`); normalised to
     * bare UUID at the route boundary.
     */
    organizer_id?: string;
    /**
     * OrganizerType - target organizer kind. One of user|group|club . CalendarEntityType.
     */
    organizer_type?: 'user' | 'group' | 'club' | 'role' | 'event';
};

