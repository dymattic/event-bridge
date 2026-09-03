/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InvoiceLineOut = {
    /**
     * Description is the line description.
     */
    description?: string;
    /**
     * ID is the prefixed line identifier ("invl_<uuid>").
     */
    id?: string;
    /**
     * LineGrossCents is the line gross total (cents).
     */
    line_gross_cents?: number;
    /**
     * LineNetCents is the line net total (cents).
     */
    line_net_cents?: number;
    /**
     * LineVatCents is the line VAT (cents).
     */
    line_vat_cents?: number;
    /**
     * Position is the 1-based position on the invoice.
     */
    position?: number;
    /**
     * Quantity is the line quantity (fractional supported).
     */
    quantity?: number;
    /**
     * Unit is the unit label ("GB", "minutes", "items"...). nil
     * serializes as null.
     */
    unit?: string;
    /**
     * UnitPriceNetCents is the unit price net in EUR cents.
     */
    unit_price_net_cents?: number;
    /**
     * UsageFeatureKey is the optional usage feature the line bills.
     */
    usage_feature_key?: string;
    /**
     * VatCategory is one of "standard" | "reduced" | "zero".
     */
    vat_category?: string;
    /**
     * VatRateBPS is the VAT rate in basis points (1900 = 19%).
     */
    vat_rate_bps?: number;
};

