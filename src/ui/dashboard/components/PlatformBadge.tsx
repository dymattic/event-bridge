// Neutral platform tag. Functional neutrality: every platform gets the same
// treatment (outline, no brand hue that would privilege one), only the name differs.
import { Badge } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import { PLATFORM_NAME } from '../../lib/platform-meta';

export function PlatformBadge({ platform }: { platform: Platform }): React.JSX.Element {
  return (
    <Badge variant="outline" data-testid={`platform-badge-${platform}`}>
      {PLATFORM_NAME[platform]}
    </Badge>
  );
}
