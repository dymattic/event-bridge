import * as React from "react"
import {cn} from "../lib/cn"

export interface InputProps extends React.ComponentProps<"input"> {
    /** Decorative node inside the field's left edge (e.g. search icon). Non-interactive. */
    leading?: React.ReactNode;
    /** Node inside the right edge (e.g. clear button). Interactive - receives pointer events. */
    trailing?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, leading, trailing, ...props}, ref) => {
        const input = (
            <input
                type={type}
                className={cn(
                    // Height from the density token (--control-h, tokens.css):
                    // cozy = 40px on phones (touch-target floor), 36px at sm:
                    // where pointer is primary; compact/spacious override it.
                    // `text-base` on mobile keeps iOS Safari from zooming the
                    // viewport on focus (zoom trigger is <16 px), `md:text-sm`
                    // past that. Focus state uses the brand-base tint, matching
                    // the design-system `rp-field:focus-within` rule (pink
                    // ring + pink-tinted border).
                    "flex h-[var(--control-h)] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-brand-base/50 focus-visible:ring-1 focus-visible:ring-brand-base/35 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    leading != null && "pl-9",
                    trailing != null && "pr-9",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
        if (leading == null && trailing == null) return input
        return (
            <div className="relative w-full">
                {leading != null && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none [&_svg]:h-4 [&_svg]:w-4">
                        {leading}
                    </span>
                )}
                {input}
                {trailing != null && (
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                        {trailing}
                    </span>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export {Input}
