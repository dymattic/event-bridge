// Typed message bus between dashboard/background and injected agents.
export type AgentMessage = { type: 'ping' };
export type AgentResponse = { ok: true; origin: string; buildId: string };
