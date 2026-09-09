import React from 'react';
import {AlertCircle, AlertTriangle, Info} from 'lucide-react';
import {Button} from './Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from './Dialog';

export interface ConfirmDialogLabels {
    confirm: string;
    cancel: string;
}

export const confirmDialogDefaultLabels: ConfirmDialogLabels = {
    confirm: 'Confirm',
    cancel: 'Cancel',
};

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
    /** Extra content between message and buttons - e.g. an opt-in that changes what confirming does. */
    children?: React.ReactNode;
    /** Fallback button labels (English defaults in `confirmDialogDefaultLabels`). */
    labels?: Partial<ConfirmDialogLabels>;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         isOpen,
                                                         title,
                                                         message,
                                                         confirmText,
                                                         cancelText,
                                                         onConfirm,
                                                         onCancel,
                                                         type = 'danger',
                                                         children,
                                                         labels,
                                                     }) => {
    const l = {...confirmDialogDefaultLabels, ...labels};
    const resolvedConfirm = confirmText ?? l.confirm;
    const resolvedCancel = cancelText ?? l.cancel;
    // One-shot per open cycle - double activation (focus-restore replays,
    // rapid double-tap) must never fire a destructive action twice.
    const fired = React.useRef(false);
    React.useEffect(() => {
        if (isOpen) fired.current = false;
    }, [isOpen]);
    const confirmOnce = () => {
        if (fired.current) return;
        fired.current = true;
        onConfirm();
    };
    const icon = type === 'danger'
        ? <AlertCircle className="h-5 w-5 text-brand-base-soft"/>
        : type === 'warning'
            ? <AlertTriangle className="h-5 w-5 text-brand-amber"/>
            : <Info className="h-5 w-5 text-brand-violet-soft"/>;

    const confirmVariant = type === 'danger' ? 'destructive' : 'default';
    const showCancel = Boolean(resolvedCancel && resolvedCancel.trim());

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) onCancel();
        }}>
            {/* Not resizable: a confirmation is a title, a sentence and two
                buttons - there is nothing to size up, and drag handles on a
                destructive prompt only add mis-click surface. */}
            <DialogContent resizable={false} className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {icon}
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                {children && <div className="mt-4">{children}</div>}
                <DialogFooter className="mt-4">
                    {showCancel && (
                        <Button onClick={onCancel} variant="outline">
                            {resolvedCancel}
                        </Button>
                    )}
                    <Button onClick={confirmOnce} variant={confirmVariant}>
                        {resolvedConfirm}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
