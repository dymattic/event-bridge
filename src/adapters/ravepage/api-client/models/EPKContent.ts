/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EPKContentSection } from './EPKContentSection';
import type { EPKHero } from './EPKHero';
export type EPKContent = {
    /**
     * Hero is the above-the-fold block.
     */
    hero?: EPKHero;
    /**
     * Sections are ordered body sections.
     */
    sections?: Array<EPKContentSection>;
};

