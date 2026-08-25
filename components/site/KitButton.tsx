'use client'

import Link from 'next/link'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { PRODUCTS, bySlug } from '@/lib/catalog'
import { useStore } from '@/components/StoreProvider'

/**
 * «Собрать набор» — три шага нанесения требуют трёх покупок.
 *
 * Готового набора у бренда нет, и выдумывать его состав и цену нельзя.
 * Поэтому это не товар, а действие: кнопка кладёт в корзину пучки, клей и
 * пинцет — ровно то, что названо в шагах рядом. Ничего нового про товар
 * не утверждается, а четыре перехода по каталогу превращаются в одно нажатие.
 *
 * Позиция ресниц берётся первая по рангу — та же, что открывает витрину.
 *
 * Собрать набор можно один раз. Дальше кнопка становится ссылкой в корзину:
 * повторное нажатие удваивало бы заказ молча, а состояние «уже собран»
 * читается из самой корзины, а не из памяти компонента — поэтому переживает
 * перезагрузку страницы и возврат на неё из каталога.
 */
const KIT = ['lash-glue', 'tweezers-curved']

export function KitButton({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const { add, cart, ready } = useStore()

  const items = [
    [...PRODUCTS].filter((p) => p.category === 'lashes').sort((a, b) => a.rank - b.rank)[0],
    ...KIT.map((s) => bySlug(s)),
  ].filter((p): p is NonNullable<typeof p> => Boolean(p))

  const inStock = items.filter((p) => p.variants.some((v) => v.inStock))
  if (inStock.length < 2) return null

  const collected = ready && inStock.every((p) => cart.some((l) => l.id === p.id))

  if (collected) {
    return (
      <Link href={`/${lang}/cart`} className="btn">
        {t.blocks.kitDone}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        for (const p of inStock) {
          const v = p.variants.find((x) => x.inStock)
          if (v) add(p.id, v.sku)
        }
      }}
    >
      {t.blocks.kitCta}
    </button>
  )
}
