/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkVerifyResult } from './LinkVerifyResult';
export type LinkVerifyResponse = {
    /**
     * Results - one per request item. Non-nil (empty ⇒ `[]`). Correlate
     * back by Ref (order is not guaranteed).
     */
    results?: Array<LinkVerifyResult>;
};

