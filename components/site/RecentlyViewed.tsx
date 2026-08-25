'use client'

import { useEffect, useState } from 'react'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { PRODUCTS, bySlug } from '@/lib/catalog'
import { ProductCard } from '@/components/site/ProductCard'

const KEY = 'glass.recent.v1'
const LIMIT = 8

/**
 * Недавно смотрели.
 *
 * В каталоге 21 позиция, и линейки различаются одной цифрой в названии —
 * вернуться к той, что понравилась три карточки назад, без истории просмотра
 * можно только перебором. Список живёт в localStorage и на сервер не уходит.
 *
 * Блок не рисуется, пока в истории нет ничего, кроме текущего товара:
 * пустая полоса с заголовком выглядела бы как несработавший блок.
 */
export function RecentlyViewed({ slug, lang }: { slug: string; lang: Locale }) {
  const t = CONTENT[lang]
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    let seen: string[] = []
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) seen = (JSON.parse(raw) as string[]).filter((s) => typeof s === 'string')
    } catch {
      seen = []
    }
    // Показываем историю ДО текущего товара, иначе он занял бы место в
    // собственной же ленте.
    setSlugs(seen.filter((s) => s !== slug && bySlug(s)).slice(0, 4))
    try {
      localStorage.setItem(KEY, JSON.stringify([slug, ...seen.filter((s) => s !== slug)].slice(0, LIMIT)))
    } catch {
      /* приватный режим — история просто не сохранится */
    }
  }, [slug])

  if (!slugs.length) return null

  return (
    <section className="sec border-t border-[var(--color-rule)]">
      <div className="wrap">
        <h2 className="t-h2">{t.product.recent}</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {slugs.map((s) => {
            const p = PRODUCTS.find((x) => x.slug === s)
            return p ? <ProductCard key={p.id} product={p} lang={lang} /> : null
          })}
        </div>
      </div>
    </section>
  )
}
