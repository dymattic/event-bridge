/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DataKeyOut = {
    /**
     * CreatedAt, RFC3339.
     */
    created_at?: string;
    /**
     * Factor of this wrapping.
     */
    factor?: 'password' | 'passkey' | 'recovery';
    /**
     * KeyRef of this wrapping.
     */
    key_ref?: string;
    /**
     * Scheme label the client stored.
     */
    scheme?: string;
    /**
     * UpdatedAt, RFC3339. Changes when the wrapping is replaced, e.g.
     * on a password change.
     */
    updated_at?: string;
    /**
     * WrappedKey, base64url-unpadded.
     */
    wrapped_key?: string;
};

