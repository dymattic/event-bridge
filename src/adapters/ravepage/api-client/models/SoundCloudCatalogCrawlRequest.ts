/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudCatalogCrawlRequest = {
    /**
     * ProviderID - the SC numeric user id (as string). Optional;
     * carried for logging + idempotency observability only.
     */
    provider_id?: string;
    /**
     * UserID - the Rave user UUID whose SoundCloud catalog to crawl.
     * Required. Matches the just-upserted user_oauth_links row.
     */
    user_id?: string;
};

