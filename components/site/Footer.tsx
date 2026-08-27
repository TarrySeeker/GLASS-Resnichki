import Link from 'next/link'
import { BLANKS, BRAND, BRAND_SUB, CONTENT, SOCIAL } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { AnchorLink } from '@/components/site/AnchorLink'
import { Switchers } from '@/components/site/Switchers'
import { Subscribe } from '@/components/site/Subscribe'
import { PromoCode } from '@/components/site/PromoCode'

/**
 * Футер. Инверсный — это единственная чёрная плоскость на сайте, она закрывает
 * страницу и отделяет витрину от служебного слоя.
 *
 * Три полосы, и порядок в них не декоративный.
 *
 * Первая — то, ради чего сюда доскроллили: подписка и промокод. Обе полезны
 * тому, кто дочитал до конца, и обе бесполезны в начале страницы. Заголовок
 * слева, поле справа: раньше и то и другое стояло в одной левой колонке, форма
 * переносила кнопку на вторую строку даже на 1440, а правая половина полосы
 * оставалась пустой.
 *
 * Вторая — четыре равные колонки по три модуля сетки. До этого левая колонка
 * несла пять разных вещей подряд (марка, контакты, соцсети, форма, промокод),
 * а шесть колонок справа от неё пустовали ниже первой строки: 350 px чёрного
 * ничего. Столбцы теперь кончаются на одной высоте.
 *
 * Третья — служебная: копирайт, переключатели и возврат наверх. Язык, валюта
 * и страна переехали сюда из правого верхнего угла, где висели оторванно от
 * всего; это их обычное место, и оно освобождает верхнюю строку под ссылки.
 *
 * «Наверх» — не украшение: главная длиной 5600 px, и без него единственный
 * способ вернуться к шапке — прокрутить всё обратно.
 *
 * Ссылки колонок получили полную зону касания в 44 px вместо плотной в 26:
 * плотная заведена под хлебные крошки и строки таблиц, а здесь единственная
 * навигация в конце страницы, и промахиваться по ней пальцем нельзя. На
 * телефоне колонки идут в столбик: на 390 в половину ширины не встаёт ни
 * «Конфиденциальность», ни «Доставка и оплата» — они налезали на соседнюю
 * колонку. По две в ряд колонки встают с 640, где на каждую приходится 260 px.
 */
export function Footer({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]

  const cols = [
    {
      title: t.footer.care,
      items: [
        { label: t.footer.delivery, href: `/${lang}/info/delivery` },
        { label: t.footer.returns, href: `/${lang}/info/returns` },
        { label: t.footer.contacts, href: `/${lang}/info/contacts` },
        { label: t.footer.privacy, href: `/${lang}/info/privacy` },
      ],
    },
    {
      title: t.nav.shop,
      items: [
        { label: t.nav.lashes, href: `/${lang}/catalog?category=lashes` },
        { label: t.nav.care, href: `/${lang}/catalog?category=care` },
        { label: t.nav.tools, href: `/${lang}/catalog?category=tools` },
        { label: t.nav.about, href: `/${lang}/info/about` },
      ],
    },
  ]

  /* Полоса условий над футером: три строки того, что известно наверняка.
     Гарантий и обещаний, которых бренд не давал, здесь нет.

     Каждая ведёт на страницу доставки. Строка «СДЭК по России и СНГ» сама по
     себе вызывает вопрос — почему СДЭК и почему не везде, — и ответ должен
     быть в одном нажатии от вопроса, а не в футере через три экрана. */
  const promise = [t.promise.shipping, t.promise.worldwide, t.promise.cost]

  return (
    <>
      <section className="border-y border-[var(--color-rule)]">
        <ul className="wrap grid gap-y-4 py-6 sm:grid-cols-12 sm:gap-x-[var(--col-gap)]">
          {promise.map((line) => (
            <li key={line} className="sm:col-span-4">
              <Link
                href={`/${lang}/info/delivery`}
                className="lnk tap t-label t-muted inline-flex"
              >
                {line}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="on-ink">
        {/* ─── Полоса действий ─────────────────────────────────────────
            Заголовок и обещание слева, поле справа — так же, как читается
            сама фраза: сначала зачем, потом куда вписывать. До этого всё
            стояло в одной левой колонке, а правая половина полосы пустовала. */}
        <div className="wrap grid gap-8 border-b border-[var(--color-rule-ink)] py-10 lg:grid-cols-12 lg:gap-[var(--col-gap)] lg:py-12">
          <div className="min-w-0 lg:col-span-5">
            <h2 id="subscribe-title" className="t-h3">
              {t.footer.subscribeTitle}
            </h2>
            <p className="t-label t-muted max-w-sm pt-3">{t.footer.subscribeNote}</p>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <Subscribe lang={lang} labelledBy="subscribe-title" />

            {/* Промокод под формой и по правому краю: обе строки — про
                выгоду, и обе адресованы тому, кто уже решил покупать. */}
            <div className="pt-6 lg:flex lg:justify-end">
              <PromoCode lang={lang} />
            </div>
          </div>
        </div>

        {/* ─── Колонки ─────────────────────────────────────────────────── */}
        <div className="wrap grid gap-x-8 gap-y-8 py-10 max-sm:gap-y-0 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-[var(--col-gap)] lg:gap-y-10 lg:py-14">
          <div className="min-w-0 lg:col-span-3">
            <p className="t-h2">{BRAND}</p>
            <p className="t-label t-muted pt-1">{BRAND_SUB}</p>
            {/* Телефон и почта — дыры, и выглядят дырами. Ссылка на страницу
                контактов не дублируется: она стоит в колонке «Помощь». */}
            <p className="t-label t-muted pt-6">{BLANKS.phone}</p>
            <p className="t-label t-muted">{BLANKS.email}</p>
          </div>

          {cols.map((col) => (
            <nav key={col.title} className="min-w-0 lg:col-span-3" aria-label={col.title}>
              {/* На телефоне колонка сворачивается. Двенадцать ссылок в столбик
                  давали 1332 px футера — полтора экрана прокрутки мимо того,
                  что почти никому не нужно. Свёрнутые группы дают три строки,
                  а нужную открывают одним касанием.

                  С 1024 раскрытие отменяется классом .fold-static: содержимое
                  показывается всегда, стрелка убирается, и колонка выглядит
                  ровно как раньше. Разметка одна на оба случая. */}
              <details className="fold fold-static">
                <summary className="t-label t-muted">{col.title}</summary>
                <ul className="pt-2">
                  {col.items.map((i) => (
                    <li key={i.label}>
                      <Link href={i.href} className="lnk tap t-nav">
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </nav>
          ))}

          {/* Соцсети текстом, а не значком: во всём футере нет ни одной
              иконки, и логотип чужой площадки читался бы заплаткой. */}
          <nav
            className="min-w-0 max-sm:border-t max-sm:border-[var(--color-rule-ink)] max-sm:pt-4 lg:col-span-3"
            aria-label={t.footer.social}
          >
            <p className="t-label t-muted lg:pt-0">{t.footer.social}</p>
            <ul className="pt-2">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lnk tap t-nav"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ─── Служебная полоса ────────────────────────────────────────── */}
        <div className="wrap flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-[var(--color-rule-ink)] py-6">
          <p className="t-label t-muted order-last w-full lg:order-none lg:w-auto">
            © {new Date().getFullYear()} {BRAND} {BRAND_SUB}. {t.footer.rights}.
          </p>

          <div className="lg:ms-auto">
            <Switchers lang={lang} inline />
          </div>

          <AnchorLink href="#top" targetId="top" className="lnk tap t-nav">
            {t.footer.toTop}
          </AnchorLink>
        </div>
      </footer>
    </>
  )
}
