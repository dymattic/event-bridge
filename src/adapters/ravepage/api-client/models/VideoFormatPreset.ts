/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VideoFormatPreset = {
    /**
     * null on lossless
     */
    audio_bitrate?: string;
    audio_codec?: string;
    container?: string;
    crf?: number;
    description?: string;
    name?: string;
    pixel_format?: string;
    preset?: string;
    /**
     * null on webm presets
     */
    profile?: string;
    /**
     * explicit "WxH" OR "source"
     */
    resolution?: string;
    /**
     * null on lossless
     */
    video_bitrate?: string;
    video_codec?: string;
};

