/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubeQuotaDayOut } from './YouTubeQuotaDayOut';
export type YouTubeQuotaOut = {
    /**
     * Configured - YOUTUBE_API_KEY set on social-platforms.
     */
    configured?: boolean;
    /**
     * CrawlBudgetPct - share of the daily limit the background crawl
     * may spend (60; headroom reserved for interactive reads).
     */
    crawl_budget_pct?: number;
    crawl_budget_units?: number;
    /**
     * CrawlGated - today's spend reached the crawl budget; crawl ticks
     * stop until the next UTC day bucket.
     */
    crawl_gated?: boolean;
    /**
     * DailyLimitUnits - YT_DAILY_QUOTA_UNITS (Google free-tier default
     * 10000; raising it is a Google quota request, not payment).
     */
    daily_limit_units?: number;
    /**
     * History - most-recent-first day buckets (today included), up to
     * 30. Non-nil (empty → `[]`).
     */
    history?: Array<YouTubeQuotaDayOut>;
    /**
     * Today - today's UTC day bucket (zero-valued when no calls yet).
     */
    today?: YouTubeQuotaDayOut;
};

