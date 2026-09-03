// Kitchen-sink view exercising every @rave-page/ui export with sample props.
// Proves the vendored kit renders + its Tailwind classes reach the built CSS.
// NOT wired into the router here (App.tsx is owned by another unit) — the lead
// adds one line to dashboard/App.tsx to mount it at #/kit (see e2e/tests/kit.spec.ts).
import { useState } from 'react';
import { Calendar, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  ColorPicker,
  ConfirmDialog,
  DashboardCard,
  DashboardListRow,
  DashboardTile,
  DataTable,
  DatePicker,
  DateTimePicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  IconButtonWithTooltip,
  Input,
  InputDialog,
  Label,
  LoadingSpinner,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeSlider,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SmartSelect,
  StatCard,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useNotification,
  type BadgeProps,
  type ButtonProps,
  type Column,
  type SmartSelectOption,
} from '@rave-page/ui';

const BUTTON_VARIANTS: NonNullable<ButtonProps['variant']>[] = [
  'default', 'primary', 'go', 'explore', 'warn', 'destructive', 'outline', 'secondary', 'ghost', 'link',
];
const BADGE_VARIANTS: NonNullable<BadgeProps['variant']>[] = [
  'default', 'success', 'info', 'warning', 'error', 'secondary', 'destructive', 'outline',
];

const SELECT_OPTIONS: SmartSelectOption[] = [
  { value: 'techno', label: 'Techno' },
  { value: 'house', label: 'House' },
  { value: 'dnb', label: 'Drum & Bass' },
];

interface DemoRow { id: string; name: string; genre: string; }
const TABLE_ROWS: DemoRow[] = [
  { id: '1', name: 'Neon Nights', genre: 'Techno' },
  { id: '2', name: 'Sunrise Set', genre: 'House' },
];
const TABLE_COLUMNS: Column<DemoRow>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Genre', accessor: (r) => <span className="text-brand-mint-soft">{r.genre}</span> },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="font-orbitron text-sm uppercase tracking-wider text-muted-foreground mb-2">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function KitShowcase() {
  const { addNotification } = useNotification();
  const [checked, setChecked] = useState(false);
  const [on, setOn] = useState(true); // Switch defaults checked -> mint bg (e2e assertion)
  const [range, setRange] = useState<[number, number]>([20, 80]);
  const [genre, setGenre] = useState<string | null>('techno');
  const [date, setDate] = useState('2026-09-10');
  const [dateTime, setDateTime] = useState('2026-09-10T22:00');
  const [color, setColor] = useState('#F70864');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);

  return (
    <main className="p-4 bg-background min-h-screen" data-testid="kit-showcase">
      <h1 className="font-orbitron text-2xl text-foreground mb-4">@rave-page/ui showcase</h1>

      <Section title="Buttons">
        {BUTTON_VARIANTS.map((v) => (
          <Button key={v} variant={v} data-testid={`kit-button-${v}`}>
            {v}
          </Button>
        ))}
        <Button variant="default" size="sm">sm</Button>
        <Button variant="default" size="lg">lg</Button>
        <Button variant="go" tooltip="Saved to the timeline" data-testid="kit-button-tooltip">
          <Sparkles /> With tooltip
        </Button>
        <IconButtonWithTooltip icon={<Plus />} tooltip="Add event" data-testid="kit-iconbutton" />
      </Section>

      <Section title="Badges">
        {BADGE_VARIANTS.map((v) => (
          <Badge key={v} variant={v} data-testid={`kit-badge-${v}`}>
            {v}
          </Badge>
        ))}
        <Badge variant="success" dot caps>live</Badge>
      </Section>

      <Section title="Cards">
        <Card data-testid="kit-card" className="w-64">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>Body content.</CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">Action</Button>
          </CardFooter>
        </Card>
        <DashboardCard data-testid="kit-dashboardcard" className="w-64">
          <DashboardTile>Tile A</DashboardTile>
          <DashboardListRow selected data-testid="kit-dashboardlistrow">Row (selected)</DashboardListRow>
        </DashboardCard>
        <StatCard data-testid="kit-statcard" label="Slots" value={12} icon={<Calendar />} trailing={<Badge variant="success">+2</Badge>} />
      </Section>

      <Section title="Empty / loading">
        <EmptyState
          data-testid="kit-emptystate"
          icon={<Sparkles />}
          title="No events yet"
          description="Create your first event to see it here."
          action={<Button size="sm">New event</Button>}
        />
        <LoadingSpinner size="md" />
      </Section>

      <Section title="Form controls">
        <div className="flex flex-col gap-1">
          <Label htmlFor="kit-input">Search</Label>
          <Input id="kit-input" data-testid="kit-input" leading={<Search />} placeholder="Search…" defaultValue="" />
        </div>
        <Textarea data-testid="kit-textarea" placeholder="Notes" defaultValue="" />
        <label className="flex items-center gap-2 text-foreground">
          <Checkbox checked={checked} onCheckedChange={(c) => setChecked(c === true)} data-testid="kit-checkbox" />
          Checkbox
        </label>
        <label className="flex items-center gap-2 text-foreground">
          <Switch checked={on} onCheckedChange={setOn} data-testid="kit-switch" />
          Switch
        </label>
        <div className="w-56">
          <RangeSlider min={0} max={100} value={range} onChange={setRange} ariaLabels={['low', 'high']} />
        </div>
        <div className="w-56">
          <SmartSelect
            options={SELECT_OPTIONS}
            value={genre}
            onChange={(v) => setGenre(typeof v === 'string' ? v : null)}
            label="Genre"
            allowSearch
          />
        </div>
        <ColorPicker value={color} onChange={setColor} label="Accent" />
      </Section>

      <Section title="Date / time">
        <DatePicker value={date} onChange={setDate} aria-label="Event date" />
        <DateTimePicker value={dateTime} onChange={setDateTime} aria-label="Event start" />
      </Section>

      <Section title="Overlays">
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="kit-dialog-trigger">Open dialog</Button>
          </DialogTrigger>
          <DialogContent resizable={false} data-testid="kit-dialog-content">
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>A resizable modal from the kit.</DialogDescription>
            </DialogHeader>
            <p className="text-foreground">Dialog body.</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" data-testid="kit-dialog-close">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="warn" onClick={() => setConfirmOpen(true)} data-testid="kit-confirm-trigger">
          Confirm dialog
        </Button>
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Discard draft?"
          message="This cannot be undone."
          type="warning"
          onConfirm={() => setConfirmOpen(false)}
          onCancel={() => setConfirmOpen(false)}
        />

        <Button variant="explore" onClick={() => setInputOpen(true)} data-testid="kit-input-trigger">
          Input dialog
        </Button>
        <InputDialog
          isOpen={inputOpen}
          title="Rename event"
          initialValue="Neon Nights"
          onConfirm={() => setInputOpen(false)}
          onCancel={() => setInputOpen(false)}
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" data-testid="kit-sheet-trigger">Open sheet</Button>
          </SheetTrigger>
          <SheetContent data-testid="kit-sheet-content">
            <SheetHeader>
              <SheetTitle>Sheet title</SheetTitle>
              <SheetDescription>A slide-over drawer.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" data-testid="kit-popover-trigger">Popover</Button>
          </PopoverTrigger>
          <PopoverContent data-testid="kit-popover-content">Popover content.</PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" data-testid="kit-dropdown-trigger">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent data-testid="kit-dropdown-content">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="link" data-testid="kit-tooltip-trigger">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Standalone tooltip.</TooltipContent>
        </Tooltip>

        <Button
          variant="go"
          data-testid="kit-toast-trigger"
          onClick={() => addNotification('Saved to the timeline', 'success')}
        >
          Fire toast
        </Button>
      </Section>

      <Section title="Layout">
        <div className="w-full">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lineup">Lineup</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-foreground">Overview tab.</TabsContent>
            <TabsContent value="lineup" className="text-foreground">Lineup tab.</TabsContent>
          </Tabs>
        </div>
        <Separator className="my-2" />
        <div className="w-full max-w-md">
          <DataTable data={TABLE_ROWS} columns={TABLE_COLUMNS} keyExtractor={(r) => r.id} />
        </div>
      </Section>
    </main>
  );
}
