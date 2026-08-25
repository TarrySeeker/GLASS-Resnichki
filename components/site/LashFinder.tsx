'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import { formatLength, type Locale } from '@/lib/i18n'
import { PRODUCTS } from '@/lib/catalog'

/**
 * Подбор по длине и изгибу.
 *
 * Ресницы выбирают по двум числам, и до сих пор эти два числа жили только
 * в каталоге — девятью текстовыми чекбоксами в боковой колонке, куда ещё надо
 * добраться. Четыре готовых образа выше отвечают на вопрос «какой эффект»;
 * этот ряд отвечает на «какие именно», не уводя со страницы.
 *
 * Считает по тем же данным, что и каталог, поэтому число под кнопкой всегда
 * совпадает с тем, что покупатель увидит после перехода. Пустой выбор — это
 * весь каталог ресниц, а не ноль: строка не должна выглядеть сломанной до
 * первого нажатия.
 *
 * На самой странице каталога вести некуда — сетка уже под ним. Там подбор
 * проставляет фильтр на месте и возвращает к сетке: `mode="apply"`. Уводить
 * человека на ту же страницу, где он стоит, значило бы отнять у него весь
 * набранный контекст ради перезагрузки.
 */
const uniq = (xs: string[]) =>
  [...new Set(xs)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

const LASHES = PRODUCTS.filter((p) => p.category === 'lashes')
const LENGTHS = uniq(LASHES.flatMap((p) => p.variants.map((v) => v.length))).filter((l) => l !== '—')
const CURLS = uniq(LASHES.flatMap((p) => p.variants.map((v) => v.curl))).filter((c) => c !== '—')

export function LashFinder({
  lang,
  mode = 'link',
  standalone = false,
}: {
  lang: Locale
  /** 'link' — уйти в каталог, 'apply' — проставить фильтр на этой же странице. */
  mode?: 'link' | 'apply'
  /**
   * Отдельный блок страницы, а не хвост чужого.
   *
   * На главной подбор — приписка к ряду образов, и живёт под их же
   * заголовком с линией сверху. В каталоге у него своя секция, и линия с
   * отступом там оказались бы второй границей поверх границы секции, а
   * заголовок третьего уровня — вне иерархии страницы.
   */
  standalone?: boolean
}) {
  const t = CONTENT[lang]
  const router = useRouter()
  const pathname = usePathname()
  const [lengths, setLengths] = useState<string[]>([])
  const [curls, setCurls] = useState<string[]>([])

  const toggle = (value: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const found = useMemo(
    () =>
      LASHES.filter((p) =>
        p.variants.some(
          (v) =>
            (lengths.length === 0 || lengths.includes(v.length)) &&
            (curls.length === 0 || curls.includes(v.curl)),
        ),
      ).length,
    [lengths, curls],
  )

  const open = () => {
    const q = new URLSearchParams({ category: 'lashes' })
    if (lengths.length) q.set('length', lengths.join(','))
    if (curls.length) q.set('curl', curls.join(','))

    if (mode === 'link') {
      router.push(`/${lang}/catalog?${q}`)
      return
    }

    /* Замена, а не новая запись в истории: подбор — это уточнение текущего
       экрана, и кнопка «назад» должна вернуть на страницу до каталога, а не
       отматывать по одному нажатию на чип. */
    router.replace(`${pathname}?${q}`, { scroll: false })
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={standalone ? '' : 'finder'}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        {standalone ? (
          <h2 className="t-h2">{t.blocks.finderExact}</h2>
        ) : (
          <h3 className="t-h3">{t.blocks.finderTitle}</h3>
        )}
        {lengths.length || curls.length ? (
          <button
            type="button"
            className="lnk tap t-label"
            onClick={() => {
              setLengths([])
              setCurls([])
            }}
          >
            {t.catalog.reset}
          </button>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-[var(--col-gap)]">
        <fieldset className="border-0 p-0 lg:col-span-7">
          <legend className="t-label t-muted">{t.catalog.length}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {LENGTHS.map((l) => (
              <button
                key={l}
                type="button"
                className="chip"
                aria-pressed={lengths.includes(l)}
                onClick={() => toggle(l, lengths, setLengths)}
              >
                {formatLength(l, lang)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-0 p-0 lg:col-span-4 lg:col-start-9">
          <legend className="t-label t-muted">{t.catalog.curl}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {CURLS.map((c) => (
              <button
                key={c}
                type="button"
                className="chip"
                aria-pressed={curls.includes(c)}
                onClick={() => toggle(c, curls, setCurls)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <button type="button" className="btn" onClick={open} disabled={found === 0}>
          {t.catalog.apply}
        </button>
        {/* Число живёт рядом с действием и объявляется вслух: иначе нажатие
            на чип на монохромной витрине почти ничего не меняет визуально. */}
        <p className="t-label t-muted" aria-live="polite">
          {t.catalog.found} {found}
        </p>
      </div>
    </div>
  )
}
