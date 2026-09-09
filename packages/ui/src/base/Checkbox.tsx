import * as React from "react"
import * as CheckboxPrimitives from "@radix-ui/react-checkbox"
import {Check, Minus} from "lucide-react"
import {cn} from "../lib/cn"

// Multi-select checkbox (distinct from Switch - which is an on/off setting).
// Checked uses `brand-base` (the DS selection/accent hue); focus ring mirrors
// Switch. 16px box clears the 40px touch floor when wrapped in a label-row
// (per AGENTS.md §2.6). Supports indeterminate via Radix `checked="indeterminate"`.
const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
>(({className, ...props}, ref) => (
    <CheckboxPrimitives.Root
        ref={ref}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded border border-input bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand-base data-[state=checked]:bg-brand-base data-[state=indeterminate]:border-brand-base data-[state=indeterminate]:bg-brand-base",
            className
        )}
        {...props}
    >
        <CheckboxPrimitives.Indicator
            className={cn("flex items-center justify-center text-primary-foreground")}
        >
            {props.checked === "indeterminate"
                ? <Minus className="h-3 w-3"/>
                : <Check className="h-3 w-3"/>}
        </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
))
Checkbox.displayName = CheckboxPrimitives.Root.displayName

export {Checkbox}
