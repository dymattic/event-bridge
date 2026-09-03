/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PDFRetiredOut = {
    /**
     * JSONEndpoint is the path to the JSON resource the FE should
     * fetch + render. Same value as the `Location` header.
     */
    json_endpoint?: string;
    /**
     * Message is the human-readable explanation.
     */
    message?: string;
    /**
     * Type is the deprecation kind. Always `pdf-retired`.
     */
    type?: 'pdf-retired';
};

