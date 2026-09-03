/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditHistoryEntryMetaOut } from '../models/EditHistoryEntryMetaOut';
import type { EditHistoryEntryOut } from '../models/EditHistoryEntryOut';
import type { EditHistoryPrefsOut } from '../models/EditHistoryPrefsOut';
import type { EditHistoryPrefsUpdateIn } from '../models/EditHistoryPrefsUpdateIn';
import type { EditHistoryRestoreOut } from '../models/EditHistoryRestoreOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EditHistoryService {
    /**
     * List my edit-history entries
     * Returns the caller's edit-history entries (lightweight
     * meta rows - no snapshot payload), ordered most-recent
     * first. Use GET /history/{entry_id} to fetch a single
     * entry's snapshot.
     * @returns EditHistoryEntryMetaOut OK
     * @throws ApiError
     */
    public static listEditHistory({
        entityType,
        entityId,
        limit,
        offset,
    }: {
        /**
         * Filter by entity type (e.g. 'profile', 'profile_section', 'epk')
         */
        entityType?: any,
        /**
         * Filter by entity UUID
         */
        entityId?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Page offset (>=0, default 0)
         */
        offset?: any,
    }): CancelablePromise<Array<EditHistoryEntryMetaOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history',
            query: {
                'entity_type': entityType,
                'entity_id': entityId,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Malformed query params`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Clear my edit-history (optionally scoped)
     * Bulk-deletes the caller's edit-history rows. Optional
     * entity_type / entity_id filters narrow the scope; the
     * owner-scope (`owner_user_id = caller`) is ALWAYS
     * applied. Returns 204 regardless of how many rows
     * matched.
     * @returns void
     * @throws ApiError
     */
    public static clearEditHistory({
        entityType,
        entityId,
    }: {
        /**
         * Filter by entity type
         */
        entityType?: any,
        /**
         * Filter by entity UUID
         */
        entityId?: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/history/edit-history',
            query: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Malformed entity_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete one of my edit-history entries
     * Deletes a single entry. BOLA-gated: a non-owner sees
     * 404 (NOT 403). Returns 204 on success.
     * @returns void
     * @throws ApiError
     */
    public static deleteEditHistoryEntry({
        entryId,
    }: {
        /**
         * Entry ID (prefixed 'eh_<uuid>' or bare UUID)
         */
        entryId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/history/edit-history/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Entry not found or not visible to caller`,
                422: `Malformed entry_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get edit-history opt-in preferences
     * Returns the caller's edit-history preferences. The
     * feature is disabled by default; users opt in via
     * PUT /history/preferences. First-read auto-creates an
     * empty row with the column defaults (enabled=false,
     * max_snapshots_per_entity=50).
     * @returns EditHistoryPrefsOut OK
     * @throws ApiError
     */
    public static getEditHistoryPreferences(): CancelablePromise<EditHistoryPrefsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history/preferences',
            errors: {
                401: `Auth missing or invalid`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update edit-history opt-in preferences
     * Updates the caller's edit-history preferences. Both
     * fields are optional (PUT-as-PATCH). The
     * max_snapshots_per_entity field is clamped to [1, 200];
     * out-of-range values return 422 VALIDATION_FAILED.
     * @returns EditHistoryPrefsOut OK
     * @throws ApiError
     */
    public static updateEditHistoryPreferences({
        requestBody,
    }: {
        /**
         * Patch fields
         */
        requestBody: EditHistoryPrefsUpdateIn,
    }): CancelablePromise<EditHistoryPrefsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/history/preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Auth missing or invalid`,
                422: `max_snapshots_per_entity out of range`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a single edit-history entry (with snapshot)
     * Returns the snapshot payload for one edit-history
     * entry. BOLA-gated: a non-owner sees 404 (NOT 403) to
     * avoid leaking the entry's existence.
     * @returns EditHistoryEntryOut OK
     * @throws ApiError
     */
    public static getEditHistoryEntry({
        entryId,
    }: {
        /**
         * Entry ID (prefixed 'eh_<uuid>' or bare UUID)
         */
        entryId: any,
    }): CancelablePromise<EditHistoryEntryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/history/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Entry not found or not visible to caller`,
                422: `Malformed entry_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Restore entity to a previous snapshot
     * Loads the owner-scoped snapshot row and dispatches
     * back into the originating worker. Authz + BOLA gate run
     * FIRST so 401/404/422 take precedence over any
     * downstream disposition.
     * @returns EditHistoryRestoreOut Restore applied
     * @throws ApiError
     */
    public static restoreEditHistoryEntry({
        entryId,
    }: {
        /**
         * Entry ID (prefixed 'eh_<uuid>' or bare UUID)
         */
        entryId: any,
    }): CancelablePromise<EditHistoryRestoreOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/history/{entry_id}/restore',
            path: {
                'entry_id': entryId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Entry not found or not visible; target profile missing`,
                422: `Malformed entry_id, unsupported entity type, or stale snapshot enum`,
                500: `Internal error`,
                503: `Restore not yet available (dev mode or unsupported destination)`,
            },
        });
    }
}
