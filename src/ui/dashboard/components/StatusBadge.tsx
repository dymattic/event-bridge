// Status / visibility chip. Maps a platform status or audience string to a kit
// Badge intent. Renders nothing when the value is absent.
import { Badge, type BadgeProps } from '@rave-page/ui';

type Variant = BadgeProps['variant'];

function variantFor(value: string): Variant {
  const s = value.toLowerCase();
  if (['published', 'public', 'live', 'active', 'promoted'].includes(s)) return 'success';
  if (s === 'draft') return 'secondary';
  if (['unlisted', 'followers', 'private', 'hidden'].includes(s)) return 'info';
  return 'outline';
}

export function StatusBadge({ value, testId }: { value?: string; testId?: string }): React.JSX.Element | null {
  if (!value) return null;
  return (
    <Badge variant={variantFor(value)} data-testid={testId}>
      {value}
    </Badge>
  );
}
