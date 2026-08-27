'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CONTENT } from '@/lib/content'
import { formatLength, type Locale } from '@/lib/i18n'
import type { Product } from '@/lib/catalog'
import { useStore } from '@/components/StoreProvider'

/**
 * Блок покупки: цена, выбор варианта, кнопка.
 *
 * Клиентский, потому что цена пересчитывается в валюту покупателя, а корзина
 * живёт в localStorage.
 */
export function ProductBuy({ product, lang }: { product: Product; lang: Locale }) {
  const t = CONTENT[lang]
  const { add, price, cart } = useStore()

  // Стартуем с первого доступного варианта: предвыбранный «нет в наличии»
  // выглядит как поломка. Если нет ни одного — остаёмся на первом.
  const first = product.variants.findIndex((v) => v.inStock)
  const [sel, setSel] = useState(first === -1 ? 0 : first)

  const variant = product.variants[sel]
  /* «В корзине» — не память кнопки, а состояние корзины: после перезагрузки
     страницы кнопка обязана показывать то же самое, что показывает счётчик в
     шапке. Строка ищется по паре товар-артикул: другая длина той же линейки —
     другая строка, и статус у неё свой. */
  const inCart = cart.some((l) => l.id === product.id && l.variant === variant.sku)
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : (product.discount ?? null)

  const pick = (i: number) => setSel(i)

  /* Одна и та же кнопка стоит в панели и в липкой полосе.
     Добавленный товар превращает её в ссылку на корзину: надпись «в корзине»
     сообщает состояние, и нажатие на неё должно вести туда, о чём она
     сообщает. Раньше повторное нажатие молча добавляло вторую штуку —
     количество меняют в самой корзине, а не вслепую отсюда. */
  const cta = (className: string) =>
    inCart ? (
      <Link href={`/${lang}/cart`} className={`btn ${className}`}>
        {t.product.added}
      </Link>
    ) : (
      <button
        type="button"
        className={`btn ${className}`}
        disabled={!variant.inStock}
        onClick={() => add(product.id, variant.sku)}
      >
        {variant.inStock ? t.product.add : t.product.unavailable}
      </button>
    )

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-3">
        <span className="t-price">{price(product.price)}</span>
        {/* Старая цена показывается только когда она есть. Плашка со скидкой
            живёт отдельно: процент подтверждён витриной, а прайс — нет. */}
        {product.oldPrice ? (
          <span className="t-label t-muted line-through">{price(product.oldPrice)}</span>
        ) : null}
        {discount ? <span className="badge badge-sale">−{discount}%</span> : null}
      </p>

      {/* Варианты — настоящая радиогруппа: стрелки, disabled и объявление
          группы достаются от браузера. Недоступные видны, но не выбираются.

          Группа не показывается, если выбирать нечего: у части позиций вариант
          один и ни длины, ни изгиба у него нет — чип «— · —» читался бы как
          сбой данных, а не как «характеристик пока нет». */}
      {product.variants.length > 1 || variant.length !== '—' || variant.curl !== '—' ? (
      <fieldset className="mt-8 border-0 p-0">
        <legend className="t-label t-muted">{t.product.variant}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((v, i) => (
            <label
              key={v.sku}
              className="t-label inline-flex cursor-pointer items-center border border-[var(--color-rule)] px-4 py-3 has-[:checked]:border-[var(--color-ink)] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-35 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-[var(--color-ink)]"
            >
              <input
                type="radio"
                name="variant"
                className="sr-only"
                value={v.sku}
                checked={i === sel}
                disabled={!v.inStock}
                onChange={() => pick(i)}
              />
              <span>
                {formatLength(v.length, lang)} · {v.curl}
              </span>
              {!v.inStock ? <span className="ms-2 t-muted">({t.catalog.outOfStock})</span> : null}
            </label>
          ))}
        </div>
      </fieldset>
      ) : null}

      <p className="t-label t-muted mt-4">
        {t.product.sku}: {variant.sku}
      </p>

      {cta('mt-6 hidden w-full lg:inline-flex')}

      {/*
        Мобильное решение: панель покупки уезжает вверх, как только читаешь
        описание, а телефон — основная сцена. Поэтому действие дублируется
        липкой полосой у нижнего края, в зоне большого пальца. На десктопе
        полосы нет: там вся колонка покупки и так липкая, дубль был бы шумом.
      */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-rule)] bg-[var(--color-paper)] lg:hidden">
        <div className="wrap flex items-center gap-4 py-3">
          <div className="min-w-0">
            <p className="t-price">{price(product.price)}</p>
            <p className="t-label t-muted truncate">
              {formatLength(variant.length, lang)} · {variant.curl}
            </p>
          </div>
          {cta('flex-1')}
        </div>
      </div>
    </div>
  )
}
