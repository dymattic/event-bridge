import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "../lib/cn"

/**
 * Badge - rave.page design-system primitive.
 *
 * Per the design system, ALL CAPS is reserved for SHORT status badges
 * (`LIVE`, `SOLD OUT`, `BETA`, eyebrow labels) - never long labels. The
 * default rendering therefore keeps casing as-authored; consumers that
 * want a status-style badge pass `caps` (or build it via `variant` +
 * inline className).
 *
 * Hue ⇄ intent (same recipe as Button, RSVPs, toasts):
 *   default     - featured / primary highlight (brand base)
 *   success     - live / confirmed / going (mint)
 *   info        - beta / scheduled / VR (violet)
 *   warning     - rate-limit / pending (amber)
 *   error       - sold-out / offline / failed (brand base, soft text)
 *   secondary   - neutral chrome
 *   destructive - irreversible-state surface
 *   outline     - plain neutral outline
 */
const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-brand-base-fill text-white border-brand-base shadow-brand-glow-sm",
                success:
                    "bg-brand-mint/15 text-brand-mint-soft border-brand-mint/45 [box-shadow:0_0_12px_-4px_rgba(8,247,155,0.4)]",
                info:
                    "bg-brand-violet/15 text-brand-violet-soft border-brand-violet/45",
                warning:
                    "bg-brand-amber/15 text-brand-amber border-brand-amber/45",
                error:
                    "bg-brand-base/15 text-brand-base-soft border-brand-base/45",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground border-white/20",
            },
            caps: {
                true: "uppercase tracking-wider",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            caps: false,
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    /** Render a pulsing dot before the label (e.g. LIVE, RECORDING). */
    dot?: boolean;
}

function Badge({className, variant, caps, dot, children, ...props}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({variant, caps}), className)} {...props}>
            {dot && (
                <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse shrink-0"
                    aria-hidden="true"
                />
            )}
            {children}
        </div>
    )
}

export {Badge, badgeVariants}
