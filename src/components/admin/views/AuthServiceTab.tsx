import React, { memo } from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ServiceHealth } from '../../../services/monitoring.service';
import { GrafanaPanel, GrafanaDashboard } from '../GrafanaPanel';

interface AuthServiceTabProps {
  service?: ServiceHealth;
  loading: boolean;
}

/**
 * Service Header Component - Séparé pour éviter les remontages
 */
const ServiceHeader = memo<{ service?: ServiceHealth; loading: boolean }>(
  ({ service, loading }) => {
    const { t } = useTranslation('admin');

    if (!service) {
      return (
        <div className="card p-8 text-center">
          <span className="text-4xl mb-4 block">❓</span>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {t('service.notFound')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">{t('service.notFoundMessage')}</p>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <span className="text-3xl">🔐</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {t('navigation.authService')}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  service.status === 'healthy'
                    ? 'bg-success/10 text-success dark:bg-success/20'
                    : 'bg-error/10 text-error dark:bg-error/20'
                }`}
              >
                {service.status === 'healthy' ? t('common.healthy') : t('common.unhealthy')}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {t('serviceDescriptions.authService')}
            </p>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('common.status')}
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {service.status === 'healthy' ? '✅' : '❌'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('common.responseTime')}
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {service.responseTime}ms
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('common.uptime')}
                </p>
                <p className="text-lg font-semibold text-success">99.9%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('auth.totalUsers')}
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">--</p>
              </div>
            </div>
          </div>
        </div>

        {service.error && (
          <div className="mt-4 p-3 bg-error/10 dark:bg-error/20 border border-error/20 dark:border-error/30 rounded-lg">
            <h4 className="font-medium text-error mb-1">{t('service.serviceError')}</h4>
            <p className="text-sm text-error">{service.error}</p>
          </div>
        )}
      </motion.div>
    );
  }
);

ServiceHeader.displayName = 'ServiceHeader';

/**
 * Grafana Dashboards Component - Séparé pour éviter les remontages
 */
const GrafanaDashboards = memo(() => {
  const { t } = useTranslation('admin');

  return (
    <>
      {/* Grafana Dashboard - Dashboard principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GrafanaDashboard
          dashboardId="penpal-auth-metrics"
          title={t('auth.dashboard.title')}
          height={800}
          timeRange="now-1h"
          refresh="30s"
        />
      </motion.div>

      {/* Grafana Panels - Panneaux individuels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GrafanaPanel
            dashboardId="penpal-auth-metrics"
            panelId={1}
            title={t('auth.panels.totalUsers')}
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GrafanaPanel
            dashboardId="penpal-auth-metrics"
            panelId={2}
            title={t('auth.panels.activeUsers')}
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GrafanaPanel
            dashboardId="penpal-auth-metrics"
            panelId={3}
            title={t('auth.panels.usersByLanguage')}
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GrafanaPanel
            dashboardId="penpal-auth-metrics"
            panelId={5}
            title={t('auth.panels.averageLevel')}
            height={300}
          />
        </motion.div>
      </div>
    </>
  );
});

GrafanaDashboards.displayName = 'GrafanaDashboards';

/**
 * Service Information Component - Séparé pour éviter les remontages
 */
const ServiceInformation = memo(() => {
  const { t } = useTranslation('admin');

  const authFeatures = [
    t('features.auth.userRegistration'),
    t('features.auth.emailAuthentication'),
    t('features.auth.oauthIntegration'),
    t('features.auth.jwtTokens'),
    t('features.auth.passwordSecurity'),
    t('features.auth.sessionManagement'),
  ];

  const authEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/auth/register',
      description: t('endpoints.auth.register'),
    },
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      description: t('endpoints.auth.login'),
    },
    {
      method: 'GET',
      path: '/api/v1/users/me',
      description: t('endpoints.auth.me'),
    },
    {
      method: 'POST',
      path: '/api/v1/auth/logout',
      description: t('endpoints.auth.logout'),
    },
    {
      method: 'GET',
      path: '/api/v1/users/metrics',
      description: t('endpoints.auth.metrics'),
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-success/10 text-success border-success/20 dark:bg-success/20';
      case 'POST':
        return 'bg-primary-100 text-primary-600 border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800';
      case 'PATCH':
        return 'bg-warning/10 text-warning border-warning/20 dark:bg-warning/20';
      case 'DELETE':
        return 'bg-error/10 text-error border-error/20 dark:bg-error/20';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Features */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {t('common.features')}
        </h3>
        <div className="space-y-3">
          {authFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* API Endpoints */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {t('common.apiEndpoints')}
        </h3>
        <div className="space-y-3">
          {authEndpoints.map((endpoint, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 rounded border border-neutral-200 dark:border-neutral-700"
            >
              <span
                className={`px-2 py-1 rounded text-xs font-medium border ${getMethodColor(endpoint.method)}`}
              >
                {endpoint.method}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-neutral-700 dark:text-neutral-300 truncate">
                  {endpoint.path}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {endpoint.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

ServiceInformation.displayName = 'ServiceInformation';

/**
 * Auth Service Tab Component
 * Vue spécialisée pour le service d'authentification avec métriques Grafana
 */
export const AuthServiceTab: React.FC<AuthServiceTabProps> = memo(({ service, loading }) => {
  return (
    <div className="space-y-6">
      {/* Service Header - Se met à jour avec les health checks */}
      <ServiceHeader service={service} loading={loading} />

      {/* Grafana Dashboards - Reste stable */}
      <GrafanaDashboards />

      {/* Service Information - Statique */}
      <ServiceInformation />
    </div>
  );
});

AuthServiceTab.displayName = 'AuthServiceTab';
