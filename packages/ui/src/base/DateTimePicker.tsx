import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as Popover from '@radix-ui/react-popover';
import dayjs from 'dayjs';
import {Calendar, ChevronLeft, ChevronRight, Clock} from 'lucide-react';
import {cn} from '../lib/cn';
import {Button} from './Button';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export interface DateTimePickerLabels {
    selectDateTime: string;
    prevMonth: string;
    nextMonth: string;
    calendar: string;
    increaseHour: string;
    hour: string;
    decreaseHour: string;
    increaseMinute: string;
    minute: string;
    decreaseMinute: string;
    now: string;
    clear: string;
    done: string;
}

export const dateTimePickerDefaultLabels: DateTimePickerLabels = {
    selectDateTime: 'Select date & time…',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    calendar: 'Calendar',
    increaseHour: 'Increase hour',
    hour: 'Hour',
    decreaseHour: 'Decrease hour',
    increaseMinute: 'Increase minute',
    minute: 'Minute',
    decreaseMinute: 'Decrease minute',
    now: 'Now',
    clear: 'Clear',
    done: 'Done',
};

interface DateTimePickerProps {
    /** Current value - ISO string, 'YYYY-MM-DDTHH:mm', or empty string */
    value: string;
    /** Called with 'YYYY-MM-DDTHH:mm' string (local) or '' when cleared */
    onChange: (datetime: string) => void;
    /** Minimum selectable datetime (ISO or YYYY-MM-DDTHH:mm) */
    min?: string;
    /** Maximum selectable datetime (ISO or YYYY-MM-DDTHH:mm) */
    max?: string;
    /** Placeholder text shown when no datetime is selected */
    placeholder?: string;
    /** Whether the picker is disabled */
    disabled?: boolean;
    /** Additional classes for the trigger button */
    className?: string;
    /** Accessible label */
    'aria-label'?: string;
    /** HTML id for the trigger */
    id?: string;
    /** HTML name (for form usage) */
    name?: string;
    /** Accessible strings (English defaults in `dateTimePickerDefaultLabels`). */
    labels?: Partial<DateTimePickerLabels>;
}

/**
 * Custom datetime picker that replaces `<input type="datetime-local">`.
 * Combines a calendar date grid with hour/minute selectors.
 * Uses design-system tokens and is cross-browser consistent.
 */
const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
    (
        {
            value,
            onChange,
            min,
            max,
            placeholder,
            disabled = false,
            className,
            id,
            name,
            labels,
            ...props
        },
        ref,
    ) => {
        const l = {...dateTimePickerDefaultLabels, ...labels};
        const resolvedPlaceholder = placeholder ?? l.selectDateTime;
        const [open, setOpen] = useState(false);

        const parsed = useMemo(() => (value ? dayjs(value) : null), [value]);
        const [viewDate, setViewDate] = useState(() => (parsed?.isValid() ? parsed : dayjs()));
        const [hour, setHour] = useState(() => (parsed?.isValid() ? parsed.hour() : 20));
        const [minute, setMinute] = useState(() => (parsed?.isValid() ? parsed.minute() : 0));

        // Committed selection driving the trigger label. Mirrors `value`, but is
        // also set locally the moment the user picks, so the button always shows
        // what was chosen instead of depending on the parent echoing the value
        // back in a shape this component can re-parse.
        const [committed, setCommitted] = useState<dayjs.Dayjs | null>(() =>
            parsed?.isValid() ? parsed : null,
        );

        // Sync when value changes externally. An explicitly empty value is a
        // clear; an unparseable one leaves the last good selection alone.
        useEffect(() => {
            if (parsed?.isValid()) {
                setViewDate(parsed);
                setHour(parsed.hour());
                setMinute(parsed.minute());
                setCommitted(parsed);
            } else if (!value) {
                setCommitted(null);
            }
        }, [parsed, value]);

        const minDt = useMemo(() => (min ? dayjs(min) : null), [min]);
        const maxDt = useMemo(() => (max ? dayjs(max) : null), [max]);

        const isDateDisabled = useCallback(
            (d: dayjs.Dayjs) => {
                if (minDt && d.isBefore(minDt, 'day')) return true;
                if (maxDt && d.isAfter(maxDt, 'day')) return true;
                return false;
            },
            [minDt, maxDt],
        );

        const calendarDays = useMemo(() => {
            const startOfMonth = viewDate.startOf('month');
            const dayOfWeek = (startOfMonth.day() + 6) % 7;
            const gridStart = startOfMonth.subtract(dayOfWeek, 'day');
            const days: dayjs.Dayjs[] = [];
            for (let i = 0; i < 42; i++) {
                days.push(gridStart.add(i, 'day'));
            }
            return days;
        }, [viewDate]);

        const emitChange = useCallback(
            (date: dayjs.Dayjs, h: number, m: number) => {
                const dt = date.hour(h).minute(m).second(0);
                if (!dt.isValid()) return;
                setCommitted(dt);
                onChange(dt.format('YYYY-MM-DDTHH:mm'));
            },
            [onChange],
        );

        const handleSelectDate = useCallback(
            (d: dayjs.Dayjs) => {
                if (isDateDisabled(d)) return;
                setViewDate(d);
                emitChange(d, hour, minute);
            },
            [isDateDisabled, emitChange, hour, minute],
        );

        // Time edits apply to the committed day (falling back to the parsed
        // value); keying off `parsed` alone made them no-ops whenever the
        // parent hadn't echoed a date back yet.
        const activeDay = committed ?? (parsed?.isValid() ? parsed : null);

        const handleHourChange = useCallback(
            (h: number) => {
                setHour(h);
                if (activeDay) {
                    emitChange(activeDay, h, minute);
                }
            },
            [activeDay, emitChange, minute],
        );

        const handleMinuteChange = useCallback(
            (m: number) => {
                setMinute(m);
                if (activeDay) {
                    emitChange(activeDay, hour, m);
                }
            },
            [activeDay, emitChange, hour],
        );

        const goToPrevMonth = useCallback(
            () => setViewDate((prev) => prev.subtract(1, 'month')),
            [],
        );
        const goToNextMonth = useCallback(
            () => setViewDate((prev) => prev.add(1, 'month')),
            [],
        );

        const gridRef = useRef<HTMLDivElement>(null);

        const handleGridKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                const focused = document.activeElement as HTMLButtonElement;
                const dateStr = focused?.getAttribute('data-date');
                if (!dateStr) return;

                let next = dayjs(dateStr);
                let handled = true;

                switch (e.key) {
                    case 'ArrowLeft':
                        next = next.subtract(1, 'day');
                        break;
                    case 'ArrowRight':
                        next = next.add(1, 'day');
                        break;
                    case 'ArrowUp':
                        next = next.subtract(7, 'day');
                        break;
                    case 'ArrowDown':
                        next = next.add(7, 'day');
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        handleSelectDate(next);
                        return;
                    default:
                        handled = false;
                }

                if (handled) {
                    e.preventDefault();
                    if (!next.isSame(viewDate, 'month')) {
                        setViewDate(next.startOf('month'));
                    }
                    requestAnimationFrame(() => {
                        const nextBtn = gridRef.current?.querySelector(
                            `[data-date="${next.format('YYYY-MM-DD')}"]`,
                        ) as HTMLButtonElement | null;
                        nextBtn?.focus();
                    });
                }
            },
            [viewDate, handleSelectDate],
        );

        const selectedDay = committed;

        const displayValue = selectedDay
            ? selectedDay
                .hour(hour)
                .minute(minute)
                .format('MMM D, YYYY · HH:mm')
            : resolvedPlaceholder;

        return (
            <Popover.Root open={open} onOpenChange={setOpen}>
                {name && (
                    <input
                        type="hidden"
                        name={name}
                        value={
                            selectedDay
                                ? selectedDay.hour(hour).minute(minute).second(0).format('YYYY-MM-DDTHH:mm')
                                : ''
                        }
                    />
                )}
                <Popover.Trigger asChild>
                    <button
                        ref={ref}
                        id={id}
                        type="button"
                        disabled={disabled}
                        aria-label={props['aria-label']}
                        className={cn(
                            'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
                            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            !selectedDay && 'text-muted-foreground',
                            className,
                        )}
                    >
                        <span className="truncate">{displayValue}</span>
                        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground"/>
                    </button>
                </Popover.Trigger>

                <Popover.Portal>
                    <Popover.Content
                        className="z-(--z-popover) w-[304px] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95"
                        sideOffset={4}
                        align="start"
                    >
                        {/* Month / year navigation */}
                        <div className="mb-2 flex items-center justify-between">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 sm:h-8 sm:w-8"
                                onClick={goToPrevMonth}
                                aria-label={l.prevMonth}
                            >
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>
                            <span className="text-sm font-semibold text-foreground">
                                {viewDate.format('MMMM YYYY')}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 sm:h-8 sm:w-8"
                                onClick={goToNextMonth}
                                aria-label={l.nextMonth}
                            >
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </div>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-0 text-center mb-1">
                            {WEEKDAYS.map((d) => (
                                <div
                                    key={d}
                                    className="text-[11px] font-medium text-muted-foreground py-1"
                                >
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Day grid */}
                        <div
                            ref={gridRef}
                            className="grid grid-cols-7 gap-0"
                            role="grid"
                            aria-label={l.calendar}
                            onKeyDown={handleGridKeyDown}
                        >
                            {calendarDays.map((day) => {
                                const isCurrentMonth = day.isSame(viewDate, 'month');
                                const isSelected =
                                    selectedDay !== null &&
                                    day.isSame(selectedDay, 'day');
                                const isToday = day.isSame(dayjs(), 'day');
                                const isDayDisabled = isDateDisabled(day);

                                return (
                                    <button
                                        key={day.format('YYYY-MM-DD')}
                                        type="button"
                                        data-date={day.format('YYYY-MM-DD')}
                                        disabled={isDayDisabled}
                                        tabIndex={
                                            isSelected ||
                                            (!selectedDay && isToday && isCurrentMonth)
                                                ? 0
                                                : -1
                                        }
                                        onClick={() => handleSelectDate(day)}
                                        className={cn(
                                            'relative flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                            !isCurrentMonth && 'text-muted-foreground/40',
                                            isCurrentMonth && !isSelected && 'text-foreground hover:bg-accent',
                                            isToday && !isSelected && 'font-bold text-primary',
                                            isSelected &&
                                            'bg-primary text-primary-foreground font-semibold hover:bg-primary/90',
                                            isDayDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent',
                                        )}
                                        aria-label={day.format('dddd, MMMM D, YYYY')}
                                        aria-selected={isSelected}
                                    >
                                        {day.date()}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time selector - fully custom, no native <select> */}
                        <div className="mt-2 border-t border-border pt-2">
                            <div className="flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground"/>
                                <div className="flex items-center gap-1">
                                    {/* Hour spinner */}
                                    <div className="flex flex-col items-center">
                                        <button
                                            type="button"
                                            aria-label={l.increaseHour}
                                            onClick={() => handleHourChange((hour + 1) % 24)}
                                            className="flex items-center justify-center h-10 w-10 sm:h-7 sm:w-10 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <ChevronLeft className="h-3 w-3 rotate-90"/>
                                        </button>
                                        <div
                                            className="h-10 w-10 sm:h-8 sm:w-10 rounded-md border border-input bg-background flex items-center justify-center text-sm font-mono font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-ns-resize select-none"
                                            role="spinbutton"
                                            aria-label={l.hour}
                                            aria-valuenow={hour}
                                            aria-valuemin={0}
                                            aria-valuemax={23}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'ArrowUp') handleHourChange((hour + 1) % 24);
                                                if (e.key === 'ArrowDown') handleHourChange((hour + 23) % 24);
                                            }}
                                            onWheel={(e) => {
                                                e.preventDefault();
                                                handleHourChange(e.deltaY < 0 ? (hour + 1) % 24 : (hour + 23) % 24);
                                            }}
                                        >
                                            {String(hour).padStart(2, '0')}
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={l.decreaseHour}
                                            onClick={() => handleHourChange((hour + 23) % 24)}
                                            className="flex items-center justify-center h-10 w-10 sm:h-7 sm:w-10 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <ChevronRight className="h-3 w-3 rotate-90"/>
                                        </button>
                                    </div>
                                    <span className="text-foreground font-medium text-lg pb-0.5">:</span>
                                    {/* Minute spinner */}
                                    <div className="flex flex-col items-center">
                                        <button
                                            type="button"
                                            aria-label={l.increaseMinute}
                                            onClick={() => handleMinuteChange((Math.floor(minute / 5) * 5 + 5) % 60)}
                                            className="flex items-center justify-center h-10 w-10 sm:h-7 sm:w-10 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <ChevronLeft className="h-3 w-3 rotate-90"/>
                                        </button>
                                        <div
                                            className="h-10 w-10 sm:h-8 sm:w-10 rounded-md border border-input bg-background flex items-center justify-center text-sm font-mono font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-ns-resize select-none"
                                            role="spinbutton"
                                            aria-label={l.minute}
                                            aria-valuenow={minute}
                                            aria-valuemin={0}
                                            aria-valuemax={55}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'ArrowUp') handleMinuteChange((Math.floor(minute / 5) * 5 + 5) % 60);
                                                if (e.key === 'ArrowDown') handleMinuteChange((Math.floor(minute / 5) * 5 + 55) % 60);
                                            }}
                                            onWheel={(e) => {
                                                e.preventDefault();
                                                handleMinuteChange(e.deltaY < 0 ? (Math.floor(minute / 5) * 5 + 5) % 60 : (Math.floor(minute / 5) * 5 + 55) % 60);
                                            }}
                                        >
                                            {String(minute).padStart(2, '0')}
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={l.decreaseMinute}
                                            onClick={() => handleMinuteChange((Math.floor(minute / 5) * 5 + 55) % 60)}
                                            className="flex items-center justify-center h-10 w-10 sm:h-7 sm:w-10 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <ChevronRight className="h-3 w-3 rotate-90"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex justify-center gap-1 border-t border-border pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                    const now = dayjs();
                                    if (!isDateDisabled(now)) {
                                        setViewDate(now);
                                        setHour(now.hour());
                                        setMinute(Math.floor(now.minute() / 5) * 5);
                                        emitChange(now, now.hour(), Math.floor(now.minute() / 5) * 5);
                                    }
                                }}
                            >
                                {l.now}
                            </Button>
                            {selectedDay && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground"
                                    onClick={() => {
                                        onChange('');
                                        setOpen(false);
                                    }}
                                >
                                    {l.clear}
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                className="text-xs"
                                onClick={() => setOpen(false)}
                            >
                                {l.done}
                            </Button>
                        </div>

                        <Popover.Arrow className="fill-border"/>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        );
    },
);

DateTimePicker.displayName = 'DateTimePicker';

export {DateTimePicker};
export type {DateTimePickerProps};
