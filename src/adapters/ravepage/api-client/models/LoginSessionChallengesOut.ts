/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginSessionChallengesOut = {
    /**
     * OTPEmail is the email-OTP challenge handle, when an email factor is pending.
     */
    otp_email?: string;
    /**
     * OTPSMS is the SMS-OTP challenge handle, when an SMS factor is pending.
     */
    otp_sms?: string;
};

