import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ServiceHealth } from '../../../services/monitoring.service';

interface ServicesTabProps {
  services: ServiceHealth[];
  loading: boolean;
}

/**
 * Services Tab Component
 * Vue détaillée de tous les services avec filtres et recherche
 */
export const ServicesTab: React.FC<ServicesTabProps> = ({ services, loading }) => {
  const { t } = useTranslation('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'unhealthy'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'responseTime' | 'status'>('name');

  const filteredAndSortedServices = services
    .filter((service) => {
      // Filter by search term
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'responseTime':
          return a.responseTime - b.responseTime;
        case 'status':
          if (a.status === b.status) return 0;
          return a.status === 'healthy' ? -1 : 1;
        default:
          return 0;
      }
    });

  const getServiceTypeIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('auth')) return '🔐';
    if (name.includes('db')) return '🗄️';
    if (name.includes('ai')) return '🤖';
    if (name.includes('payment')) return '💳';
    if (name.includes('monitoring')) return '📊';
    return '⚙️';
  };

  const getServiceDescription = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('auth')) return t('serviceDescriptions.authService');
    if (name.includes('db')) return t('serviceDescriptions.dbService');
    if (name.includes('ai')) return t('serviceDescriptions.aiService');
    if (name.includes('payment')) return t('serviceDescriptions.paymentService');
    return 'Service component';
  };

  if (loading && !services.length) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 flex items-center pl-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder={t('services.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div>
              <label
                htmlFor="statusFilter"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
              >
                {t('common.status')}
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input"
              >
                <option value="all">{t('services.all')}</option>
                <option value="healthy">{t('common.healthy')}</option>
                <option value="unhealthy">{t('common.unhealthy')}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
              >
                {t('services.sortBy')}
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input"
              >
                <option value="name">{t('services.name')}</option>
                <option value="responseTime">{t('common.responseTime')}</option>
                <option value="status">{t('common.status')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {services.length}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('overview.totalServices')}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">
                {services.filter((s) => s.status === 'healthy').length}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('common.healthy')}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-error">
                {services.filter((s) => s.status === 'unhealthy').length}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('common.unhealthy')}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {filteredAndSortedServices.length}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('services.filtered')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Services List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {filteredAndSortedServices.length === 0 ? (
          <div className="card p-8 text-center">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('services.noServicesFound')}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm || statusFilter !== 'all'
                ? t('services.adjustFilters')
                : t('services.notMonitored')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{getServiceTypeIcon(service.name)}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                          {service.name.replace('-service', '')}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                          {getServiceDescription(service.name)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          service.status === 'healthy'
                            ? 'bg-success/10 text-success dark:bg-success/20'
                            : 'bg-error/10 text-error dark:bg-error/20'
                        }`}
                      >
                        {service.status === 'healthy' ? '✅' : '❌'}{' '}
                        {service.status === 'healthy' ? t('common.healthy') : t('common.unhealthy')}
                      </span>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {t('common.lastChecked')}:{' '}
                        {new Date(service.lastChecked).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Service Metrics */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {t('common.responseTime')}
                      </p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {service.responseTime}ms
                      </p>
                    </div>
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {t('common.uptime')}
                      </p>
                      <p className="text-lg font-semibold text-success">99.9%</p>
                    </div>
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {t('common.requests')}
                      </p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        1.2K
                      </p>
                    </div>
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {t('service.url')}
                      </p>
                      <p
                        className="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate"
                        title={service.url}
                      >
                        {service.url}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="btn btn-outline btn-sm">{t('services.details')}</button>
                      <button className="btn btn-ghost btn-sm">{t('services.logs')}</button>
                    </div>

                    {service.error && (
                      <div className="text-right">
                        <span className="text-error text-sm font-medium">
                          {t('services.error')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Error Details */}
                  {service.error && (
                    <div className="mt-4 p-3 bg-error/10 dark:bg-error/20 border border-error/20 dark:border-error/30 rounded-lg">
                      <p className="text-error text-sm">{service.error}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
