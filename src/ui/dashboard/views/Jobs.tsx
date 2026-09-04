// #/jobs — the persisted job log. Every plan run (editor create/edit/transfer,
// delete, poster, sync) is a row: when, kind, title, targets, status. Expand a row
// to see each step's exact resolved request (never tokens) + any error, and an
// "Open event" link when the run produced refs. "Clear finished" drops everything
// except still-running jobs. Reads are local (storage.local `jobs`); nothing leaves
// the browser.
import { Badge, Button, DataTable, EmptyState, LoadingSpinner, type Column } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { clearFinishedJobs, listJobs, type JobRecord, type JobStatus, type JobStepStatus } from '../../../runtime/jobs';
import { PLATFORM_NAME } from '../../lib/platform-meta';
import { formatLocalDateTime } from '../../lib/format';
import { useResource } from '../../lib/resource';

function statusVariant(s: JobStatus): 'success' | 'info' | 'error' | 'warning' {
  return s === 'done' ? 'success' : s === 'running' ? 'info' : s === 'failed' ? 'error' : 'warning';
}
function stepVariant(s: JobStepStatus): 'success' | 'info' | 'error' {
  return s === 'done' ? 'success' : s === 'error' ? 'error' : 'info';
}
function targetsLabel(targets: Platform[]): string {
  return targets.map((p) => PLATFORM_NAME[p]).join(' · ') || '—';
}

function JobDetails({ job }: { job: JobRecord }): React.JSX.Element {
  const openRef = job.refs[0];
  return (
    <details data-testid={`job-details-${job.id}`}>
      <summary className="cursor-pointer text-2xs text-muted-foreground">
        {job.steps.length} step{job.steps.length === 1 ? '' : 's'}
      </summary>
      <div className="mt-2 flex flex-col gap-2">
        {openRef && (
          <a
            href={`#/events/${openRef.platform}/${openRef.id}`}
            data-testid={`job-open-${job.id}`}
            className="text-2xs text-brand-mint underline-offset-2 hover:underline"
          >
            Open event
          </a>
        )}
        {job.steps.length === 0 ? (
          <p className="text-2xs text-muted-foreground">No steps recorded.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {job.steps.map((s) => (
              <li key={s.stepId} data-testid={`job-step-${job.id}-${s.stepId}`} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant={stepVariant(s.status)}>{s.status}</Badge>
                  <span className="text-2xs text-foreground">{PLATFORM_NAME[s.platform]} · {s.stepId}</span>
                </div>
                {s.error && <span className="text-2xs text-brand-base">{s.error.code ? `${s.error.code}: ` : ''}{s.error.message}</span>}
                <pre className="max-h-56 overflow-auto rounded-md border border-border bg-card p-2 text-2xs whitespace-pre-wrap">{s.preview}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}

export default function Jobs(): React.JSX.Element {
  const jobs = useResource('jobs', listJobs);
  const rows = jobs.data ?? [];

  const onClear = (): void => {
    void clearFinishedJobs().then(() => jobs.refresh());
  };

  const columns: Column<JobRecord>[] = [
    { header: 'When', accessor: (j) => <span className="whitespace-nowrap text-2xs text-muted-foreground">{formatLocalDateTime(j.startedAt)}</span> },
    { header: 'Kind', accessor: (j) => <span className="text-foreground">{j.kind}</span> },
    { header: 'Title', accessor: (j) => <span className="font-medium text-foreground">{j.title || '—'}</span> },
    { header: 'Targets', accessor: (j) => <span className="text-2xs text-muted-foreground">{targetsLabel(j.targets)}</span> },
    { header: 'Status', accessor: (j) => <Badge variant={statusVariant(j.status)}>{j.status}</Badge> },
    { header: 'Steps', accessor: (j) => <JobDetails job={j} /> },
  ];

  return (
    <main className="p-4 bg-background min-h-screen" data-testid="jobs-view">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-orbitron text-2xl text-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Everything event-bridge wrote, per step. Stored locally only.</p>
        </div>
        <Button type="button" variant="outline" data-testid="jobs-clear" disabled={rows.length === 0} onClick={onClear}>
          Clear finished
        </Button>
      </header>

      {!jobs.data ? (
        <div data-testid="jobs-loading" className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner /> Loading jobs…
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          data-testid="jobs-empty"
          headingLevel="h2"
          title="No jobs yet"
          description="Create, edit, transfer, delete or sync an event and each run shows up here."
        />
      ) : (
        <>
          <p data-testid="jobs-count" className="text-2xs text-muted-foreground mb-2">
            {rows.length} job{rows.length === 1 ? '' : 's'}
          </p>
          <div data-testid="jobs-table">
            <DataTable
              data={rows}
              columns={columns}
              keyExtractor={(j) => j.id}
              emptyMessage="No jobs."
              renderMobileCard={(j) => (
                <div className="flex flex-col gap-2" data-testid={`job-card-${j.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{j.title || '—'}</span>
                    <Badge variant={statusVariant(j.status)}>{j.status}</Badge>
                  </div>
                  <div className="text-2xs text-muted-foreground">{j.kind} · {targetsLabel(j.targets)}</div>
                  <div className="text-2xs text-muted-foreground">{formatLocalDateTime(j.startedAt)}</div>
                  <JobDetails job={j} />
                </div>
              )}
            />
          </div>
        </>
      )}
    </main>
  );
}
