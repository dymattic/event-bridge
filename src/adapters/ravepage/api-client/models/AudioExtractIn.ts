/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AudioExtractIn = {
    /**
     * AudioBitrate is the target audio bitrate. Default `192k`.
     */
    audio_bitrate?: string;
    /**
     * AudioCodec is the audio codec. Default `libmp3lame`.
     */
    audio_codec?: string;
    /**
     * AudioFormat is the output container. Default `mp3`.
     */
    audio_format?: string;
    /**
     * Channels is the optional channel count (1 mono, 2 stereo).
     */
    channels?: number;
    /**
     * FormatPreset is the optional named audio preset.
     */
    format_preset?: string;
    /**
     * SampleRate is the optional sample rate (Hz).
     */
    sample_rate?: string;
    /**
     * UploadID is the source media-upload identifier. Required.
     */
    upload_id?: string;
};

