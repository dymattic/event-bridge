import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "../lib/cn"

/**
 * Chip / ChipGroup - rave.page design-system primitive.
 *
 * The single token for every pill: filters, tags, jump nav, lineup credits,
 * genre chips. Replaces hand-rolled `rounded-full … border … px-` chips.
 * `Badge` stays status-only.
 *
 * `tone` colours the SELECTED state only; unselected is always neutral.
 * No opacity-derived text colours (contrast rule).
 */
type ChipTone = 'neutral' | 'brand' | 'live' | 'soon';
type ChipSize = 'sm' | 'md';
type ChipElement = 'button' | 'a' | 'span';

const chipVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full border font-medium shrink-0 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            size: {
                // Mobile-first, 44px touch floor; denser at sm: where pointer leads.
                md: "min-h-11 sm:min-h-9 px-3 text-sm",
                sm: "min-h-9 sm:min-h-7 px-2.5 text-xs",
            },
            selected: {
                true: "",
                false: "border-white/[0.12] bg-white/[0.03] text-foreground hover:border-white/25 hover:bg-white/[0.06]",
            },
            tone: {neutral: "", brand: "", live: "", soon: ""},
        },
        compoundVariants: [
            {selected: true, tone: 'brand', class: "border-brand-base/50 bg-brand-base/15 text-brand-base-soft"},
            {selected: true, tone: 'live', class: "border-brand-mint/50 bg-brand-mint/15 text-brand-mint-soft"},
            {selected: true, tone: 'soon', class: "border-brand-amber/50 bg-brand-amber/15 text-brand-amber"},
            {selected: true, tone: 'neutral', class: "border-foreground/70 bg-foreground text-background"},
        ],
        defaultVariants: {size: 'md', tone: 'brand', selected: false},
    }
)

export interface ChipProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>,
        Pick<VariantProps<typeof chipVariants>, 'size' | 'tone' | 'selected'> {
    /** Element to render. Default: `button`, or `a` with `href`, or `span` when neither `onClick` nor `href`. */
    as?: ChipElement;
    href?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    /** Trailing count after the label (tabular). */
    count?: number | string;
    /** Leading icon (sized to `h-3.5 w-3.5`). */
    icon?: React.ReactNode;
    disabled?: boolean;
    "data-testid"?: string;
}

const Chip = React.forwardRef<HTMLElement, ChipProps>(function Chip(
    {as, href, onClick, selected, count, icon, size, tone, disabled, className, children, ...rest},
    ref,
) {
    const resolvedAs: ChipElement = as ?? (href ? 'a' : onClick ? 'button' : 'span');
    const isButton = resolvedAs === 'button';
    const isDisabled = !!disabled;
    const Comp = resolvedAs as React.ElementType;
    // aria-pressed for standalone toggle buttons + ChipGroup multi mode.
    // ChipGroup single mode passes role="radio" + aria-checked → suppress.
    const ariaPressed = isButton && rest.role === undefined && selected !== undefined ? selected : undefined;

    return (
        <Comp
            ref={ref}
            className={cn(chipVariants({size, tone, selected}), !isButton && isDisabled && "opacity-50 pointer-events-none", className)}
            onClick={isDisabled ? undefined : onClick}
            href={resolvedAs === 'a' && !isDisabled ? href : undefined}
            type={isButton ? 'button' : undefined}
            disabled={isButton ? isDisabled : undefined}
            aria-disabled={!isButton && isDisabled ? true : undefined}
            aria-pressed={ariaPressed}
            {...rest}
        >
            {icon && (
                <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:h-3.5 [&_svg]:w-3.5">
                    {icon}
                </span>
            )}
            {children}
            {count != null && (
                <span className={cn("tabular-nums font-normal", !selected && "text-muted-foreground-2")}>
                    {count}
                </span>
            )}
        </Comp>
    );
})

export interface ChipGroupOption {
    value: string;
    label: React.ReactNode;
    count?: number | string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export interface ChipGroupProps {
    options: ChipGroupOption[];
    /** Selected value(s). `string`/`null` for single, `string[]` for multiple. */
    value: string | string[] | null;
    /** Single mode passes the clicked `string`; multiple passes the next `string[]`. */
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
    size?: ChipSize;
    tone?: ChipTone;
    /** `wrap` (default) or `scroll` (single row, gutter-bleed). */
    layout?: 'wrap' | 'scroll';
    "aria-label": string;
    className?: string;
}

/**
 * ChipGroup - single (radiogroup) or multiple (group) chip select with roving
 * focus (ArrowLeft/ArrowRight/Home/End). Space/Enter toggle via native button.
 */
const ChipGroup: React.FC<ChipGroupProps> = ({
    options,
    value,
    onChange,
    multiple = false,
    size = 'md',
    tone = 'brand',
    layout = 'wrap',
    className,
    "aria-label": ariaLabel,
}) => {
    const refs = React.useRef<(HTMLElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

    const selected = React.useMemo(
        () => new Set(Array.isArray(value) ? value : value != null ? [value] : []),
        [value],
    );

    const enabled = options.flatMap((o, i) => (o.disabled ? [] : [i]));

    const toggle = (v: string) => {
        if (multiple) {
            const cur = Array.isArray(value) ? value : value != null ? [value] : [];
            onChange(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
        } else {
            onChange(v);
        }
    };

    const focusAt = (index: number) => {
        setFocusedIndex(index);
        refs.current[index]?.focus();
    };

    const move = (from: number, dir: 1 | -1 | 'home' | 'end') => {
        if (!enabled.length) return;
        if (dir === 'home') return focusAt(enabled[0]);
        if (dir === 'end') return focusAt(enabled[enabled.length - 1]);
        const pos = enabled.indexOf(from);
        focusAt(enabled[(pos + dir + enabled.length) % enabled.length]);
    };

    const onKeyDown = (e: React.KeyboardEvent, index: number) => {
        switch (e.key) {
            case 'ArrowRight': e.preventDefault(); move(index, 1); break;
            case 'ArrowLeft': e.preventDefault(); move(index, -1); break;
            case 'Home': e.preventDefault(); move(index, 'home'); break;
            case 'End': e.preventDefault(); move(index, 'end'); break;
        }
    };

    // Roving tabindex: focused chip, else first selected-enabled, else first enabled.
    const selectedEnabled = options.findIndex((o, i) => !o.disabled && selected.has(o.value) && i >= 0);
    const activeIndex = focusedIndex ?? (selectedEnabled >= 0 ? selectedEnabled : enabled[0] ?? -1);

    return (
        <div
            role={multiple ? 'group' : 'radiogroup'}
            aria-label={ariaLabel}
            className={cn(
                "flex gap-1.5",
                layout === 'scroll' ? "flex-nowrap overflow-x-auto scrollbar-none -mx-4 px-4" : "flex-wrap",
                className,
            )}
        >
            {options.map((o, i) => (
                <Chip
                    key={o.value}
                    as="button"
                    size={size}
                    tone={tone}
                    selected={selected.has(o.value)}
                    count={o.count}
                    icon={o.icon}
                    disabled={o.disabled}
                    ref={el => {refs.current[i] = el;}}
                    tabIndex={i === activeIndex ? 0 : -1}
                    role={multiple ? undefined : 'radio'}
                    aria-checked={multiple ? undefined : selected.has(o.value)}
                    onFocus={() => setFocusedIndex(i)}
                    onKeyDown={e => onKeyDown(e, i)}
                    onClick={() => {if (!o.disabled) toggle(o.value);}}
                >
                    {o.label}
                </Chip>
            ))}
        </div>
    );
};

export {Chip, ChipGroup, chipVariants}
