/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventRuleCreateIn = {
    /**
     * Description is the optional rule body.
     */
    description?: string;
    /**
     * DisplayOrder is the integer sort key. ..)` -
     * defaults to 0 when absent. Pointer here so the route layer can
     * distinguish "omitted" (→ 0) from "explicit 0".
     */
    display_order?: number;
    /**
     * Title is the short rule title. .., max_length=
     * 255)`.
     */
    title?: string;
};

