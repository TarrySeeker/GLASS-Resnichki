import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glass.example'

/**
 * Пока домен не выбран и витрина стоит на предпросмотре, индексировать её
 * нельзя: черновик с пустыми ценами уйдёт в выдачу. Открывается одной
 * переменной окружения — NEXT_PUBLIC_INDEXABLE=1 на боевом домене.
 */
export default function robots(): MetadataRoute.Robots {
  const open = process.env.NEXT_PUBLIC_INDEXABLE === '1'
  return {
    rules: open
      ? { userAgent: '*', allow: '/', disallow: ['/ru/cart', '/en/cart', '/ar/cart'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${SITE}/sitemap.xml`,
  }
}
