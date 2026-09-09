import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "../lib/cn"

const dashboardCardVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "rounded-2xl border border-white/[0.06] bg-white/[0.02]",
                accent: "rounded-2xl border border-brand-base/20 bg-gradient-to-br from-brand-base/[0.06] to-transparent",
                cta: "rounded-2xl border border-brand-base/20 bg-gradient-to-r from-brand-base/[0.06] to-brand-violet/[0.06]",
                sub: "rounded-xl border border-white/10 bg-white/[0.03]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface DashboardCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof dashboardCardVariants> {}

const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
    ({className, variant, ...props}, ref) => (
        <div
            ref={ref}
            className={cn(dashboardCardVariants({variant, className}))}
            {...props}
        />
    )
)
DashboardCard.displayName = "DashboardCard"

const DashboardTile = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({className, ...props}, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 min-w-0",
                className
            )}
            {...props}
        />
    )
)
DashboardTile.displayName = "DashboardTile"

export interface DashboardListRowProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean
    asButton?: boolean
}

const DashboardListRow = React.forwardRef<HTMLButtonElement, DashboardListRowProps>(
    ({className, selected = false, asButton = true, type, ...props}, ref) => {
        const base = "w-full text-left rounded-xl border p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40"
        const state = selected
            ? "bg-brand-base/10 border-brand-base/30"
            : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03]"
        if (!asButton) {
            const {onClick: _onClick, onKeyDown: _onKeyDown, ...rest} = props
            return (
                <div
                    ref={ref as unknown as React.Ref<HTMLDivElement>}
                    className={cn(base, state, className)}
                    {...(rest as React.HTMLAttributes<HTMLDivElement>)}
                />
            )
        }
        return (
            <button
                ref={ref}
                type={type ?? "button"}
                className={cn(base, state, className)}
                {...props}
            />
        )
    }
)
DashboardListRow.displayName = "DashboardListRow"

export {DashboardCard, DashboardTile, DashboardListRow, dashboardCardVariants}
