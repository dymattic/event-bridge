import * as React from 'react';
import {cn} from '../lib/cn';

/**
 * Plain avatar - image with a deterministic initials fallback. No media-URL
 * resolution (that stays in the host app); pass a ready `src`. Hue is derived
 * from `name` off brand tokens so the same name is always the same colour.
 */
export interface AvatarProps {
    src?: string | null;
    name: string;
    /** px. Default 40. */
    size?: number;
    shape?: 'round' | 'rounded';
    className?: string;
}

const HUES = [
    '--color-brand-base',
    '--color-brand-violet',
    '--color-brand-mint',
    '--color-brand-amber',
    '--color-brand-hot',
    '--color-brand-deep',
] as const;

function hueToken(name: string): string {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return HUES[h % HUES.length];
}

function initial(name: string): string {
    return (name.trim().charAt(0) || '?').toUpperCase();
}

export function Avatar({src, name, size = 40, shape = 'round', className}: AvatarProps) {
    const [failed, setFailed] = React.useState(false);
    React.useEffect(() => setFailed(false), [src]);

    const rounded = shape === 'round' ? 'rounded-full' : 'rounded-md';
    const style: React.CSSProperties = {width: size, height: size, minWidth: size, minHeight: size};
    const showImg = !!src && !failed;

    return (
        <span
            className={cn('inline-flex items-center justify-center overflow-hidden ring-1 ring-white/10 select-none shrink-0', rounded, className)}
            style={style}
        >
            {showImg ? (
                <img
                    src={src ?? undefined}
                    alt={name}
                    loading="lazy"
                    className={cn('h-full w-full object-cover', rounded)}
                    onError={() => setFailed(true)}
                />
            ) : (
                <span
                    aria-hidden="true"
                    className={cn('flex h-full w-full items-center justify-center font-bold text-white', rounded)}
                    style={{
                        background: `linear-gradient(135deg, color-mix(in srgb, var(${hueToken(name)}) 55%, transparent) 0%, color-mix(in srgb, var(--color-brand-deep) 40%, transparent) 100%)`,
                        fontSize: Math.max(10, Math.round(size * 0.42)),
                        lineHeight: 1,
                    }}
                >
                    {initial(name)}
                </span>
            )}
        </span>
    );
}
