/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginSessionFactorIn = {
    /**
     * OTPEmailCode completes an email-OTP challenge.
     */
    otp_email_code?: string;
    /**
     * OTPSMSCode completes an SMS-OTP challenge.
     */
    otp_sms_code?: string;
    password?: string;
    /**
     * SessionToken authenticates the mutation (from the prior step).
     */
    session_token?: string;
    /**
     * TOTPCode completes an authenticator-app (TOTP) challenge.
     */
    totp_code?: string;
    /**
     * WebAuthNAssertion completes a passkey challenge - the raw
     * PublicKeyCredential JSON from navigator.credentials.get(), passed
     * through to Zitadel untouched.
     */
    webauthn_assertion?: Record<string, any>;
};

