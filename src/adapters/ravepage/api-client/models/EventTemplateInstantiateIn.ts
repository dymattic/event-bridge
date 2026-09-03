/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventTemplateInstantiateIn = {
    /**
     * EndsAt is optional - when omitted, derived from starts_at +
     * template.default_duration_minutes (or left null if no default).
     */
    ends_at?: string;
    /**
     * OrganizerID accepts BOTH bare UUID and `<prefix>_<uuid>`. Required
     * when OrganizerType is set.
     */
    organizer_id?: string;
    /**
     * OrganizerType overrides organizer type. One of {user, group, club}.
     */
    organizer_type?: string;
    /**
     * Slug optionally overrides the auto-derived slug.
     */
    slug?: string;
    /**
     * StartsAt is the absolute start timestamp for the produced event.
     * The template's slot offsets resolve against this anchor.
     */
    starts_at?: string;
    /**
     * Title overrides the produced event's title. Defaults to the
     * template's title (or name when title is unset).
     */
    title?: string;
};

