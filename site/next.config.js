const commerce = require('./commerce.config.json')
const { withCommerceConfig, getProviderName } = require('./commerce-config')

const provider = commerce.provider || getProviderName()
const isBC = provider === '@vercel/commerce-bigcommerce'
const isShopify = provider === '@vercel/commerce-shopify'
const isSaleor = provider === '@vercel/commerce-saleor'
const isSwell = provider === '@vercel/commerce-swell'
const isVendure = provider === '@vercel/commerce-vendure'
const isLocal = provider === '@vercel/commerce-local'

module.exports = withCommerceConfig({
  commerce,
  images: {
    loader: "custom",
    imageSizes: [16, 32, 64, 96, 256],
    deviceSizes: [640, 750, 1080, 1200, 2048],
    nextImageExportOptimizer: {
      imageFolderPath: "public",
      exportFolderPath: "out",
      quality: 75,
    },
  },
  env: {
    optimizeProductImages: isLocal ? true : false,
    storePicturesInWEBP: true,
    generateAndUseBlurImages: true,
  },
  generateBuildId: async () => {
    return 'quant-static'
  },
  rewrites() {
    return [
      (isBC || isShopify || isSwell || isVendure || isSaleor) && {
        source: '/checkout',
        destination: '/api/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
      // For Vendure, rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.
      isVendure &&
      process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL && {
        source: `${process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL}/:path*`,
        destination: `${process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL}/:path*`,
      },
      // To test API routing via Quant use the NEXT_COMMERCE_API_VIA_QUANT env var.
      // @todo: Implemented as a redirect, rewrites not overriding existing API paths.
      process.env.NEXT_COMMERCE_QUANT_API && {
        source: '/quantapi/:path*',
        destination: `${process.env.NEXT_COMMERCE_QUANT_API}/:path*` // Proxy to Backend
      },
    ].filter(Boolean)
  },
  redirects() {
    return [
      process.env.NEXT_COMMERCE_QUANT_API && {
        source: '/api/:path*',
        destination: '/quantapi/:path*',
        permanent: false
      }
    ].filter(Boolean)
  }
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
