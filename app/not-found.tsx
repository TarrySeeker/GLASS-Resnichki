import Link from 'next/link'
import localFont from 'next/font/local'
import { BRAND, BRAND_SUB, CONTENT } from '@/lib/content'
import { DEFAULT_LOCALE } from '@/lib/i18n'
import './globals.css'

/**
 * Ненайденный адрес без языкового префикса — например /ru/чего-нет.
 *
 * Языковой макет сюда не применяется: адрес не совпал ни с одним маршрутом,
 * поэтому страница несёт собственные <html> и <body>. Шапки и футера нет —
 * они требуют языка, а его в таком адресе нет. Остаётся то, ради чего человек
 * сюда попал: понять, что случилось, и уйти в каталог.
 */
const display = localFont({
  src: './fonts/BodyText-LargeBold.woff2',
  weight: '700',
  display: 'swap',
  variable: '--font-bodytext',
})

const tenor = localFont({
  src: './fonts/TenorSans-Regular.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-tenor',
})

export default function RootNotFound() {
  const lang = DEFAULT_LOCALE
  const t = CONTENT[lang]

  return (
    <html lang={lang} className={`${display.variable} ${tenor.variable}`}>
      <body>
        {/* Своих метаданных у этого файла нет: языковой макет сюда не
            применяется, а Next не собирает metadata для корневого not-found.
            React поднимает эти теги в <head> сам. Индексировать несуществующий
            адрес незачем — отсюда noindex. */}
        <title>{`404 · ${BRAND} ${BRAND_SUB}`}</title>
        <meta name="robots" content="noindex, follow" />
        <main className="wrap flex min-h-screen flex-col justify-center">
          <p className="t-label t-muted">
            {BRAND} {BRAND_SUB}
          </p>
          <p className="t-hero mt-6">404</p>
          <h1 className="t-h2 mt-6">{t.notFound.title}</h1>
          <p className="t-lead t-muted mt-4">{t.notFound.note}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={`/${lang}/catalog`} className="btn">
              {t.notFound.cta}
            </Link>
            <Link href={`/${lang}`} className="btn btn-ghost">
              {BRAND}
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
