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
};

export default nextConfig;
