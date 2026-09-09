import React from 'react';
import {cn} from '../lib/cn';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const SIZE_PX: Record<NonNullable<LoadingSpinnerProps['size']>, number> = {sm: 16, md: 32, lg: 48};

/**
 * Brand-token loading spinner. Replaces the app's former MUI `CircularProgress`
 * wrapper. CSS-only ring on `--color-brand-base` (matches the boot-loader look);
 * respects `prefers-reduced-motion` via Tailwind's `motion-reduce`.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({size = 'md', className = ''}) => {
    const px = SIZE_PX[size];
    return (
        <span
            role="status"
            aria-label="Loading"
            className={cn(
                'inline-block shrink-0 animate-spin rounded-full border-2 border-brand-base/25 border-t-brand-base motion-reduce:animate-none',
                className,
            )}
            style={{width: px, height: px}}
        />
    );
};

export default LoadingSpinner;
