'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { CONTENT } from '@/lib/content'
import { DIR, type Locale } from '@/lib/i18n'
import { PhotoBlank } from '@/components/site/PhotoBlank'

/**
 * Галерея товара по образцу Lashify: колонка миниатюр у внутреннего края,
 * крупный кадр рядом.
 *
 * Одна лента кадров работает на оба экрана. На мобиле её листают пальцем —
 * это нативная прокрутка с scroll-snap, без библиотек и без обработки touch:
 * браузер сам даёт инерцию, отмену жеста и правильное направление в RTL
 * (в арабской версии scrollLeft уходит в минус, поэтому индекс берётся по
 * модулю). На десктопе лента не прокручивается пальцем, но те же кадры
 * переключают миниатюры — прокруткой контейнера, а не сменой src.
 *
 * Клик по кадру открывает его во весь экран в нативном <dialog>: Esc,
 * ловушка фокуса и верхний слой достаются от браузера даром.
 */
export function ProductGallery({
  images,
  alt,
  lang,
}: {
  images: string[]
  alt: string
  lang: Locale
}) {
  const t = CONTENT[lang]
  const [active, setActive] = useState(0)
  const strip = useRef<HTMLUListElement>(null)
  const dlg = useRef<HTMLDialogElement>(null)
  const ticking = useRef(false)

  // Фотографий у товара нет — ни зума, ни свайпа, только честная заглушка.
  if (images.length === 0) {
    return (
      <div className="aspect-square">
        <PhotoBlank name={alt} note={t.product.photoBlank} />
      </div>
    )
  }

  // CSS-правило reduced-motion до JS-прокрутки не достаёт, спрашиваем сами.
  const behavior = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

  /** Прокрутка ленты к кадру. Сдвиг физический, поэтому в RTL считается сам. */
  const goTo = (i: number) => {
    const el = strip.current
    const frame = el?.children[i]
    if (!el || !frame) return
    setActive(i)
    el.scrollBy({
      left: frame.getBoundingClientRect().left - el.getBoundingClientRect().left,
      behavior: behavior(),
    })
  }

  // Индикатор синхронизируется с прокруткой: один кадр анимации на пачку
  // событий, чтобы не считать позицию на каждом пикселе.
  const onScroll = () => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      ticking.current = false
      const el = strip.current
      if (el) setActive(Math.round(Math.abs(el.scrollLeft) / (el.clientWidth || 1)))
    })
  }

  /** Шаг по кадрам с закольцовкой: крайних неактивных кнопок нет, и фокус
   *  не теряется на последнем кадре. */
  const step = (d: number) => goTo((active + d + images.length) % images.length)

  const open = (i: number) => {
    goTo(i)
    dlg.current?.showModal()
  }

  // Стрелки клавиатуры идут по экрану, а не по индексу: в RTL «вправо» — назад.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const forward = DIR[lang] === 'rtl' ? e.key === 'ArrowLeft' : e.key === 'ArrowRight'
    e.preventDefault()
    step(forward ? 1 : -1)
  }

  /** Закрытие по подложке: клик засчитывается, только если попал мимо содержимого. */
  const closeOnSelf = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) dlg.current?.close()
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse sm:gap-4">
      <div className="min-w-0 flex-1">
        {/* Рамка фокуса рисуется снаружи кнопки, а прокручиваемый контейнер
            обрезает всё за своими краями. Поэтому у ленты запас 6 px внутрь
            (p-1.5 у кадра) и ровно столько же наружу (-m-1.5 у ленты): рамка
            видна, а кадр стоит ровно там же, где стоял. */}
        <ul
          ref={strip}
          onScroll={onScroll}
          aria-label={t.product.gallery}
          className="-m-1.5 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <li key={src} className="w-full shrink-0 snap-center p-1.5">
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`${t.product.zoom}, ${i + 1}`}
                className="tile block aspect-square w-full cursor-zoom-in"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={1000}
                  height={1000}
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 55vw, 45vw"
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Точки — только на мобиле: на десктопе за индикатор отвечают миниатюры. */}
        {images.length > 1 ? (
          <ul className="mt-1 flex justify-center sm:hidden">
            {images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active}
                  aria-label={`${t.product.gallery} ${i + 1}`}
                  className="tap grid w-11 place-items-center"
                >
                  <span
                    className={`block h-1.5 w-1.5 ${
                      i === active ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-rule)]'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul
          aria-label={t.product.gallery}
          className="hidden shrink-0 gap-2 sm:flex sm:w-20 sm:flex-col"
        >
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active}
                aria-label={`${t.product.gallery} ${i + 1}`}
                className={`tile block aspect-square w-16 border sm:w-full ${
                  i === active
                    ? 'border-[var(--color-ink)]'
                    : 'border-transparent opacity-60'
                }`}
              >
                <Image src={src} alt="" width={200} height={200} sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Полноэкранный просмотр. Сам <dialog> прозрачен — тёмная плоскость
          вокруг кадра это ::backdrop, и клик по ней закрывает окно.
          Фокус при закрытии возвращается на тот кадр, что виден сейчас. */}
      <dialog
        ref={dlg}
        aria-label={t.product.gallery}
        onClick={closeOnSelf}
        onKeyDown={onKeyDown}
        onClose={() =>
          strip.current?.children[active]?.querySelector<HTMLButtonElement>('button')?.focus()
        }
        className="sheet fixed top-0 bottom-0 start-0 end-0 m-0 h-full max-h-none w-full max-w-none flex-col border-0 bg-transparent p-0 text-[var(--color-ink)] open:flex"
      >
        {/* Полоса управления на бумаге: чёрная рамка фокуса на тёмной подложке
            была бы не видна, поэтому все кнопки стоят на белом. */}
        <div className="flex items-center justify-between bg-[var(--color-paper)] px-[var(--gutter)] py-2">
          <p className="t-label t-muted">
            {images.length > 1 ? `${active + 1} / ${images.length}` : alt}
          </p>
          <button type="button" className="t-nav lnk tap" onClick={() => dlg.current?.close()}>
            {t.nav.close}
          </button>
        </div>

        <div
          onClick={closeOnSelf}
          className="relative flex min-h-0 flex-1 items-center justify-center p-[var(--gutter)]"
        >
          <Image
            src={images[active] as string}
            alt={alt}
            width={1600}
            height={1600}
            sizes="100vw"
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t.product.prev}
                className="btn absolute top-1/2 start-2 -translate-y-1/2"
              >
                <Chevron />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t.product.next}
                className="btn absolute top-1/2 end-2 -translate-y-1/2"
              >
                <Chevron forward />
              </button>
            </>
          ) : null}
        </div>
      </dialog>
    </div>
  )
}

/** Шеврон смотрит к началу строки; «вперёд» — тот же глиф, развёрнутый. */
function Chevron({ forward }: { forward?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={forward ? 'rotate-180 rtl:rotate-0' : 'rtl:rotate-180'}
    >
      <path d="M15 4 7 12l8 8" />
    </svg>
  )
}
