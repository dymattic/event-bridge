/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HetznerCostSummaryOut } from './HetznerCostSummaryOut';
import type { PerUserStorageOut } from './PerUserStorageOut';
export type StorageOut = {
    /**
     * PerUser is nil
     * (infra-mgmt holds no media-table grant). See package doc.
     */
    per_user?: PerUserStorageOut;
    /**
     * SystemWide is real - Hetzner block-storage (volumes + snapshots).
     */
    system_wide?: HetznerCostSummaryOut;
};

