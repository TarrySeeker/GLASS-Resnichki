'use client'

import { useEffect, useRef } from 'react'
import { CONTENT } from '@/lib/content'
import { COUNTRIES, countryLabel, type Locale } from '@/lib/i18n'
import { useStore } from '@/components/StoreProvider'
import { Select } from '@/components/site/Select'

/**
 * Переспрос региона при первом посещении — пункт 3.3 брифа.
 *
 * Страна уже угадана по языку браузера и подставлена: покупателю остаётся
 * согласиться одним нажатием. Спрашиваем один раз, ответ живёт в localStorage.
 *
 * Панель нижняя, а не по центру: на телефоне она оказывается под большим
 * пальцем, а на десктопе не закрывает первый экран.
 */
export function RegionGate({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const { ready, regionAsked, country, setCountry, confirmRegion } = useStore()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (ready && !regionAsked) ref.current?.showModal()
  }, [ready, regionAsked])

  if (!ready || regionAsked) return null

  return (
    <dialog
      ref={ref}
      aria-label={t.region.title}
      /*
        Escape закрывал панель, но ответа не сохранял — на следующей странице
        она открывалась снова, и отказаться от неё было нельзя. Теперь любое
        закрытие засчитывается за ответ: остаётся угаданная страна, а
        переспрос больше не приходит. Переключатели страны и валюты
        остались в шапке и в футере.
      */
      onClose={() => confirmRegion(country)}
      /* overflow-visible: список стран раскрывается вверх — снизу его
        держит край экрана, — и без этого браузер обрезал бы его по верхней
        кромке панели. Содержимое панели короткое, прокручивать в ней
        нечего. */
      className="sheet safe-bottom fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none overflow-visible border-0 bg-[var(--color-paper)] p-0 text-[var(--color-ink)]"
    >
      <div className="wrap flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="t-h3">{t.region.title}</h2>
          <p className="t-label t-muted pt-2">{t.region.note}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            label={t.footer.country}
            labelHidden
            boxed
            value={country}
            onChange={setCountry}
            options={COUNTRIES.map((c) => ({ value: c.code, label: countryLabel(c, lang) }))}
          />
          <button
            type="button"
            className="btn"
            onClick={() => {
              confirmRegion(country)
              ref.current?.close()
            }}
          >
            {t.region.confirm}
          </button>
        </div>
      </div>
    </dialog>
  )
}
