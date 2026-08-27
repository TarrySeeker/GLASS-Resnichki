import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLANKS, BRAND, CONTENT, MAKER } from '@/lib/content'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'

/**
 * Служебные страницы: о бренде, контакты, доставка, возврат, конфиденциальность.
 *
 * До этого четыре ссылки футера вели в каталог — покупатель, ищущий условия
 * возврата, попадал на витрину. Пять страниц собраны одним маршрутом: у них
 * общая раскладка и разный только текст, отдельные файлы были бы копиями.
 *
 * Там, где условия задаёт бренд (реквизиты, сертификаты, порог доставки),
 * стоит `— ДАННЫЕ —`. Придумывать юридические формулировки за клиента нельзя:
 * дыру видно, и её закрывают одной правкой в lib/content.ts.
 */

export const INFO_SLUGS = ['about', 'contacts', 'delivery', 'returns', 'privacy'] as const
export type InfoSlug = (typeof INFO_SLUGS)[number]

const isInfoSlug = (v: string): v is InfoSlug => (INFO_SLUGS as readonly string[]).includes(v)

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => INFO_SLUGS.map((slug) => ({ lang, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang) || !isInfoSlug(slug)) return {}
  const page = CONTENT[lang].info[slug]
  return {
    title: page.title,
    description: page.lead,
    alternates: {
      canonical: `/${lang}/info/${slug}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/info/${slug}`])),
    },
  }
}

export default async function InfoPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLocale(lang) || !isInfoSlug(slug)) notFound()
  const t = CONTENT[lang]
  const page = t.info[slug]

  return (
    <>
      <Header lang={lang} />
      <main>
        <article className="sec">
          <div className="wrap">
            <nav aria-label={t.catalog.breadcrumbs}>
              <ol className="t-label t-muted flex flex-wrap items-center gap-2">
                <li>
                  <Link href={`/${lang}`} className="lnk tap-sm">
                    {BRAND}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-[var(--color-ink)]">
                  {page.title}
                </li>
              </ol>
            </nav>

            {/* Текстовая страница живёт в узкой колонке: строка длиннее 34em
                перестаёт читаться, а ширина витрины здесь ничего не даёт.

                Заголовок при этом идёт во всю ширину, а не четвертью слева:
                «Конфиденциальность» — восемнадцать букв, и в четырёх колонках
                оно требует вдвое больше места, чем там есть. Переносить его
                по слогам нельзя, ужимать кегль ради одной страницы — тоже:
                остаётся дать слову строку целиком. */}
            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
              <h1 className="t-h2 lg:col-span-12">{page.title}</h1>
              {/* Предел в 36em держит длину строки: семь колонок из двенадцати
                  на широком мониторе дают строку в полторы тысячи пикселей, и
                  глаз перестаёт находить начало следующей. Раньше это делал
                  общий предел ширины .wrap — он снят, потому что ломал сетку
                  страницы, а ограничивать надо не полосу, а текст. */}
              <div className="max-w-[36em] lg:col-span-7 lg:col-start-6">
                <p className="t-lead">{page.lead}</p>

                {'body' in page ? (
                  <div className="mt-8 flex flex-col gap-5">
                    {page.body.map((par) => (
                      <p key={par} className="t-lead t-muted">
                        {par}
                      </p>
                    ))}
                  </div>
                ) : null}

                {slug === 'contacts' ? <ContactList lang={lang} /> : null}

                <Link href={`/${lang}/catalog`} className="btn btn-wide mt-10">
                  {t.cart.toShop}
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer lang={lang} />
    </>
  )
}

/** Контакты — единственная страница со списком полей, а не с абзацами. */
function ContactList({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const rows = [
    { label: t.info.contacts.phone, value: BLANKS.phone },
    { label: 'E-mail', value: BLANKS.email },
    { label: t.footer.contacts, value: BLANKS.address },
    /* Изготовитель — настоящее юридическое имя, а не заглушка реквизитов:
       эти сведения обязательны для товара и известны точно. Остальные
       реквизиты (ИНН, адрес) ждут своей строки. */
    { label: t.product.specMaker, value: MAKER },
    { label: t.footer.offer, value: BLANKS.inn },
  ]
  return (
    <dl className="mt-8">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--color-rule)] py-4"
        >
          <dt className="t-label t-muted">{r.label}</dt>
          <dd className="t-nav">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
