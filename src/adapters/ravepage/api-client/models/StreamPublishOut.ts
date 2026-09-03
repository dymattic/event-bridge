/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Visibility } from './Visibility';
export type StreamPublishOut = {
    /**
     * EventID is the resulting event association (`evt_<uuid>`), null
     * when the set isn't tied to an event.
     */
    event_id?: string;
    /**
     * StreamID is the published set (`strm_<uuid>`).
     */
    stream_id?: string;
    /**
     * Visibility is the resulting read audience.
     */
    visibility?: Visibility;
};

