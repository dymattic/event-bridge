import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {GripHorizontal, X} from "lucide-react";
import {cn} from "../lib/cn";

/** User-resized dialog size. Was sourced from the app's ui-preferences store;
 *  now passed in via `initialSize` / `onSizeChange` props so the kit stays
 *  store-agnostic. */
export interface PersistedSize {
    width?: number;
    height?: number;
}

export interface DialogLabels {
    resizeWidth: string;
    resizeHeight: string;
    resize: string;
    dragToResize: string;
    close: string;
}

export const dialogDefaultLabels: DialogLabels = {
    resizeWidth: 'Resize width',
    resizeHeight: 'Resize height',
    resize: 'Resize',
    dragToResize: 'Drag to resize',
    close: 'Close',
};

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({className, ...props}, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-(--z-modal) bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        data-perf-keep-blur
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
    extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    /**
     * When true, the dialog renders as a full-width bottom sheet below the
     * `sm` breakpoint (instead of a centered modal that scrolls internally).
     * Use this for tall forms - Create Event, Create Club, etc.
     */
    responsive?: boolean;
    /**
     * Whether to expose edge resize handles. Default `true`. Set to `false`
     * for tiny confirmation dialogs that should never grow.
     */
    resizable?: boolean;
    /**
     * Restored persisted size (the app shim reads it from the ui-preferences
     * store by a stable id). Providing `onSizeChange` turns on persistence;
     * omitting both keeps resize session-only (reset on close).
     */
    initialSize?: PersistedSize;
    /** Called when a resize drag ends. Provide to persist the size. */
    onSizeChange?: (size: PersistedSize) => void;
    /** Lower bound for resize, in CSS px. Default 320×200. */
    minWidth?: number;
    minHeight?: number;
    /** Accessible strings (English defaults in `dialogDefaultLabels`). */
    labels?: Partial<DialogLabels>;
}

/** Tailwind `sm` - resizing (handles + stored sizes) exists only above it. */
const SM_BREAKPOINT = 640;
/** Breathing room kept between a sized dialog and the viewport edge, in px. */
const VIEWPORT_GUTTER = 16;

function useVisibleViewport() {
    const read = React.useCallback(() => {
        if (typeof window === 'undefined') return {width: SM_BREAKPOINT, height: 800, offsetTop: 0};
        const viewport = window.visualViewport;
        return viewport
            ? {width: viewport.width, height: viewport.height, offsetTop: viewport.offsetTop}
            : {width: window.innerWidth, height: window.innerHeight, offsetTop: 0};
    }, []);
    const [viewport, setViewport] = React.useState(read);

    React.useEffect(() => {
        const visualViewport = window.visualViewport;
        const update = () => setViewport(read());
        window.addEventListener('resize', update);
        visualViewport?.addEventListener('resize', update);
        visualViewport?.addEventListener('scroll', update);
        return () => {
            window.removeEventListener('resize', update);
            visualViewport?.removeEventListener('resize', update);
            visualViewport?.removeEventListener('scroll', update);
        };
    }, [read]);

    return viewport;
}

/**
 * Live viewport box. Only subscribes while `active` so dialogs that never
 * apply a stored size don't re-render on every resize tick.
 */
function useViewportBox(active: boolean) {
    const [box, setBox] = React.useState(() => (
        typeof window === 'undefined'
            ? {width: SM_BREAKPOINT, height: 800}
            : {width: window.innerWidth, height: window.innerHeight}
    ));
    React.useEffect(() => {
        if (!active || typeof window === 'undefined') return;
        const onResize = () => setBox({width: window.innerWidth, height: window.innerHeight});
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [active]);
    return box;
}

/**
 * Wires a Radix Content node up to resize handles. Persistence is delegated to
 * props: with `onSizeChange` the dragged size is reported to the caller (and
 * `initialSize` restores it); without it the size is session-only and reset
 * when the portalled content unmounts. Returns the inline style override and
 * the handle JSX.
 */
function useDialogResize(opts: {
    enabled: boolean;
    initialSize?: PersistedSize;
    onSizeChange?: (size: PersistedSize) => void;
    minWidth: number;
    minHeight: number;
    labels: DialogLabels;
}) {
    const {enabled, initialSize, onSizeChange, minWidth, minHeight, labels} = opts;
    const persistEnabled = !!onSizeChange;

    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [draftSize, setDraftSize] = React.useState<PersistedSize>(initialSize ?? {});

    React.useEffect(() => {
        if (!persistEnabled) return; // session-only: draft never re-synced from a prop
        setDraftSize(initialSize ?? {});
    }, [persistEnabled, initialSize]);

    // Callers keep <Dialog> (and this hook) mounted while closed - only the
    // portalled content unmounts. Drop the session-only draft when that happens,
    // so reopening starts from the default size instead of the last drag.
    const releaseDraft = React.useCallback(() => {
        if (persistEnabled) return;
        setDraftSize(prev => (prev.width || prev.height ? {} : prev));
    }, [persistEnabled]);

    const dragRef = React.useRef<{
        startX: number;
        startY: number;
        startW: number;
        startH: number;
        edge: 'right' | 'bottom' | 'corner';
    } | null>(null);

    const onPointerDown = React.useCallback(
        (e: React.PointerEvent, edge: 'right' | 'bottom' | 'corner') => {
            if (!enabled || !elementRef.current) return;
            e.preventDefault();
            e.stopPropagation();
            const rect = elementRef.current.getBoundingClientRect();
            dragRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                startW: rect.width,
                startH: rect.height,
                edge,
            };
            try {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
            } catch {
                // Older browsers / non-trusted events (synthetic test drivers) - fall through; window listeners still receive the moves.
            }

            const onMove = (moveEvent: PointerEvent) => {
                const drag = dragRef.current;
                if (!drag) return;
                // Cap to viewport-relative bounds - translate(-50%, -50%) keeps the
                // dialog centered, so reaching the edge of the viewport means doubling
                // the half-distance to the edge.
                const maxW = Math.max(minWidth, window.innerWidth - VIEWPORT_GUTTER);
                const maxH = Math.max(minHeight, window.innerHeight - VIEWPORT_GUTTER);

                let nextW = drag.startW;
                let nextH = drag.startH;
                if (drag.edge === 'right' || drag.edge === 'corner') {
                    // Right/corner: each px of movement adds 2px of width because
                    // the dialog is centered (mirroring the resize on the left side).
                    nextW = Math.min(maxW, Math.max(minWidth, drag.startW + (moveEvent.clientX - drag.startX) * 2));
                }
                if (drag.edge === 'bottom' || drag.edge === 'corner') {
                    nextH = Math.min(maxH, Math.max(minHeight, drag.startH + (moveEvent.clientY - drag.startY) * 2));
                }
                setDraftSize({width: Math.round(nextW), height: Math.round(nextH)});
            };

            const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                const finalRect = elementRef.current?.getBoundingClientRect();
                dragRef.current = null;
                if (onSizeChange && finalRect && finalRect.width > 0 && finalRect.height > 0) {
                    onSizeChange({
                        width: Math.round(finalRect.width),
                        height: Math.round(finalRect.height),
                    });
                }
            };

            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
        },
        [enabled, minWidth, minHeight, onSizeChange],
    );

    // Hidden under sm: breakpoint when responsive bottom-sheet kicks in - handles
    // would conflict with the slide-up behavior.
    const handleClassPrefix = 'hidden sm:block';

    const handles = enabled ? (
        <>
            <div
                role="separator"
                aria-label={labels.resizeWidth}
                onPointerDown={(e) => onPointerDown(e, 'right')}
                className={`${handleClassPrefix} absolute right-0 top-0 h-full w-1.5 cursor-ew-resize hover:bg-brand-base/40 transition-colors rounded-r-xl`}
                style={{touchAction: 'none'}}
            />
            <div
                role="separator"
                aria-label={labels.resizeHeight}
                onPointerDown={(e) => onPointerDown(e, 'bottom')}
                className={`${handleClassPrefix} absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize hover:bg-brand-base/40 transition-colors rounded-b-xl`}
                style={{touchAction: 'none'}}
            />
            <div
                role="separator"
                aria-label={labels.resize}
                onPointerDown={(e) => onPointerDown(e, 'corner')}
                className={`${handleClassPrefix} absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize text-white/40 hover:text-brand-base flex items-center justify-center`}
                style={{touchAction: 'none'}}
                title={labels.dragToResize}
            >
                <GripHorizontal className="h-3 w-3 -rotate-45"/>
            </div>
        </>
    ) : null;

    // A stored size only means anything where resizing exists (sm+, mirroring
    // the handle gating above). Below that the responsive Tailwind layout owns
    // the box - replaying a desktop size there pushes the dialog off-screen.
    const hasStoredSize = !!(draftSize.width || draftSize.height);
    const viewport = useViewportBox(enabled && hasStoredSize);
    const sizingActive = enabled && hasStoredSize && viewport.width >= SM_BREAKPOINT;

    // Same clamp the drag applies, re-run on restore + every viewport change:
    // a size stored on a big screen must not overflow a smaller one.
    const maxW = Math.max(minWidth, viewport.width - VIEWPORT_GUTTER);
    const maxH = Math.max(minHeight, viewport.height - VIEWPORT_GUTTER);

    const sizeStyle: React.CSSProperties = sizingActive
        ? {
            width: draftSize.width != null ? Math.min(draftSize.width, maxW) : undefined,
            height: draftSize.height != null ? Math.min(draftSize.height, maxH) : undefined,
            // Once the user explicitly resizes the width, drop the Tailwind
            // max-width cap so the dialog can actually grow past `max-w-lg`.
            ...(draftSize.width != null ? {maxWidth: 'none'} : {}),
        }
        : {};

    return {elementRef, handles, sizeStyle, releaseDraft};
}

/** Runs `onGone` when the portalled dialog content unmounts (dialog closed). */
const ContentLifetime = ({onGone}: {onGone: () => void}) => {
    React.useEffect(() => onGone, [onGone]);
    return null;
};

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    DialogContentProps
>(({
    className,
    children,
    responsive = false,
    resizable = true,
    initialSize,
    onSizeChange,
    minWidth = 320,
    minHeight = 200,
    labels,
    style,
    onPointerDownOutside,
    onInteractOutside,
    ...props
}, ref) => {
    const resolvedLabels = {...dialogDefaultLabels, ...labels};
    const {elementRef, handles, sizeStyle, releaseDraft} = useDialogResize({
        enabled: resizable,
        initialSize,
        onSizeChange,
        minWidth,
        minHeight,
        labels: resolvedLabels,
    });
    const viewport = useVisibleViewport();
    const mobileSheet = responsive && viewport.width < SM_BREAKPOINT;
    const viewportMaxHeight = Math.max(0, mobileSheet ? viewport.height * 0.92 : viewport.height - VIEWPORT_GUTTER);
    const viewportStyle = {
        '--dialog-viewport-height': `${viewport.height}px`,
        '--dialog-viewport-top': `${viewport.offsetTop}px`,
        '--dialog-viewport-bottom': `${Math.max(0, (typeof document === 'undefined' ? viewport.height : document.documentElement.clientHeight) - viewport.offsetTop - viewport.height)}px`,
    } as React.CSSProperties;

    // Compose forwarded ref + internal ref so consumers and the resize hook both work.
    const setRefs = React.useCallback((node: HTMLDivElement | null) => {
        elementRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [ref, elementRef]);

    // Popover-style surfaces (SmartSelect's menu, and anything else marked
    // data-portal-surface) portal to <body>, so they sit OUTSIDE this content
    // node and Radix counts a click in them as an outside-click - dismissing
    // the whole dialog mid-form. Treat them as inside.
    //
    // The clicked node is on detail.originalEvent; the CustomEvent's own
    // target is the content node, which would never match.
    const guardPortalSurface = (
        event: CustomEvent<{originalEvent: Event}>,
    ): void => {
        const origin = event.detail?.originalEvent?.target;
        if (origin instanceof Element && origin.closest('[data-portal-surface]')) {
            event.preventDefault();
        }
    };

    return (
        <DialogPortal>
            <DialogOverlay/>
            <DialogPrimitive.Content
                ref={setRefs}
                aria-describedby={undefined}
                className={cn(
                    "fixed left-[50%] top-[calc(var(--dialog-viewport-top)+var(--dialog-viewport-height)/2)] z-(--z-modal) w-full max-w-lg max-h-[calc(var(--dialog-viewport-height)-1rem)] translate-x-[-50%] translate-y-[-50%] overflow-y-auto overscroll-contain rounded-xl border border-border bg-background p-4 sm:p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    responsive && "max-sm:left-0 max-sm:top-auto max-sm:bottom-[var(--dialog-viewport-bottom)] max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:max-h-[calc(var(--dialog-viewport-height)*0.92)] max-sm:rounded-t-2xl max-sm:rounded-b-none max-sm:pb-[calc(1rem+env(safe-area-inset-bottom))] max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=closed]:slide-out-to-bottom",
                    className
                )}
                style={{...viewportStyle, ...style, ...sizeStyle, maxHeight: viewportMaxHeight}}
                onPointerDownOutside={(e) => {
                    guardPortalSurface(e);
                    onPointerDownOutside?.(e);
                }}
                onInteractOutside={(e) => {
                    guardPortalSurface(e);
                    onInteractOutside?.(e);
                }}
                {...props}
            >
                {children}
                <DialogPrimitive.Close
                    aria-label={resolvedLabels.close}
                    className="absolute right-3 top-3 inline-flex items-center justify-center h-10 w-10 sm:h-8 sm:w-8 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 after:absolute after:-inset-1 after:content-[''] sm:after:hidden">
                    <X className="h-4 w-4"/>
                    <span className="sr-only">{resolvedLabels.close}</span>
                </DialogPrimitive.Close>
                {handles}
                <ContentLifetime onGone={releaseDraft}/>
            </DialogPrimitive.Content>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col gap-2 text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({className, ...props}, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({className, ...props}, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogClose,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
