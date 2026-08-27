'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import { RATES, plural, type Locale, formatLength } from '@/lib/i18n'
import { PRODUCTS, type Category, type Variant } from '@/lib/catalog'
import { useStore } from '@/components/StoreProvider'
import { ProductCard } from '@/components/site/ProductCard'
import { SuggestRow } from '@/components/site/SuggestRow'
import { Select } from '@/components/site/Select'
import { BackToList } from '@/components/site/BackToList'
import { searchProducts, matchProduct } from '@/lib/search'

/**
 * Каталог: полоса управления, панель фильтра, сетка.
 *
 * Всё состояние живёт в query-параметрах, а не в useState: ссылка на
 * «ресницы, изгиб D, в наличии, сначала дешевле» должна открываться у другого
 * человека такой же. Отсюда одно правило на весь файл — читаем из URL,
 * пишем router.replace (не push, чтобы кнопка «назад» не разбирала историю
 * по одному чекбоксу).
 *
 * Фильтр — панель, а не колонка, и на всех экранах одинаково. Колонка
 * занимала 15rem слева от сетки на десктопе: это колонка каталога, отданная
 * под девять чекбоксов, к которым в среднем визите не притрагиваются. Панель
 * забирает столько места, сколько ей нужно, ровно на время выбора, а сетка
 * получает всю ширину — четыре товара в ряд вместо трёх с половиной.
 *
 * Цена этого решения известна: выбранное состояние перестаёт быть видно,
 * пока панель закрыта. Поэтому под полосой стоит ряд снятых фильтров — не
 * украшение, а замена той самой колонки: он показывает, что именно сейчас
 * ограничивает выдачу, и снимает ограничение одним нажатием.
 *
 * Появления (.rise) внутри сетки нет намеренно: карточки перерисовываются на
 * каждый фильтр, и анимация превратилась бы в мигание.
 */

const CATEGORIES = ['lashes', 'care', 'tools'] as const satisfies readonly Category[]
const SORTS = ['popular', 'price-asc', 'price-desc', 'new'] as const
type Sort = (typeof SORTS)[number]

/* Опции считаются из товаров: появится новый SKU — появится и вариант фильтра. */
const uniq = (xs: string[]) =>
  [...new Set(xs)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
// «—» в данных значит «длина не указана» — в списке выбора это мусор.
const LENGTHS = uniq(PRODUCTS.flatMap((p) => p.variants.map((v) => v.length))).filter(
  (l) => l !== '—',
)
const CURLS = uniq(PRODUCTS.flatMap((p) => p.variants.map((v) => v.curl))).filter(
  (c) => c !== '—',
)
const PRICE_MIN = Math.min(...PRODUCTS.map((p) => p.price))
const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.price))

/** Крестик снятия фильтра. Рисуется, а не набирается: символ × сидит на
 *  высоте строчных и уезжает вниз относительно прописного текста рядом. */
function Cross() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M1 1l6 6M7 1l-6 6" />
    </svg>
  )
}

export function CatalogView({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const qs = sp.toString()
  const { currency } = useStore()
  const sheet = useRef<HTMLDialogElement>(null)

  /* ─── Чтение состояния из URL ─────────────────────────────────────────── */
  const category = sp.get('category') ?? 'all'
  const lengths = (sp.get('length') ?? '').split(',').filter(Boolean)
  const curls = (sp.get('curl') ?? '').split(',').filter(Boolean)
  const onlyStock = sp.get('stock') === '1'
  const pmin = Number(sp.get('pmin')) || 0
  const pmax = Number(sp.get('pmax')) || 0
  const q = sp.get('q') ?? ''
  const sortParam = sp.get('sort')
  const sort: Sort = (SORTS as readonly string[]).includes(sortParam ?? '')
    ? (sortParam as Sort)
    : 'popular'

  const push = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(qs)
      mutate(p)
      const next = p.toString()
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    },
    [qs, pathname, router],
  )

  const setParam = useCallback(
    (key: string, value: string) =>
      push((p) => {
        if (value) p.set(key, value)
        else p.delete(key)
      }),
    [push],
  )

  const toggle = (key: string, value: string, current: string[]) =>
    setParam(
      key,
      (current.includes(value) ? current.filter((v) => v !== value) : [...current, value]).join(','),
    )

  /* ─── Поиск с задержкой ───────────────────────────────────────────────
     Поле держит свой текст, в URL он уходит через 250 мс после последней
     буквы. `committed` отличает наш собственный переход от внешнего
     (кнопка «назад», сброс) — иначе поле и URL зациклились бы друг на друге. */
  const [term, setTerm] = useState(q)
  const committed = useRef(q)
  const pending = term !== q

  useEffect(() => {
    if (committed.current !== q) {
      committed.current = q
      setTerm(q)
    }
  }, [q])

  useEffect(() => {
    if (term === q) return
    const id = setTimeout(() => {
      committed.current = term
      setParam('q', term)
    }, 250)
    return () => clearTimeout(id)
  }, [term, q, setParam])

  const reset = () => {
    committed.current = ''
    setTerm('')
    router.replace(pathname, { scroll: false })
  }

  /* Не больше шести строк — дальше это уже сетка ниже, а не подсказка. */
  const [focused, setFocused] = useState(false)
  const suggest = useMemo(() => (focused ? searchProducts(term, lang, 6) : []), [focused, term, lang])

  /* ─── Отбор и сортировка ──────────────────────────────────────────────
     Длина, изгиб и наличие проверяются на одном варианте, а не по товару
     целиком: «12 мм + изгиб D + в наличии» должно означать, что такой SKU
     действительно существует. */
  const found = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase(lang)
    const okVariant = (v: Variant) =>
      (lengths.length === 0 || lengths.includes(v.length)) &&
      (curls.length === 0 || curls.includes(v.curl)) &&
      (!onlyStock || v.inStock)

    const list = PRODUCTS.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (pmin === 0 || p.price >= pmin) &&
        (pmax === 0 || p.price <= pmax) &&
        matchProduct(p, needle, lang) &&
        p.variants.some(okVariant),
    )

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      // Даты у товара нет, поэтому «новинки» — это плашка new, дальше обычный порядок.
      case 'new':
        return list.sort(
          (a, b) => Number(b.badge === 'new') - Number(a.badge === 'new') || a.rank - b.rank,
        )
      default:
        return list.sort((a, b) => a.rank - b.rank)
    }
    // Списки length/curl — новые массивы на каждый рендер, поэтому в
    // зависимостях стоит строка запроса: она меняется ровно тогда же.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, qs])

  /* ─── Цена в выбранной валюте ─────────────────────────────────────────
     В URL диапазон всегда в рублях — базовой валюте прайса, иначе ссылка
     значила бы разное у покупателя в Москве и в Дубае. В поле показываем
     пересчёт, курс тот же, что у цен. */
  const rate = RATES[currency]
  const toView = (rub: number) => Math.round(rub * rate)
  const toRub = (view: number) => Math.round(view / rate)

  /* ─── Снятые фильтры ──────────────────────────────────────────────────
     Один список на все виды ограничений: у каждого есть подпись и способ
     себя снять. Категория сюда не попадает — она стоит рядом с заголовком
     раздела отдельным рядом и снимается там. */
  const active: { key: string; label: string; drop: () => void }[] = [
    ...(q ? [{ key: 'q', label: `«${q}»`, drop: () => { committed.current = ''; setTerm(''); setParam('q', '') } }] : []),
    ...lengths.map((l) => ({
      key: `length-${l}`,
      label: formatLength(l, lang),
      drop: () => toggle('length', l, lengths),
    })),
    ...curls.map((c) => ({
      key: `curl-${c}`,
      label: c,
      drop: () => toggle('curl', c, curls),
    })),
    ...(onlyStock
      ? [{ key: 'stock', label: t.catalog.inStock, drop: () => setParam('stock', '') }]
      : []),
    ...(pmin ? [{ key: 'pmin', label: `${t.catalog.from} ${toView(pmin)}`, drop: () => setParam('pmin', '') }] : []),
    ...(pmax ? [{ key: 'pmax', label: `${t.catalog.to} ${toView(pmax)}`, drop: () => setParam('pmax', '') }] : []),
  ]

  const dirty = qs.length > 0

  const field = 'w-full border-b border-[var(--color-rule-ink)] bg-transparent py-2 outline-offset-4'
  const box = 'h-4 w-4 shrink-0 accent-[var(--color-ink)]'

  const filters = (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="t-label">{t.catalog.category}</legend>
        <div className="mt-3 flex flex-col gap-2">
          {(['all', ...CATEGORIES] as const).map((c) => (
            <label key={c} className="flex items-center gap-3">
              <input
                type="radio"
                name="category"
                className={box}
                checked={category === c}
                onChange={() => setParam('category', c === 'all' ? '' : c)}
              />
              <span className="t-label">{c === 'all' ? t.home.all : t.nav[c]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Длина и изгиб — числа, и выбирать их удобнее строкой значений, чем
          столбиком чекбоксов: в панели шириной 30rem они встают в три ряда
          вместо девяти строк. */}
      <fieldset>
        <legend className="t-label">{t.catalog.length}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {LENGTHS.map((l) => (
            <button
              key={l}
              type="button"
              className="chip"
              aria-pressed={lengths.includes(l)}
              onClick={() => toggle('length', l, lengths)}
            >
              {formatLength(l, lang)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="t-label">{t.catalog.curl}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {CURLS.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={curls.includes(c)}
              onClick={() => toggle('curl', c, curls)}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Пока прайса нет, у всех товаров цена 0, и диапазон ничего не
          отбирает. Показывать поле, которое заведомо ничего не делает, хуже,
          чем не показывать: оно обещает работу. Появятся цены — граница
          разойдётся, и фильтр вернётся сам. */}
      {PRICE_MAX > PRICE_MIN ? (
      <fieldset>
        <legend className="t-label">{`${t.catalog.price}, ${currency}`}</legend>
        {/* Значение уходит в URL по потере фокуса, а не на каждую цифру:
            иначе «2490» означало бы четыре разных фильтра подряд. */}
        <div className="mt-3 flex items-end gap-4">
          {(
            [
              ['pmin', t.catalog.from, pmin, PRICE_MIN],
              ['pmax', t.catalog.to, pmax, PRICE_MAX],
            ] as const
          ).map(([key, label, value, bound]) => (
            <label key={key} className="flex-1">
              <span className="t-label t-muted">{label}</span>
              <input
                key={`${key}-${value}-${currency}`}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                defaultValue={value ? toView(value) : ''}
                placeholder={String(toView(bound))}
                className={`${field} t-nav tabular-nums`}
                onBlur={(e) =>
                  setParam(key, e.target.value ? String(toRub(Number(e.target.value))) : '')
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                }}
              />
            </label>
          ))}
        </div>
      </fieldset>
      ) : null}

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className={box}
          checked={onlyStock}
          onChange={(e) => setParam('stock', e.target.checked ? '1' : '')}
        />
        <span className="t-label">{t.catalog.inStock}</span>
      </label>
    </div>
  )

  return (
    <>
      <div className="filter-bar on-ink">
        {/* Две строки на телефоне и одна на десктопе, без дублирования
            разметки: `sm:contents` растворяет обёртки, и четыре элемента
            становятся прямыми детьми полосы. Порядок на широком экране
            задаётся order, а не перестановкой в разметке, — иначе тот же
            блок пришлось бы писать дважды. */}
        <div className="wrap flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:gap-x-6 sm:py-3">
          <div className="sm:contents">
            {/* Поиск занимает всю первую строку: подсказка «название, длина,
                изгиб» длиннее половины экрана, и рядом с ней обрезалось
                и поле, и то, что стояло справа. Число найденного
                уехало во вторую строку, к фильтру и сортировке — там оно и
                читается как итог их работы. */}
            <div className="relative order-1 min-w-0 flex-1 sm:max-w-sm sm:flex-none sm:basis-64">
              <label className="block">
                <span className="sr-only">{t.nav.search}</span>
                <input
                  type="search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 120)}
                  placeholder={t.nav.searchHint}
                  className={`${field} t-nav`}
                />
              </label>

              {/* Подсказки перекрывают сетку, а не раздвигают её: полоса
                  липкая, и рост её высоты сдвигал бы весь каталог под ней. */}
              {suggest.length > 0 ? (
                <ul
                  className="absolute inset-x-0 top-full z-10 max-h-[60dvh] overflow-y-auto border border-[var(--color-rule)] bg-[var(--color-paper)]"
                  aria-label={t.search.suggestions}
                >
                  {suggest.map((p) => (
                    <li key={p.id} className="border-b border-[var(--color-rule)] last:border-b-0">
                      <Link href={`/${lang}/product/${p.slug}`} className="block px-3">
                        <SuggestRow product={p} lang={lang} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:contents">
            <button
              type="button"
              className="t-nav tap order-2 shrink-0 border border-current px-3 sm:px-4"
              onClick={() => sheet.current?.showModal()}
            >
              {t.catalog.filters}
              {active.length ? <span className="ms-2 tabular-nums">{active.length}</span> : null}
            </button>

            <div className="order-3 min-w-0">
              <Select
                label={t.catalog.sort}
                labelHidden="mobile"
                value={sort}
                onChange={(v) => setParam('sort', v === 'popular' ? '' : v)}
                options={[
                  { value: 'popular', label: t.catalog.sortPopular },
                  { value: 'price-asc', label: t.catalog.sortPriceUp },
                  { value: 'price-desc', label: t.catalog.sortPriceDown },
                  { value: 'new', label: t.catalog.sortNew },
                ]}
              />
            </div>

            <p
              className="t-label order-4 ms-auto shrink-0 tabular-nums"
              aria-live="polite"
              aria-busy={pending}
            >
              {pending ? `${t.nav.search}…` : plural(found.length, lang, t.catalog.items)}
            </p>
          </div>
        </div>

        {active.length ? (
          <div className="wrap flex flex-wrap items-center gap-2 border-t border-[var(--color-rule-ink)] py-3">
            <span className="t-label t-muted me-2">{t.catalog.active}</span>
            {active.map((f) => (
              <button
                key={f.key}
                type="button"
                className="chip-active"
                onClick={f.drop}
                aria-label={`${t.catalog.removeFilter}: ${f.label}`}
              >
                {f.label}
                <Cross />
              </button>
            ))}
            <button type="button" className="lnk t-label tap-sm ms-2" onClick={reset}>
              {t.catalog.reset}
            </button>
          </div>
        ) : null}
      </div>

      {/* Разделы каталога не уводят на отдельные страницы, а подводят к этой
          же сетке — и оставляют человека внизу длинного списка. Кнопка
          возвращает к его началу, где стоят и заголовок, и фильтр. */}
      <BackToList label={t.catalog.toList} />

      <div className="wrap anchor-grid pt-10" id="catalog">
        <h2 className="sr-only">{t.catalog.found}</h2>

        {found.length > 0 ? (
          <div
            className="grid grid-cols-12 content-start gap-x-[var(--col-gap)] gap-y-12"
            style={{
              opacity: pending ? 0.5 : 1,
              transition: 'opacity var(--dur-fast) var(--ease-brand)',
            }}
          >
            {found.map((p, i) => (
              <div key={p.id} className="col-span-6 md:col-span-4 lg:col-span-3">
                <ProductCard
                  product={p}
                  lang={lang}
                  priority={i < 4}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 22vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-[var(--color-rule)] py-20 text-center">
            <p className="t-h3">{t.catalog.empty}</p>
            <p className="t-label t-muted mx-auto mt-4 max-w-xs">{t.catalog.emptyHint}</p>
            <button type="button" className="btn btn-ghost mt-8" onClick={reset} disabled={!dirty}>
              {t.catalog.reset}
            </button>
          </div>
        )}
      </div>

      {/* Панель фильтра. Закрывается по Esc (нативно), нажатием вне карточки
          и кнопкой «Показать». Выбор применяется сразу, поэтому «Показать» —
          это закрыть панель, а не подтвердить: отменять нечего. */}
      <dialog
        ref={sheet}
        aria-label={t.catalog.filters}
        onClick={(e) => {
          if (e.target === sheet.current) sheet.current?.close()
        }}
        className="drawer"
      >
        <div className="flex h-full max-h-[88dvh] flex-col lg:max-h-none">
          <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-[var(--gutter)] py-4 lg:px-8">
            <h2 className="t-label">{t.catalog.filters}</h2>
            <button type="button" className="t-nav lnk py-2" onClick={() => sheet.current?.close()}>
              {t.nav.close}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-[var(--gutter)] py-6 lg:px-8">
            {filters}
          </div>

          <div className="safe-bottom flex items-center gap-4 border-t border-[var(--color-rule)] px-[var(--gutter)] pt-4 lg:px-8 lg:pb-6">
            <button type="button" className="btn flex-1" onClick={() => sheet.current?.close()}>
              {`${t.catalog.apply} (${found.length})`}
            </button>
            <button
              type="button"
              className="lnk t-label tap-sm disabled:pointer-events-none disabled:opacity-40"
              onClick={reset}
              disabled={!dirty}
            >
              {t.catalog.reset}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
