/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AppSettingValueOut = {
    /**
     * Default is the hard-coded default used when unset.
     */
    default?: any;
    /**
     * Key is the setting identifier (e.g. "image_variant_formats").
     */
    key?: string;
    /**
     * Value is the current setting value. JSON-serialisable scalar
     * or object. When the underlying row is absent the service falls
     * back to Default .
     */
    value?: any;
};

