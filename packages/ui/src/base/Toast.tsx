import React from 'react';
import {AlertCircle, AlertTriangle, CheckCircle2, Info, X} from 'lucide-react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../lib/cn';
import {useNotification} from './NotificationContext';

/**
 * Toast surface - fixed bottom-center on mobile (thumb-reachable, sits
 * above MobileBottomNav), top-right on desktop. Variants mirror the
 * Badge primitive's hue=intent map exactly:
 *
 *   success → mint  (confirm / done / saved)
 *   warning → amber (slow-the-click, reversible)
 *   error   → base  (destructive / failure)
 *   info    → violet (passive context)
 *
 * Reads the notification queue from `NotificationContext`. User-visible
 * strings are `labels` props (English defaults in `toastDefaultLabels`); the
 * app shim passes translated strings.
 */
const toastVariants = cva(
    'pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium font-orbitron shadow-lg backdrop-blur-sm',
    {
        variants: {
            variant: {
                success: 'border-brand-mint/45 bg-brand-mint/15 text-brand-mint-soft shadow-brand-mint/20',
                warning: 'border-brand-amber/45 bg-brand-amber/15 text-brand-amber shadow-brand-amber/20',
                error: 'border-brand-base/45 bg-brand-base/15 text-brand-base-soft shadow-brand-base/20',
                info: 'border-brand-violet/45 bg-brand-violet/15 text-brand-violet-soft shadow-brand-violet/20',
            },
        },
        defaultVariants: {
            variant: 'info',
        },
    },
);

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;

const ICON_FOR_VARIANT: Record<ToastVariant, React.ComponentType<{className?: string}>> = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
};

export interface ToastLabels {
    /** aria-label for the toast region. */
    title: string;
    /** aria-label for the per-toast dismiss button. */
    dismiss: string;
}

export const toastDefaultLabels: ToastLabels = {
    title: 'Notifications',
    dismiss: 'Dismiss notification',
};

interface ToastProps {
    labels?: Partial<ToastLabels>;
}

const Toast: React.FC<ToastProps> = ({labels}) => {
    const l = {...toastDefaultLabels, ...labels};
    const {notifications, removeNotification} = useNotification();

    if (notifications.length === 0) {
        return null;
    }

    return (
        // Stack container. Bottom-center on mobile so it sits above the
        // MobileBottomNav (bottom-24 keeps it clear of nav + PlayerBar
        // padding); top-right on desktop. `pointer-events-none` so the
        // stack background doesn't block clicks; each item re-enables it.
        <div
            className={cn(
                'pointer-events-none fixed z-(--z-toast) flex flex-col gap-2 px-4',
                'bottom-24 left-1/2 -translate-x-1/2 w-full max-w-sm',
                'lg:bottom-auto lg:left-auto lg:translate-x-0 lg:right-6 lg:top-6 lg:max-w-md',
            )}
            role="region"
            aria-label={l.title}
        >
            {notifications.map((n) => (
                <ToastItem
                    key={n.id}
                    message={n.message}
                    variant={(n.type as ToastVariant) ?? 'info'}
                    dismissLabel={l.dismiss}
                    onClose={() => removeNotification(n.id)}
                />
            ))}
        </div>
    );
};

interface ToastItemProps {
    message: string;
    variant: ToastVariant;
    dismissLabel: string;
    onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({message, variant, dismissLabel, onClose}) => {
    const Icon = ICON_FOR_VARIANT[variant] ?? Info;

    return (
        <div className={toastVariants({variant})} role="alert" aria-live="polite">
            <Icon className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true"/>
            <span className="flex-1 min-w-0 break-words text-foreground/90">{message}</span>
            <button
                type="button"
                onClick={onClose}
                aria-label={dismissLabel}
                className="shrink-0 -my-0.5 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <X className="h-3.5 w-3.5"/>
            </button>
        </div>
    );
};

export default Toast;
