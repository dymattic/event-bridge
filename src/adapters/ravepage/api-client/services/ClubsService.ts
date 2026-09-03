/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClubClaimCreateIn } from '../models/ClubClaimCreateIn';
import type { ClubClaimOut } from '../models/ClubClaimOut';
import type { ClubClaimReviewIn } from '../models/ClubClaimReviewIn';
import type { ClubCreateIn } from '../models/ClubCreateIn';
import type { ClubOut } from '../models/ClubOut';
import type { ClubResidentCreateIn } from '../models/ClubResidentCreateIn';
import type { ClubResidentOut } from '../models/ClubResidentOut';
import type { ClubResidentUpdateIn } from '../models/ClubResidentUpdateIn';
import type { ClubShowcaseResult } from '../models/ClubShowcaseResult';
import type { ClubStaffCreateIn } from '../models/ClubStaffCreateIn';
import type { ClubStaffOut } from '../models/ClubStaffOut';
import type { ClubStaffUpdateIn } from '../models/ClubStaffUpdateIn';
import type { ClubUpdateIn } from '../models/ClubUpdateIn';
import type { ClubVerificationInitiateIn } from '../models/ClubVerificationInitiateIn';
import type { ClubVerificationOut } from '../models/ClubVerificationOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClubsService {
    /**
     * List clubs
     * Returns clubs filtered by optional name (q), city,
     * country, owning group, or unclaimed-only flag. Sorted
     * by name. Anonymous endpoint - no auth required.
     * @returns ClubOut OK
     * @throws ApiError
     */
    public static listClubs({
        q,
        city,
        country,
        groupId,
        unclaimedOnly,
    }: {
        /**
         * Name ILIKE filter
         */
        q?: any,
        /**
         * City ILIKE filter
         */
        city?: any,
        /**
         * Country ILIKE filter
         */
        country?: any,
        /**
         * Owning group (bare UUID or grp_<uuid>)
         */
        groupId?: any,
        /**
         * Filter to is_claimed=false (default false)
         */
        unclaimedOnly?: any,
    }): CancelablePromise<Array<ClubOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clubs',
            query: {
                'q': q,
                'city': city,
                'country': country,
                'group_id': groupId,
                'unclaimed_only': unclaimedOnly,
            },
            errors: {
                400: `Invalid query param`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a new club
     * Creates a new club owned by the authenticated caller.
     * When `group_id` is set, the caller MUST be an
     * owner/admin/manager of that group (or a platform
     * admin). The new club's slug must be unique.
     * @returns ClubOut Created
     * @throws ApiError
     */
    public static createClub({
        requestBody,
    }: {
        /**
         * Club creation payload
         */
        requestBody: ClubCreateIn,
    }): CancelablePromise<ClubOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/clubs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure`,
                401: `Authentication required`,
                403: `Caller not authorized for the requested group`,
                409: `Slug already exists`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a club
     * Returns a single club by id. Anonymous endpoint - no
     * auth required. Accepts both bare UUID and prefixed
     * `club_<uuid>` forms.
     * @returns ClubOut OK
     * @throws ApiError
     */
    public static getClub({
        clubId,
    }: {
        /**
         * Club id (bare UUID or club_<uuid>)
         */
        clubId: any,
    }): CancelablePromise<ClubOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clubs/{club_id}',
            path: {
                'club_id': clubId,
            },
            errors: {
                400: `Invalid club_id`,
                404: `Club not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a club
     * Updates an existing club. The caller MUST be the club
     * owner / staff (owner|manager), a group owner/admin/
     * manager when the club is group-owned, or a platform
     * admin. Empty body is a no-op.
     * @returns ClubOut OK
     * @throws ApiError
     */
    public static updateClub({
        clubId,
        requestBody,
    }: {
        /**
         * Club id (bare UUID or club_<uuid>)
         */
        clubId: any,
        /**
         * Patch body - every field optional
         */
        requestBody: ClubUpdateIn,
    }): CancelablePromise<ClubOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/clubs/{club_id}',
            path: {
                'club_id': clubId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure`,
                401: `Authentication required`,
                403: `Caller not authorized`,
                404: `Club not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * File a claim for an unlinked club
     * Authenticated user asserts they operate the venue.
     * Returns 409 if the caller already owns the club or
     * already has a pending claim for it.
     * @returns ClubClaimOut Created
     * @throws ApiError
     */
    public static claimClub({
        clubId,
        requestBody,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
        /**
         * Claim payload
         */
        requestBody: ClubClaimCreateIn,
    }): CancelablePromise<ClubClaimOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/clubs/{club_id}/claim',
            path: {
                'club_id': clubId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure`,
                401: `Authentication required`,
                404: `Club not found`,
                409: `Already owns or pending claim`,
                422: `Reason too short`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List claims for a club (admin)
     * Admin-only. Non-admin callers receive 403.
     * @returns ClubClaimOut OK
     * @throws ApiError
     */
    public static listClubClaims({
        clubId,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
    }): CancelablePromise<Array<ClubClaimOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clubs/{club_id}/claims',
            path: {
                'club_id': clubId,
            },
            errors: {
                400: `Invalid club_id`,
                401: `Authentication required`,
                403: `Admin access required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Approve, reject, or dispute a club claim (admin)
     * Admin-only. On approve, promotes club to claimant
     * (sets is_claimed=true, user_id+claimed_by_user_id=
     * claimant, claimed_at=now) and seeds owner club_staff
     * row in the same transaction.
     * @returns ClubClaimOut OK
     * @throws ApiError
     */
    public static updateClubClaim({
        clubId,
        claimId,
        requestBody,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
        /**
         * Claim UUID
         */
        claimId: any,
        /**
         * Review payload
         */
        requestBody: ClubClaimReviewIn,
    }): CancelablePromise<ClubClaimOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/clubs/{club_id}/claims/{claim_id}',
            path: {
                'club_id': clubId,
                'claim_id': claimId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Club or claim not found`,
                422: `Invalid status value`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List resident performers of a club
     * Anonymous endpoint. Returns residents ordered by
     * (sort_order, created_at).
     * @returns ClubResidentOut OK
     * @throws ApiError
     */
    public static listClubResidents({
        clubId,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
    }): CancelablePromise<Array<ClubResidentOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clubs/{club_id}/residents',
            path: {
                'club_id': clubId,
            },
            errors: {
                400: `Invalid club_id`,
                404: `Club not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a resident performer to a club
     * Owner/admin gated. Returns 409 on duplicate
     * (club_id, performer_id), 404 if the performer does
     * not exist.
     * @returns ClubResidentOut Created
     * @throws ApiError
     */
    public static addClubResident({
        clubId,
        requestBody,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
        /**
         * Resident payload
         */
        requestBody: ClubResidentCreateIn,
    }): CancelablePromise<ClubResidentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/clubs/{club_id}/residents',
            path: {
                'club_id': clubId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure`,
                401: `Authentication required`,
                403: `Caller not authorized`,
                404: `Club or performer not found`,
                409: `Performer already a resident`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a resident performer from a club
     * Owner/admin gated.
     * @returns void
     * @throws ApiError
     */
    public static removeClubResident({
        clubId,
        residentId,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
        /**
         * Resident UUID
         */
        residentId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/clubs/{club_id}/residents/{resident_id}',
            path: {
                'club_id': clubId,
                'resident_id': residentId,
            },
            errors: {
                400: `Validation failure`,
                401: `Authentication required`,
                403: `Caller not authorized`,
                404: `Club or resident not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a resident performer entry
     * Owner/admin gated. Empty body is a no-op (returns current row).
     * @returns ClubResidentOut OK
     * @throws ApiError
     */
    public static updateClubResident({
        clubId,
        residentId,
        requestBody,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
        /**
         * Resident UUID
         */
        residentId: any,
        /**
         * Patch body
         */
        requestBody: ClubResidentUpdateIn,
    }): CancelablePromise<ClubResidentOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/clubs/{club_id}/residents/{resident_id}',
            path: {
                'club_id': clubId,
                'resident_id': residentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure`,
                401: `Authentication required`,
                403: `Caller not authorized`,
                404: `Club or resident not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get the showcase page linked to this club
     * D-235b live port. Returns the showcase page (id, slug,
     * display_name, type, visibility, is_published) for a
     * club. 404 when the club has no showcase.
     * matching row only.
     * @returns ClubShowcaseResult OK
     * @throws ApiError
     */
    public static getClubShowcasePage({
        clubId,
    }: {
        /**
         * Club UUID or club_<uuid>
         */
        clubId: any,
    }): CancelablePromise<ClubShowcaseResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clubs/{club_id}/showcase',
            path: {
                'club_id': clubId,
            },
            errors: {
                400: `Invalid club_id`,
                404: `Club or showcase not found`,
                502: `Upstream profiles worker unavailable`,
            },
        });
    }
    /**
     * List staff for a club
     * Returns every staff row for a club, ordered by creation.
     * Anonymous endpoint per parity (
         * @returns ClubStaffOut OK
         * @throws ApiError
         */
        public static listClubStaff({
            clubId,
        }: {
            /**
             * Club UUID or club_<uuid>
             */
            clubId: any,
        }): CancelablePromise<Array<ClubStaffOut>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/clubs/{club_id}/staff',
                path: {
                    'club_id': clubId,
                },
                errors: {
                    400: `Invalid club_id`,
                    404: `Club not found`,
                    500: `Internal error`,
                },
            });
        }
        /**
         * Add staff to a club
         * Adds a user as a staff member. Caller must be club
         * owner/manager, group owner/admin/manager, or platform
         * admin. Role must be one of owner | manager | staff.
         * @returns ClubStaffOut Created
         * @throws ApiError
         */
        public static addClubStaff({
            clubId,
            requestBody,
        }: {
            /**
             * Club UUID or club_<uuid>
             */
            clubId: any,
            /**
             * Staff payload
             */
            requestBody: ClubStaffCreateIn,
        }): CancelablePromise<ClubStaffOut> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/clubs/{club_id}/staff',
                path: {
                    'club_id': clubId,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Validation failure`,
                    401: `Authentication required`,
                    403: `Caller not authorized`,
                    404: `Club not found`,
                    409: `User already on staff`,
                    422: `Invalid role`,
                    500: `Internal error`,
                },
            });
        }
        /**
         * Remove a staff member from a club
         * Owner/admin gated.
         * @returns void
         * @throws ApiError
         */
        public static removeClubStaff({
            clubId,
            staffId,
        }: {
            /**
             * Club UUID or club_<uuid>
             */
            clubId: any,
            /**
             * Staff UUID
             */
            staffId: any,
        }): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/clubs/{club_id}/staff/{staff_id}',
                path: {
                    'club_id': clubId,
                    'staff_id': staffId,
                },
                errors: {
                    400: `Validation failure`,
                    401: `Authentication required`,
                    403: `Caller not authorized`,
                    404: `Club or staff member not found`,
                    500: `Internal error`,
                },
            });
        }
        /**
         * Update a club staff member's role
         * Owner/admin gated. Empty body is a no-op (returns current row).
         * @returns ClubStaffOut OK
         * @throws ApiError
         */
        public static updateClubStaff({
            clubId,
            staffId,
            requestBody,
        }: {
            /**
             * Club UUID or club_<uuid>
             */
            clubId: any,
            /**
             * Staff UUID
             */
            staffId: any,
            /**
             * Patch body
             */
            requestBody: ClubStaffUpdateIn,
        }): CancelablePromise<ClubStaffOut> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/clubs/{club_id}/staff/{staff_id}',
                path: {
                    'club_id': clubId,
                    'staff_id': staffId,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Validation failure`,
                    401: `Authentication required`,
                    403: `Caller not authorized`,
                    404: `Club or staff member not found`,
                    422: `Invalid role`,
                    500: `Internal error`,
                },
            });
        }
        /**
         * Revoke club VRChat verification (admin)
         * Admin-only delete of one club's verification record.
         * Returns 204 on success, 404 when no record exists.
         * Non-admin callers receive 403 "Admin access required".
         * @returns void
         * @throws ApiError
         */
        public static revokeClubVerification({
            clubId,
        }: {
            /**
             * Club id (UUID or club_<uuid>)
             */
            clubId: any,
        }): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/vrchat/clubs/{club_id}/verification',
                path: {
                    'club_id': clubId,
                },
                errors: {
                    401: `Authentication required`,
                    403: `Admin access required`,
                    404: `No verification record for this club`,
                    422: `club_id malformed`,
                    500: `Could not revoke verification`,
                },
            });
        }
        /**
         * Get club VRChat verification status
         * Anonymous read of one club's VRChat verification record.
         * Returns the current verification state (pending /
         * verified / failed / revoked) plus VRChat-side metadata
         * snapshot at verify time.
         * @returns ClubVerificationOut OK
         * @throws ApiError
         */
        public static getClubVerification({
            clubId,
        }: {
            /**
             * Club id (UUID or club_<uuid>)
             */
            clubId: any,
        }): CancelablePromise<ClubVerificationOut> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/vrchat/clubs/{club_id}/verification',
                path: {
                    'club_id': clubId,
                },
                errors: {
                    404: `No verification record for this club`,
                    422: `club_id malformed`,
                    500: `Could not load verification`,
                },
            });
        }
        /**
         * Initiate VRChat group verification for a club (admin)
         * Starts the verification process to link a club to a
         * VRChat group. For `bot_membership_check`,
         * uses the bot assigned to the VRChat group (if any) to
         * fetch group metadata and mark verified; for
         * `user_ownership_proof`, the verification is recorded as
         * `failed` until identity's OAuth-access-token contract
         * supports vrchat.
         * @returns ClubVerificationOut Created
         * @throws ApiError
         */
        public static initiateClubVerification({
            clubId,
            requestBody,
        }: {
            /**
             * Club id (UUID or club_<uuid>)
             */
            clubId: any,
            /**
             * Verify payload
             */
            requestBody: ClubVerificationInitiateIn,
        }): CancelablePromise<ClubVerificationOut> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/vrchat/clubs/{club_id}/verify',
                path: {
                    'club_id': clubId,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Invalid JSON body`,
                    401: `Authentication required`,
                    403: `Insufficient permissions to verify this club`,
                    409: `Club already has a verification record. Revoke it first to re-verify.`,
                    422: `Validation failed (method / id)`,
                    500: `Could not initiate verification`,
                },
            });
        }
    }
