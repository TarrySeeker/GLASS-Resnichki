'use client'

import { usePathname, useRouter } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import {
  COUNTRIES,
  CURRENCIES,
  LOCALES,
  LOCALE_NAME,
  type Currency,
  type Locale,
} from '@/lib/i18n'
import { useStore } from '@/components/StoreProvider'
import { Select } from '@/components/site/Select'

/**
 * Переключатели языка, валюты и страны — требование брифа.
 *
 * Списки — свои, а не нативные: раскрытый <select> рисует система, и на
 * тёмной плоскости футера его варианты выходили белым по белому. Всё
 * поведение и разметка — в Select, здесь только данные.
 */
export function Switchers({
  lang,
  compact = false,
  inline = false,
  fields = ['lang', 'currency', 'country'],
}: {
  lang: Locale
  compact?: boolean
  /**
   * Строкой, но с подписями и полными значениями — для служебной полосы
   * футера. Сжатый вид там не годится: язык и страна в кодах дают «RU · RU»,
   * и понять, что из этого что, нельзя.
   */
  inline?: boolean
  /** В шапке страна не нужна: она решается на оформлении заказа. */
  fields?: ('lang' | 'currency' | 'country')[]
}) {
  const t = CONTENT[lang]
  const router = useRouter()
  const pathname = usePathname()
  const { currency, setCurrency, country, setCountry } = useStore()

  // max-w-full и min-w-0 обязательны: нативный <select> просит ширину по самому
  // длинному варианту списка, и «United Arab Emirates» распирал колонку футера
  // на 1024 — страница получала горизонтальную прокрутку.
  const switchLang = (next: string) => {
    const rest = pathname.split('/').slice(2).join('/')
    router.push(`/${next}${rest ? `/${rest}` : ''}`)
  }

  return (
    <div
      className={
        compact
          ? 'flex items-center gap-4'
          : inline
            ? 'flex flex-wrap items-center gap-x-7 gap-y-2'
            : 'flex flex-col gap-2'
      }
    >
      {fields.includes('lang') ? (
        <Select
          label={t.footer.lang}
          labelHidden={compact}
          value={lang}
          onChange={switchLang}
          options={LOCALES.map((l) => ({
            value: l,
            label: compact ? l.toUpperCase() : LOCALE_NAME[l],
          }))}
        />
      ) : null}

      {fields.includes('currency') ? (
        <Select
          label={t.footer.currency}
          labelHidden={compact}
          value={currency}
          onChange={(v) => setCurrency(v as Currency)}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
        />
      ) : null}

      {fields.includes('country') ? (
        <Select
          label={t.footer.country}
          labelHidden={compact}
          value={country}
          onChange={setCountry}
          options={COUNTRIES.map((c) => ({
            value: c.code,
            label: compact ? c.code : c.name[lang],
          }))}
        />
      ) : null}
    </div>
  )
}
