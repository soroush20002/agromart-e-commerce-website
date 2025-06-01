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
    additionalSitemaps: [
      'https://agrm.ir/sitemap-0.xml',
    ],
  },
};
