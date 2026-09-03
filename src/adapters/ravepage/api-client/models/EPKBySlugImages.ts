/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKImageRef } from './EPKImageRef';
export type EPKBySlugImages = {
    /**
     * Banners are the `kind='banner'` images.
     */
    banners?: Array<EPKImageRef>;
    /**
     * Gallery are everything else (`kind != logo/banner`).
     */
    gallery?: Array<EPKImageRef>;
    /**
     * Logos are the `kind='logo'` images.
     */
    logos?: Array<EPKImageRef>;
};

