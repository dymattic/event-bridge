/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ActionCatalogEntry = {
    audit_permission_key?: string;
    family?: string;
    fires_when?: string;
    name?: string;
    operation_ids?: Array<string>;
    snapshot?: boolean;
    status?: 'active' | 'deprecated' | 'reserved';
    subject_types?: Array<string>;
    summary?: string;
    verb?: string;
    visibility?: 'public' | 'internal';
};

