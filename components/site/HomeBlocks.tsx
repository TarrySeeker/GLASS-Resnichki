import Link from 'next/link'
import Image from 'next/image'
import { BLANKS, CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { PRODUCTS, bySlug } from '@/lib/catalog'
import { LOOKS, lookQuery } from '@/lib/looks'
import { AddToCart } from '@/components/site/AddToCart'
import { LashFinder } from '@/components/site/LashFinder'
import { Clip } from '@/components/site/Clip'
import { KitButton } from '@/components/site/KitButton'

/**
 * Блоки главной по продающей структуре, присланной клиентом:
 * желание → продукт → образы → результат → качество → доверие → выбор → покупка.
 *
 * Все блоки лежат в одном файле сознательно: это не переиспользуемые
 * компоненты, а одна страница, разобранная на части. Порядок здесь — порядок
 * на экране, и читать его надо сверху вниз.
 *
 * Три блока структуры требуют съёмки, которой у бренда пока нет: «как это
 * выглядит», «до и после» и отзывы. Они собраны как явные слоты — рамка,
 * подпись и знак, — а не заполнены случайной картинкой и выдуманным текстом.
 */

/* ─── Слот под материал, которого ещё нет ──────────────────────────────────
   Пунктирная рамка и подпись читаются как место, оставленное намеренно.
   Заливки нет: четыре залитых плитки встык сливались в одно серое поле во всю
   ширину и читались как поломка вёрстки, а не как ожидание съёмки.
   Чужая фотография на этом месте читалась бы как обман. */
function Slot({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 border border-dashed border-[var(--color-rule)] ${className}`}
    >
      <Image
        src="/media/logo-mark.png"
        alt=""
        width={210}
        height={254}
        aria-hidden="true"
        className="h-8 w-auto opacity-15"
      />
      <span className="t-label t-muted px-4 text-center">{label}</span>
    </div>
  )
}

/* ─── 02. Продукт ──────────────────────────────────────────────────────────
   Сразу после эмоционального входа — то, что продаётся: одна позиция крупно,
   название, описание, цена, действие. Здесь покупатель впервые понимает,
   что за товар перед ним. */
export function FeatureBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const product = bySlug('modern-bride') ?? PRODUCTS[0]
  const href = `/${lang}/product/${product.slug}`

  return (
    <section className="sec">
      <div className="wrap grid items-center gap-10 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
        {/* Квадрат, а не 4:3: съёмка бренда квадратная, и в широкой плитке
            коробка повисала в пустоте с двух сторон. */}
        <div className="lg:col-span-6">
          <Link href={href} className="tile rise block aspect-square">
            <Image
              src={product.images[0]}
              alt={product.name[lang]}
              width={1200}
              height={1200}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Link>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <p className="t-label t-muted">{t.blocks.featureKicker}</p>
          <h2 className="t-h2 mt-4">
            <Link href={href} className="lnk">
              {product.name[lang]}
            </Link>
          </h2>
          <p className="t-lead t-muted mt-5">{product.description[lang]}</p>
          <div className="mt-8">
            <AddToCart product={product} lang={lang} href={href} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── 03. Образы ───────────────────────────────────────────────────────────
   Главный блок структуры. Женщина выбирает не характеристику, а образ,
   поэтому крупно стоит имя образа и эффект, а длина и изгиб — подписью:
   ими блок и фильтрует каталог. Это же место закрывает провал каталога,
   где длину и изгиб предлагали выбрать девятью текстовыми чекбоксами.

   Плоскость чёрная — единственный тёмный экран в верхней половине страницы. */

export function LooksBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section id="looks" className="on-ink sec-tall scroll-mt-24">
      <div className="wrap">
        <h2 className="t-h2">{t.blocks.looksTitle}</h2>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {t.blocks.looks.map((look, i) => {
            const source = LOOKS[i]
            if (!source) return null
            return (
              <li key={look.name}>
                <Link href={`/${lang}/catalog?${lookQuery(source)}`} className="group block">
                  {/* Квадрат, а не 3/4: съёмка квадратная, и в вертикальной
                      плитке упаковку срезало по бокам. */}
                  <span className="tile rise block aspect-square">
                    <Image
                      src={source.image}
                      alt=""
                      width={1200}
                      height={1200}
                      sizes="(max-width: 1024px) 50vw, 23vw"
                      className="opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </span>
                  {/* Имя образа — крупно, характеристика — мелко и приглушённо.
                      Порядок обратный привычной карточке товара намеренно. */}
                  <span className="mt-4 block t-h3">{look.name}</span>
                  <span className="mt-1 block t-label t-muted">{look.effect}</span>
                  <span className="mt-2 block t-label">{look.spec}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <LashFinder lang={lang} />
      </div>
    </section>
  )
}

/* ─── 04. Как это выглядит ─────────────────────────────────────────────────
   По структуре: упаковка → пучки → лицо → образ. Съёмки на моделях в архиве
   бренда нет ни одного кадра — все 257 фотографий предметные. Поэтому здесь
   четыре слота с подписями, а не подставленная предметка. */
/**
 * Ролики последовательности «как это выглядит», по номеру шага.
 * Пропуск означает, что съёмки этого шага у бренда нет, и на его месте
 * честно стоит пустая рамка.
 */
const CLIPS: (undefined | { src: string; poster: string })[] = [
  { src: '/media/lash-tray.mp4', poster: '/media/lash-tray-poster.jpg' },
  undefined,
  { src: '/media/face-clip.mp4', poster: '/media/face-clip-poster.jpg' },
  { src: '/media/look-clip.mp4', poster: '/media/look-clip-poster.jpg' },
]

export function RealLifeBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="sec">
      <div className="wrap">
        <div className="flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="t-h2">{t.blocks.realTitle}</h2>
          <p className="t-label t-muted max-w-sm">{t.blocks.realNote}</p>
        </div>

        {/* Три шага из четырёх — съёмка бренда, а не заглушки: палетка в
            свете, нанесение крупным планом и готовый образ. Пустым остался
            один кадр: макро самих пучков в архиве нет. */}
        <ol className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {t.blocks.realSteps.map((step, i) => {
            const clip = CLIPS[i]
            return (
              <li key={step}>
                <div className="aspect-[3/4]">
                  {clip ? (
                    <Clip src={clip.src} poster={clip.poster} label={step} />
                  ) : (
                    <Slot label={step} className="h-full" />
                  )}
                </div>
                <p className="t-label t-muted pt-3">
                  {String(i + 1).padStart(2, '0')} — {step}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ─── 05. Почему эти ресницы ───────────────────────────────────────────────
   Здесь продаётся качество, и здесь же проще всего соврать. В блоке только
   то, что подтверждено описаниями каталога: плоское основание, цвет, два
   объёма и многоразовая линия. Ни «ручной работы», ни «невесомости» —
   этого в данных бренда нет.

   Единственный блок страницы вовсе без изображений: после четырёх кадров
   подряд чистая типографика читается как пауза. */
export function WhyBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="sec-tall border-y border-[var(--color-rule)]">
      <div className="wrap">
        <h2 className="t-h2">{t.blocks.whyTitle}</h2>
        <dl className="mt-10">
          {t.blocks.why.map((f) => (
            <div
              key={f.title}
              className="grid gap-2 border-t border-[var(--color-rule)] py-6 sm:grid-cols-12 sm:gap-8"
            >
              <dt className="t-h3 sm:col-span-4">{f.title}</dt>
              <dd className="t-lead t-muted sm:col-span-7 sm:col-start-6">{f.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ─── 06. До и после ───────────────────────────────────────────────────────
   Самый сильный продающий блок структуры и единственный, который нечем
   заполнить честно: нужен один глаз в двух состояниях. Два слота стоят
   встык, без зазора — так видно, что это пара, а не две картинки. */
export function BeforeAfterBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="sec">
      <div className="wrap">
        <div className="flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="t-h2">{t.blocks.baTitle}</h2>
          <p className="t-label t-muted max-w-sm">{t.blocks.baNote}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6">
          {[t.blocks.baBefore, t.blocks.baAfter].map((label) => (
            <figure key={label}>
              <Slot label={label} className="aspect-[4/5] sm:aspect-[3/2]" />
              <figcaption className="t-label pt-3">{label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 07. Коллекции ────────────────────────────────────────────────────────
   Коллекционные линейки бренда. Каждая ведёт на свою карточку товара.

   Раньше здесь стояли выборки по поиску — CLASSIC, BASIC, MIX, FLAMBOYANCE, —
   и собраны они были из разных съёмок: лоток под углом, лоток сверху, пустая
   плитка на месте удалённого кадра. В ряд это читалось как случайный набор.

   Теперь ряд собран из одной съёмки: коробка целиком, крышка на месте,
   карточка линейки читается. Одинаковый ракурс, одинаковый фон, одинаковый
   масштаб — ровно то, ради чего съёмку так и делали.

   Раскладка горизонтальная: на телефоне лента прокручивается вбок, и это
   единственное место страницы, где движение задаёт покупатель, а не сайт. */
const COLLECTION_SLUGS = [
  'modern-bride',
  'luxurious-bride',
  'celebrity-look',
  'caramel-glaze',
  'sun-glare',
  'morning-of-the-bride',
]

export function CollectionsBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="sec">
      <div className="wrap flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="t-h2">{t.blocks.collectionsTitle}</h2>
        <p className="t-label t-muted max-w-sm">{t.blocks.collectionsNote}</p>
      </div>

      {/* Плитка квадратная: съёмка коробок квадратная, и в 16/11 у коробки
          срезался верх с логотипом. */}
      <ol className="rail mt-10">
        {COLLECTION_SLUGS.map((slug, i) => {
          const p = bySlug(slug)
          if (!p) return null
          return (
            <li key={slug} className="rail-item">
              <Link href={`/${lang}/product/${slug}`} className="group block">
                <span className="tile rise block aspect-square">
                  <Image
                    src={p.images[0]}
                    alt={p.name[lang]}
                    width={1200}
                    height={1200}
                    sizes="(max-width: 1024px) 78vw, 24vw"
                  />
                </span>
                <span className="mt-4 flex items-baseline gap-3">
                  <span className="t-label t-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t-h3">{slug.replace(/-/g, ' ').toUpperCase()}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/* ─── Категории ────────────────────────────────────────────────────────────
   Третья ось навигации. По эффекту покупательница выбирает в блоке образов,
   по линейке — в коллекциях, а по типу товара — только через шапку, куда
   с середины страницы никто не возвращается.

   Без изображений: снимка «категория целиком» у бренда нет, а ставить под
   «Уход» кадр клея значило бы выдать одну позицию за раздел. Считаем позиции —
   это единственная честная подпись, и она же полезная.

   Три строки во всю ширину, а не три колонки: в колонке шириной 340 px слово
   «ИНСТРУМЕНТЫ» наборным шрифтом не помещается и выносит счётчик за экран.
   Заодно блок перестаёт быть очередной сеткой — их на странице уже четыре.

   Плоскость чёрная: между коллекциями и витриной шли четыре светлых блока
   подряд, и полоса без изображений терялась в этой белизне.

   Справа кадр. Строки занимают чуть больше половины ширины — оставшаяся
   треть чёрного поля читалась как незаполненная вёрстка, а не как воздух.
   У кадра свои пропорции 3:4, а строки по нему центрируются. Растянуть его
   по высоте строк не вышло: без заданных пропорций высоту блока начинал
   определять сам снимок и под списком оставалось полтора экрана черноты.

   Снимок отдельный, ни в первом экране, ни в полосе лиц он не участвует:
   одно и то же лицо дважды на странице читается как нехватка материала.
   Фон у него тёмный и сходится с плоскостью блока — кадр не выглядит
   вырезанным прямоугольником на чёрном. */
export function CategoriesBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const cats = [
    { key: 'lashes', label: t.nav.lashes },
    { key: 'care', label: t.nav.care },
    { key: 'tools', label: t.nav.tools },
  ] as const

  return (
    <section className="on-ink sec">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-[var(--col-gap)] lg:items-center">
        <div className="lg:col-span-7">
        {/* Слово «Категории» — служебная подпись, а не содержание блока:
            набранное тем же кеглем, что и сами категории, оно читалось как
            четвёртый пункт списка. Уровень в разметке остаётся вторым —
            размер и роль в структуре документа это разные вещи. */}
        <h2 className="t-label t-muted">{t.home.categoriesTitle}</h2>
        <ul className="mt-6">
          {cats.map((c) => {
            const count = PRODUCTS.filter((p) => p.category === c.key).length
            return (
              <li key={c.key}>
                <Link
                  href={`/${lang}/catalog?category=${c.key}`}
                  className="group flex items-baseline gap-4 border-t border-[var(--color-rule-ink)] py-7 transition-[padding-inline-start] duration-[var(--dur)] ease-[var(--ease-brand)] hover:ps-3"
                >
                  <span className="t-h2">{c.label}</span>
                  {/* Счётчик стоит вплотную к названию, а не у правого края:
                      через полтора метра пустоты глаз до него не доходит. */}
                  <span className="t-label t-muted">{count}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        </div>

        <div className="tile tile-zoom rise hidden aspect-[3/4] lg:col-span-4 lg:col-start-9 lg:block">
          <Image
            src="/media/categories.jpg"
            alt=""
            width={900}
            height={1200}
            sizes="(max-width: 1024px) 1px, 30vw"
          />
        </div>
      </div>
    </section>
  )
}

/* ─── 08. Отзывы ───────────────────────────────────────────────────────────
   По структуре — важнее рассказа о себе. Настоящих отзывов у нас нет, и
   выдумывать их запрещено брифом прямо. Поэтому здесь три пустых карточки
   с подписью, объясняющей, что сюда встанет. */
export function ReviewsBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="sec border-t border-[var(--color-rule)]">
      <div className="wrap">
        <div className="flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="t-h2">{t.blocks.reviewsTitle}</h2>
          <p className="t-label t-muted max-w-sm">{t.blocks.reviewsNote}</p>
        </div>

        {/* Ни звёзд, ни имени, ни текста: нарисованный рейтинг — это уже
            выдуманный отзыв, даже если он серый. Карточка показывает только
            форму будущего отзыва: кадр покупательницы и её слова. */}
        {/* На телефоне остаётся одна рамка вместо трёх. Три одинаковых пустых
            кадра не говорят ничего сверх одного, а в столбик они дают
            полторы тысячи пикселей дырок в хвосте страницы. */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className={`border border-[var(--color-rule)] p-6 ${i > 0 ? 'hidden sm:block' : ''}`}
            >
              <Slot label={BLANKS.review} className="aspect-square" />
              <p className="t-lead t-muted mt-5">{BLANKS.review}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─── 09. Как наносить ─────────────────────────────────────────────────────
   Снимает страх «я сама не справлюсь». Три шага, крупные номера, никаких
   изображений — процесс описывается словами, а показывать его нечем.
   Плоскость чёрная: вторая и последняя тёмная остановка перед финалом. */
export function StepsBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="on-ink sec-tall">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="t-h2">{t.blocks.stepsTitle}</h2>
          {/* Три шага требуют трёх покупок — кнопка кладёт их разом. */}
          <KitButton lang={lang} />
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {t.blocks.steps.map((s, i) => (
            <li key={s.title} className="border-t border-[var(--color-rule-ink)] pt-6">
              <p className="t-hero" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="t-h3 mt-4">{s.title}</p>
              <p className="t-lead t-muted mt-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── 10. Качество ─────────────────────────────────────────────────────────
   По структуре — рационализация уже принятого решения, поэтому не главный
   блок и стоит поздно. Таблица честная: две строки заполнены, четыре ждут
   данных бренда. Пустые строки видно, и это лучше выдуманного состава. */
export function TrustBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="sec">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-[var(--col-gap)] lg:items-center">
        <div className="lg:col-span-4">
          <h2 className="t-h2">{t.blocks.trustTitle}</h2>
          <p className="t-label t-muted mt-4">{t.blocks.trustNote}</p>
        </div>
        <dl className="lg:col-span-7 lg:col-start-6">
          {t.blocks.trust.map((row) => (
            <div
              key={row.title}
              className="flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--color-rule)] py-4"
            >
              <dt className="t-label t-muted">{row.title}</dt>
              <dd className="t-nav">{row.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ─── 11. Финал ────────────────────────────────────────────────────────────
   Последний экран перед футером: только фраза и действие. Ни изображения,
   ни второй ссылки — здесь выбор должен быть один.

   Плоскость белая, хотя тёмная напрашивалась: футер и так чёрный, и две
   чёрные плоскости встык слиплись бы в одну. Белое перед чёрным даёт
   последнюю границу, а строка кеглем героя закрывает страницу тем же
   голосом, каким её открыли. */
export function FinalBlock({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const [l1, l2] = t.blocks.finalTitle.split('\n')

  return (
    <section className="sec-tall border-t border-[var(--color-rule)]">
      <div className="wrap">
        <p className="t-hero">
          {l1}
          <br />
          {l2}
        </p>
        <Link href={`/${lang}/catalog`} className="btn mt-10">
          {t.blocks.finalCta}
        </Link>
      </div>
    </section>
  )
}
