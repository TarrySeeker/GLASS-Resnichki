'use client'

import { useState } from 'react'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import type { Product } from '@/lib/catalog'
import { useStore } from '@/components/StoreProvider'

/**
 * Цена и покупка одним действием — для блоков вне карточки товара.
 *
 * От ProductBuy отличается тем, что не выбирает вариант: берётся первый
 * доступный. Там, где вариантов несколько и выбор важен, стоит ссылка на
 * карточку, а не эта кнопка.
 */
export function AddToCart({
  product,
  lang,
  href,
}: {
  product: Product
  lang: Locale
  /** Ссылка на карточку рядом с кнопкой: у товара может быть несколько длин. */
  href?: string
}) {
  const t = CONTENT[lang]
  const { add, price } = useStore()
  const [added, setAdded] = useState(false)

  const variant = product.variants.find((v) => v.inStock) ?? product.variants[0]

  return (
    <div>
      <p className="t-price">{price(product.price)}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="btn btn-wide"
          disabled={!variant.inStock}
          onClick={() => {
            add(product.id, variant.sku)
            setAdded(true)
          }}
        >
          {!variant.inStock ? t.product.unavailable : added ? t.product.added : t.product.add}
        </button>
        {href ? (
          <a href={href} className="lnk tap t-label">
            {t.blocks.featureCta}
          </a>
        ) : null}
      </div>
    </div>
  )
}
