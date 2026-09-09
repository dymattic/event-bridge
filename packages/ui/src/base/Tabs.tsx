import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "../lib/cn"

type TabsVariant = "default" | "pill"

const TabsVariantContext = React.createContext<TabsVariant>("default")

interface TabsRootProps
    extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
    variant?: TabsVariant;
}

const Tabs = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Root>,
    TabsRootProps
>(({variant = "default", ...props}, ref) => (
    <TabsVariantContext.Provider value={variant}>
        <TabsPrimitive.Root ref={ref} {...props} />
    </TabsVariantContext.Provider>
))
Tabs.displayName = TabsPrimitive.Root.displayName

const tabsListVariants = cva("", {
    variants: {
        variant: {
            // Mobile-first: tab list is 44 px on phones (housing 40 px tab
            // triggers with 1 px each side for the bg-muted shell), 36 px
            // at sm: where pointer is the primary input.
            default: "inline-flex h-11 sm:h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
            pill: "flex flex-wrap h-auto gap-1.5 bg-transparent p-0",
        },
    },
    defaultVariants: {variant: "default"},
})

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
        VariantProps<typeof tabsListVariants>
>(({className, variant, ...props}, ref) => {
    const ctxVariant = React.useContext(TabsVariantContext)
    const resolved = variant ?? ctxVariant
    return (
        <TabsPrimitive.List
            ref={ref}
            className={cn(tabsListVariants({variant: resolved}), className)}
            {...props}
        />
    )
})
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                // Mobile-first: default 40 px tall on phones (inside the
                // 44 px TabsList shell above), 28 px at sm:. Standalone pill
                // tabs carry the full 44 px touch target themselves, 32 px
                // at sm:.
                default:
                    "rounded-md min-h-10 sm:min-h-0 px-3 py-1 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
                pill:
                    // Same recipe as Chip (md, brand tone): one pill look across the app.
                    "gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] min-h-11 sm:min-h-9 px-3 text-sm font-medium text-foreground hover:border-white/25 hover:bg-white/[0.06] data-[state=active]:border-brand-base/50 data-[state=active]:bg-brand-base/15 data-[state=active]:text-brand-base-soft data-[state=active]:shadow-none",
            },
        },
        defaultVariants: {variant: "default"},
    }
)

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
        VariantProps<typeof tabsTriggerVariants>
>(({className, variant, ...props}, ref) => {
    const ctxVariant = React.useContext(TabsVariantContext)
    const resolved = variant ?? ctxVariant
    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(tabsTriggerVariants({variant: resolved}), className)}
            {...props}
        />
    )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className, ...props}, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export {Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants}
