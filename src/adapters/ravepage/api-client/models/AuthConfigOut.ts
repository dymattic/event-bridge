/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthConfigOut = {
    /**
     * ClearnetLeakingMethods names auth methods that would send the
     * browser to a clearnet host on THIS origin, so the frontend can
     * hide or hard-warn them instead of discovering the leak in
     * production. Empty on clearnet.
     *
     * idp Third-party IdP login (Discord/Twitch/SoundCloud/...). The
     * authorization request is a browser redirect to that
     * provider, which is clearnet by definition and cannot be
     * proxied - the provider has to see its own domain.
     *
     * Deliberately advisory, not enforced. An IdP-only account has no
     * other way in, so refusing the method server-side would lock those
     * users out of the onion entirely. Hide the buttons by default and
     * let a user who understands the trade-off opt in.
     */
    clearnet_leaking_methods?: Array<string>;
    /**
     * ClientID is the public SPA application's OIDC client_id (also the
     * audience the gateway pins). Public by OIDC design - a PKCE public
     * client has no secret.
     */
    client_id?: string;
    /**
     * DiscoveryURL is the fully-qualified OIDC discovery document URL -
     * `${issuer}/.well-known/openid-configuration`. Provided verbatim so
     * the FE never has to string-concat the issuer.
     */
    discovery_url?: string;
    /**
     * Issuer is the OIDC issuer base URL (branch-suffixed Zitadel auth
     * subdomain). The FE's OIDC client derives every endpoint from
     * `${issuer}/.well-known/openid-configuration`.
     */
    issuer?: string;
    /**
     * LoginFlow tells the frontend which flow to run on THIS origin,
     * rather than leaving it to infer one from which fields are set.
     *
     * redirect Authorization-Code + PKCE against the IdP's hosted
     * login. The browser talks to the IdP directly.
     * native POST /auth/login and the /auth/sessions pair. Every
     * call to the IdP happens server-side over the internal
     * network.
     * native-bff As `native`, plus the two legs that used to stay in
     * the browser: POST /auth/login/begin mints the auth
     * request, POST /auth/login/finalize runs the code
     * exchange and returns the tokens directly (renew via
     * POST /auth/login/refresh). The browser never contacts
     * the IdP at all - not for discovery, not for authorize,
     * not for the token endpoint.
     *
     * Over an anonymity network the answer is `native-bff`, and the
     * reason is not the login page - it is that the redirect flow has
     * the browser fetch the discovery document and then the token
     * endpoint from the IdP host itself. Those are clearnet connections
     * carrying the user's real address, made at the moment they
     * authenticate. Plain `native` is not enough either: it still needed
     * an `authRequest` id minted by a browser authorize round-trip, and
     * it still ended in a browser code exchange.
     */
    login_flow?: 'redirect' | 'native' | 'native-bff';
    /**
     * NativeLoginAvailable reports whether the native path is mounted.
     * When LoginFlow is `native` this is always true - the endpoint
     * fails closed rather than naming a flow that cannot run.
     */
    native_login_available?: boolean;
    /**
     * OpenAPIURL points at Zitadel's own gRPC-gateway OpenAPI/swagger tree
     * (`${issuer}/openapi/v2/swagger/`) - the admin/management/auth API
     * surface, served by Zitadel itself. Per-branch, resolved at runtime so
     * the FE never hard-codes the auth host. We reference rather than merge
     * it: it's Zitadel's contract, not ours.
     */
    openapi_url?: string;
    /**
     * PasskeyOriginBound warns that WebAuthn credentials do not carry
     * across origins: a passkey enrolled on the clearnet site will not
     * work here and vice versa, because the RP ID is derived from the
     * origin. Inherent to WebAuthn, not something we can fix - but the
     * user should be told before they try, not after they are locked
     * out. True on the onion origin, absent on the primary one.
     */
    passkey_origin_bound?: boolean;
    /**
     * PostLogoutRedirectURIs are the URIs Zitadel is configured to allow
     * after end-session. Empty when none are configured. Informational -
     * the FE still passes its own `post_logout_redirect_uri`.
     */
    post_logout_redirect_uris?: Array<string>;
    /**
     * Provider is the IdP family the FE should instantiate a client for.
     */
    provider?: 'zitadel';
    /**
     * Scopes is the scope set the FE should request on the authorize
     * call.
     */
    scopes?: Array<string>;
};

