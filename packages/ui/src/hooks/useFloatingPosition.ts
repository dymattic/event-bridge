import {type CSSProperties, type RefObject, useCallback, useLayoutEffect, useState} from 'react';

export type FloatingPlacement = 'bottom' | 'top';

export interface FloatingPositionResult {
    /** Inline style for a `position: fixed` panel anchored to the trigger. */
    style: CSSProperties;
    /** Available height (px) the panel's own scroll area should cap itself to. */
    maxHeight: number;
    placement: FloatingPlacement;
}

interface UseFloatingPositionOptions {
    /** Breathing room kept between the panel and the viewport edge, in px. Default 8. */
    gutter?: number;
    /** Gap between the trigger and the panel, in px. Default 4. */
    triggerGap?: number;
    /** Cap applied even when more space is available. Default 320. */
    preferredMaxHeight?: number;
    /** Flip threshold: prefer the side with this much room. Default 120. */
    minHeight?: number;
    /**
     * Match the panel width to the trigger (default true). When false, the
     * panel gets `minWidth = trigger width`, `width: max-content` and
     * `maxWidth = viewport - 2*gutter` so it sizes to its content.
     */
    matchTriggerWidth?: boolean;
}

const DEFAULTS = {gutter: 8, triggerGap: 4, preferredMaxHeight: 320, minHeight: 120};

const HIDDEN_STYLE: CSSProperties = {position: 'fixed', top: -9999, left: -9999, width: 0, visibility: 'hidden'};

/** Keyboard-aware visible viewport box. */
function getVisibleViewportBox() {
    if (typeof window === 'undefined') {
        return {width: 0, height: 0, offsetLeft: 0, offsetTop: 0};
    }
    const vv = window.visualViewport;
    if (vv) {
        return {width: vv.width, height: vv.height, offsetLeft: vv.offsetLeft, offsetTop: vv.offsetTop};
    }
    return {width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0};
}

/**
 * Positions a fixed, portaled panel within the visual viewport. Reflows on
 * layout and keyboard changes, flips when needed, and returns the safe height.
 */
export function useFloatingPosition(
    triggerRef: RefObject<HTMLElement | null>,
    open: boolean,
    options: UseFloatingPositionOptions = {},
): FloatingPositionResult {
    const gutter = options.gutter ?? DEFAULTS.gutter;
    const triggerGap = options.triggerGap ?? DEFAULTS.triggerGap;
    const preferredMaxHeight = options.preferredMaxHeight ?? DEFAULTS.preferredMaxHeight;
    const minHeight = options.minHeight ?? DEFAULTS.minHeight;
    const matchTriggerWidth = options.matchTriggerWidth ?? true;

    const [result, setResult] = useState<FloatingPositionResult>({
        style: HIDDEN_STYLE,
        maxHeight: preferredMaxHeight,
        placement: 'bottom',
    });

    const recompute = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewport = getVisibleViewportBox();
        const viewportTop = viewport.offsetTop;
        const viewportBottom = viewport.offsetTop + viewport.height;
        const viewportLeft = viewport.offsetLeft;
        const viewportRight = viewport.offsetLeft + viewport.width;
        const layoutHeight = document.documentElement.clientHeight;

        const spaceBelow = viewportBottom - rect.bottom - gutter;
        const spaceAbove = rect.top - viewportTop - gutter;

        // Prefer bottom (natural reading order) unless there truly isn't
        // enough room and flipping up would do meaningfully better.
        const placement: FloatingPlacement =
            spaceBelow >= minHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';

        const available = Math.max(0, placement === 'bottom' ? spaceBelow : spaceAbove);
        const maxHeight = Math.min(preferredMaxHeight, available);

        const width = Math.max(0, Math.min(rect.width, viewport.width - gutter * 2));
        const left = Math.min(
            Math.max(rect.left, viewportLeft + gutter),
            Math.max(viewportLeft + gutter, viewportRight - width - gutter),
        );

        // Trigger-matched (default) fixes the width; 'auto' floors at the
        // trigger width and grows to content up to the viewport-minus-gutters cap.
        const sizeStyle: CSSProperties = matchTriggerWidth
            ? {width}
            : {minWidth: width, width: 'max-content', maxWidth: Math.max(0, viewport.width - gutter * 2)};

        const style: CSSProperties = placement === 'bottom'
            ? {position: 'fixed', top: rect.bottom + triggerGap, left, ...sizeStyle}
            : {position: 'fixed', bottom: layoutHeight - rect.top + triggerGap, left, ...sizeStyle};

        setResult({style, maxHeight, placement});
    }, [triggerRef, gutter, triggerGap, preferredMaxHeight, minHeight, matchTriggerWidth]);

    useLayoutEffect(() => {
        if (!open) return;
        recompute();
        const vv = window.visualViewport;
        // capture:true so scroll on any ancestor container (not just window)
        // reflows the position, matching the previous behaviour.
        window.addEventListener('scroll', recompute, true);
        window.addEventListener('resize', recompute);
        vv?.addEventListener('resize', recompute);
        vv?.addEventListener('scroll', recompute);
        return () => {
            window.removeEventListener('scroll', recompute, true);
            window.removeEventListener('resize', recompute);
            vv?.removeEventListener('resize', recompute);
            vv?.removeEventListener('scroll', recompute);
        };
    }, [open, recompute]);

    return result;
}
