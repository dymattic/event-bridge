// One platform card for the Overview. Identical structure for all three
// platforms — no platform is highlighted or treated as primary. Status wording +
// badge intent come from ../../lib/status; the container passes the platform's
// actions (Open/Connect/Disconnect + Refresh) as a node.
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rave-page/ui';
import type { Platform } from '../../../shared/agent-protocol';
import type { StatusView } from '../../lib/status';

export interface PlatformCardProps {
  platform: Platform;
  name: string;
  host: string;
  status: StatusView;
  supports: string;
  actions: React.ReactNode;
  onGrant: () => void; // Firefox host-permission request (runs in the click gesture)
  children?: React.ReactNode; // connected-state detail (clubs, upcoming count, View events)
}

export function PlatformCard({ platform, name, host, status, supports, actions, onGrant, children }: PlatformCardProps): React.JSX.Element {
  return (
    <Card data-testid={`platform-card-${platform}`} className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription data-testid={`platform-host-${platform}`}>{host}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge data-testid={`platform-status-${platform}`} variant={status.variant}>
            {status.text}
          </Badge>
          {status.noAccess && (
            <Button type="button" variant="outline" size="sm" data-testid={`platform-grant-${platform}`} onClick={onGrant}>
              Grant access
            </Button>
          )}
        </div>
        <p data-testid={`platform-supports-${platform}`} className="text-2xs text-muted-foreground">
          {supports}
        </p>
        {children}
        <div className="flex flex-wrap gap-2">{actions}</div>
      </CardContent>
    </Card>
  );
}
