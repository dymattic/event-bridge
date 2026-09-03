// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { PosterFile } from '../../../src/core/schema';
import type { VrctlField } from '../../../src/core/mapping/to-vrctl';
import { buildVrctlDetailFields } from '../../../src/core/mapping/to-vrctl';
import { fromVrctl } from '../../../src/core/mapping/from-vrctl';
import { parseDetailForm } from '../../../src/adapters/vrctl/parse';
import {
  buildMultipartBody,
  encodeUrlencoded,
  fieldNames,
  previewFields,
  toMultipartFields,
} from '../../../src/adapters/vrctl/forms';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrctl');

// Recon-verified detail POST inventory (same list P1 asserts against).
const CAPTURED = [
  'organizers[]', 'name', 'description', 'instanceOpenMinutesBeforeStart', 'start', 'timezone', 'url',
  'howToJoin', 'showSlots', 'slots[136569][duration]', 'slots[136569][flag]', 'slots[136569][performers][]',
  'slots[136569][publicNote]', 'slots[136569][privateNote]', 'flags[1]', 'flags[2][]', 'flags[3]', 'flags[4]',
  'flags[5]', 'flags[6]', 'posterType', '_submit', '_do',
];

describe('encodeUrlencoded', () => {
  it('maps pairs to the agent urlencoded body', () => {
    expect(encodeUrlencoded([['name', 'x'], ['slots', '1']])).toEqual({
      kind: 'urlencoded',
      fields: [['name', 'x'], ['slots', '1']],
    });
  });
});

describe('multipart mapping', () => {
  const poster: PosterFile = { bytes: new Uint8Array([1, 2, 3]), mimeType: 'image/png', filename: 'p.png' };
  const fields: VrctlField[] = [
    ['name', "what's poppin"],
    ['posterType', 'upload'],
    ['posterUpload', { file: poster }],
  ];

  it('splits ordered text/file fields', () => {
    expect(toMultipartFields(fields)).toEqual([
      { kind: 'text', name: 'name', value: "what's poppin" },
      { kind: 'text', name: 'posterType', value: 'upload' },
      { kind: 'file', name: 'posterUpload', file: poster },
    ]);
  });

  it('assembles a multipart body, uploading files via putBlob', async () => {
    const uploaded: PosterFile[] = [];
    const body = await buildMultipartBody(toMultipartFields(fields), async (f) => {
      uploaded.push(f);
      return 'blob-1';
    });
    expect(uploaded).toEqual([poster]);
    expect(body).toEqual({
      kind: 'multipart',
      parts: [
        { name: 'name', value: "what's poppin" },
        { name: 'posterType', value: 'upload' },
        { name: 'posterUpload', filename: 'p.png', mime: 'image/png', blobId: 'blob-1' },
      ],
    });
  });

  it('previewFields renders a file as <upload …>', () => {
    expect(previewFields(fields)).toEqual([
      ['name', "what's poppin"],
      ['posterType', 'upload'],
      ['posterUpload', '<upload p.png>'],
    ]);
  });
});

describe('parse -> build round-trip', () => {
  it('field names cover the captured detail POST inventory', () => {
    const form = parseDetailForm(readFileSync(join(FIX, 'detail-form.html'), 'utf8'));
    // posterType rides only when a poster is set (core/from-vrctl drops it when
    // the scraped posterUrl is empty — see report note); reproduce the poster.
    const core = { ...fromVrctl(form, { organizerName: 'Example Club' }), poster: { kind: 'url', url: 'https://example.invalid/p.png' } as const };
    const fields = buildVrctlDetailFields(core, form, { publish: false });
    const names = new Set(fieldNames(fields));
    for (const c of CAPTURED) expect(names.has(c), `missing ${c}`).toBe(true);
  });

  it('published present only when publish:true', () => {
    const form = parseDetailForm(readFileSync(join(FIX, 'detail-form.html'), 'utf8'));
    const core = fromVrctl(form);
    expect(new Set(fieldNames(buildVrctlDetailFields(core, form, { publish: true }))).has('published')).toBe(true);
    expect(new Set(fieldNames(buildVrctlDetailFields(core, form, { publish: false }))).has('published')).toBe(false);
  });
});
