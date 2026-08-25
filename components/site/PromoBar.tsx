import Link from 'next/link'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'

/**
 * Верхняя полоса.
 *
 * Раньше здесь первым, что видел человек, была скидка: яркая плашка GLASS10
 * и «−10% на заказ». Знакомство с брендом начиналось с уценки — ровно то,
 * чего дорогие марки не делают.
 *
 * Теперь полоса объявляет коллекцию и ведёт в каталог. Промокод никуда не
 * делся: он переехал в футер, где стоит рядом с подпиской, — его находят,
 * когда уже решили покупать, а не вместо первого впечатления.
 *
 * Компонент стал серверным: копировать здесь больше нечего.
 *
 * `id="top"` — цель ссылки «Наверх» из футера. Полоса стоит первой на
 * странице, поэтому возврат приводит ровно к её началу и работает даже без
 * JS: это обычный якорь, а не обработчик нажатия.
 */
export function PromoBar({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <div id="top" className="on-ink">
      <p className="wrap t-label flex h-[var(--promo-h)] items-center justify-center text-center">
        <Link href={`/${lang}/catalog`} className="lnk tap -my-2 px-1 py-2">
          {t.home.announce}
        </Link>
      </p>
    </div>
  )
}
