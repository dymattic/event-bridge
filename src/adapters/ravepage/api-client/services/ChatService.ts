/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatLogoutIn } from '../models/ChatLogoutIn';
import type { DMIn } from '../models/DMIn';
import type { RoomOut } from '../models/RoomOut';
import type { SessionIn } from '../models/SessionIn';
import type { SessionOut } from '../models/SessionOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * Open or get a 1:1 chat room
     * Returns (creating if needed) the encrypted direct room
     * between the caller and target_user_id. Idempotent.
     * @returns RoomOut OK
     * @throws ApiError
     */
    public static openChatDm({
        requestBody,
    }: {
        /**
         * Target user
         */
        requestBody: DMIn,
    }): CancelablePromise<RoomOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/dm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `target_user_id required / self-DM`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revoke one Matrix device token
     * Revokes the supplied per-device Matrix access token at the
     * homeserver (e.g. on this device's sign-out).
     * @returns void
     * @throws ApiError
     */
    public static revokeChatSession({
        requestBody,
    }: {
        /**
         * Token + device to revoke
         */
        requestBody: ChatLogoutIn,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/logout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `access_token required`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revoke ALL Matrix device tokens
     * Invalidates every Matrix access token + device for the
     * caller - the full sign-out / Zitadel-logout fan-out.
     * @returns void
     * @throws ApiError
     */
    public static revokeAllChatSessions(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/logout-all',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Resolve an entity chat room
     * Returns the room bound to the entity. Private rooms
     * resolve only for members; 404 when absent OR the caller
     * isn't a member (BOLA-safe - never leaks existence to a
     * non-member). Public rooms resolve for any authed caller.
     * @returns RoomOut OK
     * @throws ApiError
     */
    public static getChatRoom({
        _for,
    }: {
        /**
         * kind:id (kind in event|collab|group|group_channel)
         */
        _for: any,
    }): CancelablePromise<RoomOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/rooms',
            query: {
                'for': _for,
            },
            errors: {
                400: `Malformed for param`,
                401: `Authentication required`,
                404: `Room not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Mint a Matrix session token
     * Returns the homeserver coordinates + a per-device Matrix
     * access token for the authenticated caller (registering the
     * Matrix user on first call). Initialize matrix-js-sdk with
     * the returned fields and talk to the homeserver directly.
     * @returns SessionOut OK
     * @throws ApiError
     */
    public static createChatSession({
        requestBody,
    }: {
        /**
         * Optional stable device id
         */
        requestBody?: SessionIn,
    }): CancelablePromise<SessionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/session',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
}
