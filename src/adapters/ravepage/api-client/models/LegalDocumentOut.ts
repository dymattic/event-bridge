/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LegalDocumentOut = {
    /**
     * Content is the markdown body.
     */
    content?: string;
    /**
     * ID is the document's prefixed UUID (`leg_<uuid>`).
     */
    id?: string;
    /**
     * Slug is the URL-safe document identifier (e.g.
     * "privacy-policy" / "terms-of-service").
     */
    slug?: string;
    /**
     * Title is the human-readable title.
     */
    title?: string;
    /**
     * UpdatedAt is the last-edit timestamp (RFC3339 UTC).
     */
    updated_at?: string;
};

