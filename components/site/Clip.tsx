'use client'

import { useEffect, useRef } from 'react'

/**
 * Короткий ролик вместо фотографии.
 *
 * Съёмка бренда, вертикальная, около тринадцати секунд. Отвечает на то, чего
 * не может показать неподвижный кадр: плотность пучка в свете и то, как
 * держится образ в движении. Заглушка на этом месте не врала, но и не
 * продавала.
 *
 * Что сделано, чтобы три мегабайта не стоили загрузки страницы:
 *
 * `preload="none"` — файл не запрашивается, пока ролик не начнёт играть.
 *
 * Постер тоже не стоит в разметке: браузер грузит его сразу, а блок лежит
 * далеко за первым экраном, и 67 КБ уходили в вес главной страницы впустую.
 * Кадр подставляется наблюдателем за 200 px до появления — к моменту, когда
 * на блок смотрят, он уже стоит, и подмены не видно: изображение оживает.
 *
 * Тот же наблюдатель включает воспроизведение и ставит на паузу, когда ролик
 * уходит из кадра. Бесконечный цикл за экраном — это декодирование видео всё
 * время, что открыта вкладка.
 *
 * Звука нет и быть не может: `muted` здесь не настройка, а условие
 * автовоспроизведения. Ролик без звука и без элементов управления — это
 * движущееся изображение, а не проигрыватель, и вести себя должно так же.
 *
 * При выключенной анимации ролик не запускается и не грузится вовсе; на его
 * месте стоит тот же кадр товара — движение здесь и есть то, от чего
 * отказываются.
 */
export function Clip({
  src,
  poster,
  label,
  className = '',
}: {
  src: string
  poster: string
  label: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    /* При выключенной анимации ролик не играет, но кадр товара обязан
       остаться: подставляем постер и на этом останавливаемся. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.poster = poster
      return
    }
    if (!('IntersectionObserver' in window)) {
      v.poster = poster
      return
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return
        if (e.isIntersecting) {
          if (!v.poster) v.poster = poster
          void v.play().catch(() => undefined)
        } else v.pause()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(v)

    /* Вкладка ушла в фон — останавливаем: браузеры тормозят таймеры, но
       декодирование видео продолжают. */
    const onHide = () => {
      if (document.hidden) v.pause()
      else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        void v.play().catch(() => undefined)
      }
    }
    document.addEventListener('visibilitychange', onHide)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [poster])

  return (
    <video
      ref={ref}
      className={`tile block h-full w-full object-cover ${className}`}
      preload="none"
      muted
      loop
      playsInline
      disablePictureInPicture
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
