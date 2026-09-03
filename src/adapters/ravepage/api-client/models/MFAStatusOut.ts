/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MFAStatusMethodOut } from './MFAStatusMethodOut';
export type MFAStatusOut = {
    backup_codes_remaining?: number;
    methods?: Array<MFAStatusMethodOut>;
    mfa_enabled?: boolean;
};

