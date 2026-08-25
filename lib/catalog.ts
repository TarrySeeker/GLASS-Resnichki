/**
 * Каталог.
 *
 * ИСТОЧНИК ДАННЫХ: витрина бренда https://goldapple.ru/brands/glass-eyelashes
 * Дата сбора: 26 августа 2026.
 *
 * ЧТО НЕ УДАЛОСЬ ДОСТАТЬ (важно, читать перед правкой):
 * 1. Сама витрина недоступна для автоматического сбора. Gold Apple отдаёт
 *    страницу-заглушку «Gold Apple — checking device» и дальше не пускает:
 *    ни браузер (Playwright), ни curl, ни WebFetch. Внутренние ручки
 *    (/front/api/...) отвечают 403, каталог медиа (/media/catalog/...) — тоже 403.
 * 2. ЦЕНЫ НЕ ПОЛУЧЕНЫ. У всех позиций `price: 0` — это заглушка, а не «бесплатно».
 *    Прайс нужно запросить у клиента и проставить сюда целыми рублями.
 *    Скидок (`oldPrice`) и плашек (`badge`) тоже нет: подтвердить их по витрине
 *    не удалось, а раздавать наугад нельзя.
 * 3. ИЗОБРАЖЕНИЯ: взяты из архива бренда на Яндекс.Диске (публичная папка из ТЗ,
 *    https://disk.yandex.ru/d/Ii7O3DCUUk5DTw). Подробности ниже, блок «ФОТО».
 *
 * ЧТО ВСЁ-ТАКИ РЕАЛЬНОЕ:
 * Названия, артикулы, длины, изгибы и ссылки позиций 1–10 подтверждены
 * поисковым индексом Gold Apple (заголовки и URL карточек товаров этого бренда).
 * Тексты описаний собраны из проиндексированных фрагментов описаний бренда.
 * Позиция «BASIC curl C MIDDLE» — длина 11 мм проставлена по логике линейки
 * (BABY 8 / MIDDLE 11 / INSPIRATION 14), в заголовке карточки её не было: уточнить.
 *
 * ФОТО (архив бренда, Яндекс.Диск, разобран целиком):
 * 328 файлов в 8 папках по месяцам = 257 фотографий + 71 видео (.mov, не смотрели)
 * + 4 .heic и 1 .cr2, которые Pillow не открывает (в отбор не попали, замена нашлась).
 * Все 257 фотографий — предметная съёмка бренда (коробки, палетки с пучками,
 * ленточные ресницы, клей, пинцет, щёточка). Модельных портретов и мусора
 * (скриншотов, отзывов, документов) в архиве НЕТ вообще — поэтому
 * /media/hero-portrait.jpg и /media/editorial-*.jpg остались прежними.
 *
 * ЧТО ОПОЗНАНО ТОЧНО (на упаковке читается имя линейки):
 *   classic-curl-c-middle-11      — на палетке читается CLASSIC;
 *   classic-curl-c-inspiration-14 — на палетке читается CLASSIC;
 *   needle-rays                   — палетка NEEDLE с метками 10/12/14 мм;
 *   lash-glue                     — фирменный тюбик «GLASS eyelashes 1.5 g»;
 *   tweezers-curved               — чёрный изогнутый пинцет.
 *
 * ЧТО ПОСТАВЛЕНО ПО ТИПУ ТОВАРА (ТРЕБУЕТ СВЕРКИ С КЛИЕНТОМ):
 * basic-curl-c-middle, basic-curl-c-inspiration-14, basic-curl-c-baby-8,
 * voluminous-eyelashes-trend-mix, voluminous-eyelashes-butterfly-mix,
 * individual-eyelashes, reusable-mega-voluminous-flamboyance.
 * Кадры, где читается ЧУЖОЕ имя линейки (BARBIE, MOOD, DAWN, UNIQUE,
 * INSOLENCE, MERMAID, BOTTOM), сознательно не брались.
 *
 * БЕЗ ФОТО ОСТАЛИСЬ ПЯТЬ ПОЗИЦИЙ:
 *   lash-remover, lash-primer, tweezers-straight — такого предмета в архиве нет;
 *   voluminous-eyelashes-trend-mix, voluminous-eyelashes-butterfly-mix — все
 *   кадры их лотков либо обрезаны фотографом по краю, либо рядом лежит соседний
 *   предмет из раскладки, который прямоугольным кропом не отделяется.
 * У всех пяти пустой images и отрабатывает заглушка: обрезанная упаковка или
 * обрывок чужого пинцета на превью хуже честной дыры.
 *
 * КОЛЛЕКЦИИ (позиции 11–16) ЗАВЕДЕНЫ ПО ФОТОГРАФИЯМ, А НЕ ПО ВИТРИНЕ.
 * Клиент попросил показывать на карточках закрытую композицию — коробку целиком.
 * В архиве такие кадры есть только у коллекционных линеек: их снимали
 * одинаково, с крышкой и читаемой карточкой линейки. У BASIC, CLASSIC, TREND,
 * BUTTERFLY и NEEDLE таких кадров нет ни одного — они сняты открытыми лотками.
 *
 * Поэтому шесть линеек заведены отдельными позициями. Названия сняты прямо с
 * упаковки на кадре и в этом смысле подтверждены. Цен, артикулов, длин и
 * изгибов у них нет: витрина Gold Apple их не подтверждает, а по фотографии
 * их не определить. Длина и изгиб стоят как «—», описание — заглушкой.
 *
 * ЕСТЬ В АРХИВЕ, НО НЕ ЗАВЕДЕНО (запросить у клиента): BARBIE, MOOD, DAWN,
 * UNIQUE, INSOLENCE, MERMAID, BOTTOM (ресницы для нижнего века), Desert Dunes,
 * Morning Flowers — у последней solo-кадра коробки в архиве не нашлось.
 *
 * ОБРАБОТКА — ТОВАРНЫЙ ВИД (переснято из архива 25 августа 2026):
 * Раньше кадры кропались по центру и упаковка обрезалась — на превью был макро-
 * фрагмент лотка вместо товара. Теперь из 252 фотографий отобраны те, где предмет
 * попадает в кадр целиком на светлом ровном фоне, и каждая приведена к одному виду:
 *   1. фон измеряется по рамке и множителем сдвигается к плитке #F2F2F2,
 *      затем мягко подтягивается к ней (тени дальше порога остаются целыми);
 *   2. габарит предмета находится по отличию от фона;
 *   3. габарит кладётся в квадрат 1200×1200 с полем 11–13 %.
 * Клей, пинцет и часть лотков сняты в общей раскладке — у них дополнительно
 * остаётся только самая крупная связная область, иначе в кадр попадают соседние
 * предметы. Где так отделить не удалось, кадр не берётся вовсе.
 *
 * ОТБОР. Кадр идёт в каталог, только если выполнены три условия: упаковка
 * попала в исходный снимок целиком; в квадрат не попал ни обрывок соседнего
 * предмета, ни край съёмочной бумаги; на упаковке не читается чужое имя линейки.
 *
 * Про край бумаги отдельно: раньше квадрат добирался плиткой поверх снимка, и
 * там, где съёмочная бумага заканчивалась внутри квадрата, шла резкая
 * вертикальная граница поперёк карточки. Теперь область кадра для каждого
 * снимка задана так, чтобы этой границы в квадрате не было.
 *
 * Позиции с одним кадром — норма, а не недоделка: второй берётся только если
 * он такой же чистый.
 * Вырезания по контуру нет намеренно: без тени упаковка теряет объём.
 * JPEG progressive, каждый файл ≤ 250 КБ. Скрипт сборки — в истории задачи.
 *
 * ССЫЛКИ НА КАРТОЧКИ GOLD APPLE (тип Product поля url не имеет — менять сигнатуру нельзя,
 * поэтому ссылки лежат здесь; id товара = артикул Gold Apple):
 *   19000091588 https://goldapple.ru/19000091588-classic-curl-s-middle
 *   19000091590 https://goldapple.ru/19000091590-classic-curl-s-inspiration
 *   19000091583 https://goldapple.ru/19000091583-basic-curl-s-middle
 *   19000091586 https://goldapple.ru/19000091586-basic-curl-s-inspiration
 *   19000067227 https://goldapple.ru/19000067227-basic-curl-c-baby
 *   19000251045 https://goldapple.ru/19000251045-voluminous-eyelashes-trend-11-14-mm-mix
 *   19000251054 https://goldapple.ru/19000251054-voluminous-eyelashes-butterfly-8-13-mm-mix
 *   19000178945 https://goldapple.ru/19000178945-needle
 *   19000178947 https://goldapple.ru/19000178947-individual-eyelashes
 *   19000300905 https://goldapple.ru/19000300905-reusable-mega-voluminous-eyelashes-flamboyance
 * ПОЗИЦИИ 11–15 (уход и инструменты) НЕ ПОДТВЕРЖДЕНЫ ВИТРИНОЙ.
 * Это типовой сопутствующий ассортимент lash-бренда (клей, ремувер, праймер,
 * пинцеты), добавленный, чтобы категории «уход» и «инструменты» не были пустыми.
 * Точные названия, состав и цены — запросить у клиента или удалить блок.
 *
 * Структура массива совпадает с тем, что будет отдавать бэкенд: файл заменяется целиком.
 */

import type { Locale } from './i18n'

export type Category = 'lashes' | 'care' | 'tools'
export type Badge = 'hit' | 'new' | 'sale'

export type Variant = {
  sku: string
  /** Длина в миллиметрах или «микс». */
  length: string
  /** Изгиб: C, D, CC. */
  curl: string
  inStock: boolean
}

export type Product = {
  id: string
  slug: string
  name: Record<Locale, string>
  summary: Record<Locale, string>
  description: Record<Locale, string>
  category: Category
  /** Цена в рублях — базовая валюта прайса. Пересчёт на клиенте. */
  price: number
  oldPrice?: number
  /**
   * Скидка в процентах — когда она подтверждена, а прайса ещё нет.
   *
   * Обычно процент считается из `price` и `oldPrice`. Пока цен нет, считать
   * не из чего, но сама скидка известна по витрине Gold Apple. Поле нужно
   * ровно на это время: появятся цены — процент начнёт считаться сам, а поле
   * удаляется. Ставить его наугад нельзя, это утверждение о цене.
   */
  discount?: number
  badge?: Badge
  images: string[]
  variants: Variant[]
  /** Порядок в сортировке «популярные». */
  rank: number
}

/**
 * Пустой список — для позиций, которых в архиве бренда просто нет
 * (ремувер, праймер, прямой пинцет). Это явная дыра, которую видно в интерфейсе.
 * Заполнить путями /media/catalog/<slug>-1.jpg, когда клиент пришлёт съёмку.
 */
const PLACEHOLDER: string[] = []

/**
 * Описание линейки, которого клиент ещё не прислал. Как и `— ЦЕНА —`,
 * это намеренная дыра: придумывать за бренд характер и эффект нельзя.
 */
const NO_TEXT: Record<Locale, string> = {
  ru: '— ОПИСАНИЕ —',
  en: '— DESCRIPTION —',
  ar: '— الوصف —',
}

export const PRODUCTS: Product[] = [
  {
    id: '19000091588',
    slug: 'classic-curl-c-middle-11',
    name: {
      ru: 'Пучковые ресницы 20D 11 мм «CLASSIC» curl C MIDDLE',
      en: 'CLASSIC Cluster Lashes 20D 11 mm, C curl — MIDDLE',
      ar: 'رموش عناقيد CLASSIC ‏20D ‏11 مم، انحناء C — ‏MIDDLE',
    },
    summary: {
      ru: 'Основная длина линейки',
      en: 'The core length of the line',
      ar: 'الطول الأساسي في الخط',
    },
    description: {
      ru: 'Объём 20D, длина 11 мм, изгиб C. Плоское основание, угольно-чёрный цвет.',
      en: '20D volume, 11 mm, C curl. Flat base, carbon black.',
      ar: 'كثافة 20D، طول 11 مم، انحناء C. قاعدة مسطّحة، أسود فحمي.',
    },
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/classic-curl-c-middle-11-1.jpg', '/media/catalog/classic-curl-c-middle-11-2.jpg'],
    variants: [{ sku: '19000091588', length: '11 мм', curl: 'C', inStock: true }],
    rank: 1,
  },
  {
    id: '19000091590',
    slug: 'classic-curl-c-inspiration-14',
    name: {
      ru: 'Пучковые ресницы 20D 14 мм «CLASSIC» curl C INSPIRATION',
      en: 'CLASSIC Cluster Lashes 20D 14 mm, C curl — INSPIRATION',
      ar: 'رموش عناقيد CLASSIC ‏20D ‏14 مم، انحناء C — ‏INSPIRATION',
    },
    summary: {
      ru: 'Акцент во внешнем углу',
      en: 'Outer-corner accent',
      ar: 'إبراز الزاوية الخارجية',
    },
    description: {
      ru: 'Объём 20D, длина 14 мм. Самая длинная в линейке, ставится к внешнему углу.',
      en: '20D volume, 14 mm. The longest in the line, for the outer corner.',
      ar: 'كثافة 20D، طول 14 مم. الأطول في الخط، للزاوية الخارجية.',
    },
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/classic-curl-c-inspiration-14-1.jpg'],
    variants: [{ sku: '19000091590', length: '14 мм', curl: 'C', inStock: true }],
    rank: 2,
  },
  {
    id: '19000091583',
    slug: 'basic-curl-c-middle',
    name: {
      ru: 'Пучковые ресницы 10D 11 мм «BASIC» curl C MIDDLE',
      en: 'BASIC Cluster Lashes 10D 11 mm, C curl — MIDDLE',
      ar: 'رموش عناقيد BASIC ‏10D ‏11 مم، انحناء C — ‏MIDDLE',
    },
    summary: {
      ru: 'База под длинные пучки',
      en: 'A base for longer clusters',
      ar: 'أساس للعناقيد الأطول',
    },
    description: {
      ru: 'Объём 10D, длина 11 мм, изгиб C. База под длинные пучки и вся линия роста.',
      en: '10D volume, 11 mm, C curl. A base for longer clusters and the whole lash line.',
      ar: 'كثافة 10D، طول 11 مم، انحناء C. أساس للعناقيد الأطول ولخط الرموش كله.',
    },
    category: 'lashes',
    price: 0,
    discount: 25,
    images: ['/media/catalog/basic-curl-c-middle-1.jpg'],
    variants: [{ sku: '19000091583', length: '11 мм', curl: 'C', inStock: true }],
    rank: 3,
  },
  {
    id: '19000091586',
    slug: 'basic-curl-c-inspiration-14',
    name: {
      ru: 'Пучковые ресницы 10D 14 мм «BASIC» curl C INSPIRATION',
      en: 'BASIC Cluster Lashes 10D 14 mm, C curl — INSPIRATION',
      ar: 'رموش عناقيد BASIC ‏10D ‏14 مم، انحناء C — ‏INSPIRATION',
    },
    summary: {
      ru: 'Удлинение без плотности',
      en: 'Length without density',
      ar: 'طول دون كثافة',
    },
    description: {
      ru: 'Объём 10D, длина 14 мм. Удлиняет линию, не добавляя плотности.',
      en: '10D volume, 14 mm. Adds length, not density.',
      ar: 'كثافة 10D، طول 14 مم. تضيف طولاً لا كثافة.',
    },
    category: 'lashes',
    price: 0,
    discount: 25,
    images: ['/media/catalog/basic-curl-c-inspiration-14-1.jpg'],
    variants: [{ sku: '19000091586', length: '14 мм', curl: 'C', inStock: true }],
    rank: 4,
  },
  {
    id: '19000067227',
    slug: 'basic-curl-c-baby-8',
    name: {
      ru: 'Пучковые ресницы 10D 8 мм «BASIC» curl C BABY',
      en: 'BASIC Cluster Lashes 10D 8 mm, C curl — BABY',
      ar: 'رموش عناقيد BASIC ‏10D ‏8 مم، انحناء C — ‏BABY',
    },
    summary: {
      ru: 'Внутренний угол и нижняя линия',
      en: 'Inner corner and lower line',
      ar: 'الزاوية الداخلية والخط السفلي',
    },
    description: {
      ru: 'Объём 10D, длина 8 мм. Внутренний угол и нижняя линия.',
      en: '10D volume, 8 mm. Inner corner and lower lash line.',
      ar: 'كثافة 10D، طول 8 مم. الزاوية الداخلية والخط السفلي.',
    },
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/basic-curl-c-baby-8-1.jpg'],
    variants: [{ sku: '19000067227', length: '8 мм', curl: 'C', inStock: true }],
    rank: 5,
  },
  {
    id: '19000251045',
    slug: 'voluminous-eyelashes-trend-mix',
    name: {
      ru: 'Объёмные пучковые ресницы TREND 11–14 мм, микс',
      en: 'TREND Voluminous Cluster Lashes 11–14 mm, mix',
      ar: 'رموش عناقيد كثيفة TREND ‏11–14 مم، تشكيلة',
    },
    summary: {
      ru: 'Микс длин в упаковке',
      en: 'A mix of lengths in one box',
      ar: 'مزيج أطوال في علبة واحدة',
    },
    description: {
      ru: 'Микс длин 11–14 мм в одной упаковке. Соседние размеры докупать не нужно.',
      en: 'A mix of 11–14 mm in one box. No need to buy the neighbouring sizes.',
      ar: 'مزيج من 11 إلى 14 مم في علبة واحدة. لا حاجة لشراء المقاسات المجاورة.',
    },
    category: 'lashes',
    price: 0,
    images: PLACEHOLDER,
    variants: [{ sku: '19000251045', length: 'микс 11–14 мм', curl: 'C', inStock: true }],
    rank: 6,
  },
  {
    id: '19000251054',
    slug: 'voluminous-eyelashes-butterfly-mix',
    name: {
      ru: 'Объёмные ресницы и лучики BUTTERFLY 8–13 мм, микс',
      en: 'BUTTERFLY Voluminous Lashes & Spikes 8–13 mm, mix',
      ar: 'رموش كثيفة وخصلات مدببة BUTTERFLY ‏8–13 مم، تشكيلة',
    },
    summary: {
      ru: 'Пучки и лучики вместе',
      en: 'Clusters and spikes together',
      ar: 'عناقيد وأشعة معاً',
    },
    description: {
      ru: 'Микс 8–13 мм: объёмные пучки и тонкие лучики в одной упаковке.',
      en: 'A mix of 8–13 mm: volume clusters and fine spikes in one box.',
      ar: 'مزيج من 8 إلى 13 مم: عناقيد كثيفة وأشعة رفيعة في علبة واحدة.',
    },
    category: 'lashes',
    price: 0,
    images: PLACEHOLDER,
    variants: [{ sku: '19000251054', length: 'микс 8–13 мм', curl: 'C', inStock: true }],
    rank: 7,
  },
  {
    id: '19000178945',
    slug: 'needle-rays',
    name: {
      ru: 'Ресницы-лучики needle 10–14 мм',
      en: 'Needle Lash Spikes 10–14 mm',
      ar: 'خصلات رموش مدببة needle ‏10–14 مم',
    },
    summary: {
      ru: 'Постановка поверх своих',
      en: 'Set over your own lashes',
      ar: 'تُركّب فوق رموشك',
    },
    description: {
      ru: 'Лучики 10–14 мм. Ставятся поверх своих ресниц, контур получается с пиками.',
      en: 'Spikes, 10–14 mm. Set over your own lashes; the line reads as peaks.',
      ar: 'أشعة من 10 إلى 14 مم. تُركّب فوق رموشك، فيأتي الخط بنتوءات.',
    },
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/needle-rays-1.jpg'],
    variants: [{ sku: '19000178945', length: 'микс 10–14 мм', curl: 'C', inStock: true }],
    rank: 8,
  },
  {
    id: '19000178947',
    slug: 'individual-eyelashes',
    name: {
      ru: 'Ресницы для стрелки individual eyelashes 30D, 10–18 мм',
      en: 'Individual Eyelashes for a Winged Line, 30D, 10–18 mm',
      ar: 'رموش فردية لرسمة الآيلاينر ‏30D، ‏10–18 مم',
    },
    summary: {
      ru: 'Стрелка без подводки',
      en: 'A wing without eyeliner',
      ar: 'جناح دون كحل',
    },
    description: {
      ru: 'Объём 30D, длины 10–18 мм, изгибы L и M. Для стрелки без подводки.',
      en: '30D volume, 10–18 mm, L and M curls. A wing without eyeliner.',
      ar: 'كثافة 30D، أطوال من 10 إلى 18 مم، انحناءان L و M. جناح دون كحل.',
    },
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/individual-eyelashes-1.jpg'],
    variants: [
      { sku: '19000178947-L', length: 'микс 10–18 мм', curl: 'L', inStock: true },
      { sku: '19000178947-M', length: 'микс 8–16 мм', curl: 'M', inStock: true },
    ],
    rank: 9,
  },
  {
    id: '19000300905',
    slug: 'reusable-mega-voluminous-flamboyance',
    name: {
      ru: 'Объёмные ленточные ресницы многоразовые flamboyance',
      en: 'Reusable Mega Voluminous Strip Lashes Flamboyance',
      ar: 'رموش شريطية كثيفة قابلة لإعادة الاستخدام flamboyance',
    },
    summary: {
      ru: 'Многоразовая лента',
      en: 'A reusable strip',
      ar: 'شريط قابل لإعادة الاستخدام',
    },
    description: {
      ru: 'Лента вместо пучков. После очистки используется снова.',
      en: 'A strip instead of clusters. Reusable after cleaning.',
      ar: 'شريط بدل العناقيد. يُعاد استخدامه بعد التنظيف.',
    },
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/reusable-mega-voluminous-flamboyance-1.jpg', '/media/catalog/reusable-mega-voluminous-flamboyance-2.jpg'],
    variants: [{ sku: '19000300905', length: 'лента', curl: 'C', inStock: true }],
    rank: 10,
  },

  /*
   * НИЖЕ — НЕ ПОДТВЕРЖДЕНО ВИТРИНОЙ GOLD APPLE.
   * Типовой сопутствующий ассортимент lash-бренда, добавлен, чтобы категории
   * «уход» и «инструменты» не были пустыми. Названия — родовые, артикулы
   * условные, цены не получены. Заменить на реальные позиции клиента или удалить.
   */

  /* ─── Коллекции в закрытой упаковке ──────────────────────────────────────
     Шесть линеек, снятых брендом одинаково: коробка целиком, крышка на месте,
     карточка линейки читается. Названия взяты прямо с упаковки на кадре —
     это единственное, что о них известно наверняка.

     Всё остальное — дыра: ни цен, ни артикулов, ни длин с изгибами клиент не
     присылал, и по фотографии их не определить. Поэтому длина и изгиб стоят
     как «—» (фильтры такие значения пропускают), а описание — заглушкой.
     Заполняются одной правкой, когда придёт прайс и спецификация.          */
  {
    id: 'glass-modern-bride',
    slug: 'modern-bride',
    name: {
      ru: 'Пучковые ресницы «MODERN BRIDE»',
      en: 'MODERN BRIDE Cluster Lashes',
      ar: 'رموش عناقيد «MODERN BRIDE»',
    },
    summary: NO_TEXT,
    description: NO_TEXT,
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/modern-bride-1.jpg'],
    variants: [{ sku: 'GLASS-MODERN-BRIDE', length: '—', curl: '—', inStock: true }],
    rank: 11,
  },
  {
    id: 'glass-luxurious-bride',
    slug: 'luxurious-bride',
    name: {
      ru: 'Пучковые ресницы «LUXURIOUS BRIDE»',
      en: 'LUXURIOUS BRIDE Cluster Lashes',
      ar: 'رموش عناقيد «LUXURIOUS BRIDE»',
    },
    summary: NO_TEXT,
    description: NO_TEXT,
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/luxurious-bride-1.jpg'],
    variants: [{ sku: 'GLASS-LUXURIOUS-BRIDE', length: '—', curl: '—', inStock: true }],
    rank: 12,
  },
  {
    id: 'glass-morning-of-the-bride',
    slug: 'morning-of-the-bride',
    name: {
      ru: 'Пучковые ресницы «MORNING OF THE BRIDE»',
      en: 'MORNING OF THE BRIDE Cluster Lashes',
      ar: 'رموش عناقيد «MORNING OF THE BRIDE»',
    },
    summary: NO_TEXT,
    description: NO_TEXT,
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/morning-of-the-bride-1.jpg'],
    variants: [{ sku: 'GLASS-MORNING-OF-THE-BRIDE', length: '—', curl: '—', inStock: true }],
    rank: 13,
  },
  {
    id: 'glass-celebrity-look',
    slug: 'celebrity-look',
    name: {
      ru: 'Пучковые ресницы «CELEBRITY LOOK»',
      en: 'CELEBRITY LOOK Cluster Lashes',
      ar: 'رموش عناقيد «CELEBRITY LOOK»',
    },
    summary: NO_TEXT,
    description: NO_TEXT,
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/celebrity-look-1.jpg'],
    variants: [{ sku: 'GLASS-CELEBRITY-LOOK', length: '—', curl: '—', inStock: true }],
    rank: 14,
  },
  {
    id: 'glass-caramel-glaze',
    slug: 'caramel-glaze',
    name: {
      ru: 'Пучковые ресницы «CARAMEL GLAZE»',
      en: 'CARAMEL GLAZE Cluster Lashes',
      ar: 'رموش عناقيد «CARAMEL GLAZE»',
    },
    summary: NO_TEXT,
    description: NO_TEXT,
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/caramel-glaze-1.jpg'],
    variants: [{ sku: 'GLASS-CARAMEL-GLAZE', length: '—', curl: '—', inStock: true }],
    rank: 15,
  },
  {
    id: 'glass-sun-glare',
    slug: 'sun-glare',
    name: {
      ru: 'Пучковые ресницы «SUN GLARE»',
      en: 'SUN GLARE Cluster Lashes',
      ar: 'رموش عناقيد «SUN GLARE»',
    },
    summary: NO_TEXT,
    description: NO_TEXT,
    category: 'lashes',
    price: 0,
    images: ['/media/catalog/sun-glare-1.jpg'],
    variants: [{ sku: 'GLASS-SUN-GLARE', length: '—', curl: '—', inStock: true }],
    rank: 16,
  },
  {
    id: 'care-glue',
    slug: 'lash-glue',
    name: {
      ru: 'Клей для пучковых ресниц',
      en: 'Cluster Lash Glue',
      ar: 'لاصق رموش العناقيد',
    },
    summary: {
      ru: 'Клей для пучков',
      en: 'Adhesive for clusters',
      ar: 'لاصق للعناقيد',
    },
    description: {
      ru: 'Клей для пучковых ресниц. Состав, объём и время схватывания: — УТОЧНЯЕТСЯ —',
      en: 'Adhesive for cluster lashes. Formula, volume and set time: — TO BE CONFIRMED —',
      ar: 'لاصق لرموش العناقيد. التركيب والحجم وزمن التماسك: — قيد التأكيد —',
    },
    category: 'care',
    price: 0,
    images: ['/media/catalog/lash-glue-1.jpg', '/media/catalog/lash-glue-2.jpg'],
    variants: [{ sku: 'CARE-GLUE', length: '—', curl: '—', inStock: true }],
    rank: 17,
  },
  {
    id: 'care-remover',
    slug: 'lash-remover',
    name: {
      ru: 'Ремувер для снятия пучков',
      en: 'Lash Remover',
      ar: 'مزيل الرموش',
    },
    summary: {
      ru: 'Для снятия пучков',
      en: 'For removing clusters',
      ar: 'لإزالة العناقيد',
    },
    description: {
      ru: 'Ремувер для снятия пучков. Состав и объём: — УТОЧНЯЕТСЯ —',
      en: 'Remover for cluster lashes. Formula and volume: — TO BE CONFIRMED —',
      ar: 'مزيل لرموش العناقيد. التركيب والحجم: — قيد التأكيد —',
    },
    category: 'care',
    price: 0,
    images: PLACEHOLDER,
    variants: [{ sku: 'CARE-REMOVER', length: '—', curl: '—', inStock: true }],
    rank: 18,
  },
  {
    id: 'care-primer',
    slug: 'lash-primer',
    name: {
      ru: 'Праймер-обезжириватель для ресниц',
      en: 'Lash Primer & Degreaser',
      ar: 'برايمر ومزيل دهون للرموش',
    },
    summary: {
      ru: 'Подготовка перед нанесением',
      en: 'Prep before application',
      ar: 'تحضير قبل التركيب',
    },
    description: {
      ru: 'Праймер-обезжириватель. Состав и объём: — УТОЧНЯЕТСЯ —',
      en: 'Priming degreaser. Formula and volume: — TO BE CONFIRMED —',
      ar: 'برايمر منظّف للدهون. التركيب والحجم: — قيد التأكيد —',
    },
    category: 'care',
    price: 0,
    images: PLACEHOLDER,
    variants: [{ sku: 'CARE-PRIMER', length: '—', curl: '—', inStock: true }],
    rank: 19,
  },
  {
    id: 'tool-tweezers-curved',
    slug: 'tweezers-curved',
    name: {
      ru: 'Пинцет изогнутый для пучковых ресниц',
      en: 'Curved Tweezers for Cluster Lashes',
      ar: 'ملقط منحنٍ لرموش العناقيد',
    },
    summary: {
      ru: 'Изогнутые кончики',
      en: 'Curved tips',
      ar: 'أطراف منحنية',
    },
    description: {
      ru: 'Пинцет с изогнутыми кончиками. Сталь и размер: — УТОЧНЯЕТСЯ —',
      en: 'Tweezers, curved tips. Steel and size: — TO BE CONFIRMED —',
      ar: 'ملقط بأطراف منحنية. الفولاذ والمقاس: — قيد التأكيد —',
    },
    category: 'tools',
    price: 0,
    images: ['/media/catalog/tweezers-curved-1.jpg'],
    variants: [{ sku: 'TOOL-TWZ-C', length: '—', curl: '—', inStock: true }],
    rank: 20,
  },
  {
    id: 'tool-tweezers-straight',
    slug: 'tweezers-straight',
    name: {
      ru: 'Пинцет прямой для ресниц',
      en: 'Straight Lash Tweezers',
      ar: 'ملقط مستقيم للرموش',
    },
    summary: {
      ru: 'Прямые кончики',
      en: 'Straight tips',
      ar: 'أطراف مستقيمة',
    },
    description: {
      ru: 'Пинцет с прямыми кончиками. Сталь и размер: — УТОЧНЯЕТСЯ —',
      en: 'Tweezers, straight tips. Steel and size: — TO BE CONFIRMED —',
      ar: 'ملقط بأطراف مستقيمة. الفولاذ والمقاس: — قيد التأكيد —',
    },
    category: 'tools',
    price: 0,
    images: PLACEHOLDER,
    variants: [{ sku: 'TOOL-TWZ-S', length: '—', curl: '—', inStock: true }],
    rank: 21,
  },
]

export function byCategory(cat: Category | 'all'): Product[] {
  return cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)
}

export function bySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function inStock(p: Product): boolean {
  return p.variants.some((v) => v.inStock)
}
