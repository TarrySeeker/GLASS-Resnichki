'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { inStock, type Product } from '@/lib/catalog'
import { useStore } from '@/components/StoreProvider'
import { PhotoBlank } from '@/components/site/PhotoBlank'

/**
 * Карточка товара.
 *
 * Устроена по образцу, присланному клиентом: квадратная светлая плитка,
 * плашки прижаты к верхнему углу, избранное — к противоположному, название
 * под изображением капслоком с разрядкой. Цвет есть только в плашках.
 *
 * Всё изображение — одна ссылка; кнопка избранного лежит поверх и не является
 * её частью, иначе клавиатура получила бы вложенные интерактивные элементы.
 */
export function ProductCard({
  product,
  lang,
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: {
  product: Product
  lang: Locale
  priority?: boolean
  sizes?: string
}) {
  const t = CONTENT[lang]
  const { favorites, toggleFavorite, price, add, cart } = useStore()
  // Кладём первый доступный вариант: выбор длины и изгиба — задача карточки
  // товара, а здесь нужно быстрое действие, а не мини-конфигуратор.
  const firstInStock = product.variants.find((v) => v.inStock)
  // Состояние берётся из корзины, а не из памяти кнопки: карточка живёт в
  // сетке, и после перезагрузки все двадцать должны показывать правду.
  const inCart = cart.some((l) => l.id === product.id && l.variant === firstInStock?.sku)
  const fav = favorites.includes(product.id)
  const available = inStock(product)
  // Процент считается из цен, а пока их нет — берётся из подтверждённого поля.
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : (product.discount ?? null)

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
        <Link href={`/${lang}/product/${product.slug}`} className="block">
          <div className="aspect-square">
            {product.images[0] ? (
              <div className="tile relative h-full w-full">
                {/* Второй кадр лежит ниже и проступает, когда верхний гаснет. */}
                {product.images[1] ? (
                  <Image
                    src={product.images[1]}
                    alt=""
                    width={1000}
                    height={1000}
                    sizes={sizes}
                    className="absolute inset-0"
                  />
                ) : null}
                <Image
                  src={product.images[0]}
                  alt={product.name[lang]}
                  width={1000}
                  height={1000}
                  sizes={sizes}
                  priority={priority}
                  className={`${available ? '' : 'opacity-45'} ${product.images[1] ? 'swap-top relative' : ''}`}
                />
              </div>
            ) : (
              <PhotoBlank name={product.name[lang]} note={t.product.photoBlank} />
            )}
          </div>
        </Link>

        {/* Быстрое добавление — как у Lashify, кнопка живёт в самой карточке.
            Лежит поверх плитки, а не внутри ссылки: вложенные интерактивные
            элементы ломают клавиатуру. */}
        {firstInStock ? (
          <div className="absolute inset-x-0 bottom-0 overflow-hidden">
            {/* Добавленный товар превращает кнопку в ссылку на корзину:
                надпись «в корзине» сообщает состояние, и нажатие на неё должно
                вести туда, о чём она сообщает. */}
            {inCart ? (
              <Link href={`/${lang}/cart`} className="btn quick w-full">
                {t.product.added}
              </Link>
            ) : (
              <button
                type="button"
                className="btn quick w-full"
                onClick={() => add(product.id, firstInStock.sku)}
              >
                {t.actions.quickAdd}
              </button>
            )}
          </div>
        ) : null}

        <div className="pointer-events-none absolute start-0 top-0 flex gap-px">
          {discount ? <span className="badge badge-sale">−{discount}%</span> : null}
          {product.badge === 'hit' ? <span className="badge badge-hit">{t.badges.hit}</span> : null}
          {product.badge === 'new' ? <span className="badge badge-new">{t.badges.new}</span> : null}
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={fav}
          aria-label={t.nav.favorites}
          className="absolute end-0 top-0 grid h-11 w-11 place-items-center"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z"
              fill={fav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </button>
      </div>

      {/* Цена прижата к низу: подписи разной длины, а строка цены
          должна стоять на одной линии во всём ряду. */}
      <div className="flex flex-1 flex-col pt-3">
        <h3 className="t-label">
          <Link href={`/${lang}/product/${product.slug}`} className="lnk">
            {product.name[lang]}
          </Link>
        </h3>
        <p className="t-label t-muted pt-1">{product.summary[lang]}</p>
        <p className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="t-price">{price(product.price)}</span>
          {product.oldPrice ? (
            <span className="t-label t-muted line-through">{price(product.oldPrice)}</span>
          ) : null}
        </p>
        {!available ? <p className="t-label t-muted pt-1">{t.catalog.outOfStock}</p> : null}
      </div>
    </article>
  )
}
