/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com'],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { message: /the `punycode` module/ }
    ];
    // Enhanced chunk optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          styles: {
            name: 'styles',
            test: /\.(css|scss)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    };
    return config;
  },
  experimental: {
    optimizeCss: true,
    largePageDataBytes: 128 * 1000, // 128KB
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_GEOLOCATION_API_URL: 'https://geolocation-db.com/json/',
  },
  // Enhanced performance settings
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  output: 'standalone'
};

export default nextConfig;
