import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CONTENT, BRAND, BRAND_SUB, MAKER } from '@/lib/content'
import { LOCALES, isLocale, formatLength } from '@/lib/i18n'
import { PRODUCTS, bySlug, inStock, type Category } from '@/lib/catalog'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { RecentlyViewed } from '@/components/site/RecentlyViewed'
import { ProductCard } from '@/components/site/ProductCard'
import { ProductGallery } from '@/components/site/ProductGallery'
import { ProductBuy } from '@/components/site/ProductBuy'

/** Все товары на всех трёх языках — витрина маленькая, собираем целиком. */
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => PRODUCTS.map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const product = bySlug(slug)
  if (!isLocale(lang) || !product) return {}
  return {
    title: product.name[lang],
    description: product.description[lang],
    openGraph: {
      title: `${product.name[lang]} — ${BRAND}`,
      description: product.summary[lang],
      type: 'website',
      images: product.images,
    },
    alternates: {
      canonical: `/${lang}/product/${slug}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/product/${slug}`])),
    },
  }
}

/** Название категории берём из навигации — второго набора строк не заводим. */
const CATEGORY_KEY: Record<Category, 'lashes' | 'care' | 'tools'> = {
  lashes: 'lashes',
  care: 'care',
  tools: 'tools',
}

/** Уникальные значения в порядке появления. */
const uniq = (xs: string[]) => [...new Set(xs)]

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()
  const product = bySlug(slug)
  if (!product) notFound()

  const t = CONTENT[lang]
  const available = inStock(product)
  const lengths = uniq(product.variants.map((v) => v.length))
  const curls = uniq(product.variants.map((v) => v.curl))
  /**
   * «С этим берут» — то, без чего товар не работает, а не то, что на него
   * похоже. Раньше здесь стояли просто четыре первых по рангу, и на карточке
   * CLASSIC покупателю предлагали BASIC: две почти одинаковые палетки вместо
   * клея и пинцета, без которых первую не наклеить.
   *
   * Правило простое и обратимое: к ресницам показываем уход и инструменты,
   * к уходу и инструментам — ресницы.
   */
  const related = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (product.category === 'lashes' ? p.category !== 'lashes' : p.category === 'lashes'),
  )
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4)

  // Микроразметка Product — требование брифа (SEO, п. 10.3). Оффер на каждый
  // артикул: наличие у вариантов разное, один общий оффер соврал бы.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[lang],
    description: product.description[lang],
    image: product.images,
    category: t.nav[CATEGORY_KEY[product.category]],
    brand: { '@type': 'Brand', name: `${BRAND} ${BRAND_SUB}` },
    // Цену в разметку кладём, только когда она есть: price 0 поисковик
    // прочитает как «бесплатно», а прайс от клиента ещё не получен.
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      sku: v.sku,
      ...(product.price > 0 ? { price: product.price, priceCurrency: 'RUB' } : {}),
      availability: v.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    })),
  }

  /* Характеристики. Материал и тип кожи стоят только у ресниц: у клея,
     праймера и пинцета «синтетический шёлк» был бы враньём. Страна и
     изготовитель одни на всю марку и стоят везде — это обязательные для
     маркировки сведения, а не описание. */
  const isLashes = product.category === 'lashes'
  const specs: [string, string][] = [
    [t.catalog.category, t.nav[CATEGORY_KEY[product.category]]],
    [t.catalog.length, lengths.map((l) => formatLength(l, lang)).join(', ')],
    [t.catalog.curl, curls.join(', ')],
    ...(isLashes
      ? ([
          [t.product.specMaterial, t.product.specMaterialValue],
          [t.product.specSkin, t.product.specSkinValue],
        ] as [string, string][])
      : []),
    [t.product.specCountry, t.product.specCountryValue],
    [t.product.specMaker, MAKER],
    [t.product.sku, product.variants.map((v) => v.sku).join(', ')],
  ]

  return (
    <>
      <Header lang={lang} />
      {/* Запас снизу под липкую полосу покупки: на мобиле она перекрыла бы футер. */}
      <main className="pb-24 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }}
        />

        <nav aria-label={t.catalog.breadcrumbs} className="wrap pt-6">
          <ol className="t-label t-muted flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${lang}`} className="lnk tap-sm">
                {BRAND}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${lang}/catalog`} className="lnk tap-sm">
                {t.catalog.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-ink)]">
              {product.name[lang]}
            </li>
          </ol>
        </nav>

        <div className="wrap grid gap-10 pt-6 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
          {/* Галерея липкая: панель покупки длиннее кадра, и при её прокрутке
              товар должен оставаться перед глазами. */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <ProductGallery images={product.images} alt={product.name[lang]} lang={lang} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <h1 className="t-h2">{product.name[lang]}</h1>
            <p className="t-label t-muted mt-3">{product.summary[lang]}</p>

            <ul className="t-label mt-6 flex flex-col gap-2 border-t border-[var(--color-rule)] pt-6">
              <li className="flex justify-between gap-4">
                <span className="t-muted">{t.catalog.length}</span>
                <span>{lengths.join(', ')}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="t-muted">{t.catalog.curl}</span>
                <span>{curls.join(', ')}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="t-muted">{t.catalog.availability}</span>
                <span>{available ? t.catalog.inStock : t.catalog.outOfStock}</span>
              </li>
            </ul>

            <div className="mt-8">
              <ProductBuy product={product} lang={lang} />
            </div>
          </div>
        </div>

        {/*
          Раскрывающиеся блоки вместо трёх колонок в ряд.

          Колонок было три и все раскрыты: описание, характеристики, доставка.
          Условий возврата в карточке не было вовсе — за ними нужно было уйти
          в футер. Развернуть всё пятью колонками нельзя, они не помещаются;
          развернуть в столбик — три экрана текста перед блоком «с этим берут».

          Открыт по умолчанию только первый: это то, ради чего сюда пришли.
        */}
        <section className="sec">
          <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
            <h2 className="t-h2 lg:col-span-4">{t.product.about}</h2>

            <div className="lg:col-span-7 lg:col-start-6">
              <details className="acc" open>
                <summary className="t-h3">{t.product.description}</summary>
                <div className="acc-body">
                  <p className="t-lead t-muted">{product.description[lang]}</p>
                </div>
              </details>

              <details className="acc">
                <summary className="t-h3">{t.product.specs}</summary>
                <div className="acc-body">
                  <dl className="t-label flex flex-col gap-3">
                    {specs.map(([k, v]) => (
                      <div
                        key={k}
                        className="flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--color-rule)] pt-3"
                      >
                        <dt className="t-muted">{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </details>

              {/* Применение — только у ресниц: у клея и пинцета своя инструкция,
                  а у праймера её нет вовсе. Предупреждение про клей стоит
                  последним и отдельной строкой: это единственное, что человек
                  обязан узнать до покупки, а не после. */}
              {isLashes ? (
                <details className="acc">
                  <summary className="t-h3">{t.product.usage}</summary>
                  <div className="acc-body flex flex-col gap-4">
                    {t.product.usageBody.map((par) => (
                      <p key={par} className="t-label t-muted">
                        {par}
                      </p>
                    ))}
                    <p className="t-label">{t.product.noGlue}</p>
                  </div>
                </details>
              ) : null}

              <details className="acc">
                <summary className="t-h3">{t.footer.delivery}</summary>
                <div className="acc-body flex flex-col gap-4">
                  {t.info.delivery.body.map((par) => (
                    <p key={par} className="t-label t-muted">
                      {par}
                    </p>
                  ))}
                  <p>
                    <Link href={`/${lang}/info/delivery`} className="lnk tap-sm t-label">
                      {t.footer.delivery}
                    </Link>
                  </p>
                </div>
              </details>

              <details className="acc">
                <summary className="t-h3">{t.footer.returns}</summary>
                <div className="acc-body flex flex-col gap-4">
                  {t.info.returns.body.map((par) => (
                    <p key={par} className="t-label t-muted">
                      {par}
                    </p>
                  ))}
                  <p>
                    <Link href={`/${lang}/info/returns`} className="lnk tap-sm t-label">
                      {t.footer.returns}
                    </Link>
                  </p>
                </div>
              </details>

              <hr className="hr" />
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="sec">
            <div className="wrap">
              <h2 className="t-h2 rise">{t.product.related}</h2>
              <div className="mt-8 grid grid-cols-12 gap-x-[var(--col-gap)] gap-y-10">
                {related.map((p, i) => (
                  <div
                    key={p.id}
                    className="rise col-span-6 lg:col-span-3"
                    data-rise-delay={`${i * 70}ms`}
                  >
                    <ProductCard product={p} lang={lang} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
        <RecentlyViewed slug={product.slug} lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
