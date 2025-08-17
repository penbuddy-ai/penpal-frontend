/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_AUTH_SERVICE_URL:
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3002/api/v1',
    NEXT_PUBLIC_AI_SERVICE_URL:
      process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3003/api/v1',
    NEXT_PUBLIC_PAYMENT_API_URL:
      process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'http://localhost:3004/api/v1',
    NEXT_PUBLIC_MONITORING_API_URL:
      process.env.NEXT_PUBLIC_MONITORING_API_URL || 'http://localhost:3005',
    NEXT_PUBLIC_AI_API_KEY: process.env.NEXT_PUBLIC_AI_API_KEY || 'your-api-key',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
};

module.exports = nextConfig;
