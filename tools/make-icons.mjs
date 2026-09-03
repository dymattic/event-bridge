// Zero-dep PNG icon generator (RGB, filter 0, zlib deflate + hand-rolled CRC32).
// Dark ground + lighter square frame with a bridge-deck band. Run: pnpm icons.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const bg = [0x12, 0x14, 0x1c];
  const fg = [0x6c, 0xa8, 0xff];
  const m = Math.round(size * 0.22);
  const t = Math.max(1, Math.round(size * 0.1));
  const raw = Buffer.alloc(size * (size * 3 + 1));
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const inBox = x >= m && x < size - m && y >= m && y < size - m;
      const onFrame = inBox && (x < m + t || x >= size - m - t || y < m + t || y >= size - m - t);
      const onDeck = y >= size / 2 - t / 2 && y < size / 2 + t / 2 && x >= m && x < size - m;
      const c = onFrame || onDeck ? fg : bg;
      raw[o++] = c[0];
      raw[o++] = c[1];
      raw[o++] = c[2];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync('icons', { recursive: true });
for (const s of [16, 32, 48, 128]) {
  writeFileSync(join('icons', `icon-${s}.png`), png(s));
  console.log(`icons/icon-${s}.png`);
}
