import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import * as Popover from '@radix-ui/react-popover';
import {cn} from '../lib/cn';
import {Input} from './Input';

/**
 * Default preset palette - organised by intent so users land on the
 * rave.page brand first, then external-provider brand colours, then a
 * generic accent ramp for showcase customisation.
 *
 * Row 1: rave.page brand primary ramp + foreground.
 * Row 2: brand soft tints + dark surfaces.
 * Row 3: external-provider brand colours (mirrors `lib/providerColors.ts`).
 * Row 4: generic web-safe accents for showcase theming when none of the
 *        above fit.
 *
 * The grid in the popover is `grid-cols-7`, so each row above is 7
 * colours. Brand tokens come first so a freshly-opened picker reads as
 * rave.page rather than a kitchen-sink Tailwind palette.
 */
const PRESET_COLORS = [
    // Row 1 - rave.page brand ramp
    '#F70864', // brand-base   - primary CTA / FEATURED / error
    '#FF3E8A', // brand-hot    - :hover step on primary
    '#A1138E', // brand-deep   - gradient mid-stop / ambient glow
    '#7C3AED', // brand-violet - navigate / explore / info
    '#08F79B', // brand-mint   - confirm / save / live / cursor
    '#FFB547', // brand-amber  - warn / reversible-costly
    '#FAFAFA', // foreground   - primary text
    // Row 2 - soft tints + dark surfaces
    '#FF8FB8', // brand-base-soft
    '#C4A4FF', // brand-violet-soft
    '#5CF2B3', // brand-mint-soft
    '#060304', // page background (--color-bg)
    '#0A0A0A', // app background
    '#1A1014', // surface-paper (lifted card surface)
    '#1A1A1A', // near-black
    // Row 3 - external-provider brand colours (see lib/providerColors.ts)
    '#FF5500', // SoundCloud
    '#FF0000', // YouTube
    '#9146FF', // Twitch
    '#5865F2', // Discord
    '#1DB954', // Spotify
    '#E1306C', // Instagram
    '#1DA1F2', // Twitter / X
    // Row 4 - generic web-safe accents
    '#EF4444', '#F97316', '#EAB308', '#84CC16', '#14B8A6', '#0EA5E9', '#EC4899',
];

export interface ColorPickerLabels {
    presetColours: string;
    hexColourCode: string;
}

export const colorPickerDefaultLabels: ColorPickerLabels = {
    presetColours: 'Preset colours',
    hexColourCode: 'Hex colour code',
};

interface ColorPickerProps {
    /** Current hex value (e.g. "#ff5500") */
    value: string;
    /** Called with a valid hex colour string */
    onChange: (hex: string) => void;
    /** Optional label rendered above the swatch */
    label?: string;
    /** Whether the picker is disabled */
    disabled?: boolean;
    /** Additional classes for the root container */
    className?: string;
    /** Accessible strings (English defaults in `colorPickerDefaultLabels`). */
    labels?: Partial<ColorPickerLabels>;
}

/**
 * Custom colour picker that replaces native `<input type="color">`.
 * Displays a clickable swatch that opens a popover with preset colours
 * and a hex text input for manual entry.
 *
 * @remarks
 * Uses `@radix-ui/react-popover` for the dropdown panel.
 * Follows the rave.page design system tokens.
 */
const ColorPicker = React.forwardRef<HTMLButtonElement, ColorPickerProps>(
    ({value, onChange, label, disabled = false, className, labels}, ref) => {
        const l = {...colorPickerDefaultLabels, ...labels};
        const [hex, setHex] = useState(() => value.replace('#', ''));
        const [open, setOpen] = useState(false);

        // Sync local text when value prop changes
        useEffect(() => {
            setHex(value.replace('#', ''));
        }, [value]);

        const handleTextChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                setHex(raw);
                if (raw.length === 6) {
                    onChange(`#${raw}`);
                }
            },
            [onChange],
        );

        const handleTextBlur = useCallback(() => {
            setHex(value.replace('#', ''));
        }, [value]);

        const handlePresetClick = useCallback(
            (colour: string) => {
                onChange(colour);
                setHex(colour.replace('#', ''));
            },
            [onChange],
        );

        const safeValue = value.length === 7 ? value : '#000000';

        return (
            <div className={cn('flex items-center gap-2', className)}>
                {label && (
                    <span className="text-xs font-medium text-muted-foreground w-[70px] shrink-0">
                        {label}
                    </span>
                )}

                <Popover.Root open={open} onOpenChange={setOpen}>
                    <Popover.Trigger asChild>
                        <button
                            ref={ref}
                            type="button"
                            disabled={disabled}
                            aria-label={`Pick colour: ${safeValue}`}
                            className={cn(
                                // Mobile-first: 40 px square for the touch floor, dense
                                // h-7 w-12 swatch only kicks in at sm: where pointer is
                                // primary input. Extending the primitive once instead
                                // of styling every consumer.
                                'h-10 w-10 sm:h-7 sm:w-12 shrink-0 rounded border border-border shadow-sm transition-colors',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                            )}
                            style={{backgroundColor: safeValue}}
                        />
                    </Popover.Trigger>

                    <Popover.Portal>
                        <Popover.Content
                            className="z-(--z-popover) w-64 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95"
                            sideOffset={4}
                            align="start"
                        >
                            {/* Preset grid */}
                            <div className="grid grid-cols-7 gap-1.5 mb-3" role="listbox" aria-label={l.presetColours}>
                                {PRESET_COLORS.map((colour) => (
                                    <button
                                        key={colour}
                                        type="button"
                                        role="option"
                                        aria-selected={value.toLowerCase() === colour.toLowerCase()}
                                        aria-label={colour}
                                        onClick={() => handlePresetClick(colour)}
                                        className={cn(
                                            // Preset cells stay dense even on mobile - the
                                            // popover surface itself is touch-scoped (open
                                            // by tap, dismiss-on-outside) so a 7-column grid
                                            // of 40 px cells would be 280 px wide and clip
                                            // most phones. Keep them compact but ensure the
                                            // tap target meets the 32 px AAA minimum.
                                            'h-8 w-8 sm:h-7 sm:w-7 rounded-md border transition-all',
                                            'hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                            value.toLowerCase() === colour.toLowerCase()
                                                ? 'border-primary ring-2 ring-primary/50'
                                                : 'border-border/60',
                                        )}
                                        style={{backgroundColor: colour}}
                                    />
                                ))}
                            </div>

                            {/* Hex text input */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-muted-foreground">#</span>
                                <Input
                                    value={hex}
                                    onChange={handleTextChange}
                                    onBlur={handleTextBlur}
                                    placeholder="rrggbb"
                                    maxLength={6}
                                    className="font-mono text-xs"
                                    aria-label={l.hexColourCode}
                                />
                                <div
                                    className="h-8 w-8 shrink-0 rounded-md border border-border"
                                    style={{backgroundColor: safeValue}}
                                    aria-hidden="true"
                                />
                            </div>

                            <Popover.Arrow className="fill-border"/>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {/* Inline hex input (always visible for quick editing).
                    Width stays compact even at sm: so the field doesn't
                    shove the rest of the colour-picker row off-screen.
                    Height inherits the Input primitive (h-10 sm:h-9). */}
                <Input
                    value={hex}
                    onChange={handleTextChange}
                    onBlur={handleTextBlur}
                    placeholder="rrggbb"
                    maxLength={6}
                    disabled={disabled}
                    className="w-24 sm:w-20 font-mono text-xs"
                    aria-label={l.hexColourCode}
                />
            </div>
        );
    },
);

ColorPicker.displayName = 'ColorPicker';

export {ColorPicker, PRESET_COLORS};
