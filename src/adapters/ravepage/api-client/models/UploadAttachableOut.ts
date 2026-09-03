/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UploadProjection } from './UploadProjection';
export type UploadAttachableOut = {
    /**
     * OK - true when all four arms passed. False for every Reason
     * except `ok`.
     */
    ok?: boolean;
    /**
     * Reason - which arm failed (or `ok` when all passed). Stable
     * enum for observability + per-caller status-code mapping.
     */
    reason?: 'ok' | 'upload_not_found' | 'not_owner' | 'group_membership_pending' | 'quarantined' | 'not_editor' | 'target_not_found' | 'editor_unavailable' | 'unsupported_kind' | 'groups_editor_unavailable';
    /**
     * Upload - narrow projection populated only when `ok=true`.
     * Callers use it to skip a follow-up upload-fetch RPC.
     */
    upload?: UploadProjection;
};

