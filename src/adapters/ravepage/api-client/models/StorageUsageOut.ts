/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BucketUsageOut } from './BucketUsageOut';
import type { DBAggregateUsage } from './DBAggregateUsage';
import type { StorageDrift } from './StorageDrift';
export type StorageUsageOut = {
    buckets?: Array<BucketUsageOut>;
    db_aggregate?: DBAggregateUsage;
    drift?: StorageDrift;
};

