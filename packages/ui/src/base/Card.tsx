import * as React from "react"
import {cn} from "../lib/cn"

/**
 * Card primitive.
 *
 * Surfaces mirror the rave.page design system (`rp-card`):
 *   bg          rgba(255,255,255,0.025)   → `bg-white/[0.025]`
 *   border      rgba(255,255,255,0.06)    → `border-white/[0.06]`
 *   border:hover rgba(255,255,255,0.12)   → `hover:border-white/[0.12]`
 *
 * `glow` = featured / now-playing surface (pink ring + soft drop-shadow,
 * matches `rp-card--glow`).
 *
 * `fx="ripple" | "wire"` requests a WebGL hover effect. The kit has no WebGL
 * layer, so the actual overlay is injected by the consumer via `renderFx`:
 * the rave.page app passes its `RippleOverlay` / `BorderWire`. Without a
 * `renderFx`, `fx` still applies the CSS hover-lift fallback but renders no
 * overlay. Both fall back to the CSS lift on shader-incapable devices.
 */
type CardFx = 'ripple' | 'wire' | undefined;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    fx?: CardFx;
    /** Featured / now-playing surface - adds the pink ring + drop shadow. */
    glow?: boolean;
    /**
     * Render the WebGL FX overlay for the active `fx` mode. Injected by the
     * consumer (the app defaults this to its RippleOverlay / BorderWire). The
     * kit itself ships no WebGL dependency.
     */
    renderFx?: (fx: 'ripple' | 'wire') => React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({className, fx, glow, renderFx, children, ...props}, ref) => {
        const hasFx = fx === 'ripple' || fx === 'wire';
        return (
            <div
                ref={ref}
                data-fx={fx ?? 'none'}
                className={cn(
                    "rounded-xl border border-white/[0.06] bg-white/[0.025] text-card-foreground shadow transition-colors duration-200 hover:border-white/[0.12]",
                    glow && "border-brand-base/40 shadow-brand-ring hover:border-brand-base/60",
                    hasFx && "relative overflow-hidden isolate ease-out hover:-translate-y-0.5 hover:shadow-lg",
                    className
                )}
                {...props}
            >
                {children}
                {hasFx && renderFx?.(fx)}
            </div>
        );
    }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        data-slot="card-header"
        className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

/**
 * `CardTitle` - section label inside a `<Card>`. Defaults to a `<div>` for
 * back-compat with existing call sites, but accepts `as="h2" | "h3" | ...`
 * to opt the title into the document outline. Auditor flagged that the
 * default `<div>` makes hundreds of card-titled sections invisible to
 * screen readers; new code should prefer `as="h2"|"h3"` based on where the
 * card sits in the outline. Visual styling is unchanged.
 */
type CardTitleAs = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement | HTMLHeadingElement> {
    as?: CardTitleAs;
}
const CardTitle = React.forwardRef<HTMLDivElement | HTMLHeadingElement, CardTitleProps>(
    ({className, as = 'div', ...props}, ref) => {
        const Tag = as as React.ElementType;
        return (
            <Tag
                ref={ref as React.Ref<HTMLDivElement>}
                className={cn("font-semibold leading-none tracking-tight", className)}
                {...props}
            />
        );
    },
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        data-slot="card-content"
        className={cn(
            // Symmetric inset by default; drop the top inset only when a header
            // sits directly above (so a header-less card keeps its top padding).
            "p-4 sm:p-6 [[data-slot=card-header]+&]:pt-0 sm:[[data-slot=card-header]+&]:pt-0",
            className,
        )}
        {...props}
    />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex items-center p-4 sm:p-6 [[data-slot=card-content]+&]:pt-0 sm:[[data-slot=card-content]+&]:pt-0",
            className,
        )}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent}
export type {CardProps, CardFx}
