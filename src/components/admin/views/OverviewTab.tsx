import React from 'react';
import { useTranslation } from 'next-i18next';
import { ServiceHealth, HealthSummary } from '../../../services/monitoring.service';
import { HealthSummaryWidget } from '../HealthSummaryWidget';
import { ServiceHealthCard } from '../ServiceHealthCard';

interface OverviewTabProps {
  services: ServiceHealth[];
  healthSummary: HealthSummary | null;
  loading: boolean;
}

/**
 * Overview Tab Component
 * Vue globale du système avec résumé et statuts principaux
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({ services, healthSummary, loading }) => {
  const { t } = useTranslation('admin');

  const getQuickStats = () => {
    if (!services.length) return null;

    const totalResponseTime = services.reduce((sum, service) => sum + service.responseTime, 0);
    const avgResponseTime = Math.round(totalResponseTime / services.length);
    const criticalServices = services.filter((s) => s.status === 'unhealthy').length;

    return {
      avgResponseTime,
      criticalServices,
      lastUpdate: new Date().toLocaleTimeString(),
    };
  };

  const stats = getQuickStats();

  if (loading && !services.length) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Summary Widget */}
      {healthSummary && <HealthSummaryWidget summary={healthSummary} />}

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('overview.avgResponseTime')}
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.avgResponseTime}ms
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-error/10 dark:bg-error/20 rounded-lg">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('overview.criticalIssues')}
                </p>
                <p className="text-2xl font-bold text-error dark:text-error">
                  {stats.criticalServices}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success/10 dark:bg-success/20 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('overview.lastUpdate')}
                </p>
                <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.lastUpdate}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid - Compact View */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {t('overview.servicesStatus')}
        </h3>
        {services.length === 0 ? (
          <div className="card p-8 text-center">
            <span className="text-4xl mb-4 block">📡</span>
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('overview.noServicesFound')}
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('overview.noServicesMessage')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceHealthCard key={service.name} service={service} />
            ))}
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {t('overview.systemInformation')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              {t('overview.environment')}
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('overview.development')}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              {t('overview.monitoring')}
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Penpal AI Monitoring Service v1.0
            </p>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              {t('overview.dataCollection')}
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('overview.everyThirtySeconds')}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              {t('overview.retention')}
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('overview.realTimeMonitoring')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
