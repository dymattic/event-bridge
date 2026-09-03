/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkshopComponentUpdateIn = {
    category?: string;
    component_type?: 'css' | 'css-js';
    default_params?: Record<string, any>;
    description?: string;
    is_published?: boolean;
    param_schema?: Record<string, any>;
    preview_video_upload_id?: string;
    price_amount?: number;
    price_type?: 'free' | 'premium' | 'donation';
    render_data?: Record<string, any>;
    tags?: Array<string>;
    thumbnail_upload_id?: string;
    title?: string;
};

