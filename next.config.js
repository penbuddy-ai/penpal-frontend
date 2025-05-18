/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    NEXT_PUBLIC_DB_API_URL: process.env.NEXT_PUBLIC_DB_API_URL,
  },
  publicRuntimeConfig: {
    authApiUrl: process.env.NEXT_PUBLIC_AUTH_API_URL,
    dbApiUrl: process.env.NEXT_PUBLIC_DB_API_URL,
  },
};

module.exports = nextConfig;
