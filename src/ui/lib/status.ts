// Shared session-status wording + badge intent for the popup and the dashboard
// Overview, so both surfaces read identically. Tab platforms (vrc.tl/vrcpop)
// derive from a page SessionStatus; rave.page derives from its token store
// (a connect gesture), so it speaks "connected/not connected" instead.
import type { BadgeProps } from '@rave-page/ui';
import type { SessionState, SessionStatus } from '../../runtime/sessions';

export type StatusVariant = BadgeProps['variant'];

const TAB_TEXT: Record<SessionState, string> = {
  'logged-in': 'Signed in',
  'logged-out': 'Signed out',
  'no-tab': 'No tab open',
  'no-permission': 'No access',
  error: 'Error',
};

// mint confirm, amber warn, neutral chrome when absent, error tint otherwise.
const TAB_VARIANT: Record<SessionState, StatusVariant> = {
  'logged-in': 'success',
  'logged-out': 'warning',
  'no-tab': 'secondary',
  'no-permission': 'error',
  error: 'error',
};

export interface StatusView {
  text: string;
  variant: StatusVariant;
  noAccess: boolean;
}

// vrc.tl / vrcpop: page-session status.
export function tabStatusView(s: SessionStatus): StatusView {
  const label = s.info?.label ? ` (${s.info.label})` : '';
  return {
    text: s.state === 'logged-in' ? `Signed in${label}` : TAB_TEXT[s.state],
    variant: TAB_VARIANT[s.state],
    noAccess: s.state === 'no-permission',
  };
}

export function formatExpiry(iso?: string): string {
  if (!iso) return '';
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  return new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// rave.page: token-store connection state.
export function ravepageStatusView(connected: boolean, label?: string, expiresAt?: string): StatusView {
  if (!connected) return { text: 'Not connected', variant: 'secondary', noAccess: false };
  const who = label ? ` as ${label}` : '';
  const exp = expiresAt ? `, expires ${formatExpiry(expiresAt)}` : '';
  return { text: `Connected${who}${exp}`, variant: 'success', noAccess: false };
}
