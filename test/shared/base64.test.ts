import { describe, expect, it } from 'vitest';
import { base64ToBytes, bytesToBase64, sliceBase64 } from '../../src/shared/base64';

function ramp(len: number): Uint8Array {
  const b = new Uint8Array(len);
  for (let i = 0; i < len; i++) b[i] = (i * 37 + 11) & 0xff;
  return b;
}
function reassemble(slices: string[]): Uint8Array {
  const parts = slices.map(base64ToBytes);
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

describe('base64 round-trip', () => {
  it('handles empty and non-multiple-of-3 lengths', () => {
    for (const len of [0, 1, 2, 3, 4, 5, 6, 7, 8, 100, 255, 1024]) {
      const b = ramp(len);
      expect(base64ToBytes(bytesToBase64(b))).toEqual(b);
    }
  });
  it('empty encodes to empty string', () => {
    expect(bytesToBase64(new Uint8Array(0))).toBe('');
  });
});

describe('sliceBase64', () => {
  it('empty input -> []', () => {
    expect(sliceBase64(new Uint8Array(0))).toEqual([]);
  });
  it('reassembles across slice boundaries', () => {
    const b = ramp(1000);
    const slices = sliceBase64(b, 256);
    expect(slices).toHaveLength(4);
    expect(reassemble(slices)).toEqual(b);
  });
  it('single slice when under the cap', () => {
    const b = ramp(50);
    expect(sliceBase64(b, 1 << 20)).toHaveLength(1);
  });
  it('rejects maxBytes <= 0', () => {
    expect(() => sliceBase64(ramp(4), 0)).toThrow(RangeError);
  });
});
