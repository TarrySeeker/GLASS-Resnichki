import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'

/**
 * Наклонная бегущая строка — разделитель между героем и витриной.
 *
 * Лента дублируется: сдвиг на −50 % возвращает её в исходное положение, и шов
 * не виден. Для чтения с экрана фраза отдаётся один раз обычным текстом,
 * а сама лента скрыта от озвучки — иначе диктор читал бы её бесконечно.
 */
export function Marquee({ lang }: { lang: Locale }) {
  const phrase = CONTENT[lang].home.marquee
  const half = [0, 1]

  return (
    <section className="marquee">
      <p className="sr-only">{phrase}</p>
      <div className="marquee-tilt" aria-hidden="true">
        <div className="marquee-track">
          {[...half, ...half].map((_, i) => (
            <span key={i} className="marquee-item">
              {phrase}
              <span className="px-[0.35em]">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
