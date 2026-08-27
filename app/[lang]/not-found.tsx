import Link from 'next/link'
import { CONTENT } from '@/lib/content'
import { DEFAULT_LOCALE } from '@/lib/i18n'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'

/**
 * Ненайденная страница внутри витрины.
 *
 * Язык здесь недоступен: not-found.tsx не получает params, а читать URL на
 * сервере нельзя. Берём язык по умолчанию — это ошибка адреса, и главное
 * здесь одно: вывести человека обратно в каталог, а не оставить в тупике.
 */
export default function NotFound() {
  const lang = DEFAULT_LOCALE
  const t = CONTENT[lang]

  return (
    <>
      <Header lang={lang} />
      <main>
        <section className="wrap sec-tall">
          <p className="t-hero">404</p>
          <h1 className="t-h2 mt-6">{t.notFound.title}</h1>
          <p className="t-lead t-muted mt-4">{t.notFound.note}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={`/${lang}/catalog`} className="btn">
              {t.notFound.cta}
            </Link>
            <Link href={`/${lang}`} className="btn btn-ghost">
              {t.notFound.home}
            </Link>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  )
}
