/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventSummary } from './EventSummary';
export type LiveOverviewResponse = {
    /**
     * EndingSoonCount is the number of live events ending in the next
     * 30 minutes.
     */
    ending_soon_count?: number;
    featured_live_events?: Array<EventSummary>;
    /**
     * LiveCount is the number of currently-live events.
     */
    live_count?: number;
    /**
     * PlatformBreakdown is platform-tag → live-count. Always non-nil ; emits `{}` when empty.
     */
    platform_breakdown?: Record<string, number>;
    /**
     * SceneEnergyScore is a normalized 0-1 score combining live count
     * with trend scores.
     */
    scene_energy_score?: number;
    /**
     * StartingSoonCount is the number of events starting in the next
     * 60 minutes.
     */
    starting_soon_count?: number;
    /**
     * TopGenres is the top-5 genre names across live events.
     */
    top_genres?: Array<string>;
    /**
     * TrendingEvents is the top-5 live events by trend_score.
     */
    trending_events?: Array<EventSummary>;
    /**
     * UpdatedAt is the response generation timestamp.
     */
    updated_at?: string;
};

