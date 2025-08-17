import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'next-i18next';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface GrafanaPanelProps {
  dashboardId: string;
  panelId?: number;
  title: string;
  height?: number;
  timeRange?: string;
  refresh?: string;
  className?: string;
}

/**
 * Grafana Panel Component
 * Composant pour intégrer des graphiques Grafana dans le dashboard admin
 */
export const GrafanaPanel: React.FC<GrafanaPanelProps> = memo(
  ({
    dashboardId,
    panelId,
    title,
    height = 400,
    timeRange = 'now-1h',
    refresh = '30s',
    className = '',
  }) => {
    const { t } = useTranslation('admin');
    const [hasError, setHasError] = useState(false);

    // Grafana server URL - en production, cela devrait venir de la config
    const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3006';

    // Construire l'URL d'embedding Grafana
    const buildGrafanaUrl = () => {
      let url = `${grafanaUrl}/d-solo/${dashboardId}`;

      if (panelId) {
        url += `?panelId=${panelId}`;
      }

      const params = new URLSearchParams({
        from: timeRange.replace('now-', 'now-'),
        to: 'now',
        refresh: refresh,
        theme: 'dark',
        kiosk: 'true',
      });

      url += (panelId ? '&' : '?') + params.toString();
      return url;
    };

    const grafanaEmbedUrl = buildGrafanaUrl();

    const handleIframeLoad = () => {
      setHasError(false);
    };

    const handleIframeError = () => {
      setHasError(true);
    };

    const openInNewTab = () => {
      const fullDashboardUrl = `${grafanaUrl}/d/${dashboardId}`;
      window.open(fullDashboardUrl, '_blank');
    };

    const refreshPanel = () => {
      setHasError(false);

      // Force refresh by updating iframe src
      const iframe = document.getElementById(
        `grafana-${dashboardId}-${panelId}`
      ) as HTMLIFrameElement;
      if (iframe) {
        iframe.src = iframe.src;
      }
    };

    if (hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card p-6 text-center ${className}`}
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {t('grafana.loadError')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {t('grafana.loadErrorMessage')}
          </p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={refreshPanel}
              className="btn btn-primary btn-sm inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('common.retry')}</span>
            </button>
            <button
              onClick={openInNewTab}
              className="btn btn-outline btn-sm inline-flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('grafana.openInGrafana')}</span>
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card overflow-hidden ${className}`}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshPanel}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              title={t('common.refresh')}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={openInNewTab}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              title={t('grafana.openInGrafana')}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grafana Iframe */}
        <div className="relative">
          <iframe
            id={`grafana-${dashboardId}-${panelId}`}
            src={grafanaEmbedUrl}
            width="100%"
            height={height}
            frameBorder="0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="block"
            title={`Grafana Panel: ${title}`}
          />
        </div>
      </motion.div>
    );
  }
);

GrafanaPanel.displayName = 'GrafanaPanel';

/**
 * Grafana Dashboard Component
 * Composant pour afficher un dashboard Grafana complet
 */
interface GrafanaDashboardProps {
  dashboardId: string;
  title: string;
  height?: number;
  timeRange?: string;
  refresh?: string;
  className?: string;
}

export const GrafanaDashboard: React.FC<GrafanaDashboardProps> = memo(
  ({ dashboardId, title, height = 600, timeRange = 'now-1h', refresh = '30s', className = '' }) => {
    const { t } = useTranslation('admin');
    const [hasError, setHasError] = useState(false);

    const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3006';

    const buildDashboardUrl = () => {
      const params = new URLSearchParams({
        from: timeRange.replace('now-', 'now-'),
        to: 'now',
        refresh: refresh,
        theme: 'dark',
        kiosk: 'tv',
      });

      return `${grafanaUrl}/d/${dashboardId}?${params.toString()}`;
    };

    const grafanaEmbedUrl = buildDashboardUrl();

    const handleIframeLoad = () => {
      setHasError(false);
    };

    const handleIframeError = () => {
      setHasError(true);
    };

    const openInNewTab = () => {
      const fullDashboardUrl = `${grafanaUrl}/d/${dashboardId}`;
      window.open(fullDashboardUrl, '_blank');
    };

    if (hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card p-8 text-center ${className}`}
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {t('grafana.dashboardError')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {t('grafana.dashboardErrorMessage')}
          </p>
          <button
            onClick={openInNewTab}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t('grafana.openInGrafana')}</span>
          </button>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card overflow-hidden ${className}`}
      >
        {/* Dashboard Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
          <button
            onClick={openInNewTab}
            className="btn btn-outline btn-sm inline-flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t('grafana.openInGrafana')}</span>
          </button>
        </div>

        {/* Grafana Dashboard Iframe */}
        <iframe
          src={grafanaEmbedUrl}
          width="100%"
          height={height}
          frameBorder="0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="block"
          title={`Grafana Dashboard: ${title}`}
        />
      </motion.div>
    );
  }
);

GrafanaDashboard.displayName = 'GrafanaDashboard';
