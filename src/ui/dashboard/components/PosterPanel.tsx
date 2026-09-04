// Poster picker for the event editor: a current-poster thumb (from a PosterRef
// url or an object URL of picked bytes), a "Use image URL" input, a "Pick file"
// button (image/* behind a kit Button; > 8 MB warns), "Remove", and the sha256 of
// picked bytes in a details disclosure. Emits (PosterRef | null, PosterFile | null)
// — bytes ride the adapter's imperative setPoster, url posters ride planPoster.
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Label } from '@rave-page/ui';
import type { PosterFile, PosterRef } from '../../../core/schema';
import { sha256HexBytes } from '../../lib/digest';

const MAX_BYTES = 8 * 1024 * 1024;

export interface PosterPanelProps {
  value: PosterRef | null;
  file: PosterFile | null;
  onChange: (poster: PosterRef | null, file: PosterFile | null) => void;
}

export function PosterPanel({ value, file, onChange }: PosterPanelProps): React.JSX.Element {
  const [urlText, setUrlText] = useState(value?.kind === 'url' ? value.url : '');
  const [warning, setWarning] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      // Copy into a fresh (non-shared) ArrayBuffer so the Blob part types line up.
      const part = new Uint8Array(file.bytes).buffer as ArrayBuffer;
      const u = URL.createObjectURL(new Blob([part], { type: file.mimeType }));
      setObjectUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setObjectUrl(null);
    return undefined;
  }, [file]);

  const thumb = value?.kind === 'url' ? value.url : objectUrl;
  const sha = value?.kind === 'bytes' ? value.sha256 : undefined;

  const onUrl = (v: string): void => {
    setUrlText(v);
    setWarning(null);
    const url = v.trim();
    onChange(url ? { kind: 'url', url } : null, null);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.currentTarget.files?.[0];
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setWarning(`Image is ${(f.size / 1_048_576).toFixed(1)} MB — keep posters under 8 MB.`);
      e.currentTarget.value = '';
      return;
    }
    setWarning(null);
    void (async () => {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const mimeType = f.type || 'application/octet-stream';
      let sha256: string | undefined;
      try {
        sha256 = await sha256HexBytes(bytes);
      } catch {
        sha256 = undefined;
      }
      setUrlText('');
      onChange({ kind: 'bytes', bytes, mimeType, filename: f.name, sha256 }, { bytes, mimeType, filename: f.name });
    })();
  };

  const onRemove = (): void => {
    setUrlText('');
    setWarning(null);
    if (fileRef.current) fileRef.current.value = '';
    onChange(null, null);
  };

  return (
    <div className="flex flex-col gap-3" data-testid="poster-panel">
      {thumb ? (
        <img src={thumb} alt="" data-testid="poster-thumb" className="rounded-md max-h-48 w-auto object-cover border border-border" />
      ) : (
        <div data-testid="poster-empty" className="rounded-md border border-dashed border-border p-6 text-center text-2xs text-muted-foreground">
          No poster yet.
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Label htmlFor="poster-url">Use image URL</Label>
        <Input id="poster-url" data-testid="poster-url" placeholder="https://…" value={urlText} onChange={(e) => onUrl(e.currentTarget.value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" data-testid="poster-pick" onClick={() => fileRef.current?.click()}>
          Pick file
        </Button>
        {(value || file) && (
          <Button type="button" variant="outline" data-testid="poster-remove" onClick={onRemove}>
            Remove
          </Button>
        )}
        <input ref={fileRef} type="file" accept="image/*" data-testid="poster-file" className="hidden" onChange={onFile} />
      </div>

      {warning && (
        <p data-testid="poster-warning" className="text-2xs text-brand-base">
          {warning}
        </p>
      )}

      {sha && (
        <details data-testid="poster-sha-disclosure">
          <summary className="cursor-pointer text-2xs text-muted-foreground">Image checksum</summary>
          <p data-testid="poster-sha" className="mt-1 break-all text-2xs text-muted-foreground">
            sha256: {sha}
          </p>
        </details>
      )}
    </div>
  );
}
