'use client'

import { useEffect, useState } from 'react'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'

/** Промокод, который клиент просил подавать плашкой ярким цветом. */
const CODE = 'GLASS10'

/**
 * Промокод в футере.
 *
 * Код копируется по нажатию: переписывать его руками — лишняя работа, на
 * которой теряют покупателей. Если буфер обмена недоступен (старый браузер,
 * страница не по https), код выделяется — скопировать всё равно можно.
 */
export function PromoCode({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(CODE)
      setCopied(true)
    } catch {
      const r = document.createRange()
      r.selectNodeContents(e.currentTarget)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(r)
    }
  }

  return (
    <p className="t-label flex flex-wrap items-center gap-x-3 gap-y-1">
      <button type="button" onClick={copy} title={t.promo.copy} aria-label={t.promo.copy} className="tap -my-2 px-1 py-2">
        <span className="badge badge-sale">{CODE}</span>
      </button>
      <span className="t-muted">{t.home.promoBody}</span>
      {/* Подтверждение объявляется вслух: нажатие на код визуально ничего
          не меняет, и без этого незрячий покупатель не узнает результат. */}
      <span aria-live="polite" className="t-muted">
        {copied ? t.promo.copied : ''}
      </span>
    </p>
  )
}
