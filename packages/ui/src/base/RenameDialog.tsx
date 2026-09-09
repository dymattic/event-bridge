import React from 'react';
import InputDialog from './InputDialog';

/**
 * Rename prompt - thin wrapper around `InputDialog` so the existing
 * `RenameDialog` call sites keep working while the rendered surface
 * routes through the design-system Dialog + Input + Button primitives.
 *
 * Sets the InputDialog defaults that match the legacy "rename" UX -
 * `confirmText='Save'`, `required` (empty input rejected), and a sensible
 * `placeholder`. User strings are `labels` props (English defaults in
 * `renameDialogDefaultLabels`); the app shim passes translated strings.
 */
export interface RenameDialogLabels {
    enterName: string;
    save: string;
    cancel: string;
}

export const renameDialogDefaultLabels: RenameDialogLabels = {
    enterName: 'Enter name',
    save: 'Save',
    cancel: 'Cancel',
};

interface RenameDialogProps {
    isOpen: boolean;
    title: string;
    initialValue: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: (newName: string) => void;
    onCancel: () => void;
    placeholder?: string;
    maxLength?: number;
    labels?: Partial<RenameDialogLabels>;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
                                                       isOpen,
                                                       title,
                                                       initialValue,
                                                       confirmText,
                                                       cancelText,
                                                       onConfirm,
                                                       onCancel,
                                                       placeholder,
                                                       maxLength = 100,
                                                       labels,
                                                   }) => {
    const l = {...renameDialogDefaultLabels, ...labels};
    return (
        <InputDialog
            isOpen={isOpen}
            title={title}
            initialValue={initialValue}
            inputType="text"
            placeholder={placeholder ?? l.enterName}
            confirmText={confirmText ?? l.save}
            cancelText={cancelText ?? l.cancel}
            maxLength={maxLength}
            required
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
};

export default RenameDialog;
