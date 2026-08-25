/**
 * Поиск по каталогу. Один матчер на всю витрину: панель в шапке, подсказки
 * в каталоге и сам отбор в сетке ищут одинаково — иначе ссылка «показать все
 * результаты» приводила бы на страницу, где найдено меньше, чем в подсказках.
 *
 * Данных мало (десятки позиций), поэтому это простой перебор без индекса.
 */

import { PRODUCTS, type Product } from './catalog'
import { formatLength, type Locale } from './i18n'

/* Длина хранится по-русски («11 мм», «микс 8–13 мм»), поэтому в строку поиска
   кладём и исходник, и локализованный вид: «11 mm» тоже должно находиться. */
function haystack(p: Product, lang: Locale): string {
  return [
    p.name[lang],
    p.summary[lang],
    ...p.variants.flatMap((v) => [v.length, formatLength(v.length, lang), v.curl]),
  ]
    .join(' ')
    .toLocaleLowerCase(lang)
}

/** `needle` ожидается уже обрезанным и в нижнем регистре — так зовёт каталог. */
export function matchProduct(p: Product, needle: string, lang: Locale): boolean {
  return needle === '' || haystack(p, lang).includes(needle)
}

export function searchProducts(query: string, lang: Locale, limit?: number): Product[] {
  const needle = query.trim().toLocaleLowerCase(lang)
  if (needle === '') return []
  const found = PRODUCTS.filter((p) => matchProduct(p, needle, lang)).sort((a, b) => a.rank - b.rank)
  return limit === undefined ? found : found.slice(0, limit)
}
