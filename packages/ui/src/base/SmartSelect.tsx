import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Check, ChevronDown, ChevronUp, X as XIcon} from 'lucide-react';
import {cn} from '../lib/cn';
import {useFloatingPosition} from '../hooks/useFloatingPosition';

export type SmartSelectOption = {
    value: string;
    label: string;
    meta?: string;
    image?: string;
    keywords?: string[];
    disabled?: boolean;
};

type SmartSelectValue = string | string[] | null;

/** Menu sizing: match the trigger width (default) or size to content. */
export type SmartSelectMenuWidth = 'trigger' | 'auto';

export interface SmartSelectLabels {
    placeholder: string;
    empty: string;
    search: string;
    countSelected: (count: number) => string;
    addQuery: (query: string) => string;
}

export const smartSelectDefaultLabels: SmartSelectLabels = {
    placeholder: 'Select...',
    empty: 'No results.',
    search: 'Search...',
    countSelected: (count) => `${count} selected`,
    addQuery: (query) => `Add "${query}"`,
};

interface SmartSelectProps {
    options: SmartSelectOption[];
    value: SmartSelectValue;
    onChange: (value: SmartSelectValue) => void;
    label?: string;
    placeholder?: string;
    emptyText?: string;
    isMulti?: boolean;
    allowSearch?: boolean;
    allowCreate?: boolean;
    createLabel?: (query: string) => string;
    createValue?: (query: string) => string;
    onCreate?: (value: string) => void;
    onQueryChange?: (query: string) => void;
    filterOption?: (option: SmartSelectOption, query: string) => boolean;
    disabled?: boolean;
    className?: string;
    /** Accessible name for the trigger when there is no visible `label`. */
    ariaLabel?: string;
    /** Menu width: `'trigger'` (default) matches the trigger; `'auto'` sizes to content. */
    menuWidth?: SmartSelectMenuWidth;
    /** Fallback strings (English defaults in `smartSelectDefaultLabels`). */
    labels?: Partial<SmartSelectLabels>;
    /**
     * Render an option's thumbnail. Injected by the consumer (the rave.page app
     * passes its consent-gated `Image`). Defaults to a plain `<img>`. Only
     * called for options that have an `image`.
     */
    renderOptionImage?: (option: SmartSelectOption) => React.ReactNode;
}

const defaultFilter = (option: SmartSelectOption, query: string) => {
    const haystack = [
        option.label,
        option.value,
        option.meta ?? '',
        ...(option.keywords ?? [])
    ]
        .join(' ')
        .toLowerCase();
    return haystack.includes(query);
};

const getSelectedOptions = (options: SmartSelectOption[], values: string[]) => {
    return values.map((val) => options.find((opt) => opt.value === val) || {value: val, label: val});
};

const defaultRenderOptionImage = (option: SmartSelectOption) => (
    <img
        src={option.image}
        alt=""
        aria-hidden="true"
        className="w-10 h-10 rounded-md object-cover bg-muted shrink-0"
        onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
    />
);

const SmartSelect: React.FC<SmartSelectProps> = ({
                                                     options,
                                                     value,
                                                     onChange,
                                                     label,
                                                     placeholder,
                                                     emptyText,
                                                     isMulti = false,
                                                     allowSearch = true,
                                                     allowCreate = false,
                                                     createLabel,
                                                     createValue,
                                                     onCreate,
                                                     onQueryChange,
                                                     filterOption,
                                                     disabled = false,
                                                     className,
                                                     ariaLabel,
                                                     menuWidth = 'trigger',
                                                     labels,
                                                     renderOptionImage = defaultRenderOptionImage,
                                                 }) => {
    const l = {...smartSelectDefaultLabels, ...labels};
    const resolvedPlaceholder = placeholder ?? l.placeholder;
    const resolvedEmptyText = emptyText ?? l.empty;
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // Menu is portaled to <body> (fixed-positioned) so no ancestor stacking
    // context / transform (e.g. SlotBoard drag transforms) can trap or clip it
    // behind sibling cards. The floating-position hook keeps it inside the
    // visual viewport as the mobile keyboard opens and closes.
    // Stable ids so the trigger can `aria-labelledby` the visible label and
    // expose `aria-controls` against the listbox. Without these, SR users
    // hear just "<value>, button" with no field context.
    const reactId = React.useId();
    const labelId = label ? `smartselect-label-${reactId}` : undefined;
    const listboxId = `smartselect-listbox-${reactId}`;
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const setQueryValue = useCallback((next: string) => {
        setQuery(next);
        onQueryChange?.(next);
    }, [onQueryChange]);

    const selectedValues = useMemo(() => {
        if (Array.isArray(value)) return value;
        return value ? [value] : [];
    }, [value]);

    const selectedOptions = useMemo(
        () => getSelectedOptions(options, selectedValues),
        [options, selectedValues]
    );

    const normalizedQuery = query.trim().toLowerCase();
    const filterFn = useMemo(() => filterOption ?? defaultFilter, [filterOption]);

    const filteredOptions = useMemo(() => {
        if (!normalizedQuery) return options;
        return options.filter((opt) => filterFn(opt, normalizedQuery));
    }, [options, normalizedQuery, filterFn]);

    const canCreate = allowCreate
        && normalizedQuery.length > 0
        && !options.some((opt) => opt.value.toLowerCase() === normalizedQuery || opt.label.toLowerCase() === normalizedQuery);

    const displayText = isMulti
        ? (selectedOptions.length > 0 ? l.countSelected(selectedOptions.length) : resolvedPlaceholder)
        : (selectedOptions[0]?.label ?? resolvedPlaceholder);

    const {style: menuStyle, maxHeight: menuMaxHeight} = useFloatingPosition(triggerRef, open, {
        preferredMaxHeight: 320,
        minHeight: 140,
        matchTriggerWidth: menuWidth !== 'auto',
    });

    useEffect(() => {
        if (!open) return;
        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
                setOpen(false);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('mousedown', handleClick);
        // Capture at window before Radix Dialog's document listener.
        window.addEventListener('keydown', handleKey, true);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleKey, true);
        };
    }, [open]);

    useEffect(() => {
        if (open && allowSearch) {
            inputRef.current?.focus();
        }
    }, [open, allowSearch]);

    // Keep search visible after the mobile keyboard settles.
    useEffect(() => {
        if (!open || !allowSearch) return;
        const vv = window.visualViewport;
        if (!vv) return;
        const onResize = () => inputRef.current?.scrollIntoView({block: 'nearest'});
        vv.addEventListener('resize', onResize);
        return () => vv.removeEventListener('resize', onResize);
    }, [open, allowSearch]);

    useEffect(() => {
        if (!open && query) {
            setQueryValue('');
        }
    }, [open, query, setQueryValue]);

    const toggleValue = (nextValue: string) => {
        if (isMulti) {
            const exists = selectedValues.includes(nextValue);
            const next = exists
                ? selectedValues.filter((val) => val !== nextValue)
                : [...selectedValues, nextValue];
            onChange(next);
        } else {
            onChange(nextValue);
            setOpen(false);
        }
        setQueryValue('');
    };

    const handleCreate = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const nextValue = createValue ? createValue(trimmed) : trimmed;
        onCreate?.(nextValue);
        if (isMulti) {
            const next = selectedValues.includes(nextValue)
                ? selectedValues
                : [...selectedValues, nextValue];
            onChange(next);
        } else {
            onChange(nextValue);
            setOpen(false);
        }
        setQueryValue('');
    };

    const removeValue = (nextValue: string) => {
        if (!isMulti) return;
        const next = selectedValues.filter((val) => val !== nextValue);
        onChange(next.length ? next : []);
    };

    return (
        <div className={cn('relative', className)} ref={rootRef}>
            {label && (
                <label
                    id={labelId}
                    htmlFor={listboxId}
                    className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1"
                >
                    {label}
                </label>
            )}
            <button
                ref={triggerRef}
                id={listboxId}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                disabled={disabled}
                className={cn(
                    // Mobile-first: 44 px touch target on phones, denser at sm:
                    // where pointer is the primary input. Same baseline as the
                    // Button primitive (h-11 / sm:h-9) so SmartSelect lines up
                    // with neighbouring form controls on every breakpoint.
                    'w-full min-h-11 sm:min-h-9 flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm text-foreground shadow-sm transition-colors',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-ring',
                    !selectedOptions.length && 'text-muted-foreground'
                )}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={labelId}
                aria-label={labelId ? undefined : ariaLabel}
                aria-disabled={disabled || undefined}
            >
                <span className="truncate">{displayText}</span>
                {open
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground"/>
                    : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground"/>
                }
            </button>

            {isMulti && selectedOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => removeValue(opt.value)}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground hover:bg-accent transition-colors"
                        >
                            <span className="truncate">{opt.label}</span>
                            <XIcon className="h-3 w-3 text-muted-foreground ml-0.5"/>
                        </button>
                    ))}
                </div>
            )}

            {open && createPortal(
                <div
                    ref={menuRef}
                    // Marks this as a legitimate out-of-tree surface. A modal
                    // Radix Dialog would otherwise treat a click in here as an
                    // outside-click and dismiss itself - see DialogContent's
                    // data-portal-surface guard.
                    data-portal-surface="smart-select"
                    // pointerEvents: a modal Radix Dialog locks `body` to
                    // pointer-events:none; this menu is portaled to body, so
                    // without this its options are simply not clickable.
                    style={{pointerEvents: 'auto', ...menuStyle, maxHeight: menuMaxHeight}}
                    onMouseDown={(e) => e.stopPropagation()}
                    // Radix dismisses on native pointerdown - stopping only
                    // React's mousedown above leaves the dialog closing.
                    onPointerDown={(e) => e.stopPropagation()}
                    className="z-[9999] flex flex-col rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
                    {allowSearch && (
                        <div className="shrink-0 p-2 border-b border-border">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(event) => setQueryValue(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        if (canCreate) {
                                            handleCreate();
                                            return;
                                        }
                                        const first = filteredOptions.find((opt) => !opt.disabled);
                                        if (first) {
                                            toggleValue(first.value);
                                        }
                                    }
                                }}
                                placeholder={l.search}
                                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    )}
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1">
                        {canCreate && (
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="w-full text-left rounded-md px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
                            >
                                {createLabel ? createLabel(query.trim()) : l.addQuery(query.trim())}
                            </button>
                        )}
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-muted-foreground">{resolvedEmptyText}</div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        disabled={option.disabled}
                                        onClick={() => toggleValue(option.value)}
                                        className={cn(
                                            'w-full text-left rounded-md px-3 py-2 text-sm transition-colors',
                                            option.disabled
                                                ? 'text-muted-foreground/50 cursor-not-allowed'
                                                : 'text-foreground hover:bg-accent',
                                            isSelected && 'bg-accent'
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            {option.image && renderOptionImage(option)}
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate">{option.label}</div>
                                                {option.meta && (
                                                    <div
                                                        className="text-xs text-muted-foreground truncate">{option.meta}</div>
                                                )}
                                            </div>
                                            {isMulti && isSelected && (
                                                <Check className="h-4 w-4 shrink-0 text-brand-mint"/>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SmartSelect;
