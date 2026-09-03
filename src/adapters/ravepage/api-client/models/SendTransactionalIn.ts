/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendTransactionalIn = {
    /**
     * Category - REQUIRED. One of the MailCategory* constants
     * above. Producer maps to the existing notifications
     * smtp.MailCategory enum.
     */
    category?: string;
    /**
     * EntityRefID - optional X-Entity-Ref-ID. Prevents Gmail from
     * collapsing similar notifications into one thread.
     */
    entity_ref_id?: string;
    /**
     * FeedbackStream - optional override of the Feedback-ID leaf
     * segment (per-campaign reputation).
     */
    feedback_stream?: string;
    /**
     * HTMLBody - optional HTML alternative. When set the producer
     * builds a multipart/alternative envelope.
     */
    html_body?: string;
    /**
     * Subject - required. ≤ 998 chars (RFC 5322 line length cap;
     * producer enforces).
     */
    subject?: string;
    /**
     * TextBody - required text-only fallback for multipart/
     * alternative.
     */
    text_body?: string;
    /**
     * To - recipient. Required. Must be `local@domain.tld` shape.
     */
    to?: string;
};

