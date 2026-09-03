// Binary crosses the runtime bus as base64 (Chrome JSON-serializes messages, so
// typed arrays / ArrayBuffers do NOT survive). Pure, no DOM/Worker text APIs
// beyond btoa/atob (present in both DOM and WebWorker libs).

const CHUNK = 0x8000; // fromCharCode arg cap

export function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Split raw bytes into independently-decodable base64 slices of <=maxBytes raw
// bytes each (default 1 MiB). Each slice self-pads, so concatenating the DECODED
// bytes of the slices in order reconstructs the input. Empty input -> [].
export function sliceBase64(bytes: Uint8Array, maxBytes = 1 << 20): string[] {
  if (maxBytes <= 0) throw new RangeError('maxBytes must be > 0');
  const out: string[] = [];
  for (let i = 0; i < bytes.length; i += maxBytes) {
    out.push(bytesToBase64(bytes.subarray(i, i + maxBytes)));
  }
  return out;
}
