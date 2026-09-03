/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubeQuotaDay } from './YouTubeQuotaDay';
export type YouTubeQuotaReportResponse = {
    /**
     * Configured - YOUTUBE_API_KEY is set on social-platforms (the
     * crawl can run). Metering rows may still exist when false.
     */
    configured?: boolean;
    /**
     * CrawlBudgetPct - percentage of the daily limit the background
     * crawl may spend (fixed 60; the headroom is reserved for
     * interactive reads).
     */
    crawl_budget_pct?: number;
    /**
     * CrawlBudgetUnits - DailyLimitUnits * CrawlBudgetPct / 100.
     */
    crawl_budget_units?: number;
    /**
     * CrawlGated - today's spend has reached the crawl budget; crawl
     * ticks stop until the next day bucket.
     */
    crawl_gated?: boolean;
    /**
     * DailyLimitUnits - YT_DAILY_QUOTA_UNITS (default 10000). The
     * free-tier Google default; raising it requires a Google quota
     * increase, not payment.
     */
    daily_limit_units?: number;
    /**
     * History - most-recent-first day buckets, today included. Non-nil
     * (empty → `[]`).
     */
    history?: Array<YouTubeQuotaDay>;
    /**
     * Today - today's day bucket (UTC; zero-valued when no calls yet).
     */
    today?: YouTubeQuotaDay;
};

