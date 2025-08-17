import React from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ServiceHealth } from '../../services/monitoring.service';

interface ServiceHealthCardProps {
  service: ServiceHealth;
}

/**
 * Service Health Card Component
 * Affiche le statut de santé d'un service individuel
 */
export const ServiceHealthCard: React.FC<ServiceHealthCardProps> = ({ service }) => {
  const { t } = useTranslation('admin');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-success dark:border-success/30';
      case 'unhealthy':
        return 'bg-error/10 text-error border-error/20 dark:bg-error/20 dark:text-error dark:border-error/30';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'unhealthy':
        return '❌';
      default:
        return '⚪';
    }
  };

  const formatResponseTime = (time: number) => {
    return `${time}ms`;
  };

  const formatLastChecked = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusText = (status: string) => {
    return status === 'healthy' ? t('common.healthy') : t('common.unhealthy');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`card p-4 border-2 ${getStatusColor(service.status)} transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getStatusIcon(service.status)}</span>
          <h3 className="font-semibold text-lg capitalize text-neutral-900 dark:text-neutral-100">
            {service.name.replace('-service', '')}
          </h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
        >
          {getStatusText(service.status)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">
            {t('common.responseTime')}:
          </span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {formatResponseTime(service.responseTime)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">{t('common.lastChecked')}:</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {formatLastChecked(service.lastChecked)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">{t('service.url')}:</span>
          <span
            className="font-mono text-xs truncate max-w-[200px] text-neutral-700 dark:text-neutral-300"
            title={service.url}
          >
            {service.url}
          </span>
        </div>

        {service.error && (
          <div className="mt-3 p-2 bg-error/10 dark:bg-error/20 border border-error/20 dark:border-error/30 rounded">
            <span className="text-error text-xs font-medium">{t('services.error')}:</span>
            <p className="text-error text-xs mt-1">{service.error}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
