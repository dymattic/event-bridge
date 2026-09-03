// Encoders: map the P1 field builders (buildVrctlCreateFields / buildVrctlDetailFields)
// onto the agent `http` body types. Urlencoded for create; multipart for the
// detail POST (a poster file rides the blob-slice protocol via the executor's
// sendBlob). Pure — no transport, no webext.
import type { HttpBody, MultipartPart } from '../../shared/agent-protocol';
import type { PosterFile } from '../../core/schema';
import type { VrctlField } from '../../core/mapping/to-vrctl';

export function encodeUrlencoded(fields: [string, string][]): HttpBody {
  return { kind: 'urlencoded', fields };
}

function isFileField(f: VrctlField): f is [string, { file: PosterFile }] {
  return typeof f[1] !== 'string';
}

export type MultipartField =
  | { kind: 'text'; name: string; value: string }
  | { kind: 'file'; name: string; file: PosterFile };

// Ordered split of detail fields into text/file parts (file entries carry the
// PosterFile; the executor turns each into a blob before assembling the body).
export function toMultipartFields(fields: VrctlField[]): MultipartField[] {
  return fields.map((f) =>
    isFileField(f)
      ? ({ kind: 'file', name: f[0], file: f[1].file } as const)
      : ({ kind: 'text', name: f[0], value: f[1] } as const),
  );
}

// Assemble the multipart HttpBody. `putBlob` uploads a file's bytes and returns
// its assembled blobId (the executor passes the agent-transport sendBlob).
export async function buildMultipartBody(
  fields: MultipartField[],
  putBlob: (file: PosterFile) => Promise<string>,
): Promise<HttpBody> {
  const parts: MultipartPart[] = [];
  for (const f of fields) {
    if (f.kind === 'text') {
      parts.push({ name: f.name, value: f.value });
    } else {
      const blobId = await putBlob(f.file);
      parts.push({ name: f.name, filename: f.file.filename, mime: f.file.mimeType, blobId });
    }
  }
  return { kind: 'multipart', parts };
}

// Human preview of detail fields: file entries render as `<upload filename>`.
export function previewFields(fields: VrctlField[]): [string, string][] {
  return fields.map((f) => (isFileField(f) ? [f[0], `<upload ${f[1].file.filename}>`] : [f[0], f[1]]));
}

// Just the field names (order preserved) — for preview lists + superset asserts.
export function fieldNames(fields: VrctlField[]): string[] {
  return fields.map((f) => f[0]);
}
