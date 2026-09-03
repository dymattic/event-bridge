/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventImageCreateIn = {
    /**
     * Caption is the optional caption.
     */
    caption?: string;
    /**
     * ImageType is the optional category. When the field is `null` explicit, the column
     * stays NULL.
     */
    image_type?: string;
    /**
     * SortOrder is the integer sort key.
     * The
     * `omitempty` AND on field absence); the column has `default=0`
     * server-side at
     */
    sort_order?: number;
    /**
     * URL is the image URL. .., description="Image URL")`
     * - REQUIRED, no default, no validator on shape.
     */
    url?: string;
};

