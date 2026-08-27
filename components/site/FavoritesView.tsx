'use client'

import Link from 'next/link'
import { CONTENT } from '@/lib/content'
import { plural, type Locale } from '@/lib/i18n'
import { PRODUCTS } from '@/lib/catalog'
import { useStore } from '@/components/StoreProvider'
import { ProductCard } from '@/components/site/ProductCard'

/**
 * Избранное.
 *
 * Сердце на карточке работало с самого начала и складывало товар в
 * localStorage — но открыть отложенное было негде, и отметка вела в никуда.
 * Здесь она наконец во что-то ведёт.
 *
 * Регистрации не требует намеренно: список живёт на устройстве, как и
 * корзина. Это сказано первой строкой — иначе человек, отметивший товар с
 * телефона, будет искать его с ноутбука и не найдёт.
 *
 * Порядок — как в каталоге, а не по времени отметки: список отмеченного
 * читают как витрину, и знать, что отложено раньше, а что позже, незачем.
 *
 * До готовности хранилища не рисуем ничего: на сервере localStorage нет, и
 * пустое состояние, мелькнувшее на долю секунды перед списком, читается
 * ошибкой.
 */
export function FavoritesView({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const { favorites, ready } = useStore()
  const items = PRODUCTS.filter((p) => favorites.includes(p.id))

  return (
    <section className="sec">
      <div className="wrap">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <h1 className="t-h2">{t.favorites.title}</h1>
          {ready && items.length ? (
            <p className="t-label t-muted tabular-nums">
              {plural(items.length, lang, t.catalog.items)}
            </p>
          ) : null}
        </div>

        <p className="t-lead t-muted mt-4 max-w-xl">{t.favorites.lead}</p>

        {!ready ? null : items.length ? (
          <>
            <div className="mt-10 grid grid-cols-12 gap-x-[var(--col-gap)] gap-y-12">
              {items.map((p, i) => (
                <div key={p.id} className="col-span-6 md:col-span-4 lg:col-span-3">
                  <ProductCard product={p} lang={lang} priority={i < 4} />
                </div>
              ))}
            </div>

            {/* Действие в конце списка: отложенное просматривают, чтобы решить,
                и решение чаще звучит как «посмотрю ещё», чем как «беру это». */}
            <Link href={`/${lang}/catalog`} className="btn btn-wide mt-12">
              {t.cart.toShop}
            </Link>
          </>
        ) : (
          <div className="mt-10 border-t border-[var(--color-rule)] py-20 text-center">
            <p className="t-h3">{t.favorites.empty}</p>
            <p className="t-label t-muted mx-auto mt-4 max-w-xs">{t.favorites.emptyHint}</p>
            <Link href={`/${lang}/catalog`} className="btn btn-wide mt-8">
              {t.cart.toShop}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
