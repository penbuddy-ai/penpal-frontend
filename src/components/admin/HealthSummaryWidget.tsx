import React from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { HealthSummary } from '../../services/monitoring.service';

interface HealthSummaryWidgetProps {
  summary: HealthSummary;
}

/**
 * Health Summary Widget Component
 * Affiche un résumé global de la santé des services
 */
export const HealthSummaryWidget: React.FC<HealthSummaryWidgetProps> = ({ summary }) => {
  const { t } = useTranslation('admin');

  const getOverallStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getOverallStatusIcon = (percentage: number) => {
    if (percentage >= 80) return '🟢';
    if (percentage >= 60) return '🟡';
    return '🔴';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {t('overview.systemHealthOverview')}
        </h2>
        <span className="text-2xl">{getOverallStatusIcon(summary.summary.percentage)}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {summary.summary.total}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('overview.totalServices')}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-success">{summary.summary.healthy}</div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('common.healthy')}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-error">{summary.summary.unhealthy}</div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('common.unhealthy')}
          </div>
        </div>

        <div className="text-center">
          <div
            className={`text-2xl font-bold ${getOverallStatusColor(summary.summary.percentage)}`}
          >
            {summary.summary.percentage}%
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('common.uptime')}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-1">
          <span>{t('overview.systemHealth')}</span>
          <span>{summary.summary.percentage}%</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${summary.summary.percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-3 rounded-full ${
              summary.summary.percentage >= 80
                ? 'bg-success'
                : summary.summary.percentage >= 60
                  ? 'bg-warning'
                  : 'bg-error'
            }`}
          ></motion.div>
        </div>
      </div>

      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        {t('overview.lastUpdate')}: {formatTimestamp(summary.timestamp)}
      </div>
    </motion.div>
  );
};
