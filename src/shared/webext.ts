// Firefox exposes the WebExtension API as promise-based `browser.*`; Chrome MV3
// exposes the same promise-based surface as `chrome.*`. Alias once, no polyfill dep.
declare const browser: typeof chrome | undefined;
export const ext: typeof chrome = typeof browser !== 'undefined' ? browser : chrome;
