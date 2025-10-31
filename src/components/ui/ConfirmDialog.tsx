import React from 'react';
import { Button } from './button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{message}</p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2"
              >
                {cancelText}
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-2"
              >
                {isLoading ? 'Deleting...' : confirmText}
              </Button>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;