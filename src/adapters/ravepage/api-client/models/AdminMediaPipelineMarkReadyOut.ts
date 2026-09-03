/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PipelineStatus } from './PipelineStatus';
export type AdminMediaPipelineMarkReadyOut = {
    /**
     * ID is the prefixed upload id (`upl_<uuid>`).
     */
    id?: string;
    /**
     * PipelineStatus is the new state - always "ready".
     */
    pipeline_status?: PipelineStatus;
    /**
     * PreviousPipelineStatus is the state before the flip.
     */
    previous_pipeline_status?: PipelineStatus;
};

