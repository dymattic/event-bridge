import * as React from "react"
import {cn} from "../lib/cn"

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Optional icon rendered above the title. */
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Action button / link rendered under the description. */
    action?: React.ReactNode;
    /** Render with a dashed border (the "empty-hero" look). Default true. */
    dashed?: boolean;
    /** Heading element for the title - match the page outline (h2 under an h1 page title). Default 'h3'. */
    headingLevel?: 'h2' | 'h3' | 'h4';
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({icon, title, description, action, dashed = true, headingLevel: Heading = 'h3', className, ...props}, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12 text-center",
                dashed
                    ? "border border-dashed border-white/10 bg-white/[0.01]"
                    : "border border-white/[0.06] bg-white/[0.02]",
                className,
            )}
            {...props}
        >
            {icon && (
                <div className="flex h-12 w-12 items-center justify-center text-brand-base/60 [&_svg]:h-8 [&_svg]:w-8">
                    {icon}
                </div>
            )}
            <div className="space-y-1">
                <Heading className="text-base font-semibold text-foreground">{title}</Heading>
                {description && (
                    <p className="max-w-md text-sm text-muted-foreground/80">{description}</p>
                )}
            </div>
            {action && <div className="mt-2">{action}</div>}
        </div>
    ),
)
EmptyState.displayName = "EmptyState"

export {EmptyState}
