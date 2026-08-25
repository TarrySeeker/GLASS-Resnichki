import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/i18n'
import { PRODUCTS } from '@/lib/catalog'
import { INFO_SLUGS } from '@/app/[lang]/info/[slug]/page'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glass.example'

/**
 * Карта сайта на трёх языках. Корзину не включаем — она у каждого своя.
 * Языковые версии связаны через alternates: иначе три витрины одного товара
 * читаются поисковиком как три разные страницы с одинаковым содержанием.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/catalog',
    ...INFO_SLUGS.map((s) => `/info/${s}`),
    ...PRODUCTS.map((p) => `/product/${p.slug}`),
  ]

  return paths.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: `${SITE}/${lang}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : path === '/catalog' ? 0.9 : 0.6,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}${path}`])),
      },
    })),
  )
}
