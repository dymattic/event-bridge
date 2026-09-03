/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BotAccountLoginOut = {
    /**
     * Human-readable result.
     */
    message?: string;
    /**
     * Whether 2FA is required.
     */
    requires_2fa?: boolean;
    /**
     * Whether email OTP is required (submit via verify-email-otp).
     */
    requires_email_otp?: boolean;
    /**
     * Whether the login attempt succeeded.
     */
    success?: boolean;
    /**
     * VRChat display name (when login succeeded).
     */
    vrchat_display_name?: string;
    /**
     * VRChat user id (when login succeeded).
     */
    vrchat_user_id?: string;
};

