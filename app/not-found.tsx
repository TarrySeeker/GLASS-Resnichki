import Link from 'next/link'
import localFont from 'next/font/local'
import { BRAND, BRAND_SUB, CONTENT } from '@/lib/content'
import { DEFAULT_LOCALE } from '@/lib/i18n'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { StoreProvider } from '@/components/StoreProvider'
import './globals.css'

/**
 * Ненайденный адрес без языкового префикса — например /ru/чего-нет.
 *
 * Языковой макет сюда не применяется: адрес не совпал ни с одним маршрутом,
 * поэтому страница несёт собственные <html> и <body>.
 *
 * Шапка и футер здесь есть, хотя раньше их не было. Довод «они требуют языка»
 * не выдержал проверки: язык по умолчанию уже берётся для самого текста
 * страницы, и брать его для навигации ничем не хуже. Без них страница была
 * тупиком — две кнопки и ни одного способа дойти до чего угодно ещё, а
 * приходят на неё чаще всего по устаревшей ссылке из поиска.
 *
 * Хранилище приходится завести своё: макет с ним сюда не доезжает, а шапка
 * показывает корзину и избранное.
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
        <StoreProvider locale={lang}>
          <Header lang={lang} />
          <main className="wrap sec-tall">
            {/* Надписи над заголовком здесь нет: имя бренда и так стоит в
                шапке, а строка над «404» была подписью к подписи. */}
            <p className="t-hero">404</p>
            <h1 className="t-h2 mt-6">{t.notFound.title}</h1>
            <p className="t-lead t-muted mt-4">{t.notFound.note}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`/${lang}/catalog`} className="btn">
                {t.notFound.cta}
              </Link>
              {/* Вторая кнопка называла себя «GLASS» — именем, а не действием.
                  Куда она ведёт, из этого не следовало никак. */}
              <Link href={`/${lang}`} className="btn btn-ghost">
                {t.notFound.home}
              </Link>
            </div>
          </main>
          <Footer lang={lang} />
        </StoreProvider>
      </body>
    </html>
  )
}
