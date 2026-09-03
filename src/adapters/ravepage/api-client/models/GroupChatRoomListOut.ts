/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupChatRoomOut } from './GroupChatRoomOut';
export type GroupChatRoomListOut = {
    /**
     * Count is len(rooms).
     */
    count?: number;
    /**
     * Rooms is the channel list ([] when none visible).
     */
    rooms?: Array<GroupChatRoomOut>;
};

