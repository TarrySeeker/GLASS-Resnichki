import Link from 'next/link'
import Image from 'next/image'
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

/**
 * Действие в конце страницы.
 *
 * Одинаковое «в каталог» на всех пяти было простым, но неверным: со страницы
 * возврата человек уходит оформлять возврат, а не выбирать ресницы, и форма
 * заявки лежит в кабинете. Остальные четыре действительно ведут к выбору —
 * там «в каталог» и остаётся.
 */
type Copy = (typeof CONTENT)[Locale]

const CTA: Record<InfoSlug, { href: (l: Locale) => string; label: (t: Copy) => string }> = {
  about: { href: (l) => `/${l}/catalog`, label: (t) => t.cart.toShop },
  contacts: { href: (l) => `/${l}/catalog`, label: (t) => t.cart.toShop },
  delivery: { href: (l) => `/${l}/catalog`, label: (t) => t.cart.toShop },
  privacy: { href: (l) => `/${l}/catalog`, label: (t) => t.cart.toShop },
  returns: { href: (l) => `/${l}/account/returns`, label: (t) => t.account.returns.send },
}

/** Кадр страницы. Съёмка бренда от 15 августа, кроме «о бренде» — там модели. */
const ART: Record<InfoSlug, { src: string; w: number; h: number }> = {
  about: { src: '/media/about.jpg', w: 1040, h: 1849 },
  contacts: { src: '/media/info-contacts.jpg', w: 1000, h: 1333 },
  delivery: { src: '/media/info-delivery.jpg', w: 1000, h: 1333 },
  returns: { src: '/media/info-returns.jpg', w: 1000, h: 1333 },
  privacy: { src: '/media/info-privacy.jpg', w: 1000, h: 1333 },
}

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

            {/* Раскладка одна на все пять страниц: заголовок во всю ширину,
                текст слева в шести колонках, кадр справа в пяти. Между ними
                колонка пустоты — она и держит их как две вещи, а не как текст
                с подписанной картинкой.

                Заголовок идёт во всю ширину, а не четвертью слева:
                «Конфиденциальность» — восемнадцать букв, и в четырёх колонках
                оно требует вдвое больше места, чем там есть. Переносить его по
                слогам нельзя, ужимать кегль ради одной страницы — тоже.

                Предел в 36em держит длину строки: шесть колонок на широком
                мониторе дают шестьсот пикселей, и это ровно та мера, после
                которой глаз перестаёт находить начало следующей строки. */}
            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
              <h1 className="t-h2 lg:col-span-12">{page.title}</h1>

              {/* Первая строка идёт во всю ширину под заголовком: это не абзац
                  текста, а подзаголовок, и колонка ему не нужна. Предел меры
                  шире, чем у основного текста, — одна строка в 48em читается
                  без усилия, десять уже нет. */}
              <p className="t-lead max-w-[48em] lg:col-span-12">{page.lead}</p>

              {/* Таблица — во всю ширину сетки, а не в колонку текста. В шести
                  колонках «на оформлении, по стране назначения» ломалось на
                  три строки, и три способа доставки читались как двенадцать
                  строк вместо трёх. Двенадцать колонок дают каждой ячейке
                  место в одну строку.

                  Стоит она сразу под заголовком: эту страницу открывают с
                  вопросом «как приедет и почём», а не «почему устроено так» —
                  сперва ответ, следом причины. */}
              {slug === 'delivery' ? (
                <div className="lg:col-span-12">
                  <DeliveryTable lang={lang} />
                </div>
              ) : null}

              <div className="max-w-[36em] lg:col-span-6">
                {'body' in page ? (
                  <div className="flex flex-col gap-5">
                    {page.body.map((par) => (
                      <p key={par} className="t-lead t-muted">
                        {par}
                      </p>
                    ))}
                  </div>
                ) : null}

                {slug === 'contacts' ? <ContactList lang={lang} /> : null}

                {/* Действие в конце — то, к которому страница ведёт, а не
                    одинаковое «в каталог» на всех пяти. С возврата уходят
                    оформлять возврат, с остальных — выбирать. */}
                <Link href={CTA[slug].href(lang)} className="btn btn-wide mt-10">
                  {CTA[slug].label(t)}
                </Link>
              </div>

              {/* Кадр у каждой страницы свой, и выбран он не для украшения: у
                  доставки — закрытая коробка, у возврата — она же открытая, у
                  контактов — буклет бренда, у политики — закрытая коробочка. О
                  бренде говорит съёмка с моделями: это единственная страница,
                  где речь о людях, а не о посылке.

                  До 1024 кадра нет: там текст идёт во всю ширину, и картинка
                  над ним отодвинула бы ответ на вопрос, ради которого сюда
                  пришли.

                  Высота у кадра не своя, а по колонке текста: класс tile-fill
                  вынимает изображение из потока, и строку меряет текст. С
                  жёстким 3:4 кадр свисал ниже текста на четыреста пикселей, а
                  когда его просто растянули — на столько же растянулась и
                  колонка текста, оставив пустоту под кнопкой. Нижний предел
                  держит кадр от схлопывания там, где текста совсем мало. */}
              <div className="tile tile-fill tile-zoom rise hidden min-h-[18rem] lg:col-span-5 lg:col-start-8 lg:block">
                <Image
                  src={ART[slug].src}
                  alt=""
                  width={ART[slug].w}
                  height={ART[slug].h}
                  sizes="(max-width: 1024px) 1px, 40vw"
                />
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer lang={lang} />
    </>
  )
}

/**
 * Способы доставки таблицей.
 *
 * Лид отвечает в одну строку, таблица — по существу: чем везут, куда, за
 * сколько и почём. Абзацы ниже объясняют, почему для одной страны есть выбор,
 * а для другой нет.
 *
 * Строки те же три, что и в корзине, и заведены они там же — переставлять их
 * надо в одном месте.
 *
 * Срок стоит заглушкой намеренно: его считает перевозчик по адресу, и любое
 * число здесь было бы обещанием, которого бренд не давал.
 *
 * С 1024 это настоящая таблица: подписи колонок стоят один раз в шапке, а
 * каждый способ занимает одну строку. Ниже — карточки: четыре колонки в
 * 336 px не встают, а горизонтальная прокрутка ради трёх строк плохая цена.
 * Переключает раскладку display: contents — разметка одна на оба случая.
 */
function DeliveryTable({ lang }: { lang: Locale }) {
  const page = CONTENT[lang].info.delivery
  const c = page.methodsCols
  const cells = 'lg:grid lg:grid-cols-12 lg:gap-x-[var(--col-gap)]'

  return (
    <section className="mt-12">
      <h2 className="t-h3">{page.methodsTitle}</h2>

      {/* Шапка таблицы только на широком экране: в карточках подпись стоит у
          каждого значения, и повторять её сверху незачем. */}
      <div className={`t-label t-muted mt-6 hidden border-b border-[var(--color-rule)] pb-3 ${cells}`}>
        <span className="lg:col-span-3">{c.name}</span>
        <span className="lg:col-span-3">{c.zone}</span>
        <span className="lg:col-span-2">{c.time}</span>
        <span className="lg:col-span-4">{c.cost}</span>
      </div>

      <ul>
        {page.methods.map((m) => (
          <li
            key={m.name}
            className={`border-t border-[var(--color-rule)] py-5 lg:items-baseline ${cells}`}
          >
            <p className="t-nav lg:col-span-3">{m.name}</p>

            <dl className={`mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-3 lg:contents`}>
              {(
                [
                  [c.zone, m.zone, 'lg:col-span-3'],
                  [c.time, m.time, 'lg:col-span-2'],
                  [c.cost, m.cost, 'lg:col-span-4'],
                ] as const
              ).map(([label, value, span]) => (
                <div key={label} className={span}>
                  <dt className="t-label t-muted lg:sr-only">{label}</dt>
                  <dd className="t-label pt-1 lg:pt-0">{value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Контакты — единственная страница со списком полей, а не с абзацами. */
function ContactList({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const rows = [
    { label: t.info.contacts.phone, value: BLANKS.phone },
    { label: 'E-mail', value: BLANKS.email },
    { label: t.info.contacts.address, value: BLANKS.address },
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
