// Delete confirmation shared by the table row + the detail view. Shows the EXACT
// planned request(s) in a collapsible preview before confirming (the plan/execute
// split CLAUDE.md requires), destructive-styled + platform-named when the event is
// public/published, then runs planDelete -> execute and invalidates caches.
import { useEffect, useState } from 'react';
import { ConfirmDialog, useNotification } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { errorText } from '../../lib/error-copy';
import { PLATFORM_NAME } from '../../lib/platform-meta';
import { platformHost } from '../../lib/platform-urls';
import { invalidate } from '../../lib/resource';
import { deletePreview, executeDelete } from '../lib/event-data';
import { startJob, recordStep, finishJob } from '../../../runtime/jobs';

export interface DeleteTarget {
  platform: Platform;
  id: string;
  title: string;
  status?: string;
  visibility?: string;
}

function isPublic(t: DeleteTarget): boolean {
  const s = `${t.status ?? ''} ${t.visibility ?? ''}`.toLowerCase();
  return /\b(published|public|promoted|live)\b/.test(s);
}

export function DeleteEventDialog({
  target,
  onClose,
  onDeleted,
}: {
  target: DeleteTarget | null;
  onClose: () => void;
  onDeleted: (target: DeleteTarget) => void;
}): React.JSX.Element | null {
  const { addNotification } = useNotification();
  const [busy, setBusy] = useState(false);
  // rave.page host is instance-configurable → resolve async; fall back to the name.
  const [host, setHost] = useState<string>(target ? PLATFORM_NAME[target.platform] : '');
  const platform = target?.platform;
  useEffect(() => {
    if (!platform) return;
    let alive = true;
    void platformHost(platform).then((h) => {
      if (alive) setHost(h);
    });
    return () => {
      alive = false;
    };
  }, [platform]);
  if (!target) return null;

  const destructive = isPublic(target);
  const message = destructive
    ? `This removes the event from ${host} immediately.`
    : `Delete the draft “${target.title}” on ${host}?`;

  let preview: string[] = [];
  try {
    preview = deletePreview(target.platform, target.id);
  } catch (e) {
    preview = [errorText(e, target.platform)];
  }

  const onConfirm = (): void => {
    if (busy) return;
    setBusy(true);
    void (async () => {
      const job = await startJob({ kind: 'delete', title: target.title, targets: [target.platform], refs: [{ platform: target.platform, id: target.id }] });
      try {
        await executeDelete(target.platform, target.id, (evt) => void recordStep(job.id, evt, target.platform));
        await finishJob(job.id, 'done');
        invalidate(`platform:${target.platform}`);
        invalidate(`event:${target.platform}:${target.id}`);
        invalidate('links');
        invalidate('sync:pass');
        addNotification(`Deleted “${target.title}”`, 'success');
        onDeleted(target);
      } catch (e: unknown) {
        await finishJob(job.id, 'failed');
        addNotification(errorText(e, target.platform), 'error');
      } finally {
        setBusy(false);
        onClose();
      }
    })();
  };

  return (
    <div data-testid="delete-dialog">
      <ConfirmDialog
        isOpen
        type={destructive ? 'danger' : 'warning'}
        title={`Delete “${target.title}”?`}
        message={message}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirm}
        onCancel={onClose}
      >
        <details data-testid="delete-preview-disclosure">
          <summary className="cursor-pointer text-sm text-muted-foreground">Show exact request</summary>
          <pre data-testid="delete-preview" className="mt-2 max-h-64 overflow-auto rounded-md border border-border bg-card p-2 text-2xs whitespace-pre-wrap">
            {preview.join('\n\n')}
          </pre>
        </details>
      </ConfirmDialog>
    </div>
  );
}
