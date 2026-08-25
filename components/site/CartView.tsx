'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CONTENT, PRICE_BLANK } from '@/lib/content'
import { COUNTRIES, countryLabel, type Locale, formatLength } from '@/lib/i18n'
import { PRODUCTS } from '@/lib/catalog'
import { promoDiscount, useStore } from '@/components/StoreProvider'
import { Select } from '@/components/site/Select'

/**
 * Корзина.
 *
 * Считает всё на клиенте и мгновенно: количество, промокод, страна и способ
 * доставки меняют итог без перезагрузки — это требование брифа.
 *
 * Стоимость доставки здесь демонстрационная. Реальную считает бэкенд по API
 * СДЭК и Почты; точка подстановки одна — `shippingCost`.
 */

const FREE_FROM = 5000
function shippingCost(method: string, subtotal: number): number {
  if (subtotal >= FREE_FROM) return 0
  if (method === 'pickup') return 250
  if (method === 'courier') return 450
  return 900 // почта по миру
}

export function CartView({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const { cart, setQty, remove, add, promo, applyPromo, clearPromo, price, country, setCountry, ready } =
    useStore()
  // Удаление обратимо: диалог подтверждения на каждый товар раздражает,
  // а необратимое удаление в один клик — потерянный заказ.
  const [undo, setUndo] = useState<{ id: string; variant: string; qty: number } | null>(null)
  const [code, setCode] = useState('')
  const blank = PRICE_BLANK[lang]
  const [promoError, setPromoError] = useState(false)

  useEffect(() => {
    if (!undo) return
    const id = setTimeout(() => setUndo(null), 7000)
    return () => clearTimeout(id)
  }, [undo])

  const shippingKind = COUNTRIES.find((c) => c.code === country)?.shipping ?? 'post'
  const [method, setMethod] = useState<'courier' | 'pickup' | 'post'>('courier')
  const activeMethod = shippingKind === 'cdek' ? method : 'post'

  const lines = cart
    .map((l) => {
      const product = PRODUCTS.find((p) => p.id === l.id)
      if (!product) return null
      // Имя `variant` в строке корзины — это артикул; разворачиваем его в объект
      // под другим именем, иначе строковый ключ потерялся бы.
      const info = product.variants.find((v) => v.sku === l.variant)
      return { ...l, product, info }
    })
    .filter((l): l is NonNullable<typeof l> => l !== null)

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const discount = Math.round(subtotal * promoDiscount(promo))
  const ship = lines.length ? shippingCost(activeMethod, subtotal - discount) : 0
  const total = subtotal - discount + ship

  /**
   * Прайса от клиента нет: у всех позиций цена 0. Раньше корзина всё равно
   * показывала итог — в него попадала одна доставка, и покупатель видел
   * «ИТОГО 9,78 $» за три палетки. Это враньё, а не заглушка.
   *
   * Пока хотя бы у одной строки нет цены, суммы не считаются вовсе и
   * оформление недоступно. Проставят прайс в lib/catalog.ts — блок оживёт сам.
   */
  const priceless = lines.some((l) => l.product.price <= 0)

  // До чтения localStorage не показываем ни пустую корзину, ни товары —
  // иначе на долю секунды мигнёт «корзина пуста» у того, у кого она полная.
  if (!ready) return <div className="wrap sec" style={{ minHeight: '50vh' }} />

  const undoStrip = undo ? (
    <p
      className="t-label mt-6 flex flex-wrap items-center gap-4 border-y border-[var(--color-rule)] py-4"
      role="status"
    >
      <span>{t.actions.removed}</span>
      <button
        type="button"
        className="lnk tap"
        onClick={() => {
          add(undo.id, undo.variant, undo.qty)
          setUndo(null)
        }}
      >
        {t.actions.undo}
      </button>
    </p>
  ) : null

  if (!lines.length) {
    return (
      <section className="wrap sec-tall">
        <h1 className="t-h2">{t.cart.title}</h1>
        {undoStrip}
        <p className="t-lead t-muted mt-6">{t.cart.empty}</p>
        <Link href={`/${lang}/catalog`} className="btn mt-8">
          {t.cart.toShop}
        </Link>
      </section>
    )
  }

  return (
    <section className="wrap sec">
      <h1 className="t-h2">{t.cart.title}</h1>

      {undoStrip}

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
        {/* Список товаров */}
        <ul className="lg:col-span-7">
          {lines.map((l) => (
            <li
              key={`${l.id}-${l.variant}`}
              className="grid grid-cols-[88px_1fr] gap-4 border-t border-[var(--color-rule)] py-6 sm:grid-cols-[112px_1fr] sm:gap-6"
            >
              <Link href={`/${lang}/product/${l.product.slug}`} className="tile aspect-square">
                <Image
                  src={l.product.images[0]}
                  alt={l.product.name[lang]}
                  width={300}
                  height={300}
                  sizes="112px"
                />
              </Link>

              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="t-label">
                      <Link href={`/${lang}/product/${l.product.slug}`} className="lnk">
                        {l.product.name[lang]}
                      </Link>
                    </h2>
                    <p className="t-label t-muted pt-1">
                      {l.info ? `${formatLength(l.info.length, lang)} · ${l.info.curl}` : l.variant}
                    </p>
                  </div>
                  <p className="t-price whitespace-nowrap">{price(l.product.price * l.qty)}</p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center border border-[var(--color-rule)]">
                    <button
                      type="button"
                      className="t-nav h-10 w-10"
                      onClick={() => setQty(l.id, l.variant, l.qty - 1)}
                      aria-label={`${t.cart.qty} −`}
                    >
                      −
                    </button>
                    <span className="t-price w-8 text-center" aria-live="polite">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      className="t-nav h-10 w-10"
                      onClick={() => setQty(l.id, l.variant, l.qty + 1)}
                      aria-label={`${t.cart.qty} +`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="lnk tap t-label t-muted"
                    onClick={() => {
                      setUndo({ id: l.id, variant: l.variant, qty: l.qty })
                      remove(l.id, l.variant)
                    }}
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Итоги. Липнут на десктопе: длинный список не должен уводить сумму
            за пределы экрана. На мобиле — обычным потоком внизу. */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <div className="border-t border-[var(--color-ink)] pt-6">
            {/* Страна и доставка */}
            <Select
              label={t.cart.country}
              block
              boxed
              value={country}
              onChange={setCountry}
              options={COUNTRIES.map((c) => ({ value: c.code, label: countryLabel(c, lang) }))}
            />

            <fieldset className="mt-6">
              <legend className="t-label t-muted">{t.cart.method}</legend>
              <div className="mt-2 flex flex-col gap-px">
                {shippingKind === 'cdek' ? (
                  <>
                    <MethodOption
                      checked={activeMethod === 'courier'}
                      onChange={() => setMethod('courier')}
                      title={`${t.cart.cdek} — ${t.cart.courier}`}
                      note={price(shippingCost('courier', subtotal - discount))}
                    />
                    <MethodOption
                      checked={activeMethod === 'pickup'}
                      onChange={() => setMethod('pickup')}
                      title={`${t.cart.cdek} — ${t.cart.pickup}`}
                      note={price(shippingCost('pickup', subtotal - discount))}
                    />
                  </>
                ) : (
                  <MethodOption
                    checked
                    onChange={() => setMethod('post')}
                    title={t.cart.post}
                    note={price(shippingCost('post', subtotal - discount))}
                  />
                )}
              </div>
            </fieldset>

            {/* Промокод */}
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault()
                const ok = applyPromo(code)
                setPromoError(!ok)
                if (ok) setCode('')
              }}
            >
              <label className="t-label t-muted" htmlFor="promo">
                {t.cart.promo}
              </label>
              <div className="mt-2 flex gap-px">
                <input
                  id="promo"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setPromoError(false)
                  }}
                  className="t-nav min-w-0 flex-1 border border-[var(--color-rule)] bg-transparent px-3 py-3 uppercase"
                  aria-invalid={promoError}
                  aria-describedby={promoError ? 'promo-error' : undefined}
                />
                <button type="submit" className="btn px-5" disabled={!code.trim()}>
                  {t.cart.promoApply}
                </button>
              </div>
              {promoError ? (
                <p id="promo-error" className="t-label pt-2" style={{ color: 'var(--color-sale)' }}>
                  {t.cart.promoBad}
                </p>
              ) : null}
              {promo ? (
                <p className="t-label pt-2 flex items-center gap-2">
                  <span className="badge badge-sale">{promo}</span>
                  {t.cart.promoOk}
                  <button type="button" className="lnk t-muted" onClick={clearPromo}>
                    {t.cart.remove}
                  </button>
                </p>
              ) : null}
            </form>

            {/* Суммы */}
            <dl className="mt-8 flex flex-col gap-2">
              <Row label={t.cart.subtotal} value={priceless ? blank : price(subtotal)} />
              {discount && !priceless ? (
                <Row label={t.cart.promo} value={`− ${price(discount)}`} accent />
              ) : null}
              <Row
                label={t.cart.shipping}
                value={priceless ? blank : ship === 0 ? t.cart.shippingFree : price(ship)}
              />
            </dl>

            <hr className="hr my-5" />
            <div className="flex items-baseline justify-between">
              <span className="t-h3">{t.cart.total}</span>
              <span className="t-h3" aria-live="polite">
                {priceless ? blank : price(total)}
              </span>
            </div>

            <button type="button" className="btn mt-6 w-full" disabled={priceless}>
              {t.cart.checkout}
            </button>
            {priceless ? (
              <p className="t-label t-muted pt-3">{t.cart.pricePending}</p>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  )
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="t-label t-muted">{label}</dt>
      <dd className="t-price" style={accent ? { color: 'var(--color-sale)' } : undefined}>
        {value}
      </dd>
    </div>
  )
}

function MethodOption({
  checked,
  onChange,
  title,
  note,
}: {
  checked: boolean
  onChange: () => void
  title: string
  note: string
}) {
  return (
    <label
      className="flex cursor-pointer items-center justify-between gap-4 border px-3 py-3"
      style={{ borderColor: checked ? 'var(--color-ink)' : 'var(--color-rule)' }}
    >
      <span className="flex items-center gap-3">
        <input
          type="radio"
          name="shipping"
          checked={checked}
          onChange={onChange}
          className="accent-[var(--color-ink)]"
        />
        <span className="t-nav">{title}</span>
      </span>
      <span className="t-label t-muted">{note}</span>
    </label>
  )
}
