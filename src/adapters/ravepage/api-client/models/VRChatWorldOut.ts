/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VRChatWorldOut = {
    /**
     * Author's user id.
     */
    authorId?: string;
    /**
     * Author's display name.
     */
    authorName?: string;
    /**
     * Max player capacity.
     */
    capacity?: number;
    /**
     * Creation timestamp.
     */
    created_at?: string;
    /**
     * World description.
     */
    description?: string;
    /**
     * Number of favorites.
     */
    favorites?: number;
    /**
     * Heat / trending score.
     */
    heat?: number;
    /**
     * World id.
     */
    id?: string;
    /**
     * World image URL.
     */
    imageUrl?: string;
    /**
     * Active instances (VRChat-opaque shape).
     */
    instances?: Array<Record<string, any>>;
    /**
     * Labs publication date.
     */
    labsPublicationDate?: string;
    /**
     * World name.
     */
    name?: string;
    /**
     * Current occupants.
     */
    occupants?: number;
    /**
     * World organization.
     */
    organization?: string;
    /**
     * Popularity score.
     */
    popularity?: number;
    /**
     * Current private occupants.
     */
    privateOccupants?: number;
    /**
     * Current public occupants.
     */
    publicOccupants?: number;
    /**
     * Publication date.
     */
    publicationDate?: string;
    /**
     * Recommended capacity.
     */
    recommendedCapacity?: number;
    /**
     * Release status (public/private/hidden).
     */
    releaseStatus?: string;
    /**
     * World tags.
     */
    tags?: Array<string>;
    /**
     * Thumbnail image URL.
     */
    thumbnailImageUrl?: string;
    /**
     * Last update timestamp.
     */
    updated_at?: string;
    /**
     * World version.
     */
    version?: number;
    /**
     * Number of visits.
     */
    visits?: number;
};

