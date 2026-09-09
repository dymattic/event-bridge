import * as React from "react";
import { Button, type ButtonProps } from "./Button";

/**
 * IconButtonWithTooltip
 * A reusable button for icon/image actions with enforced accessible labeling and tooltip.
 *
 * - Always requires either `aria-label` or `tooltip` (preferably both)
 * - Renders children (icon/svg/img) inside the button
 * - Delegates tooltip + variant defaults to the design-system Button so the
 *   tooltip is rendered exactly once. (Wrapping again here used to stack
 *   a second tooltip on top of the Button's own.)
 */
export interface IconButtonWithTooltipProps extends Omit<ButtonProps, "children"> {
  /** The icon, SVG, or image to render inside the button. */
  icon: React.ReactNode;
  /** Tooltip text shown on hover/focus. Required if no aria-label. */
  tooltip?: string;
  /** Accessible label for screen readers. Required if no tooltip. */
  "aria-label"?: string;
}

export const IconButtonWithTooltip = React.forwardRef<HTMLButtonElement, IconButtonWithTooltipProps>(
  ({ icon, tooltip, "aria-label": ariaLabel, variant, size, ...props }, ref) => {
    if (!tooltip && !ariaLabel) {
      throw new Error("IconButtonWithTooltip requires at least one of `tooltip` or `aria-label`.");
    }
    return (
      <Button
        ref={ref}
        variant={variant ?? "ghost"}
        size={size ?? "icon"}
        tooltip={tooltip ?? ariaLabel}
        aria-label={ariaLabel ?? tooltip}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);
IconButtonWithTooltip.displayName = "IconButtonWithTooltip";
