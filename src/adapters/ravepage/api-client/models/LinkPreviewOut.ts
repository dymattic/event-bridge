/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkPreviewImageOut } from './LinkPreviewImageOut';
export type LinkPreviewOut = {
    /**
     * AuthorName is article:author or meta author, empty when absent.
     */
    author_name?: string;
    /**
     * CacheTTLSeconds is how long this result stays valid; the FE may
     * hold it that long before asking again.
     */
    cache_ttl_seconds?: number;
    /**
     * Description is the page summary, empty when absent.
     */
    description?: string;
    /**
     * FetchedAt is when we retrieved the page, RFC3339 UTC.
     */
    fetched_at?: string;
    /**
     * IconProxyURL is the site icon through our proxy, empty when the
     * page declared none.
     */
    icon_proxy_url?: string;
    /**
     * Images are candidate preview images, best first. May be empty.
     */
    images?: Array<LinkPreviewImageOut>;
    /**
     * Locale is og:locale or the html lang attribute, empty when absent.
     */
    locale?: string;
    /**
     * OGType is the raw og:type value, empty when absent.
     */
    og_type?: string;
    /**
     * ResolvedURL is the final URL after redirects. Safe to expose: the
     * user chose to paste this link, and following it is their click.
     */
    resolved_url?: string;
    /**
     * SiteName is the publisher name from og:site_name, empty when absent.
     */
    site_name?: string;
    /**
     * SourceHost is the hostname of ResolvedURL, always populated.
     */
    source_host?: string;
    /**
     * Title is the page title, empty when the page declared none.
     */
    title?: string;
    /**
     * TwitterCard is the declared card type, empty when absent.
     */
    twitter_card?: string;
    /**
     * URL is the normalised form of the requested URL.
     */
    url?: string;
};

