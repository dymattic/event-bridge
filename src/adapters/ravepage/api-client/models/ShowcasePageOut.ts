/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShowcaseCollaboratorItem } from './ShowcaseCollaboratorItem';
import type { ShowcasePageSummary } from './ShowcasePageSummary';
import type { ShowcaseSectionItem } from './ShowcaseSectionItem';
export type ShowcasePageOut = {
    collaborators?: Array<ShowcaseCollaboratorItem>;
    page?: ShowcasePageSummary;
    page_version?: number;
    /**
     * RequestedSlug is the slug the caller asked for when SlugAdjusted is
     * true (the stored slug is in `page.slug`). Empty otherwise.
     */
    requested_slug?: string;
    schema_version?: number;
    sections?: Array<ShowcaseSectionItem>;
    /**
     * SlugAdjusted is true when the create/update auto-suffixed the
     * requested slug to avoid a global collision (FE should notify the
     * user the stored slug differs). Always false on reads.
     */
    slug_adjusted?: boolean;
    user_role?: string;
};

