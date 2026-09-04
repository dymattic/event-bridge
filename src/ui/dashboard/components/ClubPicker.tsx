// Multi-select over own club NAMES (never ids), grouped visually by platform via
// the option meta line. Backed by the kit SmartSelect (searchable).
import { SmartSelect, type SmartSelectOption } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { PLATFORM_NAME, PLATFORM_ORDER } from '../../lib/platform-meta';

export interface ClubRef {
  id: string;
  name: string;
  platform: Platform;
}

export function ClubPicker({
  clubs,
  value,
  onChange,
}: {
  clubs: ClubRef[];
  value: string[];
  onChange: (ids: string[]) => void;
}): React.JSX.Element {
  const options: SmartSelectOption[] = [...clubs]
    .sort((a, b) => PLATFORM_ORDER.indexOf(a.platform) - PLATFORM_ORDER.indexOf(b.platform) || a.name.localeCompare(b.name))
    .map((c) => ({ value: c.id, label: c.name, meta: PLATFORM_NAME[c.platform], keywords: [PLATFORM_NAME[c.platform]] }));

  return (
    <div data-testid="events-filter-club">
      <SmartSelect
        label="Club"
        isMulti
        allowSearch
        options={options}
        value={value}
        placeholder="All clubs"
        onChange={(v) => onChange(Array.isArray(v) ? v : v ? [v] : [])}
      />
    </div>
  );
}
