import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/hooks/useAuth';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { monitoringService } from '@/services/monitoring.service';
import { ServiceHealth, HealthSummary } from '@/services/monitoring.service';
import { OverviewTab } from './views/OverviewTab';
import { ServicesTab } from './views/ServicesTab';
import { ServiceTab } from './views/ServiceTab';
import { TabNavigation } from './TabNavigation';
import { AuthServiceTab } from './views/AuthServiceTab';
import { AIServiceTab } from './views/AIServiceTab';
import { Tab } from './TabNavigation';

/**
 * Admin Dashboard Component
 * Dashboard principal pour l'administration et le monitoring des services
 */
export default function AdminDashboard() {
  const { t } = useTranslation('admin');
  const { isLoading: authLoading } = useAuth();
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  // Auto-refresh monitoring data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMonitoringData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    setIsLoading(true);
    try {
      const data = await monitoringService.getServicesHealth();
      setServices(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const getServiceData = (serviceName: string) => {
    return services.find((s) => s.name === serviceName);
  };

  const tabs: Tab[] = [
    { id: 'overview', label: t('navigation.overview'), icon: '🏠' },
    { id: 'services', label: t('navigation.services'), icon: '⚙️', count: services.length },
    { id: 'auth-service', label: t('navigation.authService'), icon: '🔐' },
    { id: 'db-service', label: t('navigation.dbService'), icon: '🗄️' },
    { id: 'ai-service', label: t('navigation.aiService'), icon: '🤖' },
    { id: 'payment-service', label: t('navigation.paymentService'), icon: '💳' },
  ];

  const renderTabContent = () => {
    const service = getServiceData(activeTab);

    switch (activeTab) {
      case 'overview':
        return <OverviewTab services={services} healthSummary={null} loading={isLoading} />;
      case 'services':
        return <ServicesTab services={services} loading={isLoading} />;
      case 'auth-service':
        return <AuthServiceTab service={service} loading={isLoading} />;
      case 'db-service':
        return (
          <ServiceTab
            serviceName="db-service"
            serviceIcon="🗄️"
            serviceDisplayName={t('navigation.dbService')}
            serviceDescription={t('serviceDescriptions.dbService')}
            service={service}
            loading={isLoading}
          />
        );
      case 'ai-service':
        return <AIServiceTab service={service} loading={isLoading} />;
      case 'payment-service':
        return (
          <ServiceTab
            serviceName="payment-service"
            serviceIcon="💳"
            serviceDisplayName={t('navigation.paymentService')}
            serviceDescription={t('serviceDescriptions.paymentService')}
            service={service}
            loading={isLoading}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('errors.unknownTab')}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">{t('errors.tabNotConfigured')}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {t('title')}
              </h1>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">{t('description')}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {t('common.lastRefresh')}: {lastRefresh.toLocaleTimeString()}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchMonitoringData}
                disabled={isLoading}
                className="btn btn-primary btn-sm inline-flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{t('common.refresh')}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </main>
    </div>
  );
}
