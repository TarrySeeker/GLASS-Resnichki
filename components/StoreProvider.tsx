'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { COUNTRIES, type Currency, type Locale, formatPrice, pickCountry } from '@/lib/i18n'
import { PRICE_BLANK } from '@/lib/content'

/**
 * Состояние витрины: корзина, избранное, валюта, страна, промокод.
 *
 * Всё держится в localStorage — так требует бриф для гостя. Точка синхронизации
 * с бэкендом после авторизации одна: `hydrate`.
 */

export type CartLine = { id: string; variant: string; qty: number }

type Store = {
  cart: CartLine[]
  favorites: string[]
  currency: Currency
  country: string
  promo: string | null
  add: (id: string, variant: string, qty?: number) => void
  setQty: (id: string, variant: string, qty: number) => void
  remove: (id: string, variant: string) => void
  toggleFavorite: (id: string) => void
  setCurrency: (c: Currency) => void
  /** Регион подтверждён покупателем. */
  regionAsked: boolean
  confirmRegion: (code: string) => void
  setCountry: (code: string) => void
  applyPromo: (code: string) => boolean
  clearPromo: () => void
  price: (rub: number) => string
  count: number
  /** Растёт при каждом добавлении. Нужен, чтобы счётчик в шапке отозвался. */
  addedAt: number
  ready: boolean
}

const Ctx = createContext<Store | null>(null)

/** Демонстрационные промокоды. Реальные придут из бэкенда. */
const PROMOS: Record<string, number> = { GLASS10: 0.1, OWM20: 0.2 }
export function promoDiscount(code: string | null): number {
  return code ? (PROMOS[code] ?? 0) : 0
}

const KEY = 'glass.store.v1'

export function StoreProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [currency, setCurrency] = useState<Currency>('RUB')
  const [country, setCountryState] = useState('RU')
  /** Регион ещё не подтверждён покупателем — показываем переспрос. */
  const [regionAsked, setRegionAsked] = useState(true)
  const [promo, setPromo] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [addedAt, setAddedAt] = useState(0)

  // Читаем один раз после монтирования: на сервере localStorage нет,
  // а расхождение разметки дороже, чем один кадр без корзины.
  // Правило react-hooks/set-state-in-effect бьёт по каскадным перерисовкам;
  // здесь их нет — React батчит все вызовы внутри эффекта в одну перерисовку,
  // а прочитать хранилище раньше монтирования физически невозможно.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) {
        // Первое посещение: угадываем страну по языку браузера. Геолокации по
        // IP нет намеренно — она требует внешнего сервиса и врёт при VPN.
        // Догадку всё равно переспрашиваем.
        const guess = pickCountry(navigator.language ? navigator.languages.join(',') : null)
        const c = COUNTRIES.find((x) => x.code === guess)
        if (c) {
          setCountryState(c.code)
          setCurrency(c.currency)
        }
        setRegionAsked(false)
      }
      if (raw) {
        const s = JSON.parse(raw)
        if (Array.isArray(s.cart)) setCart(s.cart)
        if (Array.isArray(s.favorites)) setFavorites(s.favorites)
        if (typeof s.currency === 'string') setCurrency(s.currency)
        if (typeof s.country === 'string') setCountryState(s.country)
        if (typeof s.promo === 'string') setPromo(s.promo)
        if (s.regionAsked === false) setRegionAsked(false)
      }
    } catch {
      // Повреждённое или недоступное хранилище не должно ронять витрину.
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ cart, favorites, currency, country, promo, regionAsked }),
      )
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [cart, favorites, currency, country, promo, regionAsked, ready])

  const add = useCallback((id: string, variant: string, qty = 1) => {
    setAddedAt((n) => n + 1)
    setCart((c) => {
      const i = c.findIndex((l) => l.id === id && l.variant === variant)
      if (i === -1) return [...c, { id, variant, qty }]
      const next = [...c]
      next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) }
      return next
    })
  }, [])

  const setQty = useCallback((id: string, variant: string, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((l) => !(l.id === id && l.variant === variant))
        : c.map((l) => (l.id === id && l.variant === variant ? { ...l, qty: Math.min(99, qty) } : l)),
    )
  }, [])

  const remove = useCallback((id: string, variant: string) => {
    setCart((c) => c.filter((l) => !(l.id === id && l.variant === variant)))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }, [])

  // Страна тянет за собой валюту: покупателю в Казахстане цена в евро бесполезна.
  const setCountry = useCallback((code: string) => {
    setCountryState(code)
    const c = COUNTRIES.find((x) => x.code === code)
    if (c) setCurrency(c.currency)
  }, [])

  const applyPromo = useCallback((code: string) => {
    const key = code.trim().toUpperCase()
    if (!(key in PROMOS)) return false
    setPromo(key)
    return true
  }, [])

  const value = useMemo<Store>(
    () => ({
      cart,
      favorites,
      currency,
      country,
      promo,
      add,
      setQty,
      remove,
      toggleFavorite,
      setCurrency,
      setCountry,
      regionAsked,
      confirmRegion: (code: string) => {
        setCountry(code)
        setRegionAsked(true)
      },
      applyPromo,
      clearPromo: () => setPromo(null),
      // Цена 0 означает, что прайса ещё нет. Показывать «0 ₽» — врать
      // покупателю; показываем явную дыру, которую видно и в макете, и в вёрстке.
      price: (rub: number) => (rub > 0 ? formatPrice(rub, currency, locale) : PRICE_BLANK[locale]),
      count: cart.reduce((n, l) => n + l.qty, 0),
      addedAt,
      ready,
    }),
    [cart, favorites, currency, country, promo, add, setQty, remove, toggleFavorite, setCountry, applyPromo, locale, ready, addedAt, regionAsked],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore вызван вне StoreProvider')
  return v
}
