import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as Popover from '@radix-ui/react-popover';
import dayjs from 'dayjs';
import {Calendar, ChevronLeft, ChevronRight} from 'lucide-react';
import {cn} from '../lib/cn';
import {Button} from './Button';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export interface DatePickerLabels {
    selectDate: string;
    prevMonth: string;
    nextMonth: string;
    calendar: string;
    today: string;
    clear: string;
}

export const datePickerDefaultLabels: DatePickerLabels = {
    selectDate: 'Select date…',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    calendar: 'Calendar',
    today: 'Today',
    clear: 'Clear',
};

interface DatePickerProps {
    /** Current value in YYYY-MM-DD format */
    value: string;
    /** Called with YYYY-MM-DD string when a date is selected */
    onChange: (date: string) => void;
    /** Minimum selectable date in YYYY-MM-DD format */
    min?: string;
    /** Maximum selectable date in YYYY-MM-DD format */
    max?: string;
    /** Placeholder text shown when no date is selected */
    placeholder?: string;
    /** Whether the picker is disabled */
    disabled?: boolean;
    /** Additional classes for the trigger button */
    className?: string;
    /** Accessible label for the date picker */
    'aria-label'?: string;
    /** HTML id for the trigger */
    id?: string;
    /** Accessible strings (English defaults in `datePickerDefaultLabels`). */
    labels?: Partial<DatePickerLabels>;
}

/**
 * Custom date picker component that replaces the native `<input type="date">`.
 * Renders a calendar popover with month navigation, keyboard support,
 * and design-system-consistent styling.
 *
 * @remarks
 * Uses `@radix-ui/react-popover` for positioning and focus management.
 * Uses `dayjs` for date calculations.
 */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
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
            labels,
            ...props
        },
        ref,
    ) => {
        const l = {...datePickerDefaultLabels, ...labels};
        const resolvedPlaceholder = placeholder ?? l.selectDate;
        const [open, setOpen] = useState(false);
        const [viewDate, setViewDate] = useState(() =>
            value ? dayjs(value) : dayjs(),
        );

        // Sync view when value changes externally
        useEffect(() => {
            if (value) setViewDate(dayjs(value));
        }, [value]);

        const selectedDay = useMemo(
            () => (value ? dayjs(value) : null),
            [value],
        );

        const minDate = useMemo(() => (min ? dayjs(min) : null), [min]);
        const maxDate = useMemo(() => (max ? dayjs(max) : null), [max]);

        const isDateDisabled = useCallback(
            (d: dayjs.Dayjs) => {
                if (minDate && d.isBefore(minDate, 'day')) return true;
                if (maxDate && d.isAfter(maxDate, 'day')) return true;
                return false;
            },
            [minDate, maxDate],
        );

        /** Build the 6-row calendar grid for the current view month */
        const calendarDays = useMemo(() => {
            const startOfMonth = viewDate.startOf('month');
            // dayjs uses 0=Sunday, we want Monday=0
            const dayOfWeek = (startOfMonth.day() + 6) % 7;
            const gridStart = startOfMonth.subtract(dayOfWeek, 'day');

            const days: dayjs.Dayjs[] = [];
            for (let i = 0; i < 42; i++) {
                days.push(gridStart.add(i, 'day'));
            }
            return days;
        }, [viewDate]);

        const handleSelect = useCallback(
            (d: dayjs.Dayjs) => {
                if (isDateDisabled(d)) return;
                onChange(d.format('YYYY-MM-DD'));
                setOpen(false);
            },
            [onChange, isDateDisabled],
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
                        handleSelect(next);
                        return;
                    default:
                        handled = false;
                }

                if (handled) {
                    e.preventDefault();
                    // Navigate month if needed
                    if (!next.isSame(viewDate, 'month')) {
                        setViewDate(next.startOf('month'));
                    }
                    // Focus the cell on next render
                    requestAnimationFrame(() => {
                        const nextBtn = gridRef.current?.querySelector(
                            `[data-date="${next.format('YYYY-MM-DD')}"]`,
                        ) as HTMLButtonElement | null;
                        nextBtn?.focus();
                    });
                }
            },
            [viewDate, handleSelect],
        );

        const displayValue = selectedDay
            ? selectedDay.format('MMM D, YYYY')
            : resolvedPlaceholder;

        return (
            <Popover.Root open={open} onOpenChange={setOpen}>
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
                        className="z-(--z-popover) w-72 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95"
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
                                            (!selectedDay &&
                                                isToday &&
                                                isCurrentMonth)
                                                ? 0
                                                : -1
                                        }
                                        onClick={() => handleSelect(day)}
                                        className={cn(
                                            'relative flex h-9 w-full items-center justify-center rounded-md text-sm transition-colors',
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

                        {/* Today shortcut */}
                        <div className="mt-2 flex justify-center border-t border-border pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                    const today = dayjs();
                                    if (!isDateDisabled(today)) {
                                        handleSelect(today);
                                    } else {
                                        setViewDate(today);
                                    }
                                }}
                            >
                                {l.today}
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
                        </div>

                        <Popover.Arrow className="fill-border"/>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        );
    },
);

DatePicker.displayName = 'DatePicker';

export {DatePicker};
