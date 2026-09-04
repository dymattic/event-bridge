// sha256 of raw bytes -> hex. Pure (crypto.subtle global; no runtime/webext import).
// Poster panel shows the digest of picked bytes; core/hash.ts hashes strings only.
export async function sha256HexBytes(bytes: Uint8Array): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('crypto.subtle unavailable');
  const digest = await subtle.digest('SHA-256', bytes.slice().buffer);
  let out = '';
  for (const b of new Uint8Array(digest)) out += b.toString(16).padStart(2, '0');
  return out;
}
