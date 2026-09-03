/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKArtistFormat } from './EPKArtistFormat';
import type { EPKArtistGenres } from './EPKArtistGenres';
import type { EPKArtistLocation } from './EPKArtistLocation';
export type EPKArtist = {
    /**
     * Formats are performance formats offered.
     */
    formats?: Array<EPKArtistFormat>;
    /**
     * Genres groups primary / secondary.
     */
    genres?: EPKArtistGenres;
    /**
     * Location is the artist base location.
     */
    location?: EPKArtistLocation;
    /**
     * Name is the stage / performer name.
     */
    name?: string;
    /**
     * Roles are the artist roles (DJ, producer, MC, etc.).
     */
    roles?: Array<string>;
    /**
     * SetLengthsMinutes are offered set lengths (e.g. [60, 90, 120]).
     */
    set_lengths_minutes?: Array<number>;
    /**
     * Taglines are short marketing taglines.
     */
    taglines?: Array<string>;
};

