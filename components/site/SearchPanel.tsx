'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { searchProducts } from '@/lib/search'
import { SuggestRow } from '@/components/site/SuggestRow'

/**
 * Поиск по сайту: кнопка-триггер и панель в одном компоненте — подключается
 * в шапку одной строкой.
 *
 * Панель — нативный <dialog> с showModal(): Esc, ловушка фокуса, верхний слой
 * и возврат фокуса на триггер достаются от браузера, писать их руками незачем.
 *
 * Поле — настоящий комбобокс, а не список ссылок: стрелки двигают выделение,
 * Enter открывает выделенный товар. Поэтому строки подсказок — option внутри
 * listbox, а не <a>: иначе Tab уводил бы фокус по каждой строке, и стрелки
 * пришлось бы бороться с курсором в поле.
 *
 * type="text", а не "search": по Esc браузер сначала чистит поле поиска и
 * панель не закрывается с первого нажатия.
 */

const LIMIT = 6
const LIST_ID = 'search-suggest'

export function SearchPanel({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const router = useRouter()
  const dlg = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const field = useRef<HTMLInputElement>(null)

  const [term, setTerm] = useState('')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  /* Задержка ввода: перебор дешёвый, но перерисовывать шесть карточек на
     каждую букву незачем — и состояние «идёт поиск» без неё не видно. */
  useEffect(() => {
    if (term === query) return
    const id = setTimeout(() => setQuery(term), 200)
    return () => clearTimeout(id)
  }, [term, query])

  const results = useMemo(() => searchProducts(query, lang, LIMIT), [query, lang])

  const typed = term.trim() !== ''
  const pending = term !== query
  /* Выделение зажимаем при отрисовке, а не сбрасываем эффектом: список
     короче — лишней перерисовки не будет. */
  const cur = results.length > 0 ? Math.min(active, results.length - 1) : -1
  const allHref = `/${lang}/catalog?q=${encodeURIComponent(term.trim())}`

  const close = () => dlg.current?.close()

  const go = (href: string) => {
    close()
    router.push(href)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (results.length === 0) return
      e.preventDefault() // иначе курсор прыгает в начало и конец поля
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (Math.min(i, results.length - 1) + step + results.length) % results.length)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (cur >= 0) go(`/${lang}/product/${results[cur].slug}`)
      else if (typed) go(allHref) // ничего не нашлось — уводим в каталог с запросом
    }
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="t-nav tap"
        aria-haspopup="dialog"
        onClick={() => {
          dlg.current?.showModal()
          field.current?.focus()
        }}
      >
        {t.nav.search}
      </button>

      <dialog
        ref={dlg}
        aria-label={t.nav.search}
        /* Возврат фокуса браузеры делают сами, но не все — подстраховываемся. */
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === dlg.current) close()
        }}
        className="fixed top-0 start-0 end-0 m-0 max-h-[100dvh] w-full max-w-none border-0 bg-[var(--color-paper)] p-0 text-[var(--color-ink)]"
      >
        {/* Отступ сверху обязателен: панель выезжает от нуля, и поле вставало
            вплотную к кромке окна — под адресной строкой браузера, без воздуха
            над собой. Сверху столько же, сколько высота шапки, из которой
            поиск вызывают: полоса будто остаётся на месте. */}
        <div className="wrap flex max-h-[100dvh] flex-col pt-6 lg:pt-8">
          <div className="flex items-center gap-4 border-b border-[var(--color-rule)]">
            <input
              ref={field}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls={LIST_ID}
              aria-expanded={cur >= 0}
              aria-activedescendant={cur >= 0 ? `${LIST_ID}-${cur}` : undefined}
              aria-label={t.nav.search}
              value={term}
              placeholder={t.nav.searchHint}
              onChange={(e) => {
                setTerm(e.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
              className="t-nav min-h-11 flex-1 bg-transparent py-4 outline-offset-4 placeholder:text-[var(--color-muted)]"
            />
            <button type="button" className="t-nav lnk tap" onClick={close}>
              {t.nav.close}
            </button>
          </div>

          {/* Счётчик озвучивается отдельно: постоянная область живёт в разметке
              всегда, иначе экранный диктор пропускает появившийся текст. */}
          <p className="sr-only" aria-live="polite">
            {pending ? t.search.loading : typed ? `${t.catalog.found} ${results.length}` : ''}
          </p>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {!typed ? (
              <div className="py-10" />
            ) : pending ? (
              <p className="t-label t-muted py-10">{t.search.loading}</p>
            ) : results.length === 0 ? (
              <div className="py-10">
                <p className="t-h3">{t.catalog.empty}</p>
                <p className="t-label t-muted mt-3">{t.search.emptyHint}</p>
              </div>
            ) : (
              <ul id={LIST_ID} role="listbox" aria-label={t.search.suggestions} className="py-2">
                {results.map((p, i) => (
                  <li
                    key={p.id}
                    id={`${LIST_ID}-${i}`}
                    role="option"
                    aria-selected={i === cur}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(`/${lang}/product/${p.slug}`)}
                    className={`cursor-pointer border-b border-[var(--color-rule)] px-2 ${
                      i === cur ? 'bg-[var(--color-tile)]' : ''
                    }`}
                    style={{ transition: 'background-color var(--dur-fast) var(--ease-brand)' }}
                  >
                    <SuggestRow product={p} lang={lang} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {typed ? (
            <div className="border-t border-[var(--color-rule)]">
              <Link href={allHref} className="t-nav lnk tap py-2" onClick={close}>
                {t.search.all}
              </Link>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  )
}
