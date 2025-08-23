import React, { memo } from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ServiceHealth } from '../../../services/monitoring.service';
import { GrafanaPanel, GrafanaDashboard } from '../GrafanaPanel';

interface AIServiceTabProps {
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
            <span className="text-3xl">🤖</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {t('navigation.aiService')}
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
              {t('serviceDescriptions.aiService')}
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
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('ai.provider')}</p>
                <p className="text-lg font-semibold text-success">OpenAI</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('ai.defaultModel')}
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  GPT-4o Mini
                </p>
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
          dashboardId="penpal-ai-test"
          title="AI Service Test Metrics"
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
            dashboardId="penpal-ai-test"
            panelId={1}
            title="AI Service Status (Test)"
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GrafanaPanel
            dashboardId="penpal-ai-metrics"
            panelId={2}
            title={t('ai.panels.totalCosts')}
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GrafanaPanel
            dashboardId="penpal-ai-metrics"
            panelId={3}
            title={t('ai.panels.tokenConsumption')}
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GrafanaPanel
            dashboardId="penpal-ai-metrics"
            panelId={4}
            title={t('ai.panels.requestDuration')}
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GrafanaPanel
            dashboardId="penpal-ai-metrics"
            panelId={5}
            title={t('ai.panels.messagesByLanguage')}
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GrafanaPanel
            dashboardId="penpal-ai-metrics"
            panelId={6}
            title={t('ai.panels.activeConnections')}
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

  const endpoints = [
    { method: 'POST', path: '/ai/chat', description: t('ai.endpoints.chat') },
    { method: 'POST', path: '/ai/tutor', description: t('ai.endpoints.tutor') },
    {
      method: 'POST',
      path: '/ai/conversation-partner',
      description: t('ai.endpoints.conversationPartner'),
    },
    { method: 'POST', path: '/ai/analyze', description: t('ai.endpoints.analyze') },
    {
      method: 'GET',
      path: '/ai/conversation-starters',
      description: t('ai.endpoints.conversationStarters'),
    },
    { method: 'GET', path: '/ai/models', description: t('ai.endpoints.models') },
    { method: 'GET', path: '/ai/providers', description: t('ai.endpoints.providers') },
    { method: 'GET', path: '/ai/health', description: t('ai.endpoints.health') },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-6"
    >
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        {t('service.apiEndpoints')}
      </h3>
      <div className="space-y-3">
        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(endpoint.method)}`}
              >
                {endpoint.method}
              </span>
              <code className="text-sm font-mono text-neutral-900 dark:text-neutral-100">
                {endpoint.path}
              </code>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-right">
              {endpoint.description}
            </p>
          </div>
        ))}
      </div>

      {/* Configuration Information */}
      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
          {t('ai.configuration')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('ai.defaultModel')}</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              gpt-4o-mini
            </p>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('ai.maxTokens')}</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">2,000</p>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('ai.temperature')}</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">0.7</p>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('ai.rateLimit')}</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">100/min</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ServiceInformation.displayName = 'ServiceInformation';

/**
 * AI Service Tab - Onglet principal pour le service IA
 */
export const AIServiceTab: React.FC<AIServiceTabProps> = ({ service, loading }) => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <ServiceHeader service={service} loading={loading} />

      {/* Grafana Dashboards */}
      <GrafanaDashboards />

      {/* Service Information */}
      <ServiceInformation />
    </div>
  );
};

export default AIServiceTab;
