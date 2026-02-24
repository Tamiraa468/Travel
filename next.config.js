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
  // IMAGES — next/image optimization enabled
  // Serves WebP/AVIF, responsive srcset, lazy loading
  // ============================================
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dutauqy6m/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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

  // Increase static generation timeout (default 60s is too short for data-heavy pages)
  staticPageGenerationTimeout: 120,
  
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