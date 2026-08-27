'use client'

import Link from 'next/link'
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
  const { add, price, cart } = useStore()

  const variant = product.variants.find((v) => v.inStock) ?? product.variants[0]
  // Состояние берётся из корзины, а не из памяти кнопки: см. ProductBuy.
  const inCart = cart.some((l) => l.id === product.id && l.variant === variant.sku)

  return (
    <div>
      <p className="t-price">{price(product.price)}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {inCart ? (
          <Link href={`/${lang}/cart`} className="btn btn-wide">
            {t.product.added}
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn-wide"
            disabled={!variant.inStock}
            onClick={() => add(product.id, variant.sku)}
          >
            {variant.inStock ? t.product.add : t.product.unavailable}
          </button>
        )}
        {href ? (
          <a href={href} className="lnk tap t-label">
            {t.blocks.featureCta}
          </a>
        ) : null}
      </div>
    </div>
  )
}
