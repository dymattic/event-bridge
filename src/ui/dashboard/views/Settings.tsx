// #/settings — real settings surface (kit components). Sections:
//   General      close-opened-tabs + test-event title prefix.
//   Experimental rave.page integration toggle (OFF by default; optional, never a
//                prerequisite for vrc.tl/vrcpop) + a configurable instance
//                (self-hosted / federated rave.page) with a runtime permission
//                grant for custom origins, plus connect/disconnect.
import { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  Input,
  Label,
  Switch,
  useNotification,
} from '@rave-page/ui';
import { ext } from '../../../shared/webext';
import { isBridgeError } from '../../../core/errors';
import {
  RAVEPAGE_DEFAULT_INSTANCE,
  getSettings,
  normalizeOrigin,
  setSettings,
  type Settings as SettingsShape,
} from '../../../runtime/settings';
import { connect, disconnect, status } from '../../../adapters/ravepage/auth';
import type { ConnectionStatus } from '../../../adapters/types';
import { invalidate } from '../../lib/resource';

function errMessage(e: unknown): string {
  if (isBridgeError(e)) return `${e.code}: ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}

const INSTANCE_CHANGED = 'rave.page instance changed — reconnect to continue';

export default function Settings(): React.JSX.Element {
  const { addNotification } = useNotification();
  const [settings, setLocal] = useState<SettingsShape | null>(null);
  const [prefix, setPrefix] = useState('');
  const [appInput, setAppInput] = useState('');
  const [apiInput, setApiInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [conn, setConn] = useState<ConnectionStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmOff, setConfirmOff] = useState(false);
  const [alsoDisconnect, setAlsoDisconnect] = useState(false);

  const refreshConn = useCallback(async (): Promise<void> => {
    setConn(await status());
  }, []);

  useEffect(() => {
    void getSettings().then((s) => {
      setLocal(s);
      setPrefix(s.testPrefix);
      setAppInput(s.ravepage.appOrigin);
      setApiInput(s.ravepage.apiOrigin);
      if (s.experimental.ravepage) void refreshConn();
    });
  }, [refreshConn]);

  const enabled = settings?.experimental.ravepage ?? false;
  const connected = conn?.connected === true;

  const patch = async (p: Partial<SettingsShape>): Promise<SettingsShape> => {
    const next = await setSettings(p);
    setLocal(next);
    return next;
  };

  // ---- General ----
  const onCloseTabs = (v: boolean): void => {
    void patch({ closeOpenedTabs: v });
  };
  const onPrefixBlur = (): void => {
    if (settings && prefix !== settings.testPrefix) void patch({ testPrefix: prefix });
  };

  // ---- Experimental toggle ----
  const persistEnabled = async (next: boolean): Promise<void> => {
    await patch({ experimental: { ravepage: next } });
    if (next) await refreshConn();
  };
  const onToggle = (next: boolean): void => {
    setError(null);
    if (!next && connected) {
      setAlsoDisconnect(false);
      setConfirmOff(true);
      return;
    }
    void persistEnabled(next);
  };
  const confirmTurnOff = (): void => {
    setConfirmOff(false);
    void (async () => {
      await persistEnabled(false);
      if (alsoDisconnect) {
        await disconnect();
        await refreshConn();
      }
    })();
  };

  // ---- Instance ----
  const applyInstance = async (appOrigin: string, apiOrigin: string, toast: string): Promise<void> => {
    await patch({ ravepage: { appOrigin, apiOrigin } });
    setAppInput(appOrigin);
    setApiInput(apiOrigin);
    await disconnect(); // stored token is instance-scoped
    invalidate('connections');
    invalidate('platform:ravepage');
    await refreshConn();
    addNotification(toast, 'info');
  };

  const onSave = (): void => {
    setError(null);
    const app = normalizeOrigin(appInput);
    if (!app.ok) {
      setError(`App origin: ${app.reason}`);
      return;
    }
    const api = normalizeOrigin(apiInput);
    if (!api.ok) {
      setError(`API origin: ${api.reason}`);
      return;
    }
    const { origin: appOrigin } = app;
    const { origin: apiOrigin } = api;
    const needGrant =
      appOrigin !== RAVEPAGE_DEFAULT_INSTANCE.appOrigin || apiOrigin !== RAVEPAGE_DEFAULT_INSTANCE.apiOrigin;
    if (needGrant) {
      // Firefox: request MUST run inside the click gesture (no await before it).
      void ext.permissions.request({ origins: [`${appOrigin}/*`, `${apiOrigin}/*`] }).then((ok) => {
        if (!ok) {
          setError('Permission denied — instance unchanged');
          addNotification('Permission denied — instance unchanged', 'error');
          return;
        }
        void applyInstance(appOrigin, apiOrigin, INSTANCE_CHANGED);
      });
    } else {
      void applyInstance(appOrigin, apiOrigin, INSTANCE_CHANGED);
    }
  };

  const onReset = (): void => {
    setError(null);
    void applyInstance(
      RAVEPAGE_DEFAULT_INSTANCE.appOrigin,
      RAVEPAGE_DEFAULT_INSTANCE.apiOrigin,
      'rave.page instance reset to defaults',
    );
  };

  // ---- Connect / disconnect ----
  const run = (fn: () => Promise<void>) => (): void => {
    setBusy(true);
    setError(null);
    void fn()
      .catch((e) => setError(errMessage(e)))
      .finally(() => setBusy(false));
  };
  const onConnect = run(async () => {
    setConn(await connect());
  });
  const onDisconnect = run(async () => {
    await disconnect();
    await refreshConn();
  });

  const statusText = connected
    ? `Connected${conn?.label ? ` as ${conn.label}` : ''}`
    : 'Not connected';

  return (
    <main className="p-4 bg-background min-h-screen" data-testid="settings-view">
      <header className="mb-4">
        <h1 className="font-orbitron text-2xl text-foreground">Settings</h1>
      </header>

      <div className="flex flex-col gap-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="settings-close-tabs">Close tabs opened by event-bridge</Label>
                <p className="text-2xs text-muted-foreground">Auto-close the platform tabs the extension opens for you.</p>
              </div>
              <Switch id="settings-close-tabs" data-testid="settings-close-tabs" checked={settings?.closeOpenedTabs ?? true} onCheckedChange={onCloseTabs} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="settings-test-prefix">Test event title prefix</Label>
              <Input
                id="settings-test-prefix"
                data-testid="settings-test-prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.currentTarget.value)}
                onBlur={onPrefixBlur}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Experimental</CardTitle>
              <Badge variant="info" caps>Beta</Badge>
            </div>
            <CardDescription>Optional integrations, off by default.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="settings-ravepage-toggle">rave.page integration (beta)</Label>
                <p className="text-2xs text-muted-foreground">
                  Optional integration. Off by default. vrc.tl and vrcpop.com work without it.
                </p>
              </div>
              <Switch
                id="settings-ravepage-toggle"
                data-testid="settings-ravepage-toggle"
                checked={enabled}
                onCheckedChange={onToggle}
              />
            </div>

            {enabled && (
              <Card data-testid="settings-ravepage-instance" className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Instance</CardTitle>
                  <CardDescription>
                    Point at a self-hosted or federated rave.page. Changing the instance disconnects the current session.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="settings-ravepage-app-origin">App origin</Label>
                    <Input
                      id="settings-ravepage-app-origin"
                      data-testid="settings-ravepage-app-origin"
                      value={appInput}
                      placeholder={RAVEPAGE_DEFAULT_INSTANCE.appOrigin}
                      onChange={(e) => setAppInput(e.currentTarget.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="settings-ravepage-api-origin">API origin</Label>
                    <Input
                      id="settings-ravepage-api-origin"
                      data-testid="settings-ravepage-api-origin"
                      value={apiInput}
                      placeholder={RAVEPAGE_DEFAULT_INSTANCE.apiOrigin}
                      onChange={(e) => setApiInput(e.currentTarget.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" data-testid="settings-ravepage-save" disabled={busy} onClick={onSave}>
                      Save instance
                    </Button>
                    <Button type="button" variant="outline" data-testid="settings-ravepage-reset" disabled={busy} onClick={onReset}>
                      Reset to defaults
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <Badge data-testid="settings-ravepage-status" variant={connected ? 'success' : 'secondary'}>
                      {statusText}
                    </Badge>
                    {connected ? (
                      <Button type="button" variant="outline" size="sm" data-testid="settings-ravepage-disconnect" disabled={busy} onClick={onDisconnect}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button type="button" size="sm" data-testid="settings-ravepage-connect" disabled={busy} onClick={onConnect}>
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <p data-testid="settings-error" className="text-2xs text-brand-base">
                {error}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={confirmOff}
        type="warning"
        title="Turn off rave.page integration?"
        message="rave.page will be hidden across event-bridge. vrc.tl and vrcpop.com are unaffected."
        confirmText="Turn off"
        cancelText="Keep on"
        onConfirm={confirmTurnOff}
        onCancel={() => setConfirmOff(false)}
      >
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox checked={alsoDisconnect} onCheckedChange={(v) => setAlsoDisconnect(v === true)} data-testid="settings-ravepage-forget" />
          Also disconnect (forget the stored token)
        </label>
      </ConfirmDialog>
    </main>
  );
}
