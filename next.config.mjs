/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com'],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { message: /the `punycode` module/ }
    ];
    return config;
  },
  experimental: {
    optimizeCss: false // Disable this feature for now
  }
};

export default nextConfig;
