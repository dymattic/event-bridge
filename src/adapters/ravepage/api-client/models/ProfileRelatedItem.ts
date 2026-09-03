/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileRelatedItem = {
    /**
     * DisplayName is the entity's display name. Optional.
     */
    display_name?: string;
    /**
     * EntityID is the entity row id.
     */
    entity_id?: string;
    /**
     * EntityType names the underlying entity kind (user, performer,
     * group, club, event, …).
     */
    entity_type?: string;
    /**
     * Score is the personalization score in [0, 1]; null when
     * unranked or on chronological fallback.
     */
    score?: number;
    /**
     * Slug is the entity's URL slug. Optional.
     */
    slug?: string;
};

