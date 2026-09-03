/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntitySettingsUpdateIn } from '../models/EntitySettingsUpdateIn';
import type { eventNotificationSettingsOut } from '../models/eventNotificationSettingsOut';
import type { eventSubscribeOut } from '../models/eventSubscribeOut';
import type { eventSubscriberCountOut } from '../models/eventSubscriberCountOut';
import type { groupNotificationSettingsOut } from '../models/groupNotificationSettingsOut';
import type { groupSubscribeOut } from '../models/groupSubscribeOut';
import type { groupSubscriberCountOut } from '../models/groupSubscriberCountOut';
import type { PatchChannelsIn } from '../models/PatchChannelsIn';
import type { routes_EntitySettingsOut } from '../models/routes_EntitySettingsOut';
import type { SubscriptionCreateIn } from '../models/SubscriptionCreateIn';
import type { SubscriptionOut } from '../models/SubscriptionOut';
import type { UserNotificationPrefsResponse } from '../models/UserNotificationPrefsResponse';
import type { UserNotificationPrefsUpdate } from '../models/UserNotificationPrefsUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionsService {
    /**
     * Read event notification channel settings
     * Returns the per-event organiser allow-list +
     * discord_webhook_url override. When no settings row
     * exists, returns the default (`allowed_channels`
     * null = "all channels allowed").
     * @returns eventNotificationSettingsOut OK
     * @throws ApiError
     */
    public static getEventNotificationSettings({
        eventId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<eventNotificationSettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/notification-settings',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update event notification channel settings
     * Configure which notification channels are active
     * for this event AND optional discord webhook
     * override. Caller must be an event editor (admin /
     * event_users member / group-organizer).
     * @returns eventNotificationSettingsOut OK
     * @throws ApiError
     */
    public static setEventNotificationSettings({
        eventId,
        allowedChannels,
        discordWebhookUrl,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Channels to allow
         */
        allowedChannels?: any,
        /**
         * Discord webhook override URL
         */
        discordWebhookUrl?: any,
    }): CancelablePromise<eventNotificationSettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}/notification-settings',
            path: {
                'event_id': eventId,
            },
            query: {
                'allowed_channels': allowedChannels,
                'discord_webhook_url': discordWebhookUrl,
            },
            errors: {
                400: `Invalid event id`,
                401: `Authentication required`,
                403: `Not an event editor`,
                404: `Event not found`,
                500: `Internal error`,
                502: `Editor check upstream unavailable`,
            },
        });
    }
    /**
     * Unsubscribe the current user from event updates
     * Shorthand for DELETE /subscriptions/{id} scoped to
     * the current user's subscription for this event.
     * Idempotent - returns 204 whether or not a row was
     * deleted .
     * @returns void
     * @throws ApiError
     */
    public static unsubscribeFromEvent({
        eventId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/subscribe',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Subscribe the current user to event updates
     * Shorthand for POST /subscriptions with
     * entity_type=event. Channels default to user
     * preferences when the `channels` query param is
     * omitted.
     * @returns eventSubscribeOut Created
     * @throws ApiError
     */
    public static subscribeToEvent({
        eventId,
        channels,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Channel filter (email,discord,discord_dm,webhook)
         */
        channels?: any,
    }): CancelablePromise<eventSubscribeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/subscribe',
            path: {
                'event_id': eventId,
            },
            query: {
                'channels': channels,
            },
            errors: {
                400: `Invalid event id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Count subscribers for an event
     * Returns the number of users currently subscribed to
     * this event.
     * @returns eventSubscriberCountOut OK
     * @throws ApiError
     */
    public static getEventSubscriberCount({
        eventId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<eventSubscriberCountOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/subscribers/count',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Set notification channels for a group
     * Upserts the group's
     * entity_notification_settings row via the
     * notifications-worker cross-worker contract.
     * Requires group-admin authority (owner / admin /
     * manager / platform-admin).
     * @returns groupNotificationSettingsOut OK
     * @throws ApiError
     */
    public static setGroupNotificationSettings({
        groupId,
        allowedChannels,
        discordWebhookUrl,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * email|discord|webhook
         */
        allowedChannels?: any,
        /**
         * Discord webhook URL
         */
        discordWebhookUrl?: any,
    }): CancelablePromise<groupNotificationSettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/groups/{group_id}/notification-settings',
            path: {
                'group_id': groupId,
            },
            query: {
                'allowed_channels': allowedChannels,
                'discord_webhook_url': discordWebhookUrl,
            },
            errors: {
                400: `Invalid group_id / query`,
                401: `Authentication required`,
                404: `Group not found or caller lacks admin authority`,
                502: `Upstream notifications worker unavailable`,
            },
        });
    }
    /**
     * Unsubscribe the current user from group updates
     * Shorthand for DELETE /subscriptions/{id} scoped to
     * the current user's subscription for this group.
     * Idempotent - 204 whether or not a row was deleted .
     * @returns void
     * @throws ApiError
     */
    public static unsubscribeFromGroup({
        groupId,
    }: {
        /**
         * Group id (UUID or grp_<uuid>)
         */
        groupId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/groups/{group_id}/subscribe',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Subscribe the current user to group updates
     * Shorthand for POST /subscriptions with
     * entity_type=group.
     * @returns groupSubscribeOut Created
     * @throws ApiError
     */
    public static subscribeToGroup({
        groupId,
        channels,
    }: {
        /**
         * Group id (UUID or grp_<uuid>)
         */
        groupId: any,
        /**
         * Channel filter (email,discord,webhook)
         */
        channels?: any,
    }): CancelablePromise<groupSubscribeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups/{group_id}/subscribe',
            path: {
                'group_id': groupId,
            },
            query: {
                'channels': channels,
            },
            errors: {
                400: `Invalid group id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Count subscribers for a group
     * Returns the number of users currently subscribed to
     * this group.
     * @returns groupSubscriberCountOut OK
     * @throws ApiError
     */
    public static getGroupSubscriberCount({
        groupId,
    }: {
        /**
         * Group id (UUID or grp_<uuid>)
         */
        groupId: any,
    }): CancelablePromise<groupSubscriberCountOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/subscribers/count',
            path: {
                'group_id': groupId,
            },
            errors: {
                400: `Invalid group id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List my subscriptions
     * Returns the caller's subscriptions.
     * @returns SubscriptionOut OK
     * @throws ApiError
     */
    public static listMySubscriptions({
        entityType,
    }: {
        /**
         * Filter by entity type
         */
        entityType?: any,
    }): CancelablePromise<Array<SubscriptionOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/subscriptions',
            query: {
                'entity_type': entityType,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create subscription
     * Subscribes the caller to an entity's notifications.
     * @returns SubscriptionOut Created
     * @throws ApiError
     */
    public static createSubscription({
        requestBody,
    }: {
        /**
         * Subscription payload
         */
        requestBody: SubscriptionCreateIn,
    }): CancelablePromise<SubscriptionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get entity notification settings
     * Returns per-entity notification settings (allowed channels, webhook URL).
     * @returns routes_EntitySettingsOut OK
     * @throws ApiError
     */
    public static getEntityNotificationSettings({
        entityType,
        entityId,
    }: {
        /**
         * Entity type
         */
        entityType: any,
        /**
         * Entity ID
         */
        entityId: any,
    }): CancelablePromise<routes_EntitySettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/subscriptions/entity-settings',
            query: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Settings not found`,
            },
        });
    }
    /**
     * Upsert entity notification settings
     * Upserts per-entity notification settings.
     * @returns routes_EntitySettingsOut OK
     * @throws ApiError
     */
    public static upsertEntityNotificationSettings({
        entityType,
        entityId,
        requestBody,
    }: {
        /**
         * Entity type
         */
        entityType: any,
        /**
         * Entity ID
         */
        entityId: any,
        /**
         * Settings payload
         */
        requestBody: EntitySettingsUpdateIn,
    }): CancelablePromise<routes_EntitySettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/subscriptions/entity-settings',
            query: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get notification preferences
     * Returns the caller's master notification preferences.
     * @returns UserNotificationPrefsResponse OK
     * @throws ApiError
     */
    public static getNotificationPreferences(): CancelablePromise<UserNotificationPrefsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/subscriptions/preferences',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update notification preferences
     * Patches the caller's master notification preferences (only set fields are updated).
     * @returns UserNotificationPrefsResponse OK
     * @throws ApiError
     */
    public static updateNotificationPreferences({
        requestBody,
    }: {
        /**
         * Patch payload
         */
        requestBody: UserNotificationPrefsUpdate,
    }): CancelablePromise<UserNotificationPrefsResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/subscriptions/preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Delete subscription
     * Removes a subscription row owned by the caller.
     * @returns void
     * @throws ApiError
     */
    public static unsubscribe({
        subId,
    }: {
        /**
         * Subscription ID
         */
        subId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/subscriptions/{sub_id}',
            path: {
                'sub_id': subId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Subscription not found`,
            },
        });
    }
    /**
     * Patch subscription channels
     * Updates the per-channel enable flags and configs for a subscription.
     * @returns SubscriptionOut OK
     * @throws ApiError
     */
    public static updateSubscriptionChannels({
        subId,
        requestBody,
    }: {
        /**
         * Subscription ID
         */
        subId: any,
        /**
         * Channels patch
         */
        requestBody: PatchChannelsIn,
    }): CancelablePromise<SubscriptionOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/subscriptions/{sub_id}/channels',
            path: {
                'sub_id': subId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Subscription not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
