import { PRODUCTS } from '@/lib/catalog'

/**
 * Образы — эффект вместо артикула.
 *
 * Покупательница выбирает не «микс 8–13 мм, изгиб C», а результат: мягкий,
 * воздушный, вытянутый, плотный. Образ — это именованный набор значений
 * фильтра, и больше ничего: своей сущности в каталоге у него нет, товар в
 * него не «кладут». Поэтому смена ассортимента не ломает блок — меняются
 * только строки длин ниже, а разметка, счётчики и ссылки пересчитываются.
 *
 * Один источник на две страницы: главная показывает образы сеткой, каталог —
 * лентой и своими счётчиками. Раньше таблица лежала внутри HomeBlocks, и
 * второе место её использования означало бы вторую копию.
 *
 * Названия и описания живут в CONTENT[lang].blocks.looks — там же, где весь
 * остальной текст витрины, и в том же порядке, что и здесь.
 */
export type Look = {
  /** Кадр для плитки. Пустая строка — фотографии нет, плитка честно пустая. */
  image: string
  /** Значения фильтра «длина», ровно как они записаны в данных товара. */
  length: string[]
}

export const LOOKS: Look[] = [
  { image: '/media/catalog/basic-curl-c-baby-8-1.jpg', length: ['8 мм', '11 мм'] },
  {
    image: '/media/catalog/individual-eyelashes-1.jpg',
    length: ['микс 8–13 мм', 'микс 11–14 мм', 'микс 8–16 мм', 'микс 10–18 мм'],
  },
  { image: '/media/catalog/classic-curl-c-inspiration-14-1.jpg', length: ['14 мм'] },
  {
    image: '/media/catalog/reusable-mega-voluminous-flamboyance-1.jpg',
    length: ['лента', 'микс 10–14 мм'],
  },
]

/** Параметры каталога для образа. Те же ключи, что читает CatalogView. */
export function lookQuery(look: Look): URLSearchParams {
  return new URLSearchParams({ category: 'lashes', length: look.length.join(',') })
}

/**
 * Сколько товаров попадёт под образ.
 *
 * Считается по тем же данным и тем же правилом, что и сетка каталога, —
 * иначе число под плиткой обещало бы одно, а переход показывал другое.
 */
export function lookCount(look: Look): number {
  return PRODUCTS.filter(
    (p) => p.category === 'lashes' && p.variants.some((v) => look.length.includes(v.length)),
  ).length
}
