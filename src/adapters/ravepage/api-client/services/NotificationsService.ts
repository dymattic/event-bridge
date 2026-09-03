/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminDispatchIn } from '../models/AdminDispatchIn';
import type { MarkAllReadOut } from '../models/MarkAllReadOut';
import type { NotificationDeliveryOut } from '../models/NotificationDeliveryOut';
import type { NotificationOut } from '../models/NotificationOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * List notifications
     * Returns paginated notifications for the caller.
     * @returns NotificationOut OK
     * @throws ApiError
     */
    public static listNotifications({
        skip,
        limit,
        unread,
        isRead,
        entityType,
    }: {
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size
         */
        limit?: any,
        /**
         * Filter by unread state (unread=true → only unread rows). Wins over is_read when both supplied.
         */
        unread?: any,
        /**
         * Legacy alias: filter by read flag (is_read=false ≡ unread=true). Ignored when unread is supplied.
         */
        isRead?: any,
        /**
         * Filter by linked entity type (≤ 30 chars)
         */
        entityType?: any,
    }): CancelablePromise<Array<NotificationOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications',
            query: {
                'skip': skip,
                'limit': limit,
                'unread': unread,
                'is_read': isRead,
                'entity_type': entityType,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Admin: dispatch notification
     * Admin-only manual dispatch endpoint.
     * @returns number Number of notifications created
     * @throws ApiError
     */
    public static adminDispatchNotification({
        requestBody,
    }: {
        /**
         * Dispatch payload
         */
        requestBody: AdminDispatchIn,
    }): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications/dispatch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Admin only`,
                422: `Unprocessable Entity`,
                503: `Dispatcher unconfigured`,
            },
        });
    }
    /**
     * Mark all notifications as read
     * Marks every unread notification for the caller as read; returns the count.
     * @returns MarkAllReadOut OK
     * @throws ApiError
     */
    public static markAllNotificationsRead(): CancelablePromise<MarkAllReadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications/read-all',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get notification deliveries
     * Returns per-channel delivery rows for one notification.
     * @returns NotificationDeliveryOut OK
     * @throws ApiError
     */
    public static getNotificationDeliveries({
        notifId,
    }: {
        /**
         * Notification ID
         */
        notifId: any,
    }): CancelablePromise<Array<NotificationDeliveryOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/{notif_id}/deliveries',
            path: {
                'notif_id': notifId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Notification not found`,
            },
        });
    }
    /**
     * Mark notification as read
     * Marks a single notification as read. Idempotent.
     * @returns NotificationOut OK
     * @throws ApiError
     */
    public static markNotificationRead({
        notifId,
    }: {
        /**
         * Notification ID
         */
        notifId: any,
    }): CancelablePromise<NotificationOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/notifications/{notif_id}/read',
            path: {
                'notif_id': notifId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Notification not found`,
            },
        });
    }
}
