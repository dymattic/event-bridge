/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkVerifyItem } from './LinkVerifyItem';
export type LinkVerifyRequest = {
    /**
     * Items - the links to verify (1-50). Over-long batches are truncated,
     * not rejected.
     */
    items?: Array<LinkVerifyItem>;
};

