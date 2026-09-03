/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StreamConsumerHealth } from './StreamConsumerHealth';
export type StreamHealth = {
    bytes?: number;
    consumers?: Array<StreamConsumerHealth>;
    messages?: number;
    name?: string;
    subjects?: Array<string>;
};

