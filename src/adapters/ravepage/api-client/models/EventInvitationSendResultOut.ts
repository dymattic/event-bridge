/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventInvitationOut } from './EventInvitationOut';
export type EventInvitationSendResultOut = {
    /**
     * Created is the list of new-or-reactivated pending invitations.
     */
    created?: Array<EventInvitationOut>;
    /**
     * Skipped is the list of user ids the send intentionally skipped
     * (already accepted, not-a-friend, self-invite). skipped` is typed `List[UserId]`
     * (
         * serializes with the `usr_` prefix. The example payload at
         * wire-shape pin. Each entry MUST match `^usr_<uuid>$` - the
         * route layer projects via `"usr_" + uuid.UUID.String()`.
         */
        skipped?: Array<string>;
        /**
         * SkippedReasons maps user_id -> reason code for each entry in
         * Skipped. Reason codes: `self_invite`, `not_a_friend`,
         * `already_accepted`, `already_pending`.
         */
        skipped_reasons?: Record<string, string>;
    };

