import * as React from "react"
import {cn} from "../lib/cn"
import {dashboardCardVariants} from "./DashboardCard"

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Uppercase eyebrow label (e.g. "Slots", "Runtime"). */
    label: React.ReactNode;
    /** Primary value. Strings, numbers, or custom nodes. */
    value: React.ReactNode;
    /** Optional icon rendered next to the label. */
    icon?: React.ReactNode;
    /** Icon tint - defaults to muted. Pass a custom colour (CSS var or class). */
    iconColor?: string;
    /** Optional small trailing node (delta, badge, unit). */
    trailing?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    ({label, value, icon, iconColor, trailing, className, ...props}, ref) => (
        <div
            ref={ref}
            className={cn(dashboardCardVariants({variant: "sub"}), "p-4", className)}
            {...props}
        >
            <div className="flex items-center gap-2 mb-1">
                {icon && (
                    <span
                        className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground [&_svg]:h-4 [&_svg]:w-4"
                        style={iconColor ? {color: iconColor} : undefined}
                    >
                        {icon}
                    </span>
                )}
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {label}
                </span>
                {trailing && <span className="ml-auto">{trailing}</span>}
            </div>
            <p className="text-2xl font-bold text-foreground leading-tight">
                {value ?? <span className="text-muted-foreground/40">-</span>}
            </p>
        </div>
    ),
)
StatCard.displayName = "StatCard"

export {StatCard}
