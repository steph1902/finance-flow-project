import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Create the next-intl plugin with the path to our config
const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // Enable for Docker deployment

  // Turbopack configuration
  turbopack: {
    root: __dirname, // Explicitly set workspace root
  },

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },

  // NOTE: i18n is handled with next-intl plugin
};

// Export wrapped config
export default withNextIntl(nextConfig);
