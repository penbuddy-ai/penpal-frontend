import React from 'react';
import Modal from './Modal';
import Button from '../Button/Button';
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Confirmation modal component with different types and icons
 */
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning',
  isLoading = false,
  size = 'md',
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const typeConfig = {
    warning: {
      icon: AlertTriangleIcon,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      confirmVariant: 'primary' as const,
    },
    danger: {
      icon: XCircleIcon,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      confirmVariant: 'danger' as const,
    },
    info: {
      icon: InfoIcon,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      confirmVariant: 'primary' as const,
    },
    success: {
      icon: CheckCircleIcon,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      confirmVariant: 'primary' as const,
    },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${config.iconBg}`}
        >
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="sm:order-1">
              {cancelText}
            </Button>
            <Button
              variant={config.confirmVariant}
              onClick={handleConfirm}
              disabled={isLoading}
              className="sm:order-2"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
