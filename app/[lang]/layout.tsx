import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Noto_Kufi_Arabic } from 'next/font/google'
import { notFound } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import { DIR, LOCALES, isLocale } from '@/lib/i18n'
import { Reveal } from '@/components/Reveal'
import { StoreProvider } from '@/components/StoreProvider'
import { RegionGate } from '@/components/site/RegionGate'
import '../globals.css'

/* Гарнитуры присланы клиентом. Обе несут латиницу и кириллицу полностью.
   Отдаются в woff2: исходные OTF и TTF весили 251 КБ на каждый заход, после
   сжатия — 87 КБ. Оригиналы лежат рядом и остаются источником правды;
   пересобрать woff2 после правки глифов: fontTools, flavor = 'woff2'. */
const display = localFont({
  src: '../fonts/BodyText-LargeBold.woff2',
  weight: '700',
  display: 'swap',
  variable: '--font-bodytext',
})

const tenor = localFont({
  src: '../fonts/TenorSans-Regular.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-tenor',
})

/* Арабской графики в клиентских шрифтах нет ни одного глифа.
   Noto Kufi Arabic подобран по подобию нынешней пары: тот же геометрический
   широкий скелет с открытыми просветами, и одна семья закрывает обе роли —
   300 вместо Tenor Sans в описаниях, 700 вместо Body Text Large Bold
   в заголовках. */
const arabic = Noto_Kufi_Arabic({
  weight: ['300', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic-src',
  /*
    Без preload. Ссылка на предзагрузку выписывается по месту вызова загрузчика,
    а макет здесь один на три языка — и 121 КБ арабской графики уезжали вместе
    с русской и английской витринами, где не нужен ни один её глиф. Теперь файл
    тянется по обращению из стилей, то есть только там, где к элементу приложена
    переменная --font-arabic-src, — на арабской витрине.

    Обратная сторона известна: латинская пара по той же причине
    предзагружается и на арабской витрине, где её перекрывает :root:lang(ar).
    Развести это до конца можно только отдельным макетом для ar.
  */
  preload: false,
})

export const viewport: Viewport = {
  themeColor: '#faf8f5',
  colorScheme: 'light',
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = CONTENT[lang]
  return {
    // Домен ещё не выбран — до запуска берётся из переменной окружения,
    // иначе Next собирает абсолютные ссылки для Open Graph от localhost.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glass.example'),
    title: { default: t.meta.title, template: `%s — GLASS` },
    description: t.meta.description,
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: 'website',
      locale: lang === 'ar' ? 'ar_AE' : lang === 'en' ? 'en_US' : 'ru_RU',
      // Общая карточка для всех страниц, кроме карточки товара: у той свой
      // кадр. Без неё ссылка на витрину приходила в мессенджер голым текстом.
      images: [{ url: '/media/hero-portrait.jpg', width: 858, height: 1280, alt: '' }],
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      canonical: `/${lang}`,
      languages: { ru: '/ru', en: '/en', ar: '/ar' },
    },
  }
}

/* Класс js ставится до первой отрисовки: иначе контент успел бы показаться
   и тут же спрятаться под анимацию появления. */
const NO_FLASH = `document.documentElement.classList.add('js')`

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return (
    <html
      lang={lang}
      dir={DIR[lang]}
      data-scroll-behavior="smooth"
      /*
        Арабская гарнитура подключается только к арабской витрине: на ru и en
        она грузилась вместе с ними и стоила 121 КБ, которые никто не видел.
        next/font снимает и preload, когда переменной нет в разметке.
      */
      className={`${display.variable} ${tenor.variable} ${lang === 'ar' ? arabic.variable : ''}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        {/*
          THESIS: интернет-магазин GLASS, собранный по правилам самого бренда —
          чёрное и белое, весь цвет отдан товару. Отказ: от розово-золотого
          beauty-шаблона и от пёстрой витрины-маркетплейса.
          OWN-WORLD: белая бумага, чёрные чернила, плитка товара #F2F2F2. Ноль
          скруглений, ноль теней, только волосяные линейки. Body Text Large Bold
          на заголовках, Tenor Sans на описаниях — обе гарнитуры клиента.
          Хроматический цвет живёт только в плашках скидок и статусов.
          STORY: посетительница видит бренд раньше, чем товар; находит нужную
          длину и изгиб; кладёт в корзину.
          FIRST VIEWPORT: съёмка моделей клиента во всю ширину, поверх — название
          в две строки и действие в каталог.
          FORM: витрина магазина по референсу Lashify, выбранному клиентом.
          FINISH: unreviewed and undocumented is unfinished; this build ends with
          the finish review, the verdict, and DESIGN.md
        */}
        <StoreProvider locale={lang}>
          {children}
          <RegionGate lang={lang} />
        </StoreProvider>
        <Reveal />
      </body>
    </html>
  )
}
