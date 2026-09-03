/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingExportService {
    /**
     * DAC7/PStTG seller aggregate (scaffold; XML pending)
     * Returns the §15 PStTG seller-aggregate data bundle. XML rendering against the BZSt XSD is out of scope pending legal review (see `notes` in the response). Admin-only; year 2023-2100 (DAC7 regulation's first reporting year).
     * @returns any DAC7 aggregate
     * @throws ApiError
     */
    public static adminExportDac7({
        year,
    }: {
        /**
         * Reporting year (2023-2100)
         */
        year: any,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/billing/export/dac7.json',
            query: {
                'year': year,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid year`,
                500: `Internal error`,
                503: `Tax export pipeline not configured`,
            },
        });
    }
    /**
     * Export bookings as DATEV Buchungsstapel CSV
     * Returns a DATEV-import-compatible CSV (UTF-8 BOM, `;`-separated, EXTF 510 header). Admin-only; non-admin → 403. Year 2020-2100 required; month 1-12 optional (full-year when omitted). Booking text is `Rechnung <number> (<customer name, 30 char cap>)`.
     * @returns string CSV body (UTF-8 BOM + ;-separated)
     * @throws ApiError
     */
    public static adminExportDatevCsv({
        year,
        month,
    }: {
        /**
         * Reporting year (2020-2100)
         */
        year: any,
        /**
         * Optional month filter (1-12)
         */
        month?: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/billing/export/datev.csv',
            query: {
                'year': year,
                'month': month,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid year or month`,
                500: `Internal error`,
                503: `Tax export pipeline not configured`,
            },
        });
    }
    /**
     * GoBD audit bundle for a year (ZIP with invoices + hashes)
     * Returns a deterministic ZIP containing `manifest.json` (per-invoice metadata + hashes), `invoices.csv` (tabular summary), `invoices/<number>.json` (canonical JSON per invoice), and `hashes.txt` (SHA-256 manifest). Bytes are stable across regenerations when inputs match - auditors can independently verify. Admin-only; year 2020-2100 required.
     * @returns string ZIP body (application/zip)
     * @throws ApiError
     */
    public static adminExportGobd({
        year,
    }: {
        /**
         * Reporting year (2020-2100)
         */
        year: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/billing/export/gobd.zip',
            query: {
                'year': year,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid year`,
                500: `Internal error`,
                503: `Tax export pipeline not configured`,
            },
        });
    }
    /**
     * Monthly UStVA summary (ELSTER KZ fields)
     * Returns the ELSTER UStVA field bundle for the period - KZ_81 (19% net), KZ_86 (7% net), KZ_21 (EU services), KZ_41 (EU intra supplies), KZ_43 (non-EU export), KZ_89 (reverse-charge received), KZ_66 (input VAT), plus `tax_owed_cents`. Admin-only; non-admin → 403. Year 2020-2100 AND month 1-12 BOTH required.
     * @returns any UStVA field bundle
     * @throws ApiError
     */
    public static adminExportUstva({
        year,
        month,
    }: {
        /**
         * Reporting year (2020-2100)
         */
        year: any,
        /**
         * Reporting month (1-12)
         */
        month: any,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/billing/export/ustva.json',
            query: {
                'year': year,
                'month': month,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid year or month`,
                500: `Internal error`,
                503: `Tax export pipeline not configured`,
            },
        });
    }
}
