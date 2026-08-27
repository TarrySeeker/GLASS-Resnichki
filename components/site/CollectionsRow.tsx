import Image from 'next/image'
import { AnchorLink } from '@/components/site/AnchorLink'
import { CONTENT } from '@/lib/content'
import { plural, type Locale } from '@/lib/i18n'
import { LOOKS, lookCount, lookQuery } from '@/lib/looks'

/**
 * Коллекции — вход в каталог не по артикулу, а по результату.
 *
 * Стоит между заголовком раздела и фильтром намеренно. Фильтр спрашивает
 * «сколько миллиметров и какой изгиб» — это язык мастера, и до него нужно
 * дорасти. Коллекция спрашивает «какой эффект» — это язык покупательницы, и
 * с него разговор начинается.
 *
 * Каждая плитка ведёт в ту же сетку ниже, с проставленным фильтром: не на
 * другую страницу и не в отдельный раздел. Якорь `#catalog` возвращает к
 * сетке, иначе переход выбрасывал бы к началу страницы, и результат выбора
 * оказывался бы за экраном.
 *
 * Число под именем считается по тем же данным, что и сетка. Оно же
 * защищает от вранья при смене ассортимента: исчезнут товары нужной длины —
 * под коллекцией честно встанет ноль, а не пустая сетка после нажатия.
 */
export function CollectionsRow({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  return (
    <section className="sec border-t border-[var(--color-rule)]">
      <div className="wrap">
        <h2 className="t-h2">{t.blocks.looksTitle}</h2>

        <ul className="mt-10 grid grid-cols-12 gap-x-[var(--col-gap)] gap-y-8">
          {t.blocks.looks.map((look, i) => {
            const source = LOOKS[i]
            if (!source) return null
            const count = lookCount(source)

            return (
              <li key={look.name} className="col-span-6 lg:col-span-3">
                {/* Прокрутка к сетке — весь смысл перехода: без неё человек
                    остаётся на том же экране, и выбор коллекции выглядит
                    нажатием, которое ничего не сделало. */}
                <AnchorLink
                  href={`/${lang}/catalog?${lookQuery(source)}#catalog`}
                  targetId="catalog"
                  className="group block"
                >
                  {/* Квадрат, а не вертикаль: съёмка бренда квадратная, и в
                      вытянутой плитке упаковку срезает по бокам. */}
                  <span className="tile block aspect-square">
                    <Image
                      src={source.image}
                      alt=""
                      width={1200}
                      height={1200}
                      sizes="(max-width: 1024px) 50vw, 23vw"
                      className="opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </span>
                  <span className="t-h3 mt-4 block">{look.name}</span>
                  <span className="t-label t-muted mt-1 block">{look.effect}</span>
                  <span className="t-label mt-2 block">{look.spec}</span>
                  <span className="t-label t-muted mt-2 block tabular-nums">
                    {plural(count, lang, t.catalog.items)}
                  </span>
                </AnchorLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
