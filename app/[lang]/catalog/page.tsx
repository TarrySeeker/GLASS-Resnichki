import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import { isLocale } from '@/lib/i18n'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { CatalogHero } from '@/components/site/CatalogHero'
import { CollectionsRow } from '@/components/site/CollectionsRow'
import { CatalogView } from '@/components/site/CatalogView'
import { CatalogFallback } from '@/components/site/CatalogFallback'
import { LashFinder } from '@/components/site/LashFinder'
import { ReviewsBlock } from '@/components/site/HomeBlocks'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = CONTENT[lang]
  return {
    title: t.catalog.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}/catalog`,
      languages: { ru: '/ru/catalog', en: '/en/catalog', ar: '/ar/catalog' },
    },
  }
}

/**
 * Каталог.
 *
 * Порядок блоков отвечает на вопросы в том порядке, в котором они возникают:
 *
 *   куда я попала и насколько это большой раздел  → заголовок и счётчик
 *   какой эффект я хочу                           → коллекции
 *   как сузить до своего                          → полоса и панель фильтра
 *   что здесь есть                                → сетка
 *   а если я не знаю миллиметры                   → подбор
 *   можно ли этому верить                         → отзывы
 *
 * Подбор стоит после сетки, а не до неё: он нужен тому, кто пролистал и не
 * выбрал. Ставить его выше — значит требовать знания длины и изгиба до того,
 * как человек вообще увидел товар.
 *
 * Всё интерактивное живёт в CatalogView и обёрнуто в <Suspense>: он читает
 * useSearchParams, а без границы Next 16 отказывается собирать страницу
 * статически. Подложка держит ту же геометрию, поэтому после гидратации
 * ничего не сдвигается.
 */
export default async function CatalogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <>
      <Header lang={lang} />
      <main>
        <CatalogHero lang={lang} />

        <CollectionsRow lang={lang} />

        {/* Полоса, панель и сетка — одна секция: полоса липкая, и прилипать
            она обязана к тому же потоку, по которому едет сетка. */}
        <section className="pb-[clamp(3.5rem,8vh,6rem)]">
          <Suspense fallback={<CatalogFallback lang={lang} />}>
            <CatalogView lang={lang} />
          </Suspense>
        </section>

        <section className="sec border-t border-[var(--color-rule)]">
          <div className="wrap">
            <LashFinder lang={lang} mode="apply" standalone />
          </div>
        </section>

        <ReviewsBlock lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
