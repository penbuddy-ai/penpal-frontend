import React from 'react';

interface MetricsTabProps {
  loading: boolean;
}

/**
 * Metrics Tab Component
 * Vue des métriques avancées et graphiques (à développer)
 */
export const MetricsTab: React.FC<MetricsTabProps> = ({ loading }) => {
  return (
    <div className="space-y-6">
      {/* Coming Soon Message */}
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <span className="text-6xl mb-4 block">📈</span>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Metrics</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This section will include detailed performance metrics, charts, and historical data
          analysis.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Coming Soon:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Real-time performance charts</li>
            <li>• Historical data visualization</li>
            <li>• Custom metric dashboards</li>
            <li>• Performance trend analysis</li>
            <li>• SLA monitoring</li>
          </ul>
        </div>

        <div className="flex justify-center space-x-4">
          <a
            href="http://localhost:9090"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <span className="mr-2">🔥</span>
            View Prometheus
          </a>
          <a
            href="http://localhost:3006"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">📊</span>
            View Grafana
          </a>
        </div>
      </div>

      {/* Basic Metrics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">System Metrics</h4>
            <span className="text-2xl">🖥️</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Disk Usage</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Application Metrics</h4>
            <span className="text-2xl">📱</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">API Requests</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Business Metrics</h4>
            <span className="text-2xl">💼</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Conversations</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payments</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subscriptions</span>
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
