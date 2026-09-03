/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VideoConvertIn = {
    /**
     * AudioBitrate is the optional target audio bitrate.
     */
    audio_bitrate?: string;
    /**
     * AudioCodec is the audio codec. Default `aac`.
     */
    audio_codec?: string;
    /**
     * CRF is the optional Constant Rate Factor (0-51).
     */
    crf?: number;
    /**
     * FormatPreset is the optional named preset; see
     * `GET /media-processing/formats/video`.
     */
    format_preset?: string;
    /**
     * FPS is the optional frame rate.
     */
    fps?: number;
    /**
     * OutputFormat is the container format. Default `mp4`.
     */
    output_format?: string;
    /**
     * PixelFormat is the optional pixel format.
     */
    pixel_format?: string;
    /**
     * Preset is the optional ffmpeg encoder speed preset.
     */
    preset?: string;
    /**
     * Profile is the optional H.264 profile.
     */
    profile?: string;
    /**
     * Resolution is the optional output resolution (e.g. `1280x720`).
     */
    resolution?: string;
    /**
     * UploadID is the source media-upload identifier. Required.
     */
    upload_id?: string;
    /**
     * VideoBitrate is the optional target video bitrate (e.g. `2000k`).
     */
    video_bitrate?: string;
    /**
     * VideoCodec is the video codec. Default `libx264`.
     */
    video_codec?: string;
};

