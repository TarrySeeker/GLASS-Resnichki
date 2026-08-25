import { Suspense } from 'react'
import Link from 'next/link'
import { BRAND, CONTENT } from '@/lib/content'
import { plural, type Locale } from '@/lib/i18n'
import { PRODUCTS, type Category } from '@/lib/catalog'
import { SectionLinks } from '@/components/site/SectionLinks'
import { SectionNav } from '@/components/site/SectionNav'

/**
 * Первый экран каталога. Ориентир, а не витрина.
 *
 * Человек приходит сюда выбирать, а не любоваться, поэтому большого кадра
 * здесь нет: он отодвинул бы первый товар за нижний край и повторил бы
 * портрет с главной. Экран отвечает на три вопроса и замолкает — что это
 * за раздел, насколько он велик и из чего состоит.
 *
 * Счётчик — не украшение: до него единственным способом узнать размер
 * каталога было долистать сетку до конца. Число берётся из тех же данных,
 * что и сетка, и склоняется правилами языка, а не подстановкой окончания.
 *
 * Ряд разделов — это фильтр по категории, вынесенный из панели наверх.
 * Категория — единственный фильтр, которым пользуются почти все, и прятать
 * её за кнопку было бы экономией на главном.
 */
const SECTIONS = ['all', 'lashes', 'care', 'tools'] as const
export type Section = (typeof SECTIONS)[number]

export function sectionCount(section: Section): number {
  return section === 'all'
    ? PRODUCTS.length
    : PRODUCTS.filter((p) => p.category === (section as Category)).length
}

export function CatalogHero({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  const sections = SECTIONS.map((key) => ({
    key,
    label: key === 'all' ? t.home.all : t.nav[key],
    count: sectionCount(key),
  }))

  return (
    <section className="pt-10 pb-0 sm:pt-14">
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
              {t.catalog.title}
            </li>
          </ol>
        </nav>

        {/* Заголовок и размер каталога стоят на одной линии: это два ответа
            на один вопрос «куда я попала», и разносить их по вертикали
            значило бы читать их по очереди. */}
        <div className="mt-8 grid items-end gap-4 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
          <h1 className="t-section lg:col-span-7">{t.catalog.title}</h1>
          <p className="t-lead lg:col-span-4 lg:col-start-9">
            <span className="t-muted">{t.catalog.lead}</span>
            <span className="mt-1 block tabular-nums">
              {plural(PRODUCTS.length, lang, t.catalog.items)}
            </span>
          </p>
        </div>
      </div>

      {/* Разделы читаются из адреса, поэтому уезжают на клиент. Подложка
          рисует тот же ряд в состоянии «Всё» — оно же и стоит по умолчанию,
          так что после гидратации не сдвигается ни строка. */}
      <div className="wrap mt-10">
        <Suspense
          fallback={
            <SectionNav
              label={t.catalog.sections}
              items={sections.map((s) => ({
                ...s,
                href:
                  s.key === 'all'
                    ? `/${lang}/catalog#catalog`
                    : `/${lang}/catalog?category=${s.key}#catalog`,
                current: s.key === 'all',
              }))}
            />
          }
        >
          <SectionLinks label={t.catalog.sections} sections={sections} />
        </Suspense>
      </div>
    </section>
  )
}
