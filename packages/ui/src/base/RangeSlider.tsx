/**
 * RangeSlider - dual-thumb range primitive (design-system replacement for
 * native range inputs). Pointer-driven track + two keyboard-operable thumbs
 * (role="slider", arrows/Home/End/PageUp/Down). Mobile-first: 44px-tall hit
 * area, thumbs sized for touch.
 */
import {useCallback, useRef, type FC, type KeyboardEvent, type PointerEvent} from 'react';
import {cn} from '../lib/cn';

export interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    /** [low, high] - clamped + ordered internally. */
    value: [number, number];
    onChange: (value: [number, number]) => void;
    /** Accessible names for the two thumbs. */
    ariaLabels?: [string, string];
    formatValue?: (v: number) => string;
    disabled?: boolean;
    className?: string;
}

const RangeSlider: FC<RangeSliderProps> = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    ariaLabels = ['Minimum', 'Maximum'],
    formatValue = (v) => String(v),
    disabled = false,
    className,
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const activeThumb = useRef<0 | 1 | null>(null);

    const clamp = useCallback(
        (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step)),
        [min, max, step],
    );

    const setThumb = useCallback(
        (idx: 0 | 1, v: number) => {
            const next: [number, number] = [...value];
            // thumbs can't cross
            next[idx] = idx === 0 ? Math.min(clamp(v), value[1]) : Math.max(clamp(v), value[0]);
            if (next[0] !== value[0] || next[1] !== value[1]) onChange(next);
        },
        [value, onChange, clamp],
    );

    const valueFromPointer = useCallback(
        (clientX: number): number => {
            const rect = trackRef.current?.getBoundingClientRect();
            if (!rect || rect.width === 0) return min;
            const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            return min + frac * (max - min);
        },
        [min, max],
    );

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        e.preventDefault();
        const v = valueFromPointer(e.clientX);
        // grab the nearest thumb (ties go to the high thumb so a full-range
        // slider can still be narrowed from the right)
        const idx: 0 | 1 = Math.abs(v - value[0]) < Math.abs(v - value[1]) ? 0 : 1;
        activeThumb.current = idx;
        setThumb(idx, v);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (disabled || activeThumb.current === null) return;
        setThumb(activeThumb.current, valueFromPointer(e.clientX));
    };

    const onPointerUp = () => {
        activeThumb.current = null;
    };

    const onThumbKey = (idx: 0 | 1) => (e: KeyboardEvent<HTMLSpanElement>) => {
        if (disabled) return;
        const big = (max - min) / 10;
        let next: number | null = null;
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                next = value[idx] - step;
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                next = value[idx] + step;
                break;
            case 'PageDown':
                next = value[idx] - big;
                break;
            case 'PageUp':
                next = value[idx] + big;
                break;
            case 'Home':
                next = min;
                break;
            case 'End':
                next = max;
                break;
        }
        if (next !== null) {
            e.preventDefault();
            setThumb(idx, next);
        }
    };

    const pct = (v: number) => ((v - min) / (max - min)) * 100;

    return (
        <div
            ref={trackRef}
            className={cn(
                'relative flex h-11 w-full touch-none items-center',
                disabled ? 'opacity-50' : 'cursor-pointer',
                className,
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* track */}
            <div className="h-1.5 w-full rounded-full bg-input" aria-hidden="true"/>
            {/* active range */}
            <div
                aria-hidden="true"
                className="absolute h-1.5 rounded-full bg-brand-base/70"
                style={{left: `${pct(value[0])}%`, width: `${pct(value[1]) - pct(value[0])}%`}}
            />
            {([0, 1] as const).map((idx) => (
                <span
                    key={idx}
                    role="slider"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={ariaLabels[idx]}
                    aria-valuemin={idx === 0 ? min : value[0]}
                    aria-valuemax={idx === 1 ? max : value[1]}
                    aria-valuenow={value[idx]}
                    aria-valuetext={formatValue(value[idx])}
                    aria-disabled={disabled || undefined}
                    onKeyDown={onThumbKey(idx)}
                    className={cn(
                        'absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-base bg-background shadow',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    )}
                    style={{left: `${pct(value[idx])}%`}}
                />
            ))}
        </div>
    );
};

export default RangeSlider;
