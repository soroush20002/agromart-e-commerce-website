/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://agrm.ir',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/checkout', '/my-order', '/order-confirmation'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/my-order', '/order-confirmation'],
      },
    ],
  },
  additionalPaths: async (config) => {
    const res = await fetch('https://agri.liara.run/api/products?pagination[pageSize]=1000');
    const products = await res.json();

    return products.data.map((product) => ({
      loc: `/products-search/${encodeURIComponent(product.slug)}`,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: product.updatedAt,
    }));
  },
};

