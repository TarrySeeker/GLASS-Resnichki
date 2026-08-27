'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Возврат к началу списка.
 *
 * Разделы каталога — «ресницы», «уход», «инструменты» — не уводят на отдельные
 * страницы, а перекладывают ту же сетку и подводят к ней. Выбор раздела
 * оказывается внизу длинного списка, и чтобы сменить его, приходится
 * прокручивать двадцать карточек обратно вверх. Кнопка возвращает туда одним
 * нажатием.
 *
 * Появляется, когда начало списка ушло за верхнюю кромку экрана. Следим не за
 * самим списком, а за меткой нулевой высоты в его начале: список высотой в
 * несколько экранов пересекает окно почти всегда, и наблюдатель на нём не
 * срабатывал бы вовсе — метка же уходит из кадра ровно тогда, когда нужно.
 *
 * Наблюдатель, а не слушатель прокрутки: слушатель считает на каждый кадр
 * прокрутки, наблюдатель — дважды за визит.
 *
 * Возврат ведёт к сетке, а не к началу страницы, и с тем же запасом сверху,
 * что и у переходов из разделов: под липкой полосой фильтра.
 */
export function BackToList({ label, targetId = 'catalog' }: { label: string; targetId?: string }) {
  const mark = useRef<HTMLSpanElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = mark.current
    if (!el || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      ([e]) => {
        // Только вверх: пока метка ниже окна, человек до списка ещё не дошёл,
        // и возвращать его некуда.
        setShow(!e.isIntersecting && e.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <span ref={mark} aria-hidden="true" className="block h-px" />

      <button
        type="button"
        className="to-list"
        data-show={show}
        /* Пока кнопка невидима, она и не должна попадаться в обходе
           клавиатуры: иначе фокус уходит в пустоту у нижнего края. */
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        onClick={() => {
          const el = document.getElementById(targetId)
          if (!el) return
          const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' })
        }}
      >
        <span className="sr-only">{label}</span>
        {/* Стрелка рисуется рамками, а не шрифтом и не картинкой: на витрине
            нет ни одной иконки, и знак ↑ из системного шрифта выпал бы из
            набора. */}
        <span aria-hidden="true" className="to-list-arrow" />
      </button>
    </>
  )
}
