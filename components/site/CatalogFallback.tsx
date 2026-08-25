import { CONTENT } from '@/lib/content'
import { plural, type Locale } from '@/lib/i18n'
import { PRODUCTS } from '@/lib/catalog'
import { ProductCard } from '@/components/site/ProductCard'

/**
 * Каталог, отрисованный на сервере.
 *
 * CatalogView читает useSearchParams, поэтому целиком уходит на клиент, а в
 * статической разметке на его месте стоял <Suspense>. Последствий было два:
 * поисковик видел каталог без единого товара, а у живого человека футер после
 * гидратации улетал вниз — сдвиг макета 0,42 на десктопе и 0,54 на телефоне.
 *
 * Здесь лежат те же карточки в той же сетке. Это и разметка для индексации,
 * и подложка нужной высоты: клиентская сетка встаёт ровно на её место.
 *
 * Полоса управления повторена в неактивном виде — не ради вида, а ради той же
 * геометрии: без неё сетка после гидратации уезжала бы вниз на её высоту.
 * Кнопки без обработчиков отключены явно: неработающий фильтр, который
 * отзывается на нажатие, хуже отсутствующего.
 */
export function CatalogFallback({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const all = [...PRODUCTS].sort((a, b) => a.rank - b.rank)

  return (
    <>
      <div className="filter-bar">
        <div className="wrap flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:gap-x-6 sm:py-3">
          <div className="flex items-center gap-3 sm:contents">
            <div className="relative order-1 min-w-0 flex-1 sm:max-w-sm sm:flex-none sm:basis-64">
              <label className="block">
                <span className="sr-only">{t.nav.search}</span>
                <input
                  type="search"
                  disabled
                  placeholder={t.nav.searchHint}
                  className="t-nav w-full border-b border-[var(--color-rule)] bg-transparent py-2 placeholder:text-[var(--color-muted)]"
                />
              </label>
            </div>

            <p className="t-label order-4 ms-auto shrink-0 tabular-nums">
              {plural(all.length, lang, t.catalog.items)}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:contents">
            <button
              type="button"
              disabled
              className="t-nav tap order-2 shrink-0 border border-[var(--color-ink)] px-4"
            >
              {t.catalog.filters}
            </button>

            {/* Тот же вид, что у живого списка: подложке важна геометрия, а
                не поведение — после гидратации строка не должна сдвинуться. */}
            <div className="order-3 flex min-w-0 items-center gap-2">
              <span className="t-label t-muted hidden sm:inline">{t.catalog.sort}</span>
              <span className="pick">
                <button type="button" disabled className="pick-btn t-nav tap">
                  <span className="truncate">{t.catalog.sortPopular}</span>
                  <svg viewBox="0 0 10 6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" className="pick-caret">
                    <path d="M1 1l4 4 4-4" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap pt-10">
        <div className="grid grid-cols-2 content-start gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {all.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              lang={lang}
              priority={i < 4}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 22vw"
            />
          ))}
        </div>
      </div>
    </>
  )
}
