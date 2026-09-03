/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginTokensOut = {
    /**
     * AccessToken is the bearer token for the API.
     */
    access_token?: string;
    /**
     * ExpiresIn is the access token's remaining lifetime in seconds.
     */
    expires_in?: number;
    /**
     * IDToken is the OIDC identity token, when the openid scope was granted.
     */
    id_token?: string;
    /**
     * RefreshToken renews the pair via POST /auth/login/refresh. Present
     * when the grant carried the offline_access scope.
     */
    refresh_token?: string;
    /**
     * Scope is the granted scope set, space-separated.
     */
    scope?: string;
    /**
     * TokenType is the OAuth token type, "Bearer".
     */
    token_type?: string;
};

