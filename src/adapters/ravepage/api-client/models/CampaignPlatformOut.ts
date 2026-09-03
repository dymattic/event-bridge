/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CampaignPlatformOut = {
    /**
     * AllowedMediaMimeTypes is the whitelist of MIME types the
     * platform accepts. Always non-nil; the empty case wire-emits
     * `[]`.
     */
    allowed_media_mime_types?: Array<string>;
    /**
     * AuthMethod is the platform-link mechanism the FE renders.
     * One of: "oauth", "app_password", "webhook", "smtp", "api_key".
     */
    auth_method?: 'oauth' | 'app_password' | 'webhook' | 'smtp' | 'api_key';
    /**
     * ConnectURLPath is the FE-visible URL path where linking begins.
     * nil for platforms where linking goes through the generic
     * AuthService (Instagram, Mastodon today).
     */
    connect_url_path?: string;
    /**
     * IconHint is the icon slug the frontend maps to its icon set
     * (e.g., "x", "bluesky", "discord", "email").
     */
    icon_hint?: string;
    /**
     * Key is the stable platform identifier (e.g., "x", "bluesky",
     * "discord"). Used as the platform discriminator in
     * `CampaignStepPlatformOverride` rows.
     */
    key?: string;
    /**
     * Label is the human-readable platform name for the UI (e.g.,
     * "X (Twitter)", "Email / Newsletter").
     */
    label?: string;
    /**
     * MaxMediaCount is the per-post media-item cap. 0 when
     * SupportsMedia=false.
     */
    max_media_count?: number;
    /**
     * MaxTextLength is the hard character cap for the post body.
     */
    max_text_length?: number;
    /**
     * RequiresSubject declares whether the platform requires a
     * subject line (true for email; false everywhere else).
     */
    requires_subject?: boolean;
    /**
     * Status is the platform availability state. One of:
     * "available", "beta", "coming_soon".
     */
    status?: 'available' | 'beta' | 'coming_soon';
    /**
     * SupportsMarkdown declares whether the platform renders markdown
     * in the post body.
     */
    supports_markdown?: boolean;
    /**
     * SupportsMedia declares whether the platform accepts media
     * attachments at all.
     */
    supports_media?: boolean;
    /**
     * SupportsThreads declares whether the platform supports a
     * thread-style multi-post sequence (X thread, Bluesky thread,
     * Mastodon thread).
     */
    supports_threads?: boolean;
};

