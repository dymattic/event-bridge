/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventRuleID } from './EventRuleID';
import type { GroupID } from './GroupID';
export type EventRuleOut = {
    /**
     * CreatedAt is the row creation timestamp (UTC).
     */
    created_at?: string;
    /**
     * Description is the optional rule body. JSON null when NULL in DB.
     */
    description?: string;
    /**
     * DisplayOrder is the integer used to sort rules on the event
     * detail page. Defaults to 0.
     */
    display_order?: number;
    /**
     * EventID is the parent event reference for event-scoped rules.
     * JSON null for group-scoped rules surfaced by the LIST endpoint.
     */
    event_id?: EventID;
    /**
     * GroupID is the parent group reference for group-scoped rules.
     * JSON null for event-scoped rules.
     */
    group_id?: GroupID;
    /**
     * ID is the canonical prefixed event-rule identifier. Wire form:
     * `erl_<uuid>`.
     */
    id?: EventRuleID;
    /**
     * IsActive is whether this rule is currently shown.
     */
    is_active?: boolean;
    /**
     * Title is the short rule title (1-255 chars).
     */
    title?: string;
};

