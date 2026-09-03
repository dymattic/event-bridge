/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShareGrantEntityKind } from './ShareGrantEntityKind';
export type ShareGrantOut = {
    /**
     * CreatedAt is the RFC3339 creation timestamp.
     */
    created_at?: string;
    /**
     * EntityID is `pl_<uuid>` for kind=playlist; the owner's bare user
     * UUID for kind=library.
     */
    entity_id?: string;
    /**
     * EntityKind: playlist | library.
     */
    entity_kind?: ShareGrantEntityKind;
    /**
     * GrantedBy is the user who issued the grant, null when unknown.
     */
    granted_by?: string;
    /**
     * ID is the prefixed grant id (`shr_<uuid>`).
     */
    id?: string;
    /**
     * MinGroupRole - group grants only: minimum group-membership role
     * (owner|admin|manager|member) required to inherit. Null = any member.
     */
    min_group_role?: string;
    /**
     * OwnerUserID owns the shared entity.
     */
    owner_user_id?: string;
    /**
     * PrincipalID is the granted user/group UUID.
     */
    principal_id?: string;
    /**
     * PrincipalType: user | group.
     */
    principal_type?: string;
    /**
     * Role: viewer | editor (library grants are always viewer).
     */
    role?: string;
    /**
     * Status: pending | accepted.
     */
    status?: 'pending' | 'accepted';
    /**
     * UpdatedAt is the RFC3339 last-write timestamp.
     */
    updated_at?: string;
};

