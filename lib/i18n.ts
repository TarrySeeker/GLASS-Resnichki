/**
 * Языки, валюты и страны витрины.
 *
 * Клиент назвал три языка (английский, русский, арабский) и четыре валюты
 * (рубль, доллар, евро, тенге). Дирхам добавлен потому, что бриф отдельно
 * описывает витрину ОАЭ, а арабская версия — это именно она.
 */

export const LOCALES = ['ru', 'en', 'ar'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ru'

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v)
}

/** Направление письма. Арабская витрина зеркалится целиком. */
export const DIR: Record<Locale, 'ltr' | 'rtl'> = { ru: 'ltr', en: 'ltr', ar: 'rtl' }

export const LOCALE_NAME: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  ar: 'العربية',
}

export const CURRENCIES = ['RUB', 'USD', 'EUR', 'KZT', 'AED'] as const
export type Currency = (typeof CURRENCIES)[number]

/**
 * Курсы — демонстрационные и намеренно зафиксированы.
 * Реальные тянутся из бэкенда: одна точка подстановки — `RATES`.
 */
export const RATES: Record<Currency, number> = {
  RUB: 1,
  USD: 1 / 92,
  EUR: 1 / 100,
  KZT: 5.2,
  AED: 1 / 25,
}

/** Локаль форматирования — из выбранного языка, а не из валюты. */
const INTL_LOCALE: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US', ar: 'ar-AE' }

/**
 * Цена хранится в рублях (базовая валюта прайса) и пересчитывается на клиенте.
 * Intl сам ставит символ, разделители и позицию знака под язык — в арабской
 * версии это важнее всего, там порядок другой.
 */
export function formatPrice(rub: number, currency: Currency, locale: Locale): string {
  const value = rub * RATES[currency]
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'RUB' || currency === 'KZT' ? 0 : 2,
  }).format(value)
}

/**
 * Число со словом в правильной форме.
 *
 * «21 позиция», «22 позиции», «25 позиций» — в русском три формы, в
 * английском две, в арабском шесть. Правило выбора знает Intl.PluralRules,
 * поэтому здесь нет ни одного `n % 10`; наше дело — дать сами слова.
 * `other` обязателен, остальные формы берутся из него, если не заданы.
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

export function plural(n: number, locale: Locale, forms: PluralForms): string {
  const rule = new Intl.PluralRules(INTL_LOCALE[locale]).select(n)
  const word = forms[rule] ?? forms.other
  const value = new Intl.NumberFormat(INTL_LOCALE[locale]).format(n)
  return `${value}\u00a0${word}`
}

export type Country = {
  code: string
  /** Название страны на всех трёх языках витрины: код ISO покупателю ничего не говорит. */
  name: Record<Locale, string>
  currency: Currency
  /** Как посылка уходит в эту страну. См. комментарий к COUNTRIES. */
  shipping: 'cdek' | 'post'
}

/**
 * Страны, куда бренд отправляет заказы.
 *
 * Порядок не алфавитный: сначала СНГ, где работает СДЭК, потом остальное.
 * Так список читается как ответ на вопрос «как ко мне поедет посылка», а не
 * как справочник.
 *
 * Способ доставки — не свойство страны, а граница зоны СДЭК: по России и СНГ
 * посылку везёт он (курьером или до пункта выдачи), за их пределы уходит
 * Почта России. Отсюда и поле `shipping`: корзина по нему решает, показывать
 * ли выбор между курьером и пунктом выдачи, или ставить почту без вариантов.
 *
 * Валюта берётся из четырёх, названных клиентом (рубль, доллар, евро, тенге),
 * плюс дирхам для витрины ОАЭ. Национальных валют СНГ в этом списке нет,
 * поэтому Азербайджан, Армения, Киргизия, Узбекистан и Таджикистан считают в
 * долларах — общей валюте прайса для зарубежья. Заменить на манат, драм и
 * прочее можно в одной строке каждой: добавить код в CURRENCIES и курс в
 * RATES.
 */
export const COUNTRIES: Country[] = [
  {
    code: 'RU',
    name: { ru: 'Россия', en: 'Russia', ar: 'روسيا' },
    currency: 'RUB',
    shipping: 'cdek',
  },
  {
    code: 'BY',
    name: { ru: 'Беларусь', en: 'Belarus', ar: 'بيلاروس' },
    currency: 'RUB',
    shipping: 'cdek',
  },
  {
    code: 'KZ',
    name: { ru: 'Казахстан', en: 'Kazakhstan', ar: 'كازاخستان' },
    currency: 'KZT',
    shipping: 'cdek',
  },
  {
    code: 'AZ',
    name: { ru: 'Азербайджан', en: 'Azerbaijan', ar: 'أذربيجان' },
    currency: 'USD',
    shipping: 'cdek',
  },
  {
    code: 'AM',
    name: { ru: 'Армения', en: 'Armenia', ar: 'أرمينيا' },
    currency: 'USD',
    shipping: 'cdek',
  },
  {
    code: 'KG',
    name: { ru: 'Кыргызстан', en: 'Kyrgyzstan', ar: 'قيرغيزستان' },
    currency: 'USD',
    shipping: 'cdek',
  },
  {
    code: 'UZ',
    name: { ru: 'Узбекистан', en: 'Uzbekistan', ar: 'أوزبكستان' },
    currency: 'USD',
    shipping: 'cdek',
  },
  {
    code: 'TJ',
    name: { ru: 'Таджикистан', en: 'Tajikistan', ar: 'طاجيكستان' },
    currency: 'USD',
    shipping: 'cdek',
  },
  {
    code: 'TR',
    name: { ru: 'Турция', en: 'Türkiye', ar: 'تركيا' },
    currency: 'USD',
    shipping: 'post',
  },
  {
    code: 'ES',
    name: { ru: 'Испания', en: 'Spain', ar: 'إسبانيا' },
    currency: 'EUR',
    shipping: 'post',
  },
  {
    code: 'AE',
    name: { ru: 'ОАЭ', en: 'United Arab Emirates', ar: 'الإمارات' },
    currency: 'AED',
    shipping: 'post',
  },
]

/** Подпись страны в выпадающем списке: «Россия · RUB», а не «RU · RUB». */
export function countryLabel(c: Country, locale: Locale): string {
  return `${c.name[locale]} · ${c.currency}`
}

/**
 * Длина варианта хранится строкой по-русски («микс 8–13 мм», «лента»).
 * Здесь она приводится к языку витрины: цифры и тире одинаковы во всех трёх,
 * переводятся только единица измерения и два слова.
 */
const LENGTH_WORDS: Record<Locale, { mm: string; mix: string; strip: string; unknown: string }> = {
  ru: { mm: 'мм', mix: 'микс', strip: 'лента', unknown: '—' },
  en: { mm: 'mm', mix: 'mix', strip: 'strip', unknown: '—' },
  ar: { mm: 'مم', mix: 'ميكس', strip: 'شريط', unknown: '—' },
}

export function formatLength(value: string, locale: Locale): string {
  const w = LENGTH_WORDS[locale]
  if (value === '—') return w.unknown
  if (value === 'лента') return w.strip
  return value.replace('микс', w.mix).replace('мм', w.mm)
}

/**
 * Определение языка и страны по заголовку Accept-Language.
 *
 * Геолокации по IP здесь нет намеренно: она требует внешнего сервиса, врёт при
 * VPN и роуминге, и её нельзя проверить на этапе вёрстки. Заголовок браузера
 * покупатель настраивает сам — это честнее. Выбор в любом случае
 * переспрашивается и сохраняется.
 */
export function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const base = tag.split('-')[0]
    if (base === 'ru' || base === 'en' || base === 'ar') return base
    // Языки СНГ ведут на русскую витрину: она им ближе английской.
    if (['be', 'uk', 'kk', 'ky', 'uz', 'tg', 'hy', 'az'].includes(base)) return 'ru'
  }
  // Язык есть, но не наш: немцу или французу английская витрина ближе русской.
  return 'en'
}

/** Страна из региона в заголовке: ru-RU → RU. Неизвестная — по языку. */
export function pickCountry(acceptLanguage: string | null): string {
  const known = new Set(COUNTRIES.map((c) => c.code))
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(',')) {
      const region = part.trim().split(';')[0].split('-')[1]
      if (region && known.has(region.toUpperCase())) return region.toUpperCase()
    }
  }
  // Английская витрина — это Европа: США в списке стран нет, и подставлять
  // страну, куда мы не возим, значит соврать про доставку на первом же экране.
  const byLocale: Record<Locale, string> = { ru: 'RU', en: 'ES', ar: 'AE' }
  return byLocale[pickLocale(acceptLanguage)]
}
