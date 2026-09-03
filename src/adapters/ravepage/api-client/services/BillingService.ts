/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingAccountOut } from '../models/BillingAccountOut';
import type { BillingAccountUpdateIn } from '../models/BillingAccountUpdateIn';
import type { EntitlementOut } from '../models/EntitlementOut';
import type { InvoiceCreateIn } from '../models/InvoiceCreateIn';
import type { InvoiceFinalizeIn } from '../models/InvoiceFinalizeIn';
import type { InvoiceLineCreateIn } from '../models/InvoiceLineCreateIn';
import type { InvoiceOut } from '../models/InvoiceOut';
import type { MyBillingOut } from '../models/MyBillingOut';
import type { MyFeatureOut } from '../models/MyFeatureOut';
import type { MyUsageOut } from '../models/MyUsageOut';
import type { PlanOut } from '../models/PlanOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingService {
    /**
     * Get a billing account
     * Returns the billing account row for {account_id} when the caller is the owning user or a platform admin. BOLA-hardening: a caller who is neither the owner nor admin sees 404, not 403, so account ids cannot be enumerated.
     * @returns BillingAccountOut OK
     * @throws ApiError
     */
    public static getBillingAccount({
        accountId,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
    }): CancelablePromise<BillingAccountOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/accounts/{account_id}',
            path: {
                'account_id': accountId,
            },
            errors: {
                401: `Authentication required`,
                404: `Billing account not found`,
                422: `Invalid account id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update invoice metadata for a billing account
     * Owner-or-admin endpoint for editing display_name / legal_name / address / VAT ID / cf_stream_default_recording_mode. Any change to vat_id clears `vat_id_validated_at` so VIES re-validates on the next pass. BOLA-hardening: a caller who is neither the owner nor admin sees 404, not 403, so account ids cannot be enumerated.
     * @returns BillingAccountOut OK
     * @throws ApiError
     */
    public static updateBillingAccount({
        accountId,
        requestBody,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
        /**
         * Partial update
         */
        requestBody: BillingAccountUpdateIn,
    }): CancelablePromise<BillingAccountOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/billing/accounts/{account_id}',
            path: {
                'account_id': accountId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                404: `Billing account not found`,
                422: `Invalid request body`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Resolve entitlements for a billing account
     * Returns the resolved entitlement list (one entry per distinct feature key, sorted by key). Same authz as `GET /billing/accounts/{account_id}`. BOLA-hardening: a caller who is neither the owner nor admin sees 404, not 403.
     * @returns EntitlementOut OK
     * @throws ApiError
     */
    public static getBillingAccountEntitlements({
        accountId,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
    }): CancelablePromise<Array<EntitlementOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/accounts/{account_id}/entitlements',
            path: {
                'account_id': accountId,
            },
            errors: {
                401: `Authentication required`,
                404: `Billing account not found`,
                422: `Invalid account id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List invoices for a billing account
     * Returns the invoices for an account, newest first, limited to 200. Same authz as `GET /billing/accounts/{account_id}`. BOLA-hardening: not-owner-not-admin sees 404, not 403.
     * @returns InvoiceOut OK
     * @throws ApiError
     */
    public static listBillingAccountInvoices({
        accountId,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
    }): CancelablePromise<Array<InvoiceOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/accounts/{account_id}/invoices',
            path: {
                'account_id': accountId,
            },
            errors: {
                401: `Authentication required`,
                404: `Billing account not found`,
                422: `Invalid account id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a draft invoice
     * Snapshots the account's current address / VAT ID, resolves the tax scheme, returns a `draft` invoice with zero lines. Add lines via `POST /billing/invoices/{invoice_id}/lines`, then finalize (lands in a later cycle). Authz: owner-or-admin on the billing account. BOLA-hardening: not-owner-not-admin sees 404 with "Billing account not found".
     * @returns InvoiceOut Created
     * @throws ApiError
     */
    public static createInvoiceDraft({
        accountId,
        requestBody,
    }: {
        /**
         * Billing account ID (bare UUID or `ba_<uuid>`)
         */
        accountId: any,
        /**
         * Optional notes + delivery_date
         */
        requestBody?: InvoiceCreateIn,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/accounts/{account_id}/invoices',
            path: {
                'account_id': accountId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Account missing §14 UStG required fields`,
                401: `Authentication required`,
                404: `Billing account not found`,
                422: `Invalid request body`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a single invoice
     * Returns the invoice row + its line items. Authz: the caller must own (or be admin on) the invoice's parent billing account. BOLA-hardening: not-owner-not-admin sees 404, not 403, so invoice ids cannot be enumerated.
     * @returns InvoiceOut OK
     * @throws ApiError
     */
    public static getInvoice({
        invoiceId,
    }: {
        /**
         * Invoice ID (bare UUID or `inv_<uuid>`)
         */
        invoiceId: any,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/invoices/{invoice_id}',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                401: `Authentication required`,
                404: `Invoice not found`,
                422: `Invalid invoice id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Finalize a draft invoice
     * Computes per-line VAT from the (re-resolved) tax scheme, assigns the next sequential invoice number under a `SELECT ... FOR UPDATE` on `invoice_number_counters` (gap-free German-tax invariant), stamps `issue_date`/`issued_at`/`content_hash`, flips `status` to `issued`. After this call the invoice is GoBD-immutable - further corrections require a credit-note invoice. Authz: owner-or-admin on the parent billing account; cross-account id-grab returns 404 with detail "Invoice not found". Returns 409 when the invoice is not in draft status OR has no lines.
     * @returns InvoiceOut OK
     * @throws ApiError
     */
    public static finalizeInvoice({
        invoiceId,
        requestBody,
    }: {
        /**
         * Invoice ID (bare UUID or `inv_<uuid>`)
         */
        invoiceId: any,
        /**
         * Optional issue_date override
         */
        requestBody?: InvoiceFinalizeIn,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/invoices/{invoice_id}/finalize',
            path: {
                'invoice_id': invoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                404: `Invoice not found`,
                409: `Invoice not in draft status or has no lines`,
                422: `Invalid request body`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Render the invoice as HTML
     * Returns the German-tax-compliant HTML body for the invoice (Rechnung). Same authz as `GET /billing/invoices/{invoice_id}` - owner-or-admin on the parent billing account; BOLA-hardening returns 404 on not-owner. Useful for FE preview pane and email export.
     * @returns string HTML body
     * @throws ApiError
     */
    public static getInvoiceHtml({
        invoiceId,
    }: {
        /**
         * Invoice ID (bare UUID or `inv_<uuid>`)
         */
        invoiceId: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/invoices/{invoice_id}/html',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                401: `Authentication required`,
                404: `Invoice not found`,
                422: `Invalid invoice id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a line to a draft invoice
     * Appends one line to the draft. Position is auto-assigned (count+1). VAT rate stays 0 until finalize. Authz: owner-or-admin on the parent billing account; BOLA-hardening: cross-account id-grab returns 404 with detail "Invoice not found". Returns 409 when the invoice is already finalized/void.
     * @returns InvoiceOut OK
     * @throws ApiError
     */
    public static addInvoiceLine({
        invoiceId,
        requestBody,
    }: {
        /**
         * Invoice ID (bare UUID or `inv_<uuid>`)
         */
        invoiceId: any,
        /**
         * Line payload
         */
        requestBody: InvoiceLineCreateIn,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/invoices/{invoice_id}/lines',
            path: {
                'invoice_id': invoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                404: `Invoice not found`,
                409: `Invoice not in draft status`,
                422: `Invalid line payload`,
                500: `Internal error`,
            },
        });
    }
    /**
     * PDF retired - fetch JSON + render client-side
     * Returns 410 Gone with `Location: /billing/invoices/{invoice_id}` pointing at the JSON resource; FE renders PDF client-side.
     * @returns void
     * @throws ApiError
     */
    public static getInvoicePdf({
        invoiceId,
    }: {
        /**
         * Invoice ID (bare UUID or `inv_<uuid>`)
         */
        invoiceId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/invoices/{invoice_id}/pdf',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                410: `Gone`,
            },
        });
    }
    /**
     * Get the current user's billing state
     * Returns the caller's personal billing account, its active subscription, resolved entitlements, and any group-owned billing accounts the caller can see. Auto-creates the personal billing account on first call.
     * @returns MyBillingOut OK
     * @throws ApiError
     */
    public static getMyBilling(): CancelablePromise<MyBillingOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/me',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Resolve the caller's feature bundle
     * One row per feature key: resolved flag state (global default → group override → user override), paywall entitlement (plan + grants), and the single `allowed` gate the FE should render from. Pass `group_id` when acting in a group context to apply that group's overrides.
     * @returns MyFeatureOut OK
     * @throws ApiError
     */
    public static getMyFeatures({
        groupId,
    }: {
        /**
         * Acting-as group ID (`grp_<uuid>` or bare UUID)
         */
        groupId?: any,
    }): CancelablePromise<Array<MyFeatureOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/me/features',
            query: {
                'group_id': groupId,
            },
            errors: {
                401: `Authentication required`,
                422: `Invalid group_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get the caller's usage snapshot
     * Returns one meter entry per metered feature the caller's personal billing account is entitled to. Auto-creates the personal account on first call.
     * @returns MyUsageOut OK
     * @throws ApiError
     */
    public static getMyUsage(): CancelablePromise<MyUsageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/me/usage',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List purchasable plans
     * Public plan catalog. Use this to render a pricing page. Plans with `is_public=false` are hidden from this endpoint and reachable only via admin tooling.
     * @returns PlanOut OK
     * @throws ApiError
     */
    public static listBillingPlans(): CancelablePromise<Array<PlanOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/plans',
            errors: {
                500: `Plan catalog unavailable`,
            },
        });
    }
}
