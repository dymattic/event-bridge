/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricVisibilitySetIn = {
    /**
     * Audience to apply. `private` keys the rows by subject_id;
     * every other value keys them by user_id, because sharing means
     * the link itself is disclosed.
     *
     * `mutuals` means people you and they follow each other. It is NOT
     * the same set as your accepted friends: mutual follow is the
     * PRECONDITION for a friend request, so friends are a subset at
     * the moment the request is sent - but unfollowing does not delete
     * a friendship, so a friend who later unfollowed is no longer a
     * mutual and loses access to a `mutuals` stat.
     */
    audience?: 'private' | 'followers' | 'mutuals' | 'public';
    /**
     * StatKey to change.
     */
    stat_key?: 'event' | 'track' | 'club' | 'group' | 'artist' | 'label' | 'genre' | 'release';
};

