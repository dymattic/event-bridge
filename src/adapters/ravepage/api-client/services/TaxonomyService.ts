/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityGenreAssignmentIn } from '../models/EntityGenreAssignmentIn';
import type { EntityGenreAssignmentOut } from '../models/EntityGenreAssignmentOut';
import type { EntityTagAssignIn } from '../models/EntityTagAssignIn';
import type { EntityTagAssignOut } from '../models/EntityTagAssignOut';
import type { EntityTagsOut } from '../models/EntityTagsOut';
import type { FilteredEntitiesOut } from '../models/FilteredEntitiesOut';
import type { GenreCreate } from '../models/GenreCreate';
import type { GenreMoodLinkIn } from '../models/GenreMoodLinkIn';
import type { GenreMoodLinkOut } from '../models/GenreMoodLinkOut';
import type { GenreOut } from '../models/GenreOut';
import type { MoodCreate } from '../models/MoodCreate';
import type { MoodOut } from '../models/MoodOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaxonomyService {
    /**
     * Get tags for an entity
     * Anonymous-public. Returns the genres + moods attached to (entity_type, entity_id).
     * @returns EntityTagsOut OK
     * @throws ApiError
     */
    public static getEntityTags({
        entityType,
        entityId,
    }: {
        /**
         * Entity type (user / performer / group / club / media_upload / tracklist / dj_set / soundcloud_track / youtube_video)
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
    }): CancelablePromise<EntityTagsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/taxonomy/entities/{entity_type}/{entity_id}',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                400: `Invalid entity_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Assign genres to an entity (admin)
     * Admin-only: upsert a list of genre IDs onto (entity_type, entity_id). Idempotent - repeat POSTs overwrite confidence + source.
     * @returns EntityTagAssignOut OK
     * @throws ApiError
     */
    public static assignEntityGenres({
        entityType,
        entityId,
        requestBody,
    }: {
        /**
         * Entity type (user / performer / group / release / venue / club / media_upload / tracklist / dj_set / soundcloud_track / youtube_video / event)
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
        /**
         * Tag-assign payload
         */
        requestBody: EntityTagAssignIn,
    }): CancelablePromise<EntityTagAssignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/taxonomy/entities/{entity_type}/{entity_id}/genres',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Admin access required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Assign moods to an entity (admin)
     * Admin-only: upsert a list of mood IDs onto (entity_type, entity_id). Idempotent - repeat POSTs overwrite confidence + source.
     * @returns EntityTagAssignOut OK
     * @throws ApiError
     */
    public static assignEntityMoods({
        entityType,
        entityId,
        requestBody,
    }: {
        /**
         * Entity type (user / performer / group / release / venue / club / media_upload / tracklist / dj_set / soundcloud_track / youtube_video / event)
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
        /**
         * Tag-assign payload
         */
        requestBody: EntityTagAssignIn,
    }): CancelablePromise<EntityTagAssignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/taxonomy/entities/{entity_type}/{entity_id}/moods',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Admin access required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Filter entities by genre/mood
     * Anonymous-public. Returns the entity_ids of `entity_type` matching ALL supplied filters. `genre_slugs` and `mood_slugs` are CSV lists; when both are supplied the result is the intersection. With no filters supplied, returns an empty `entity_ids`.
     * @returns FilteredEntitiesOut OK
     * @throws ApiError
     */
    public static filterEntitiesByTags({
        entityType,
        genreSlugs,
        moodSlugs,
    }: {
        /**
         * Entity type (event, performer, group, tracklist, ...)
         */
        entityType: any,
        /**
         * CSV list of genre slugs
         */
        genreSlugs?: any,
        /**
         * CSV list of mood slugs
         */
        moodSlugs?: any,
    }): CancelablePromise<FilteredEntitiesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/taxonomy/filter',
            query: {
                'entity_type': entityType,
                'genre_slugs': genreSlugs,
                'mood_slugs': moodSlugs,
            },
            errors: {
                422: `entity_type required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List all genres
     * Anonymous-public. Returns every genre row ordered by name.
     * @returns GenreOut OK
     * @throws ApiError
     */
    public static listGenres(): CancelablePromise<Array<GenreOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/taxonomy/genres',
            errors: {
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a genre (admin)
     * Admin-only: creates a new genre row. Returns 409 if the slug already exists.
     * @returns GenreOut OK
     * @throws ApiError
     */
    public static createGenre({
        requestBody,
    }: {
        /**
         * Genre create payload
         */
        requestBody: GenreCreate,
    }): CancelablePromise<GenreOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/taxonomy/genres',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                409: `Genre slug already exists`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Assign a mood to a genre (admin)
     * Admin-only: associates a mood with a genre at the given weight. Idempotent upsert.
     * @returns GenreMoodLinkOut OK
     * @throws ApiError
     */
    public static assignMoodToGenre({
        genreId,
        requestBody,
    }: {
        /**
         * Genre UUID
         */
        genreId: any,
        /**
         * Mood-link payload
         */
        requestBody: GenreMoodLinkIn,
    }): CancelablePromise<GenreMoodLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/taxonomy/genres/{genre_id}/moods',
            path: {
                'genre_id': genreId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Genre or mood not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List all moods
     * Anonymous-public. Returns every mood row ordered by name.
     * @returns MoodOut OK
     * @throws ApiError
     */
    public static listMoods(): CancelablePromise<Array<MoodOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/taxonomy/moods',
            errors: {
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a mood (admin)
     * Admin-only: creates a new mood row. Returns 409 if the slug already exists.
     * @returns MoodOut OK
     * @throws ApiError
     */
    public static createMood({
        requestBody,
    }: {
        /**
         * Mood create payload
         */
        requestBody: MoodCreate,
    }): CancelablePromise<MoodOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/taxonomy/moods',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                409: `Mood slug already exists`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Replace manual genre tags for an entity
     * Replaces the caller's previous source='manual' genre assignments on the entity with the supplied slugs at confidence 1.0. Unknown slugs are silently dropped and returned in `unknown_slugs`.
     * @returns EntityGenreAssignmentOut OK
     * @throws ApiError
     */
    public static setEntityManualGenres({
        entityType,
        entityId,
        requestBody,
    }: {
        /**
         * Entity type
         */
        entityType: any,
        /**
         * Entity UUID
         */
        entityId: any,
        /**
         * Replacement payload (genre_slugs[])
         */
        requestBody: EntityGenreAssignmentIn,
    }): CancelablePromise<EntityGenreAssignmentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/taxonomy/{entity_type}/{entity_id}/genres',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not allowed to edit tags on this entity`,
                422: `Invalid entity_type/entity_id`,
                500: `Internal error`,
            },
        });
    }
}
