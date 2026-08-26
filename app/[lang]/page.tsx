import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import { isLocale } from '@/lib/i18n'
import { PRODUCTS } from '@/lib/catalog'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { Hero } from '@/components/site/Hero'
import { Marquee } from '@/components/site/Marquee'
import { ProductCard } from '@/components/site/ProductCard'
import {
  BeforeAfterBlock,
  CategoriesBlock,
  CollectionsBlock,
  FeatureBlock,
  FinalBlock,
  LooksBlock,
  RealLifeBlock,
  ReviewsBlock,
  StepsBlock,
  TrustBlock,
  WhyBlock,
} from '@/components/site/HomeBlocks'

/**
 * Главная собрана по продающей структуре клиента:
 *
 *   ЖЕЛАНИЕ → ПРОДУКТ → ОБРАЗЫ → РЕЗУЛЬТАТ → КАЧЕСТВО → ДОВЕРИЕ → ВЫБОР → ПОКУПКА
 *
 * 01 герой · 02 продукт · 03 образы · 04 как это выглядит · 05 почему эти
 * ресницы · 06 до и после · 07 коллекции · витрина · 08 отзывы · 09 как
 * наносить · 10 качество · 11 финал.
 *
 * Редакционный блок «Точность, которую видно вблизи» убран: его роль делят
 * блоки 05 и 10, а держать все три означало трижды сказать одно и то же.
 *
 * Соседние блоки не повторяют друг друга ни плоскостью, ни раскладкой:
 * бумага и чернила чередуются, за сеткой идёт лента, за лентой — таблица,
 * а два блока подряд без изображений стоят только там, где это пауза.
 */
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = CONTENT[lang]

  const best = [...PRODUCTS].sort((a, b) => a.rank - b.rank).slice(0, 4)

  return (
    <>
      <Header lang={lang} />
      <main>
        <Hero lang={lang} />
        <Marquee lang={lang} />

        <FeatureBlock lang={lang} />
        <LooksBlock lang={lang} />
        <RealLifeBlock lang={lang} />
        <WhyBlock lang={lang} />
        <BeforeAfterBlock lang={lang} />
        <CollectionsBlock lang={lang} />
        <CategoriesBlock lang={lang} />

        {/* Витрина: сетка карточек по образцу, присланному клиентом.
            Стоит после коллекций — сначала покупатель выбирает линейку,
            и только потом видит конкретные позиции. */}
        <section className="sec">
          <div className="wrap">
            <div className="flex flex-wrap items-baseline justify-between gap-6">
              <h2 className="t-h2">{t.home.bestTitle}</h2>
              {/* На телефоне вход в каталог стоит под лентой полосой во всю
                  ширину — тот же адрес дважды в одном экране читается как две
                  разные цели, поэтому здесь ссылка прячется. */}
              <Link href={`/${lang}/catalog`} className="lnk t-label max-sm:hidden">
                {t.home.all}
              </Link>
            </div>
            {/* На телефоне витрина едет лентой, а не встаёт столбиком: восемь
                карточек в две колонки — это 880 px и четыре ряда, которые
                приходится пролистывать целиком, чтобы дойти до следующего
                блока. Лентой ряд занимает одну карточку по высоте, а вход в
                весь каталог стоит под ним отдельной целью. */}
            <div className="mrail rail-cards mt-8 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {best.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} lang={lang} />
                </div>
              ))}
            </div>

            <Link href={`/${lang}/catalog`} className="rail-more t-nav lg:hidden">
              {t.home.all}
            </Link>
          </div>
        </section>

        <ReviewsBlock lang={lang} />
        <StepsBlock lang={lang} />
        <TrustBlock lang={lang} />
        <FinalBlock lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
