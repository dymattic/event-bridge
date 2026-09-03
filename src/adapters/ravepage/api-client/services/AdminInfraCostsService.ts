/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostHistoryOut } from '../models/CostHistoryOut';
import type { CostSnapshotOut } from '../models/CostSnapshotOut';
import type { UnitPricesOut } from '../models/UnitPricesOut';
import type { YouTubeQuotaOut } from '../models/YouTubeQuotaOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminInfraCostsService {
    /**
     * Current Hetzner run-rate + month-end projection
     * Latest persisted cost snapshot (monthly run-rate net +
     * gross cents, projected month-end, per-resource-class
     * breakdown, resource counts, system-wide storage). On a
     * cold miss a live capture is attempted; if Hetzner is
     * unreachable the response is `stale=true` with zero money.
     * @returns CostSnapshotOut OK
     * @throws ApiError
     */
    public static getAdminInfraCostsCurrent(): CancelablePromise<CostSnapshotOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/infra/costs/current',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                503: `Service Unavailable`,
            },
        });
    }
    /**
     * Recent Hetzner cost snapshots (trend)
     * Up to `limit` recent snapshots, newest first, for
     * charting the run-rate trend. Default 30, max 200.
     * @returns CostHistoryOut OK
     * @throws ApiError
     */
    public static getAdminInfraCostsHistory({
        limit,
    }: {
        /**
         * Max snapshots (default 30, max 200)
         */
        limit?: any,
    }): CancelablePromise<CostHistoryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/infra/costs/history',
            query: {
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                503: `Service Unavailable`,
            },
        });
    }
    /**
     * Force a live Hetzner cost capture
     * Fetches the live fleet + pricing, computes + persists a
     * fresh snapshot, and returns it (`cached=false`). Use
     * sparingly - the scheduler already captures every ~15min.
     * @returns CostSnapshotOut OK
     * @throws ApiError
     */
    public static postAdminInfraCostsRefresh(): CancelablePromise<CostSnapshotOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/infra/costs/refresh',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                502: `Hetzner unreachable`,
                503: `Service Unavailable`,
            },
        });
    }
    /**
     * Per-unit infra cost inputs for the billing plan editor
     * Live Hetzner unit prices (block-storage per GB-month,
     * snapshot per GB-month, traffic per TB, VAT rate bps) the
     * admin plan editor consumes to price metered features.
     * `stale=true` + zeros when Hetzner is unreachable.
     * @returns UnitPricesOut OK
     * @throws ApiError
     */
    public static getAdminInfraCostsUnitPrices(): CancelablePromise<UnitPricesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/infra/costs/unit-prices',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                503: `Service Unavailable`,
            },
        });
    }
    /**
     * Self-metered YouTube Data API quota insights
     * Today's unit spend vs YT_DAILY_QUOTA_UNITS, the 60%
     * crawl-budget gate, per-endpoint split, and up to 30
     * day-bucket history rows - self-metered on social-
     * platforms (a plain API key cannot read Google-side
     * quota; Cloud Monitoring needs a service account). The
     * API is free within quota - the panel tracks headroom,
     * not spend.
     * @returns YouTubeQuotaOut OK
     * @throws ApiError
     */
    public static getAdminInfraCostsYouTubeQuota({
        days,
    }: {
        /**
         * History day buckets (default 30, max 30)
         */
        days?: any,
    }): CancelablePromise<YouTubeQuotaOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/infra/costs/youtube-quota',
            query: {
                'days': days,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                502: `social-platforms unreachable`,
                503: `Service Unavailable`,
            },
        });
    }
}
