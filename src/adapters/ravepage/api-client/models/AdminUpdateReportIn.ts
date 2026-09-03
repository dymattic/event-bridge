/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserID } from './UserID';
export type AdminUpdateReportIn = {
    /**
     * AssignedToUserID is the prefixed-id ("usr_<uuid>") of the
     * triage assignee. nil → unchanged.
     */
    assigned_to_user_id?: UserID;
    /**
     * Priority is one of urgent / high / medium / low / none.
     */
    priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none';
    /**
     * Status is the target status: open / triaged / in_progress /
     * resolved / closed / wont_fix. Transition validated against
     * STATUS_TRANSITIONS in service layer.
     */
    status?: 'open' | 'triaged' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';
    /**
     * Tags is the replacement tag set. nil → unchanged.
     */
    tags?: Array<string>;
};

