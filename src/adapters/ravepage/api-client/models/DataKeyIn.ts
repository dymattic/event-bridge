/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DataKeyIn = {
    /**
     * Factor is which auth factor unwraps this blob.
     */
    factor?: 'password' | 'passkey' | 'recovery';
    /**
     * KeyRef discriminates several wrappings of the same factor - one
     * per passkey credential, for example. Empty for factors that have
     * a single wrapping.
     */
    key_ref?: string;
    /**
     * Scheme labels the wrapping construction so the client can
     * migrate schemes later. Never interpreted server-side.
     */
    scheme?: string;
    /**
     * WrappedKey is the wrapped data key, base64url-unpadded. Opaque
     * ciphertext: the server cannot open it and never tries.
     */
    wrapped_key?: string;
};

