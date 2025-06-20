import React from 'react';
import Modal from './Modal';
import Button from '../Button/Button';
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  closeText?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Alert modal component for displaying important information
 */
export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  closeText = 'OK',
  type = 'info',
  size = 'md',
}: AlertModalProps) {
  const typeConfig = {
    warning: {
      icon: AlertTriangleIcon,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    danger: {
      icon: XCircleIcon,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
    },
    info: {
      icon: InfoIcon,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    success: {
      icon: CheckCircleIcon,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
    },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
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

          {/* Action */}
          <div className="flex justify-end">
            <Button variant="primary" onClick={onClose}>
              {closeText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
