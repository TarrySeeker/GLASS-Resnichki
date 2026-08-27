import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLANKS, BRAND, CONTENT, PRICE_BLANK } from '@/lib/content'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { AccountAddresses, AccountProfile, AccountReturn } from '@/components/site/Account'

/**
 * Личный кабинет.
 *
 * Четыре раздела на одном маршруте: профиль стоит по адресу `/account`,
 * остальные — сегментом ниже. Разделять их на отдельные файлы было бы
 * копированием шапки, крошек и колонки навигации четыре раза; разница между
 * ними — только правая колонка.
 *
 * Сервера за кабинетом нет, и страница говорит это первой строкой, а не
 * притворяется рабочей. Всё, чего мы не знаем — номер заказа, статус,
 * трек-номер, адрес, — стоит теми же заглушками, что цена и отзыв на витрине.
 * Так видно, где именно бэкенд подставляет данные, и не приходится потом
 * искать выдуманные строки по коду.
 *
 * Маршрут не в sitemap: кабинет закрыт для поиска, как и корзина.
 */

const SECTIONS = ['profile', 'orders', 'addresses', 'returns'] as const
type Section = (typeof SECTIONS)[number]

/** Профиль живёт по короткому адресу, остальные разделы — сегментом ниже. */
const path = (lang: Locale, s: Section) => (s === 'profile' ? `/${lang}/account` : `/${lang}/account/${s}`)

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    SECTIONS.map((s) => ({ lang, section: s === 'profile' ? [] : [s] })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; section?: string[] }>
}): Promise<Metadata> {
  const { lang, section } = await params
  if (!isLocale(lang)) return {}
  const t = CONTENT[lang].account
  const key = (section?.[0] ?? 'profile') as Section
  if (!SECTIONS.includes(key)) return {}
  const title = key === 'profile' ? t.title : `${t.sections[key]} — ${t.title}`
  // Кабинет — личная страница: в выдаче ей нечего делать.
  return { title, robots: { index: false, follow: false } }
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ lang: string; section?: string[] }>
}) {
  const { lang, section } = await params
  if (!isLocale(lang)) notFound()
  if ((section?.length ?? 0) > 1) notFound()
  const key = (section?.[0] ?? 'profile') as Section
  if (!SECTIONS.includes(key)) notFound()

  const t = CONTENT[lang]
  const a = t.account

  return (
    <>
      <Header lang={lang} />
      <main className="sec">
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
                {a.title}
              </li>
            </ol>
          </nav>

          <h1 className="t-h2 mt-8">{a.title}</h1>

          {/* Одна строка вместо работающего кабинета. Без неё раскладка врёт:
              человек заполнит профиль и решит, что данные сохранились. */}
          <p id="account-off" className="t-label t-muted mt-3 max-w-xl">
            {a.note}
          </p>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
            {/* Навигация: столбиком на широком экране, строкой на телефоне.
                Тот же приём, что у разделов каталога, и та же подчёркнутая
                метка текущего места. */}
            <nav aria-label={a.title} className="lg:col-span-3">
              <ul className="flex flex-wrap gap-x-8 gap-y-1 border-b border-[var(--color-rule)] pb-2 lg:flex-col lg:gap-y-2 lg:border-b-0 lg:pb-0">
                {SECTIONS.map((s) => (
                  <li key={s}>
                    <Link
                      href={path(lang, s)}
                      aria-current={s === key ? 'true' : undefined}
                      className="section-link t-nav"
                    >
                      {a.sections[s]}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Выход стоит последним в той же колонке, а не в углу шапки:
                  раньше он висел у правого края на уровне заголовка, за
                  восемью колонками пустоты, и читался чужим элементом. */}
              <Link
                href={`/${lang}`}
                className="lnk tap t-label t-muted mt-4 inline-block lg:mt-8"
              >
                {a.signOut}
              </Link>
            </nav>

            <div className="min-w-0 lg:col-span-8 lg:col-start-5">
              {key === 'profile' ? <AccountProfile lang={lang} /> : null}
              {key === 'orders' ? <Orders lang={lang} /> : null}
              {key === 'addresses' ? <AccountAddresses lang={lang} /> : null}
              {key === 'returns' ? <AccountReturn lang={lang} /> : null}
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  )
}

/**
 * Заказы. Раздел статический, поэтому живёт здесь, а не в клиентском файле.
 *
 * Две строки-заглушки вместо пустого состояния: пустое состояние показывает,
 * что заказов нет, но не показывает, как заказ будет выглядеть, — а именно
 * это и требуется от макета. Ссылка в каталог стоит под списком: она нужна и
 * тому, у кого заказов ещё нет, и тому, кто пришёл повторить прошлый.
 */
function Orders({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const a = t.account.orders

  return (
    <div>
      <p className="t-lead">{a.lead}</p>

      <ul className="mt-8 flex flex-col">
        {[0, 1].map((i) => (
          <li key={i} className="border-t border-[var(--color-rule)] py-6">
            {/* Все пять полей заказа — пары «подпись сверху, значение снизу».
                Номер отличается только кеглем: строка «ЗАКАЗ — ДАННЫЕ —»
                читалась как название заглушки, а не как номер. */}
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <dt className="t-label t-muted">{a.number}</dt>
                <dd className="t-h3 pt-1">{BLANKS.data}</dd>
              </div>
              <div>
                <dt className="t-label t-muted">{a.date}</dt>
                <dd className="t-nav pt-1">{BLANKS.data}</dd>
              </div>
              {[
                [a.status, BLANKS.data],
                [a.sum, PRICE_BLANK[lang]],
                [a.track, BLANKS.data],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="t-label t-muted">{label}</dt>
                  <dd className="t-nav pt-1">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2">
              <button type="button" className="lnk tap t-label">
                {a.items}
              </button>
              <button type="button" className="lnk tap t-label t-muted">
                {a.repeat}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Link href={`/${lang}/catalog`} className="btn btn-wide mt-8">
        {a.emptyCta}
      </Link>
    </div>
  )
}
