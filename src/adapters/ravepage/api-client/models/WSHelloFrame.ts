/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WSHelloFrame = {
    /**
     * Message is "connected" on the connect frame; subsequent frames
     * (ack, ping) carry different bodies (see realtime topic registry).
     */
    message?: string;
    /**
     * Type is always "hello" on the connect frame.
     */
    type?: string;
};

