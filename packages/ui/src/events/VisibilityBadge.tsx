import {Globe, EyeOff, Lock, Pencil, Users} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {cn} from '../lib/cn';

// Generic event-visibility chip (icon + hue = intent). Derived from the app's
// EventVisibilityBadge; platform-agnostic (renders every value, incl. public).

export type Visibility = 'public' | 'unlisted' | 'private' | 'draft' | 'followers';

export interface VisibilityBadgeLabels {
    public: string;
    unlisted: string;
    private: string;
    draft: string;
    followers: string;
}

export const visibilityBadgeDefaultLabels: VisibilityBadgeLabels = {
    public: 'Public',
    unlisted: 'Unlisted',
    private: 'Private',
    draft: 'Draft',
    followers: 'Followers',
};

const STYLES: Record<Visibility, {icon: LucideIcon; cls: string}> = {
    public: {icon: Globe, cls: 'text-brand-mint-soft border-brand-mint/45 bg-brand-mint/15'},
    followers: {icon: Users, cls: 'text-brand-violet-soft border-brand-violet/45 bg-brand-violet/15'},
    unlisted: {icon: EyeOff, cls: 'text-muted-foreground border-white/15 bg-white/[0.06]'},
    private: {icon: Lock, cls: 'text-brand-amber border-brand-amber/45 bg-brand-amber/15'},
    draft: {icon: Pencil, cls: 'text-brand-base-soft border-brand-base/45 bg-brand-base/15'},
};

export interface VisibilityBadgeProps {
    visibility: Visibility;
    labels?: Partial<VisibilityBadgeLabels>;
    className?: string;
}

export function VisibilityBadge({visibility, labels, className}: VisibilityBadgeProps) {
    const l = {...visibilityBadgeDefaultLabels, ...labels};
    const style = STYLES[visibility];
    const Icon = style.icon;
    const label = l[visibility];
    return (
        <span
            className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-semibold whitespace-nowrap', style.cls, className)}
            title={label}
        >
            <Icon className="h-3 w-3"/>
            {label}
        </span>
    );
}
