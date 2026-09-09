import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "../lib/cn"
import {Tooltip, TooltipContent, TooltipTrigger} from "./Tooltip"

const buttonVariants = cva(
    // after:* = invisible touch hit-slop: visual density (h-9/h-10) stays, but the
    // tappable area meets AGENTS.md's 44px minimum at <640px. Removed at sm:.
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 after:absolute after:-inset-1 after:content-[''] sm:after:hidden",
    {
        variants: {
            variant: {
                // ── PRIMARY · HOT PINK (brand-base) ─────────────────────
                // The one defining CTA per surface. Drives sign-up and
                // "join the night" intents. White text -> base-fill (AA;
                // #F70864 is 4.05:1), hover base-fill-hover.
                default:
                    "bg-brand-base-fill text-white shadow hover:bg-brand-base-fill-hover focus-visible:ring-brand-base/45 shadow-brand-glow",
                primary:
                    "bg-brand-base-fill text-white shadow hover:bg-brand-base-fill-hover focus-visible:ring-brand-base/45 shadow-brand-glow",
                // ── CONFIRM / GO · NEON MINT ────────────────────────────
                // Affirmative commit: RSVP yes, save, publish. "Go" green.
                go:
                    "bg-brand-mint text-background shadow hover:bg-brand-mint/90 focus-visible:ring-brand-mint/45 [box-shadow:0_4px_16px_-6px_rgba(8,247,155,0.55)]",
                // ── NAVIGATE / EXPLORE · VIOLET ─────────────────────────
                // Open / browse / look at - no commitment cost.
                explore:
                    "bg-brand-violet/15 text-brand-violet-soft border border-brand-violet/50 hover:bg-brand-violet/25 hover:border-brand-violet focus-visible:ring-brand-violet/45",
                // ── WARNING · AMBER ────────────────────────────────────
                // Reversible-but-costly: discard draft, force-sync.
                warn:
                    "bg-transparent text-brand-amber border border-brand-amber/45 hover:bg-brand-amber/10 hover:border-brand-amber",
                // ── DESTRUCTIVE · OUTLINED PINK ────────────────────────
                // Irreversible. Outline + icon forces the user to read the
                // label before committing (never filled per design system).
                destructive:
                    "bg-transparent text-brand-base-soft border border-brand-base/45 hover:bg-brand-base/10 hover:border-brand-base focus-visible:ring-brand-base/45",
                // ── SECONDARY · NEUTRAL OUTLINE ────────────────────────
                // Alt path that pairs with primary. Steps out of the way.
                outline:
                    "border border-white/20 bg-transparent text-foreground shadow-sm hover:bg-white/5 hover:border-white/32",
                // ── DISMISS · GHOST ────────────────────────────────────
                // Escape hatch with no friction. Cancel / not-now / close.
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            // Heights come from the density tokens in tokens.css
            // (--control-h / --control-h-sm): cozy = 40/36px at 320-639px and
            // 36/32px at sm+ (the 2026-07 density pass values); the compact /
            // spacious ui-preferences override them per breakpoint. The base
            // after:-inset-1 hit-slop keeps the TOUCH target ≥44px on mobile
            // at every density.
            size: {
                default: "h-[var(--control-h)] px-3 py-2 sm:px-4",
                sm: "h-[var(--control-h-sm)] rounded-md px-2.5 text-xs sm:px-3",
                lg: "h-[var(--control-h)] min-h-10 rounded-md px-5 text-base sm:px-8 sm:text-sm",
                // shrink-0: icon buttons keep their square in tight flex rows
                icon: "h-[var(--control-h)] w-[var(--control-h)] shrink-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    tooltip?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, tooltip, ...props}, ref) => {
        const Comp = asChild ? Slot : "button"
        const ariaLabel = props["aria-label"] ?? (typeof tooltip === "string" ? tooltip : undefined)
        const tooltipText = tooltip ?? (size === "icon" ? ariaLabel : undefined)

        const button = (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                aria-label={ariaLabel}
                {...props}
            />
        )

        if (tooltipText) {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        {/* Wrap in span to allow tooltip on disabled buttons.
                            inline-flex + shrink-0: a plain inline span collapses
                            fixed-size icon buttons inside flex parents (~33px). */}
                        <span className={cn("inline-flex shrink-0", props.disabled && "cursor-not-allowed")}>
                            {button}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{tooltipText}</TooltipContent>
                </Tooltip>
            )
        }

        return button
    }
)
Button.displayName = "Button"

export {Button, buttonVariants}
