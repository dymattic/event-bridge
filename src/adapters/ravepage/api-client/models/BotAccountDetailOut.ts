/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BotGroupAssignmentOut } from './BotGroupAssignmentOut';
export type BotAccountDetailOut = {
    assignment_count?: number;
    consecutive_failures?: number;
    created_at?: string;
    group_assignments?: Array<BotGroupAssignmentOut>;
    id?: string;
    is_active?: boolean;
    label?: string;
    last_error?: string;
    last_login_at?: string;
    max_groups?: number;
    totp_configured?: boolean;
    updated_at?: string;
    vrchat_display_name?: string;
    vrchat_user_id?: string;
};

