/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SetLogEntryOut = {
    album?: string;
    artist?: string;
    /**
     * BPM is the track tempo. Pointer-typed so absent values wire-emit JSON
     * `null`.
     */
    bpm?: number;
    /**
     * Deck identifies the deck the track was loaded onto ("A", "B", …).
     */
    deck?: string;
    /**
     * Extra is the pass-through renderer-side payload. Pointer-to-
     * json.RawMessage so the wire emits `null` when absent + verbatim
     * JSON bytes when present. The Go port does NOT re-validate the
     * inner shape - the ingest path is the validation point.
     */
    extra?: Array<number>;
    /**
     * ID is the entry's prefixed wire form "sle_<uuid>" - matches 's `SetLogEntryId` projection (
         */
        id?: string;
        /**
         * Key is the musical key. Pointer-typed so absent values wire-emit
         * JSON `null`.
         */
        key?: string;
        /**
         * LoadedAt is the client-supplied load timestamp. NOTE: the Pydantic schema declares a
         * camelCase alias `loadedAt` but the REST response emits the
         * snake_case form per FastAPI's default by_alias=False.
         */
        loaded_at?: string;
        /**
         * g., the SSE dump path).
         */
        stream_id?: string;
        /**
         * Title / Artist / Album are nullable metadata copied from the
         * `deck.loaded` event.
         */
        title?: string;
        /**
         * TrackLength is the track duration in seconds. NOTE: the Pydantic schema declares a camelCase alias
         * `trackLength` but the REST response emits the snake_case form
         * per FastAPI's default by_alias=False.
         */
        track_length?: number;
    };

