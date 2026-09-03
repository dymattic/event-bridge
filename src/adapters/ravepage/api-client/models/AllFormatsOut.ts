/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AudioFormatPreset } from './AudioFormatPreset';
import type { VideoFormatPreset } from './VideoFormatPreset';
export type AllFormatsOut = {
    audio_formats?: Record<string, AudioFormatPreset>;
    total_audio?: number;
    total_video?: number;
    video_formats?: Record<string, VideoFormatPreset>;
};

