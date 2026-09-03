import { describe, expect, it } from 'vitest';
import { ref, renderPreview, resolveRefs } from '../../src/core/planner';
import type { PlannedStep } from '../../src/core/planner';
import { BridgeError } from '../../src/core/errors';

function slotStep(): PlannedStep {
  return {
    id: 'createSlot',
    platform: 'ravepage',
    kind: 'lineup',
    routeId: 'ravepage.slots.create',
    request: {
      slot_number: 1,
      event_id: ref('createEvent', 'event_id'),
      nested: { deep: [ref('createEvent', 'ids.0')] },
    },
    previewLabel: 'Create slot 1',
  };
}

describe('resolveRefs', () => {
  it('replaces refs with prior results (incl. nested + array paths)', () => {
    const resolved = resolveRefs(slotStep(), { createEvent: { event_id: 'evt_1', ids: ['a', 'b'] } });
    expect(resolved.request).toEqual({
      slot_number: 1,
      event_id: 'evt_1',
      nested: { deep: ['a'] },
    });
  });

  it('throws UNRESOLVED_REF when the referenced step is missing', () => {
    try {
      resolveRefs(slotStep(), {});
      throw new Error('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(BridgeError);
      expect((e as BridgeError).code).toBe('UNRESOLVED_REF');
    }
  });

  it('throws UNRESOLVED_REF when the referenced path is missing', () => {
    expect(() => resolveRefs(slotStep(), { createEvent: { other: 1 } })).toThrow(BridgeError);
  });
});

describe('renderPreview', () => {
  it('renders refs as <new ...> tokens', () => {
    const out = renderPreview(slotStep());
    expect(out).toContain('<new event id>');
    expect(out).toContain('Create slot 1 [ravepage:lineup]');
  });
});
