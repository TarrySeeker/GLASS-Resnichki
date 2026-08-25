'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/components/StoreProvider'

/**
 * Счётчик корзины. Коротко отзывается на добавление товара — иначе кнопка
 * «в корзину» в карточке срабатывает молча и непонятно, случилось ли что-то.
 *
 * Анимация снимается по её же событию, а не по таймеру: так она не может
 * залипнуть и не мешает следующему добавлению.
 */
export function CartCount() {
  const { count, addedAt } = useStore()
  const [bump, setBump] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setBump(true)
  }, [addedAt])

  return (
    <span
      className={bump ? 'count-bump tabular-nums' : 'tabular-nums'}
      onAnimationEnd={() => setBump(false)}
    >
      ({count})
    </span>
  )
}
