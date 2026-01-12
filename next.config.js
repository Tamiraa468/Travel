/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================
  // SEO CONFIGURATION
  // ============================================
  
  // Trailing slash: false = URLs without trailing slash
  // /tours/ → redirects to /tours (301)
  // This ensures one canonical URL per page
  trailingSlash: false,
  
  // Powered-by header removal (security + smaller headers)
  poweredByHeader: false,
  
  // Strict mode for better React practices
  reactStrictMode: true,
  
  // Compress responses
  compress: true,

  // ============================================
  // IMAGES
  // ============================================
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // ============================================
  // BUILD CONFIG
  // ============================================
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  
  // ============================================
  // REDIRECTS (SEO - avoid duplicate content)
  // ============================================
  async redirects() {
    return [
      // Redirect old aboutUs to about
      {
        source: '/aboutUs',
        destination: '/about',
        permanent: true, // 301 redirect
      },
    ];
  },
};

module.exports = nextConfig;