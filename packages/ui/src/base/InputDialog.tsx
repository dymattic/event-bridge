import React, {useEffect, useId, useMemo, useState} from 'react';
import {Button} from './Button';
import {Input} from './Input';
import {Textarea} from './Textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from './Dialog';
import SmartSelect, {type SmartSelectLabels, type SmartSelectOption} from './SmartSelect';

interface InputOption {
    value: string;
    label: string;
}

export interface InputDialogLabels {
    confirm: string;
    cancel: string;
    fieldRequired: string;
    selectOption: string;
    enterText: string;
    enterValue: string;
}

export const inputDialogDefaultLabels: InputDialogLabels = {
    confirm: 'Confirm',
    cancel: 'Cancel',
    fieldRequired: 'This field is required',
    selectOption: 'Select an option…',
    enterText: 'Enter text',
    enterValue: 'Enter value',
};

interface InputDialogProps {
    isOpen: boolean;
    title: string;
    message?: string;
    inputType?: 'text' | 'select' | 'textarea';
    options?: InputOption[];
    initialValue?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
    maxLength?: number;
    required?: boolean;
    /** Fallback strings (English defaults in `inputDialogDefaultLabels`). */
    labels?: Partial<InputDialogLabels>;
    /** Forwarded to the embedded SmartSelect (search / empty strings) for inputType="select". */
    selectLabels?: Partial<SmartSelectLabels>;
}

const InputDialog: React.FC<InputDialogProps> = ({
                                                     isOpen,
                                                     title,
                                                     message,
                                                     inputType = 'text',
                                                     options = [],
                                                     initialValue = '',
                                                     placeholder = '',
                                                     confirmText,
                                                     cancelText,
                                                     onConfirm,
                                                     onCancel,
                                                     maxLength = 500,
                                                     required = false,
                                                     labels,
                                                     selectLabels,
                                                 }) => {
    const l = {...inputDialogDefaultLabels, ...labels};
    const resolvedConfirm = confirmText ?? l.confirm;
    const resolvedCancel = cancelText ?? l.cancel;
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');
    const inputId = useId();

    const smartOptions = useMemo<SmartSelectOption[]>(
        () => options.map(o => ({value: o.value, label: o.label})),
        [options],
    );

    // Reset value when dialog opens with new initialValue
    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
            setError('');
        }
    }, [isOpen, initialValue]);

    const handleConfirm = () => {
        if (required && !value.trim()) {
            setError(l.fieldRequired);
            return;
        }
        onConfirm(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputType !== 'textarea') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        if (newValue.trim() || !required) {
            setError('');
        }
    };

    const renderInput = () => {
        if (inputType === 'select') {
            return (
                <SmartSelect
                    options={smartOptions}
                    value={value}
                    onChange={(v) => handleValueChange(typeof v === 'string' ? v : '')}
                    placeholder={placeholder || l.selectOption}
                    allowSearch={smartOptions.length > 5}
                    labels={selectLabels}
                />
            );
        }

        if (inputType === 'textarea') {
            return (
                <Textarea
                    id={inputId}
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || l.enterText}
                    maxLength={maxLength}
                    rows={4}
                />
            );
        }

        return (
            <Input
                id={inputId}
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || l.enterValue}
                maxLength={maxLength}
                autoFocus
            />
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) onCancel();
        }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {message && <DialogDescription>{message}</DialogDescription>}
                </DialogHeader>
                <div className="space-y-2">
                    {renderInput()}
                    {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={onCancel} variant="outline">
                        {resolvedCancel}
                    </Button>
                    <Button onClick={handleConfirm}>
                        {resolvedConfirm}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InputDialog;
