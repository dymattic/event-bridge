// EventCore invariants -> issue list. Pure; adapters/UI decide how to surface.
import type { EventCore, Performer, Slot } from './schema';
import { isValidZone } from './time';

export interface ValidationIssue {
  path: string;
  message: string;
}

function ms(iso: string): number {
  return Date.parse(iso);
}

function checkPerformers(list: Performer[], base: string, out: ValidationIssue[]): void {
  list.forEach((p, i) => {
    if (!p.name.trim()) out.push({ path: `${base}.${i}.name`, message: 'performer name empty' });
  });
}

export function validateEvent(core: EventCore): ValidationIssue[] {
  const out: ValidationIssue[] = [];

  if (!core.title.trim()) out.push({ path: 'title', message: 'title empty' });
  if (!isValidZone(core.zone)) out.push({ path: 'zone', message: `invalid zone: ${core.zone}` });

  const startMs = ms(core.start);
  if (Number.isNaN(startMs)) out.push({ path: 'start', message: 'start not a valid instant' });

  let endMs = NaN;
  if (core.end !== undefined) {
    endMs = ms(core.end);
    if (Number.isNaN(endMs)) out.push({ path: 'end', message: 'end not a valid instant' });
    else if (!Number.isNaN(startMs) && endMs <= startMs) {
      out.push({ path: 'end', message: 'end must be after start' });
    }
  }

  checkPerformers(core.hosts, 'hosts', out);
  checkPerformers(core.dancers, 'dancers', out);

  core.lineup.forEach((slot: Slot, i: number) => {
    const sMs = ms(slot.start);
    if (Number.isNaN(sMs)) {
      out.push({ path: `lineup.${i}.start`, message: 'slot start not a valid instant' });
    }
    if (slot.end !== undefined) {
      const eMs = ms(slot.end);
      if (Number.isNaN(eMs)) out.push({ path: `lineup.${i}.end`, message: 'slot end not a valid instant' });
      else if (!Number.isNaN(sMs) && eMs <= sMs) {
        out.push({ path: `lineup.${i}.end`, message: 'slot end must be after slot start' });
      }
    }
    // Slot must fall within the event span (flag out-of-span slots).
    if (!Number.isNaN(sMs) && !Number.isNaN(startMs) && sMs < startMs) {
      out.push({ path: `lineup.${i}.start`, message: 'slot starts before event start' });
    }
    if (slot.end !== undefined && !Number.isNaN(endMs)) {
      const eMs = ms(slot.end);
      if (!Number.isNaN(eMs) && eMs > endMs) {
        out.push({ path: `lineup.${i}.end`, message: 'slot ends after event end' });
      }
    }
    checkPerformers(slot.performers, `lineup.${i}.performers`, out);
    checkPerformers(slot.dancers, `lineup.${i}.dancers`, out);
    if (slot.vj && !slot.vj.name.trim()) {
      out.push({ path: `lineup.${i}.vj.name`, message: 'vj name empty' });
    }
  });

  return out;
}

export function isValidEvent(core: EventCore): boolean {
  return validateEvent(core).length === 0;
}
