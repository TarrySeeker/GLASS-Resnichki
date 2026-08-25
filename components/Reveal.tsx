'use client'

import { useEffect } from 'react'

/**
 * Появление блоков при прокрутке: одно наблюдение на документ, без библиотек
 * и без слушателя скролла. Каждый элемент раскрывается один раз.
 *
 * Наблюдение переустанавливается при смене страницы, поэтому смотрим за
 * появлением новых узлов через MutationObserver, а не вешаем всё на маршрут.
 *
 * Наблюдений на самом деле два на появление, и разделены они намеренно.
 * Первое, с большим запасом, только просит браузер раскодировать снимок —
 * вся дорогая работа уходит туда, где её не видно. Второе, почти без запаса,
 * открывает шторки, когда блок действительно входит в экран. Одним наблюдением
 * это не решается: с большим запасом раскрытие успевало закончиться до того,
 * как на блок посмотрят, и приёма никто не видел; без запаса декодирование и
 * анимация приходились на один кадр, и раскрытие дёргалось.
 *
 * Третье наблюдение — за бегущей строкой. Она крутится бесконечно, и без
 * этого браузер перерисовывал бы её всё время, что открыта вкладка, включая
 * то, когда она за экраном. Здесь наблюдение обратимое: строка замирает,
 * когда уходит из виду, и оживает, когда возвращается.
 */
export function Reveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Задержку кладём переменной: обрезается вложенный кадр, а не сам
    // наблюдаемый элемент — иначе clip-path схлопнул бы его в ноль,
    // наблюдатель перестал бы считать элемент видимым и приём не запустился.
    /**
     * Раскрываем только готовое изображение: иначе диафрагма открывает пустую
     * плитку, а снимок появляется рывком следом. Ждём декодирования, но не
     * дольше 400 мс — снимки приходят за 75 мс, и длинный запас превращался
     * в ощущение медленной страницы.
     */
    const show = (el: HTMLElement) => {
      const reveal = () => {
        el.style.setProperty('--rise-delay', el.dataset.riseDelay ?? '0ms')
        el.dataset.shown = 'true'
      }
      const pending = [...el.querySelectorAll('img')].filter((i) => !i.complete)
      if (!pending.length) return reveal()

      let done = false
      const once = () => {
        if (done) return
        done = true
        reveal()
      }
      const timer = setTimeout(once, 400)
      Promise.all(pending.map((i) => i.decode().catch(() => undefined))).then(() => {
        clearTimeout(timer)
        once()
      })
    }

    /* Подготовка: за 700 px до появления просим браузер раскодировать кадр.
       Дальше он остаётся в памяти, и к моменту раскрытия рисовать уже нечего. */
    let prep: IntersectionObserver | undefined
    if ('IntersectionObserver' in window) {
      prep = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            prep?.unobserve(e.target)
            for (const i of e.target.querySelectorAll('img')) void i.decode?.().catch(() => undefined)
          }
        },
        { rootMargin: '0px 0px 700px 0px' },
      )
    }

    /* Строка: включаем движение только пока она в кадре. Отдельный
       наблюдатель, потому что этот не отписывается после первого срабатывания. */
    let loop: IntersectionObserver | undefined
    if ('IntersectionObserver' in window) {
      loop = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            ;(e.target as HTMLElement).dataset.run = e.isIntersecting ? 'true' : 'false'
          }
        },
        { threshold: 0 },
      )
    }

    if (!('IntersectionObserver' in window) || reduce) {
      document.querySelectorAll<HTMLElement>('.rise').forEach(show)
      // При выключенной анимации строка стоит на месте, а не проматывается
      // мгновенно в конец: движение здесь и есть то, от чего отказываются.
      document.querySelectorAll<HTMLElement>('.marquee').forEach((el) => {
        el.dataset.run = reduce ? 'false' : 'true'
      })
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          show(e.target as HTMLElement)
          io.unobserve(e.target)
        }
      },
      /* Небольшой отрицательный запас: шторки расходятся, когда блок уже
         показался, а не до того. Дорогая работа к этому моменту сделана
         наблюдателем выше. */
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>('.rise:not([data-shown])')
        .forEach((el) => io.observe(el))
      document
        .querySelectorAll<HTMLElement>('.rise:not([data-shown])')
        .forEach((el) => prep?.observe(el))
      document.querySelectorAll<HTMLElement>('.marquee').forEach((el) => loop?.observe(el))
    }

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      prep?.disconnect()
      loop?.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
