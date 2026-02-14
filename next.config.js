/** @type {import('next').NextConfig} */

// Bundle analyzer – run with ANALYZE=true to inspect chunk sizes
const withBundleAnalyzer = process.env.ANALYZE === "true"
  ? require("@next/bundle-analyzer")({ enabled: true })
  : (config) => config;

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
    // Serve modern formats automatically (WebP for all browsers, AVIF for supported)
    formats: ['image/avif', 'image/webp'],
    // Allow remote images from any HTTPS source (tour images from DB/CDN)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimized device breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
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

module.exports = withBundleAnalyzer(nextConfig);