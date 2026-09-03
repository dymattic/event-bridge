/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceLineOut } from './InvoiceLineOut';
export type InvoiceOut = {
    /**
     * BillingAccountID is the prefixed billing-account identifier
     * ("ba_<uuid>") this invoice belongs to.
     */
    billing_account_id?: string;
    /**
     * ContentHash is the SHA-256 GoBD integrity hash, or null on
     * drafts.
     */
    content_hash?: string;
    /**
     * Currency is the invoice currency (ISO-4217).
     */
    currency?: string;
    /**
     * CustomerAddress is the customer address snapshot.
     */
    customer_address?: string;
    /**
     * CustomerCountryCode is the customer country (ISO-3166-1
     * alpha-2).
     */
    customer_country_code?: string;
    /**
     * CustomerName is the customer snapshot.
     */
    customer_name?: string;
    /**
     * CustomerVatID is the customer USt-IdNr. (VIES-validated).
     */
    customer_vat_id?: string;
    /**
     * DeliveryDate is the Leistungsdatum (§14 Abs. 4 Nr. 6 UStG).
     */
    delivery_date?: string;
    /**
     * DueDate is the invoice due date.
     */
    due_date?: string;
    /**
     * ID is the prefixed invoice identifier ("inv_<uuid>"). md`.
     */
    id?: string;
    /**
     * InvoiceNumber is the sequential invoice number ("RG-2026-
     * 000042"), or null on drafts (assigned at finalize time).
     */
    invoice_number?: string;
    /**
     * IssueDate is the Steuerliches Rechnungsdatum, set at finalize
     * time. nil on drafts.
     */
    issue_date?: string;
    /**
     * Lines is the list of line items. MUST emit `[]` not `null`
     * when zero lines.
     */
    lines?: Array<InvoiceLineOut>;
    /**
     * Notes is the mandatory scheme notes + user-supplied remarks.
     */
    notes?: string;
    /**
     * Status is one of "draft" | "issued" | "void".
     */
    status?: 'draft' | 'issued' | 'void';
    /**
     * SubtotalNetCents is the sum of line nets.
     */
    subtotal_net_cents?: number;
    /**
     * SupplierAddress is the supplier address snapshot.
     */
    supplier_address?: string;
    /**
     * SupplierName is the supplier snapshot.
     */
    supplier_name?: string;
    /**
     * SupplierVatID is the supplier USt-IdNr. at issue time.
     */
    supplier_vat_id?: string;
    /**
     * TaxScheme is one of "domestic" | "reverse_charge" | "oss_b2c"
     * | "export_non_eu" | "kleinunternehmer".
     */
    tax_scheme?: string;
    /**
     * TotalGrossCents is the grand total.
     */
    total_gross_cents?: number;
    /**
     * TotalVatCents is the total VAT.
     */
    total_vat_cents?: number;
};

