# Next.js 16.2.10 — памятка для статичного маркетингового сайта (App Router)

Всё ниже проверено по локальным докам в `/home/coder/novi/node_modules/next/dist/docs/`.
Далее пути даю относительно этой папки (сокращённо `docs/`).
Если чего-то нет — явно написано «в доках не найдено».

Установлено в репо (`/home/coder/novi/package.json`): next 16.2.10, react 19.2.4, tailwindcss ^4 (реально 4.3.2), @tailwindcss/postcss ^4, eslint-config-next 16.2.10.

---

## 1. Структура проекта и обязательные файлы

Источник: `docs/01-app/01-getting-started/01-installation.md`, `docs/01-app/01-getting-started/02-project-structure.md`, `docs/01-app/03-api-reference/03-file-conventions/layout.md`

Обязательный минимум App Router:

- `app/layout.tsx` — **root layout, обязателен**, должен содержать `<html>` и `<body>`.
- `app/page.tsx` — главная страница `/`.
- `public/` — статические ассеты (опционально), доступны от `/`.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

Правила root layout (`docs/.../file-conventions/layout.md`, раздел «Root Layout»):

- Обязан определять `<html>` и `<body>`.
- **Нельзя** руками добавлять `<head>`, `<title>`, `<meta>` — только Metadata API.
- Можно несколько root layout'ов (через route groups `app/(marketing)/layout.js`); переход между разными root layout'ами = полная перезагрузка страницы.
- Если root layout забыт, `next dev` создаст его автоматически.

Файловые конвенции роутинга: `layout`, `page`, `loading`, `not-found`, `error`, `global-error`, `route`, `template`, `default` (`docs/01-app/01-getting-started/02-project-structure.md`).

Роут-группы `(group)` не влияют на URL; приватные папки `_components`, `_lib` не роутятся — удобно для компонентов лендинга.

Топ-левел файлы: `next.config.js|mjs|ts`, `package.json`, `proxy.ts` (**бывший `middleware.ts`**), `eslint.config.mjs`, `tsconfig.json`, `next-env.d.ts`.
`next.config.cjs` / `.cts` **не поддерживаются** (`docs/01-app/03-api-reference/05-config/01-next-config-js/index.md`).

Требования (`docs/01-app/02-guides/upgrading/version-16.md`): Node.js **>= 20.9**, TypeScript **>= 5.1**, браузеры Chrome/Edge/Firefox 111+, Safari 16.4+.

### Минимальный next.config.ts

Источник: `docs/01-app/03-api-reference/05-config/01-next-config-js/index.md`

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* для простого лендинга ничего не нужно */
}

export default nextConfig
```

Что убрано/переехало в 16.x (`docs/01-app/02-guides/upgrading/version-16.md`):

| Было (15) | Стало (16) |
| --- | --- |
| `experimental.turbopack` | top-level `turbopack: {}` |
| `experimental.ppr` / `experimental_ppr` | удалено; вместо него `cacheComponents: true` |
| `experimental.dynamicIO`, `experimental.useCache` | deprecated → `cacheComponents: true` |
| `experimental.adapterPath` | top-level `adapterPath` (стабильно с 16.2.0) |
| `eslint: {}` | **удалено** |
| `amp: {}` | **удалено** (весь AMP вырезан, `next/amp` тоже) |
| `serverRuntimeConfig` / `publicRuntimeConfig` | **удалены**, только env-переменные |
| `skipMiddlewareUrlNormalize` | `skipProxyUrlNormalize` |
| `images.domains` | deprecated → `images.remotePatterns` |
| `devIndicators.appIsrStatus / buildActivity / buildActivityPosition` | удалены |
| `unstable_rootParams` | удалена, замены пока нет |

Кодмод для автомиграции: `npx @next/codemod@canary upgrade latest`.

---

## 2. Metadata API

Источники: `docs/01-app/01-getting-started/14-metadata-and-og-images.md`, `docs/01-app/03-api-reference/04-functions/generate-metadata.md`, `docs/01-app/03-api-reference/04-functions/generate-viewport.md`

**Главное: `metadata` и `generateMetadata` работают только в Server Components.** В файле с `'use client'` они не сработают.

Всегда добавляются автоматически (руками не писать):

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Статические метаданные

```tsx
// app/layout.tsx | app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.ru'),
  title: {
    default: 'Ресничные студии',
    template: '%s | Студия',
  },
  description: '...',
  keywords: ['ресницы', 'наращивание'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Студия',
    description: '...',
    url: 'https://example.ru',
    siteName: 'Студия',
    locale: 'ru_RU',
    type: 'website',
    images: ['/og-image.png'], // относительный путь ок, если задан metadataBase
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}
```

`metadataBase` (`generate-metadata.md`, «metadataBase»): относительный путь в URL-полях **без** `metadataBase` = ошибка сборки. Ставить в root layout.

### generateMetadata

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params           // params — Promise!
  return { title: slug }
}
```

Дедупликация запросов между `generateMetadata` и страницей — через React `cache()` (`14-metadata-and-og-images.md`, «Memoizing data requests»).

### Viewport — ОТДЕЛЬНЫЙ экспорт, не часть metadata

Источник: `docs/01-app/03-api-reference/04-functions/generate-viewport.md`

```tsx
// app/layout.tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}
```

- Нельзя экспортировать одновременно `viewport` и `generateViewport` из одного сегмента.
- Только Server Components.
- Дефолтный viewport-мета уже проставлен, ручная настройка обычно не нужна.

### Депрекейты в metadata

Источник: `generate-metadata.md`, разделы `themeColor`, `colorScheme`, `viewport` + Version History:

- `metadata.themeColor` — **deprecated с Next 14** → `viewport`
- `metadata.colorScheme` — **deprecated с Next 14** → `viewport`
- `metadata.viewport` — **deprecated с Next 14** → `viewport`
- Кодмод: `metadata-to-viewport-export`

Не поддерживаются Metadata API (рендерить руками в layout/page): `<meta http-equiv>`, `<base>`, `<noscript>`, `<style>`, `<script>`, `<link rel="stylesheet">`. Для `preload`/`preconnect`/`dns-prefetch` — методы `ReactDOM` (`generate-metadata.md`, «Resource hints»).

### Иконки и OG — файловые конвенции (рекомендованы вместо `metadata.icons`)

Источники: `docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md`, `.../opengraph-image.md`

| Файл | Где | Форматы |
| --- | --- | --- |
| `favicon.ico` | только `app/` | `.ico` |
| `icon.*` | `app/**/*` | `.ico .jpg .jpeg .png .svg` |
| `apple-icon.*` | `app/**/*` | `.jpg .jpeg .png` |
| `opengraph-image.*` | любой сегмент | `.jpg .jpeg .png .gif` (макс 8 МБ) |
| `twitter-image.*` | любой сегмент | те же (макс 5 МБ) |
| `opengraph-image.alt.txt` | рядом с картинкой | `.txt` |

Несколько иконок — суффиксом: `icon1.png`, `icon2.png`.

Динамическая OG-картинка — `opengraph-image.tsx` + `ImageResponse` из `next/og`; поддерживается только flexbox и подмножество CSS (**`display: grid` не работает**).

`robots.txt` / `sitemap.xml` — статические файлы в корне `app/` или `robots.ts` / `sitemap.ts` с `MetadataRoute.Robots` / `MetadataRoute.Sitemap` (`.../metadata/robots.md`, `.../metadata/sitemap.md`).

---

## 3. Шрифты — `next/font`

Источники: `docs/01-app/01-getting-started/13-fonts.md`, `docs/01-app/03-api-reference/02-components/font.md`

Пакет называется **`next/font`**, встроен, ставить ничего не надо. `@next/font` переименован в `next/font` ещё в **v13.2.0** (font.md, Version Changes) — в 16.x `@next/font` использовать нельзя.

Импорты: `next/font/google` и `next/font/local`. Google Fonts скачиваются на этапе сборки и **self-host'ятся**, запросов к Google из браузера нет.

### Google Font + CSS-переменная + Tailwind v4

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],       // добавь 'cyrillic' для русского текста
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${robotoMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
```

```css
/* app/globals.css */
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-roboto-mono);
}
```

(`font.md`, разделы «With Tailwind CSS» и «Tailwind CSS v3» — для v3 всё ещё `tailwind.config.js` с `fontFamily`.)

### Локальный шрифт

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/my-font.woff2',   // путь относительно файла, где вызван localFont
  display: 'swap',
  variable: '--font-my',
})
```

Несколько начертаний одной семьи:

```js
const roboto = localFont({
  src: [
    { path: './Roboto-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Roboto-Italic.woff2',  weight: '400', style: 'italic' },
    { path: './Roboto-Bold.woff2',    weight: '700', style: 'normal' },
  ],
})
```

### Опции (font.md, «Reference»)

| Опция | google | local | Заметки |
| --- | --- | --- | --- |
| `src` | — | **обяз.** | строка или массив объектов |
| `weight` | ✔ | ✔ | **обязателен, если шрифт НЕ variable**; `'400'`, `'100 900'`, `['400','700']` |
| `style` | ✔ | ✔ | `'normal'` по умолчанию |
| `subsets` | ✔ | — | инжектит `<link rel=preload>` при `preload: true` |
| `axes` | ✔ | — | доп. оси variable-шрифта (по умолчанию только `wght`) |
| `display` | ✔ | ✔ | **по умолчанию `'swap'`**; `auto\|block\|swap\|fallback\|optional` |
| `preload` | ✔ | ✔ | по умолчанию `true` |
| `fallback` | ✔ | ✔ | массив строк |
| `adjustFontFallback` | ✔ | ✔ | google: boolean (default `true`); local: `'Arial'` (default) / `'Times New Roman'` / `false` |
| `variable` | ✔ | ✔ | имя CSS-переменной, напр. `'--font-inter'` |
| `declarations` | — | ✔ | доп. дескрипторы `@font-face` |

Три способа применения: `font.className`, `font.style` (объект с `fontFamily`), CSS-переменная `font.variable`.

Имена из нескольких слов — через нижнее подчёркивание: `Roboto_Mono`.
Рекомендация доков — variable-шрифты (тогда `weight` не нужен).

---

## 4. `next/image`

Источники: `docs/01-app/01-getting-started/12-images.md`, `docs/01-app/03-api-reference/02-components/image.md`, `docs/01-app/02-guides/upgrading/version-16.md`

Обязательные пропсы: **`src`** и **`alt`**.
`width` + `height` обязательны **кроме** случаев: статический импорт или `fill`.

```tsx
import Image from 'next/image'

// из public/
<Image src="/profile.png" alt="..." width={500} height={500} />

// статический импорт — width/height/blurDataURL подставятся сами
import hero from './hero.jpg'
<Image src={hero} alt="..." placeholder="blur" />

// адаптивная картинка из статического импорта
<Image src={hero} alt="..." sizes="100vw" style={{ width: '100%', height: 'auto' }} />

// fill — родитель обязан иметь position: relative | fixed | absolute
<div className="relative aspect-[16/9]">
  <Image src="/bg.jpg" alt="" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
</div>
```

Поведение по умолчанию:

- `loading="lazy"`, `placeholder="empty"`, `quality=75`, `preload={false}`.
- Без `sizes` браузер считает картинку шириной `100vw` и Next генерирует урезанный `srcset` (1x/2x). С `sizes` — полный `srcset` (640w, 750w…). `sizes` нужен при `fill` и при CSS-адаптивности.
- `width`/`height` задают **соотношение сторон**, а не отрисованный размер — размер задаётся CSS.

### Что изменилось в 16.x (breaking)

- **`priority` DEPRECATED** → новый проп **`preload`** (`image.md`, «priority» + Version History `v16.0.0`). Доки прямо советуют в большинстве случаев вместо `preload` использовать `loading="eager"` или `fetchPriority="high"`. Для LCP-героя: `preload` или `loading="eager"`.
- `images.qualities` по умолчанию `[75]` (раньше — любые). Другой `quality` схлопнется к ближайшему разрешённому; нужен список — прописать `images: { qualities: [50, 75, 100] }`.
- `images.minimumCacheTTL`: 60 сек → **4 часа (14400)**.
- Из `images.imageSizes` убрано значение `16`.
- Локальные `src` с query-строкой требуют `images.localPatterns` с полем `search`.
- `images.maximumRedirects`: было безлимитно → **3**.
- `images.dangerouslyAllowLocalIP` — новый флаг, по умолчанию локальные IP оптимизировать нельзя.
- `next/legacy/image` — deprecated.
- `images.domains` — deprecated, только `remotePatterns`.
- `onLoadingComplete` — deprecated (с v14), использовать `onLoad`.

### SVG

`image.md`, «dangerouslyAllowSVG»: Next по умолчанию **не оптимизирует SVG**. Специальной настройки в конфиге для локальных SVG **не требуется** — доки рекомендуют `unoptimized`, и это **происходит автоматически, когда `src` заканчивается на `.svg`**:

```tsx
<Image src="/logo.svg" alt="" width={120} height={40} />   // сам станет unoptimized
```

`dangerouslyAllowSVG: true` нужен только чтобы прогонять SVG через оптимизатор; тогда обязательно добавить:

```ts
images: {
  dangerouslyAllowSVG: true,
  contentDispositionType: 'attachment',
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}
```

Для чистого лендинга проще: SVG-иконки — инлайном как React-компоненты или обычным `<img>`/`<Image unoptimized>`.

Удалённые картинки — только через `images.remotePatterns`.

---

## 5. Server / Client Components

Источники: `docs/01-app/01-getting-started/05-server-and-client-components.md`, `docs/01-app/03-api-reference/01-directives/use-client.md`, `docs/01-app/02-guides/lazy-loading.md`

По умолчанию все layouts и pages — **Server Components**.

Client Component нужен, когда есть (`05-server-and-client-components.md`):

- состояние и обработчики событий (`onClick`, `onChange`)
- `useEffect` и прочая lifecycle-логика
- браузерные API: `window`, `localStorage`, `IntersectionObserver`, `Navigator`
- кастомные хуки

`'use client'` ставится **самой первой строкой файла, до импортов**.

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

Ключевые правила:

- `'use client'` — это **граница** между серверным и клиентским модульными графами. Всё, что файл импортирует и рендерит напрямую, уезжает в клиентский бандл. Внутренним компонентам директиву дублировать не надо.
- Server Components, переданные как `children`/props в Client Component, **не** попадают в клиентский граф — рендерятся на сервере и вставляются готовым результатом. Это главный приём композиции.
- Пропсы Client Component должны быть **сериализуемыми** — функцию из Server Component передать нельзя.
- `metadata` / `generateMetadata` / `viewport` / `generateViewport` — **только в Server Components**.

### Анимации на скролле — как изолировать

В доках нет отдельного рецепта про scroll-анимации («в доках не найдено»). Из того, что есть, следует шаблон: страница остаётся серверной, а анимируемая обёртка — маленький Client Component.

```tsx
// app/(marketing)/page.tsx  — Server Component
import Reveal from './_components/reveal'

export default function Page() {
  return (
    <Reveal>
      {/* это остаётся Server Component: как children в клиентский граф не попадает */}
      <section>…тяжёлый статичный контент…</section>
    </Reveal>
  )
}
```

```tsx
// app/(marketing)/_components/reveal.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

export default function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), {
      rootMargin: '0px 0px -10% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} data-shown={shown}>
      {children}
    </div>
  )
}
```

Если анимационная библиотека тяжёлая — ленивая загрузка (`02-guides/lazy-loading.md`):

```tsx
'use client'
import dynamic from 'next/dynamic'
const Heavy = dynamic(() => import('./heavy'), { ssr: false })
```

`ssr: false` работает **только внутри Client Component** — вынести его в клиентский файл.

### Скролл: breaking change 16.x

`docs/01-app/02-guides/upgrading/version-16.md`, «Scroll Behavior Override»: раньше Next при SPA-навигации временно подменял `scroll-behavior: smooth` на `auto`. **В 16 больше не подменяет.** Если нужно старое поведение (мгновенный скролл наверх при переходе, при глобальном `scroll-behavior: smooth`):

```tsx
<html lang="ru" data-scroll-behavior="smooth">
```

---

## 6. CSS

Источник: `docs/01-app/01-getting-started/11-css.md`

### Глобальный CSS

```tsx
// app/layout.tsx
import './globals.css'
```

Импортировать можно в любом layout/page/компоненте внутри `app`, но доки предупреждают: стили не снимаются при навигации между роутами → возможны конфликты. Рекомендация — держать глобалку действительно глобальной и импортировать в корне.

### CSS Modules

```css
/* app/blog/blog.module.css */
.blog { padding: 24px; }
```

```tsx
import styles from './blog.module.css'
export default function Page() { return <main className={styles.blog} /> }
```

### Tailwind

Ожидается **Tailwind v4** (в доках именно v4-схема, для v3 есть отдельный гайд `docs/01-app/02-guides/tailwind-v3-css.md`). Установлено в репо: `tailwindcss@4.3.2`.

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

```js
// postcss.config.mjs — в КОРНЕ проекта
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

```css
/* app/globals.css */
@import 'tailwindcss';
```

Никакого `tailwind.config.js` и директив `@tailwind base/components/utilities` в v4-схеме доков нет — только `@import 'tailwindcss'` и `@theme inline { ... }` для токенов.

Где лежит postcss-конфиг: `postcss.config.mjs` в корне проекта. Turbopack по умолчанию ищет конфиг сначала в корне; поведение «ближайший к CSS-файлу» включается флагом `experimental.turbopackLocalPostcssConfig` (`docs/.../next-config-js/turbopackLocalPostcssConfig.md`, введён в v16.3.0 — **в нашей 16.2.10 его, скорее всего, ещё нет**).

### Порядок CSS

Порядок определяется порядком импортов. Рекомендации доков: держать импорты стилей в одном входном файле, отключить авто-сортировку импортов (`sort-imports`), проверять итоговый порядок именно на `next build`. Опция `cssChunking` в next.config для контроля чанкинга.

Sass: `docs/01-app/02-guides/sass.md`; в Turbopack **не работает legacy-префикс `~`** в `@import` из `node_modules` — писать `@import 'bootstrap/dist/css/bootstrap.min.css'` (version-16.md, «Sass node_modules imports»). `sass-loader` поднят до v16 (modern Sass API).

---

## 7. Скрипты запуска и сборки

Источники: `docs/01-app/01-getting-started/01-installation.md`, `docs/01-app/03-api-reference/06-cli/next.md`, `docs/01-app/02-guides/upgrading/version-16.md`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

- **Turbopack — бандлер по умолчанию** и для `next dev`, и для `next build`. Флаг `--turbopack` больше не нужен (и `--turbo` — просто алиас).
- Отказаться от Turbopack: `next dev --webpack` / `next build --webpack`.
- **Если в проекте есть кастомный `webpack` конфиг, `next build` упадёт** (защита от рассинхрона). Варианты: `--turbopack` (игнорировать webpack-конфиг), мигрировать на `turbopack` опции, или `--webpack`.
- `next dev` теперь пишет в **`.next/dev`**, а `next build` — в `.next`, поэтому их можно гонять параллельно. Лок-файл не даёт запустить два `next dev` на одном проекте.
- В `next dev` конфиг загружается один раз; `process.argv` больше **не** содержит `'dev'` (для `build`/`typegen` содержит). Проверять `process.env.NODE_ENV === 'development'`.
- **`next lint` удалён**, `next build` больше не линтит. Линтер запускать отдельным npm-скриптом (ESLint или Biome). `@next/eslint-plugin-next` по умолчанию — flat config.
- Из вывода `next build` **убраны метрики `size` и `First Load JS`**.
- Полезные команды: `next typegen` (генерит `PageProps` / `LayoutProps` / `RouteContext`), `next experimental-analyze`, `next info`.
- Флаги `next dev`: `-p/--port`, `-H/--hostname`, `--experimental-https`.
- Флаги `next build`: `--debug`, `--profile`, `--experimental-app-only`, `--debug-prerender`, `--debug-build-paths=<patterns>`.
- С `npm run` флаги передавать через `--` (`npm run build -- --webpack`); для pnpm/yarn/bun не нужно.

Фильсистемный кэш Turbopack в dev (beta): `experimental.turbopackFileSystemCacheForDev: true`.

---

## 8. Заметные breaking changes / deprecations 16.x (релевантные лендингу)

Источник: `docs/01-app/02-guides/upgrading/version-16.md` (если не указано иное)

1. **Async Request APIs — синхронный доступ полностью удалён.** `cookies()`, `headers()`, `draftMode()`, а также `params` в `layout/page/route/default/opengraph-image/twitter-image/icon/apple-icon` и `searchParams` в `page` — **только Promise**.
   ```tsx
   export default async function Page(props: PageProps<'/blog/[slug]'>) {
     const { slug } = await props.params
     const query = await props.searchParams
   }
   ```
   `PageProps` / `LayoutProps` / `RouteContext` — глобальные, импорт не нужен, генерятся при `next dev`/`next build`/`next typegen` (`docs/.../file-conventions/page.md`, «Page Props Helper»).
2. **`params` и `id` в генераторах картинок — тоже Promise**: `opengraph-image`, `twitter-image`, `icon`, `apple-icon` (`export default async function Image({ params, id }) { const { slug } = await params }`). При этом `generateImageMetadata` получает `params` **синхронно**.
3. `sitemap`-генератор получает `id` как Promise (`generateSitemaps` возвращает `id` по-старому).
4. **`middleware.ts` → `proxy.ts`**, функция `middleware` → `proxy`. Edge runtime в `proxy` не поддерживается (только nodejs). Конфиг-флаги переименованы (`skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`).
5. **Route Segment Config урезан.** В `docs/.../03-file-conventions/02-route-segment-config/index.md` таблица теперь содержит только `dynamicParams`, `runtime`, `preferredRegion`, `maxDuration`. `dynamic`, `revalidate`, `fetchCache` **удалены, когда включён `cacheComponents`**; описание старой модели вынесено в `docs/01-app/02-guides/caching-without-cache-components.md`. `export const experimental_ppr` удалён.
6. **`revalidateTag('tag')` требует второй аргумент** — профиль cacheLife: `revalidateTag('posts', 'max')`. Односначная форма даёт ошибку TypeScript. Новые API: `updateTag()` (read-your-writes, только Server Actions), `refresh()`.
7. `cacheLife` / `cacheTag` стабилизированы — префикс `unstable_` убрать.
8. **Link**: ломающих изменений в 16 нет; в `v16.2.0` добавлен проп `transitionTypes` (`docs/.../02-components/link.md`, Version History). Дефолт `prefetch` — `"auto"`/`null`; prefetch работает **только в production**. Роутинг в 16 переписан: дедупликация layout'ов и инкрементальный prefetch — кода менять не надо, но запросов prefetch станет больше при меньшем общем объёме.
9. **Script**: изменений в 16 в Version History нет (`docs/.../02-components/script.md` — последняя запись v13.0.0). Стратегии те же: `beforeInteractive` (только в root layout), `afterInteractive` (default), `lazyOnload`, `worker` (experimental).
10. **Scroll behavior**: см. п.5 раздела 5 — нужен `data-scroll-behavior="smooth"` на `<html>`.
11. Все параллельные слоты требуют явный `default.js`, иначе сборка падает.
12. React 19.2 (canary в App Router): доступны `<ViewTransition>`, `useEffectEvent`, `<Activity>`.
13. React Compiler стабилен, но **выключен по умолчанию**: `reactCompiler: true` + `npm i -D babel-plugin-react-compiler`. Доки предупреждают: сборка станет медленнее (Babel).
14. Удалены: AMP, `next lint`, `serverRuntimeConfig`/`publicRuntimeConfig`, `unstable_rootParams`, часть `devIndicators`.

---

## 9. Как отдавать статичный сайт в 16.x

Источники: `docs/01-app/02-guides/static-exports.md`, `docs/01-app/02-guides/public-static-pages.md`, `docs/01-app/02-guides/caching-without-cache-components.md`

### Нужен ли `export const dynamic`?

**Нет.** Страница без обращений к request-time API и без нестабильных данных пререндерится статически автоматически. `docs/01-app/02-guides/public-static-pages.md` показывает это буквально: обычный компонент без входов, `next build` → `○ (Static) prerendered as static content`, «даже без явной конфигурации».

`export const dynamic = 'force-static' | 'error' | 'force-dynamic'` **всё ещё существует**, но описан уже как «предыдущая модель» в `docs/01-app/02-guides/caching-without-cache-components.md` и **удаляется при включённом `cacheComponents`**. Для маркетингового лендинга не нужен. Единственный практичный сценарий — `dynamic = 'error'` как страховка «упасть, если что-то сделало страницу динамической».

### Что делать, если на странице есть внешние данные

Из `public-static-pages.md`: как только вы `await`-ите некэшированные данные вне `<Suspense>`, Next выдаёт warning `blocking-route` — роут не пререндерится. Два выхода:

- закэшировать компонент директивой `'use cache'` (требует `cacheComponents: true`) — он пререндерится вместе со страницей;
- обернуть в `<Suspense>` — он застримится, остальное останется статикой (PPR).

```tsx
async function ProductList() {
  'use cache'
  const products = await db.product.findMany()
  return <List items={products} />
}
```

### `output: 'export'` — есть, если нужен чистый HTML/CSS/JS

`docs/01-app/02-guides/static-exports.md`:

```js
// next.config.js
const nextConfig = {
  output: 'export',
  // trailingSlash: true,          // /me -> /me/, /me.html -> /me/index.html
  // skipTrailingSlashRedirect: true,
  // distDir: 'dist',              // по умолчанию out
}
```

`next build` кладёт результат в `out/`, деплоится на любой статик-хостинг.

**Что НЕ работает при `output: 'export'`** (App Router):

- динамические роуты с `dynamicParams: true` и без `generateStaticParams()`
- Route Handlers, зависящие от Request (поддержан только статический `GET`)
- `cookies()`, Proxy, rewrites, redirects, headers из конфига
- ISR, Draft Mode, Server Actions, Intercepting Routes
- **Image Optimization со стандартным loader'ом** — нужен кастомный:
  ```js
  images: { loader: 'custom', loaderFile: './my-loader.ts' }
  ```
  либо `images: { unoptimized: true }`.

Попытка использовать что-то из этого в `next dev` даст ошибку, аналогичную `export const dynamic = 'error'` в root layout.

**Для лендинга на своём VPS `output: 'export'` обычно не нужен**: обычный `next build` + `next start` уже отдаёт статически пререндеренные HTML, и при этом сохраняется оптимизация картинок. `output: 'export'` брать только если хостинг умеет отдавать исключительно статику.

Альтернатива для докера/минимального деплоя — `output: 'standalone'` (`docs/.../next-config-js/output.md`): `.next/standalone` + `server.js`; `public/` и `.next/static` копировать вручную или отдавать с CDN.
