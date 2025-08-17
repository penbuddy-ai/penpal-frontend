/**
 * Monitoring Service
 * Service pour interagir avec l'API de monitoring des services
 */

export interface ServiceHealth {
  name: string;
  url: string;
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  lastChecked: string;
  error?: string;
}

export interface HealthSummary {
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    percentage: number;
  };
  timestamp: string;
  services: ServiceHealth[];
}

export interface MonitoringOverview {
  timestamp: string;
  totalServices: number;
  healthyServices: number;
  unhealthyServices: number;
  avgResponseTime: number;
  uptime: string;
  alerts: Array<{
    service: string;
    type: 'health' | 'performance' | 'error';
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }>;
}

class MonitoringService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_MONITORING_API_URL || 'http://localhost:3005';

  /**
   * Get health status of all services
   */
  async getServicesHealth(): Promise<ServiceHealth[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health/services`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch services health:', error);
      throw error;
    }
  }

  /**
   * Get health summary
   */
  async getHealthSummary(): Promise<HealthSummary> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch health summary:', error);
      throw error;
    }
  }

  /**
   * Get monitoring overview
   */
  async getMonitoringOverview(): Promise<MonitoringOverview> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/monitoring/overview`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch monitoring overview:', error);
      throw error;
    }
  }

  /**
   * Get monitoring alerts
   */
  async getAlerts() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/monitoring/alerts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      throw error;
    }
  }

  /**
   * Get Prometheus metrics (raw)
   */
  async getPrometheusMetrics(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Failed to fetch Prometheus metrics:', error);
      throw error;
    }
  }
}

export const monitoringService = new MonitoringService();
