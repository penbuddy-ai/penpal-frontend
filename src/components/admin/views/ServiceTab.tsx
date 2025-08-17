import React from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ServiceHealth } from '../../../services/monitoring.service';

interface ServiceTabProps {
  serviceName: string;
  serviceIcon: string;
  serviceDisplayName: string;
  serviceDescription: string;
  service?: ServiceHealth;
  loading: boolean;
}

/**
 * Service Tab Component
 * Vue détaillée d'un service spécifique
 */
export const ServiceTab: React.FC<ServiceTabProps> = ({
  serviceName,
  serviceIcon,
  serviceDisplayName,
  serviceDescription,
  service,
  loading,
}) => {
  const { t } = useTranslation('admin');

  const getServiceFeatures = (serviceName: string) => {
    const featureKey = serviceName.replace('-service', '') as 'auth' | 'db' | 'ai' | 'payment';
    const features = t(`features.${featureKey}`, { returnObjects: true }) as Record<string, string>;
    return Object.values(features);
  };

  const getServiceEndpoints = (serviceName: string) => {
    const endpointKey = serviceName.replace('-service', '') as 'auth' | 'db' | 'ai' | 'payment';
    const endpoints = t(`endpoints.${endpointKey}`, { returnObjects: true }) as Record<
      string,
      string
    >;

    const endpointList = [
      {
        method: 'GET',
        path: '/health',
        description:
          endpoints.login ||
          endpoints.getUsers ||
          endpoints.startConversation ||
          endpoints.createSubscription,
      },
      {
        method: 'POST',
        path: '/api/v1/login',
        description:
          endpoints.register ||
          endpoints.createUser ||
          endpoints.sendMessage ||
          endpoints.getSubscription,
      },
      {
        method: 'GET',
        path: '/api/v1/me',
        description:
          endpoints.me ||
          endpoints.getConversations ||
          endpoints.getConversation ||
          endpoints.processPayment,
      },
      {
        method: 'POST',
        path: '/api/v1/logout',
        description:
          endpoints.logout ||
          endpoints.createConversation ||
          endpoints.getAiCharacters ||
          endpoints.stripeWebhook,
      },
    ];

    return endpointList;
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

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

  const features = getServiceFeatures(serviceName);
  const endpoints = getServiceEndpoints(serviceName);

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <span className="text-3xl">{serviceIcon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {serviceDisplayName}
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
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">{serviceDescription}</p>

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
                  {t('common.requests')}
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">1.2K</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            {t('common.features')}
          </h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
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
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            {t('common.apiEndpoints')}
          </h3>
          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
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

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {t('common.performanceMetrics')}
        </h3>
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 text-center">
          <span className="text-4xl mb-4 block">📊</span>
          <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {t('service.chartsComingSoon')}
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            {t('service.chartsDescription')}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
