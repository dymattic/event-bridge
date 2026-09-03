/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKPrimaryContact } from './EPKPrimaryContact';
import type { EPKSocialLink } from './EPKSocialLink';
export type EPKBooking = {
    /**
     * PrimaryContact is the main booking contact.
     */
    primary_contact?: EPKPrimaryContact;
    /**
     * SocialLinks are the social profile links.
     */
    social_links?: Array<EPKSocialLink>;
};

