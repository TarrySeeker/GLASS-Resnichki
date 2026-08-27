'use client'

import { useStore } from '@/components/StoreProvider'

/**
 * Счётчик избранного в шапке.
 *
 * Без «прыжка», в отличие от корзины: отметить товар сердцем — обратимое
 * действие в один палец, и подпрыгивающая цифра на каждое нажатие превратила
 * бы просмотр каталога в мигание.
 *
 * Ноль не показывается вовсе. «Избранное (0)» сообщает ровно то же, что и
 * «Избранное», но добавляет в строку шапки скобки и цифру, которые ничего не
 * значат. У корзины иначе: там ноль — это состояние, за которым следят.
 */
export function FavCount() {
  const { favorites, ready } = useStore()
  if (!ready || !favorites.length) return null
  return <span className="ms-1 tabular-nums">({favorites.length})</span>
}
