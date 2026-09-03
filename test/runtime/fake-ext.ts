// Minimal promise-based fake of the WebExtension surface the runtime uses.
// Configurable + records calls. Shape covers tabs/scripting/permissions/runtime/
// storage/windows as consumed by src/runtime/*.

export interface FakeTab {
  id: number;
  url?: string;
  status?: string;
  active?: boolean;
  windowId?: number;
}

export interface FakePort {
  name: string;
  onMessage: { addListener: (cb: (m: unknown) => void) => void; removeListener: (cb: (m: unknown) => void) => void };
  onDisconnect: { addListener: (cb: () => void) => void; removeListener: (cb: () => void) => void };
  postMessage: (m: unknown) => void;
  disconnect: () => void;
}

export interface FakeConfig {
  contains?: boolean;
  requestResult?: boolean;
  tabs?: FakeTab[];
  createdTabStatus?: string;
  pingBuildIds?: string[]; // sequential ping replies; default 'test'
  connect?: (tabId: number, info: { name: string }) => FakePort;
  storage?: Record<string, unknown>;
}

export interface FakeCalls {
  executeScriptTargets: number[];
  reloads: number[];
  created: FakeTab[];
  removed: number[];
  sendMessages: { tabId: number; msg: unknown }[];
}

export interface Fake {
  ext: FakeExt;
  calls: FakeCalls;
  config: FakeConfig;
  emitStorageChange: (key: string, newValue: unknown, oldValue?: unknown) => void;
}

type Listener = (...args: unknown[]) => void;

function event() {
  const ls = new Set<Listener>();
  return {
    addListener: (cb: Listener) => ls.add(cb),
    removeListener: (cb: Listener) => ls.delete(cb),
    emit: (...args: unknown[]) => ls.forEach((l) => l(...args)),
  };
}

// The returned ext is intentionally loosely typed; tests assign it into the
// vi.mock getter (unknown), never against the real chrome types.
export type FakeExt = ReturnType<typeof buildExt>;

function buildExt(config: FakeConfig, calls: FakeCalls, storageChanged: ReturnType<typeof event>) {
  const tabsById = new Map<number, FakeTab>();
  for (const t of config.tabs ?? []) tabsById.set(t.id, t);
  let nextId = 1000;
  const buildIds = [...(config.pingBuildIds ?? [])];
  const storage: Record<string, unknown> = { ...(config.storage ?? {}) };

  const tabsUpdated = event();
  const tabsRemoved = event();

  return {
    runtime: {
      getURL: (p: string) => `chrome-extension://fake/${p}`,
      onMessage: event(),
      onConnect: event(),
      connect: () => {
        throw new Error('runtime.connect not used');
      },
    },
    tabs: {
      query: async (q: { url?: string }): Promise<FakeTab[]> => {
        const all = [...tabsById.values()];
        if (!q.url) return all;
        const prefix = q.url.replace(/\*$/, '');
        return all.filter((t) => (t.url ?? '').startsWith(prefix));
      },
      get: async (id: number): Promise<FakeTab> => {
        const t = tabsById.get(id);
        if (!t) throw new Error(`no tab ${id}`);
        return t;
      },
      create: async (props: { url: string; active?: boolean }): Promise<FakeTab> => {
        const tab: FakeTab = { id: ++nextId, url: props.url, active: props.active ?? true, status: config.createdTabStatus ?? 'complete', windowId: 1 };
        tabsById.set(tab.id, tab);
        calls.created.push(tab);
        return tab;
      },
      update: async (id: number, props: { active?: boolean }): Promise<FakeTab> => {
        const t = tabsById.get(id);
        if (t && props.active != null) t.active = props.active;
        return t ?? { id };
      },
      remove: async (id: number): Promise<void> => {
        tabsById.delete(id);
        calls.removed.push(id);
      },
      reload: async (id: number): Promise<void> => {
        calls.reloads.push(id);
      },
      sendMessage: async (tabId: number, msg: unknown): Promise<unknown> => {
        calls.sendMessages.push({ tabId, msg });
        const buildId = buildIds.shift() ?? 'test';
        return { ok: true, buildId, origin: 'https://mock.example' };
      },
      connect: (tabId: number, info: { name: string }): FakePort => {
        if (config.connect) return config.connect(tabId, info);
        return {
          name: info.name,
          onMessage: { addListener: () => undefined, removeListener: () => undefined },
          onDisconnect: { addListener: () => undefined, removeListener: () => undefined },
          postMessage: () => undefined,
          disconnect: () => undefined,
        };
      },
      onUpdated: tabsUpdated,
      onRemoved: tabsRemoved,
    },
    scripting: {
      executeScript: async (opts: { target: { tabId: number } }): Promise<unknown[]> => {
        calls.executeScriptTargets.push(opts.target.tabId);
        return [];
      },
    },
    permissions: {
      contains: async (): Promise<boolean> => config.contains ?? true,
      request: async (): Promise<boolean> => config.requestResult ?? true,
    },
    storage: {
      local: {
        get: async (key: string): Promise<Record<string, unknown>> => (key in storage ? { [key]: storage[key] } : {}),
        set: async (obj: Record<string, unknown>): Promise<void> => {
          for (const [k, v] of Object.entries(obj)) {
            const oldValue = storage[k];
            storage[k] = v;
            storageChanged.emit({ [k]: { newValue: v, oldValue } }, 'local');
          }
        },
      },
      onChanged: storageChanged,
    },
    windows: {
      update: async (): Promise<void> => undefined,
    },
  };
}

export function createFake(config: FakeConfig = {}): Fake {
  const calls: FakeCalls = { executeScriptTargets: [], reloads: [], created: [], removed: [], sendMessages: [] };
  const storageChanged = event();
  const ext = buildExt(config, calls, storageChanged);
  return {
    ext,
    calls,
    config,
    emitStorageChange: (key, newValue, oldValue) => storageChanged.emit({ [key]: { newValue, oldValue } }, 'local'),
  };
}
