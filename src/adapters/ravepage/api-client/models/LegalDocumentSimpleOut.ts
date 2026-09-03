/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LegalDocumentSimpleOut = {
    /**
     * Content is the markdown body of the document.
     */
    content?: string;
    /**
     * LastUpdated is the date of the last edit, formatted
     * "YYYY-MM-DD". UTC. Date-only - NOT a full datetime.
     * `doc.updated_at.date().isoformat()`.
     */
    last_updated?: string;
    /**
     * Title is the human-readable document title, e.g. "Privacy
     * Policy" or "Terms of Service".
     */
    title?: string;
};

