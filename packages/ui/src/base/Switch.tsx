import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import {cn} from "../lib/cn"

// h-6 track + h-5 thumb clears the 40px touch floor when wrapped in a label-row
// (per AGENTS.md §2.6). Checked state uses `brand-mint` - the design system's
// sole "confirm / go / on" hue (`rave-page-design-system/README.md` Buttons +
// Status cheat-sheet). Pre-fix this was `bg-primary` (white), which read as
// neutral chrome instead of an affirmative state.
const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({className, ...props}, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mint/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-mint data-[state=unchecked]:bg-input",
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
            )}
        />
    </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export {Switch}
