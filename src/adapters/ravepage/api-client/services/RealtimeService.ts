/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BridgeAcceptIn } from '../models/BridgeAcceptIn';
import type { BridgeHeartbeatOut } from '../models/BridgeHeartbeatOut';
import type { BridgeSendIn } from '../models/BridgeSendIn';
import type { BridgeSendOut } from '../models/BridgeSendOut';
import type { BridgeSessionListOut } from '../models/BridgeSessionListOut';
import type { BridgeSessionRegisterIn } from '../models/BridgeSessionRegisterIn';
import type { BridgeSessionRegisterOut } from '../models/BridgeSessionRegisterOut';
import type { MocapJoinIn } from '../models/MocapJoinIn';
import type { MocapJoinOut } from '../models/MocapJoinOut';
import type { MocapSendIn } from '../models/MocapSendIn';
import type { MocapSendOut } from '../models/MocapSendOut';
import type { MocapSessionOut } from '../models/MocapSessionOut';
import type { RealtimeTicketIn } from '../models/RealtimeTicketIn';
import type { RealtimeTicketOut } from '../models/RealtimeTicketOut';
import type { TopicCatalog } from '../models/TopicCatalog';
import type { WSHelloFrame } from '../models/WSHelloFrame';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RealtimeService {
    /**
     * Realtime WebSocket endpoint
     * Bidirectional WebSocket on `/realtime`. On connect the
     * server sends `{"type":"hello","message":"connected"}`;
     * thereafter the server ACKs every inbound text frame
     * with `{"type":"ack","received":<parsed-payload>}`. App-
     * level ping every 15s keeps the connection alive across
     * proxy idle-timeouts.
     * @returns WSHelloFrame Documented hello-frame body (server returns 101 on real upgrade)
     * @throws ApiError
     */
    public static realtimeStream({
        token,
    }: {
        /**
         * Optional token override (rarely used; gateway claim is primary)
         */
        token?: any,
    }): CancelablePromise<WSHelloFrame> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/realtime',
            query: {
                'token': token,
            },
            errors: {
                400: `Malformed handshake`,
                401: `Authentication required`,
            },
        });
    }
    /**
     * Send a blind frame to a same-account session
     * Publishes one opaque base64 frame (signal or relay) to the target session's bridge stream. The server never interprets or persists the payload - E2E crypto is the clients' job. Fire-and-forget: 202 means "validated and published", not "delivered"; confirm receipt end-to-end.
     * @returns BridgeSendOut Accepted
     * @throws ApiError
     */
    public static sendBridgeFrame({
        requestBody,
    }: {
        /**
         * Frame
         */
        requestBody: BridgeSendIn,
    }): CancelablePromise<BridgeSendOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/realtime/bridge/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                403: `RELAY_NOT_ACCEPTED`,
                404: `Sender or target session not found`,
                413: `FRAME_TOO_LARGE`,
                429: `RATE_LIMITED`,
            },
        });
    }
    /**
     * List own bridge device sessions
     * Lists the authed account's currently-online bridge sessions (presence registry). Sessions vanish when their TTL lapses without a heartbeat or open stream.
     * @returns BridgeSessionListOut OK
     * @throws ApiError
     */
    public static listBridgeSessions(): CancelablePromise<BridgeSessionListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/realtime/bridge/sessions',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Register a bridge device session
     * Registers an ephemeral, account-bound device session for the rendezvous/relay bridge. Presence lives in memory with a TTL - keep it alive via the heartbeat endpoint or an open bridge stream. No durable state; nothing survives TTL expiry.
     * @returns BridgeSessionRegisterOut Created
     * @throws ApiError
     */
    public static registerBridgeSession({
        requestBody,
    }: {
        /**
         * Session metadata
         */
        requestBody: BridgeSessionRegisterIn,
    }): CancelablePromise<BridgeSessionRegisterOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/realtime/bridge/sessions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                409: `SESSION_LIMIT_REACHED`,
                429: `RATE_LIMITED`,
            },
        });
    }
    /**
     * Deregister a bridge session
     * Removes the session and emits a presence-offline frame on the account channel. Sessions also vanish silently on TTL expiry.
     * @returns void
     * @throws ApiError
     */
    public static deleteBridgeSession({
        sid,
    }: {
        /**
         * Session id
         */
        sid: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/realtime/bridge/sessions/{sid}',
            path: {
                'sid': sid,
            },
            errors: {
                401: `Authentication required`,
                404: `Session not found / already expired`,
            },
        });
    }
    /**
     * Accept a peer session for relay
     * Marks {sid}→peer_sid as accepted. Relay (data-plane) frames flow only after BOTH sides accept each other; signal frames need no acceptance. Accept marks expire after 5 idle minutes (refreshed by relay traffic).
     * @returns void
     * @throws ApiError
     */
    public static acceptBridgePeer({
        sid,
        requestBody,
    }: {
        /**
         * Own session id
         */
        sid: any,
        /**
         * Peer to accept
         */
        requestBody: BridgeAcceptIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/realtime/bridge/sessions/{sid}/accept',
            path: {
                'sid': sid,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                404: `Session or peer not found`,
                409: `LINK_LIMIT_REACHED`,
            },
        });
    }
    /**
     * Heartbeat a bridge session
     * Refreshes the session's presence TTL. Call every ~30s when no bridge stream is open (an open stream refreshes automatically).
     * @returns BridgeHeartbeatOut OK
     * @throws ApiError
     */
    public static heartbeatBridgeSession({
        sid,
    }: {
        /**
         * Session id
         */
        sid: any,
    }): CancelablePromise<BridgeHeartbeatOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/realtime/bridge/sessions/{sid}/heartbeat',
            path: {
                'sid': sid,
            },
            errors: {
                401: `Authentication required`,
                404: `Session not found / expired`,
            },
        });
    }
    /**
     * Bridge SSE downstream
     * Long-lived SSE stream for one bridge session. Emits a `hello` frame, then one frame per event - `event:` is the frame kind (presence|signal|relay), `data:` is a BridgeFrame JSON envelope - plus `heartbeat` frames every 15s. The open stream refreshes the session's presence TTL. EventSource clients pass the JWT as `?token=` (headers unavailable).
     * @returns string text/event-stream frames (data: dto.BridgeFrame)
     * @throws ApiError
     */
    public static streamBridge({
        sid,
    }: {
        /**
         * Own session id
         */
        sid: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/realtime/bridge/stream',
            query: {
                'sid': sid,
            },
            errors: {
                401: `Authentication required`,
                404: `Session not found / expired`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List a mocap room's live sessions
     * Returns the room's live relay sessions (presence registry). Visible to event editors AND active crew members; anyone else receives 404. The web Capture Crew panel polls this.
     * @returns MocapSessionOut OK
     * @throws ApiError
     */
    public static listMocapRoomMembers({
        eventId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
    }): CancelablePromise<Array<MocapSessionOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/realtime/mocap/rooms/{event_id}/members',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                404: `Room not found (event missing or no crew standing)`,
            },
        });
    }
    /**
     * Join an event's mocap relay room
     * Registers an ephemeral relay session for the event's capture-crew room. Authorization is the events capture-crew predicate (event editors OR active roster members; role=master additionally requires editor standing). Non-crew callers receive 404 - room existence is not disclosed. Keep the session alive via the heartbeat endpoint (~25s), sending frames, or an open mocap stream. Emits a presence `join` event to the room.
     * @returns MocapJoinOut Created
     * @throws ApiError
     */
    public static joinMocapRoom({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Session role/tier/label
         */
        requestBody: MocapJoinIn,
    }): CancelablePromise<MocapJoinOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/realtime/mocap/rooms/{event_id}/sessions',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                403: `MASTER_REQUIRES_EDITOR`,
                404: `Room not found (event missing or no crew standing)`,
                409: `SESSION_LIMIT_REACHED`,
                429: `RATE_LIMITED`,
            },
        });
    }
    /**
     * Send a mocap relay frame
     * Publishes one opaque base64 frame (≤256KiB decoded) to a peer session (`to_sid`) or - masters only - to the whole room (omit `to_sid`; nodes receive 403 NODE_BROADCAST_FORBIDDEN). The server validates base64 shape + size only; pose/sync/ctrl payload shapes are a client-level contract. Fire-and-forget: 202 means "validated and published", not "delivered" - pose frames tolerate loss by design.
     * @returns MocapSendOut Accepted
     * @throws ApiError
     */
    public static sendMocapFrame({
        requestBody,
    }: {
        /**
         * Frame
         */
        requestBody: MocapSendIn,
    }): CancelablePromise<MocapSendOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/realtime/mocap/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                403: `NODE_BROADCAST_FORBIDDEN`,
                404: `Sender session gone / RELAY_UNKNOWN_PEER`,
                413: `FRAME_TOO_LARGE`,
                429: `RATE_LIMITED`,
            },
        });
    }
    /**
     * Leave a mocap room
     * Removes the session and emits a presence `leave` event to the room. Sessions also vanish silently on TTL expiry (90s without heartbeat/send/stream).
     * @returns void
     * @throws ApiError
     */
    public static leaveMocapRoom({
        sid,
    }: {
        /**
         * Session id
         */
        sid: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/realtime/mocap/sessions/{sid}',
            path: {
                'sid': sid,
            },
            errors: {
                401: `Authentication required`,
                404: `Session not found / already expired`,
            },
        });
    }
    /**
     * Heartbeat a mocap session
     * Refreshes the session's presence TTL (90s) and re-runs the cached crew check. A member whose roster row was revoked (or a master who lost editor standing) is dropped with a presence `kick` event and receives 404 - re-join is required after standing is restored. Call every ~25s.
     * @returns void
     * @throws ApiError
     */
    public static heartbeatMocapSession({
        sid,
    }: {
        /**
         * Session id
         */
        sid: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/realtime/mocap/sessions/{sid}/heartbeat',
            path: {
                'sid': sid,
            },
            errors: {
                401: `Authentication required`,
                404: `Session not found / expired / standing revoked`,
            },
        });
    }
    /**
     * Mocap relay SSE downstream
     * Long-lived SSE stream for one relay session. Emits a `hello` frame, then one frame per event - `presence` (MocapPresenceEvent JSON: join|leave|kick) and `relay` (MocapFrame JSON, sender sid) - plus `heartbeat` frames every 15s. The open stream refreshes the session's presence TTL. EventSource clients pass the JWT as `?token=` (headers unavailable).
     * @returns string text/event-stream frames (data: dto.MocapFrame | dto.MocapPresenceEvent)
     * @throws ApiError
     */
    public static streamMocapRoom({
        sid,
    }: {
        /**
         * Own session id
         */
        sid: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/realtime/mocap/stream',
            query: {
                'sid': sid,
            },
            errors: {
                401: `Authentication required`,
                404: `Session not found / expired`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Server-Sent Events stream
     * Subscribe to real-time event notifications via SSE. Supports topics: event.created, event.updated, event.deleted, appointment.*, attendee.rsvp_changed, collaborator.invite/accept/decline. Protected topics (appointment.*) require authentication. The stream emits one `hello` frame on connect, one frame per published event, and a `heartbeat` frame every 15s on idle. Browser EventSource clients should register `addEventListener("heartbeat", ...)` for browser-liveness checks.
     * @returns string text/event-stream frames
     * @throws ApiError
     */
    public static streamRealtime({
        topic,
        topics,
        calendarId,
        lastEventId,
    }: {
        /**
         * Comma-separated or repeated topic names; shorthand aliases (e.g. `releases`) are expanded.
         */
        topic?: any,
        /**
         * Alias for `topic`; comma-separated single-value form .
         */
        topics?: any,
        /**
         * Optional metadata field; reflected back in the hello frame for FE filtering. Not used for routing.
         */
        calendarId?: any,
        /**
         * Resume cursor; the server starts the id counter at this value + 1 (no historic replay).
         */
        lastEventId?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/realtime/stream',
            headers: {
                'Last-Event-ID': lastEventId,
            },
            query: {
                'topic': topic,
                'topics': topics,
                'calendar_id': calendarId,
            },
            errors: {
                400: `No topics requested or none match the registry`,
                401: `Authentication required for one or more protected topics`,
                500: `Internal error resolving subscription`,
            },
        });
    }
    /**
     * CORS preflight for the SSE stream
     * Returns 204 with no body and no `Access-Control-*` response headers. The nginx proxy is the single source of truth for CORS - setting headers here would produce duplicate values browsers reject as a literal origin mismatch.
     * @returns void
     * @throws ApiError
     */
    public static realtimeStreamOptions(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/realtime/stream',
        });
    }
    /**
     * List subscribable realtime topics
     * Returns the catalog of every realtime topic the server knows about, plus the shorthand alias channels you can pass in the `topics` query parameter on `/realtime/stream`. Frontends should fetch this on app startup to discover what's available - the catalog is the single source of truth.
     * @returns TopicCatalog OK
     * @throws ApiError
     */
    public static listRealtimeTopics(): CancelablePromise<TopicCatalog> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/realtime/topics',
            errors: {
                500: `Internal error`,
            },
        });
    }
    /**
     * Mint a realtime stream ticket
     * Returns a short-lived, single-use, scope-bound credential for an SSE/WebSocket connection. Browser `EventSource` cannot send an `Authorization` header, so the stream URL carries `?ticket=<value>` instead of a JWT. The ticket is bound to the caller, to one stream scope, and to the client address; it is invalidated the moment it is redeemed. Because it is single-use, the client MUST take over reconnect: on stream error, close the EventSource, mint a fresh ticket, and open a new one.
     * @returns RealtimeTicketOut OK
     * @throws ApiError
     */
    public static mintRealtimeTicket({
        requestBody,
    }: {
        /**
         * Scope + optional resource / resume cursor
         */
        requestBody: RealtimeTicketIn,
    }): CancelablePromise<RealtimeTicketOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/realtime/ticket',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Missing or invalid access token - the session is dead, re-authenticate`,
                422: `Unknown scope, or resource missing for a scope that requires one`,
                429: `Too many mints - back off`,
                503: `Ticket service unavailable`,
            },
        });
    }
}
