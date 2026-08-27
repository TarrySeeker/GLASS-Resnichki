'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { Switchers } from '@/components/site/Switchers'
import { PromoBar } from '@/components/site/PromoBar'
import { CartCount } from '@/components/site/CartCount'
import { FavCount } from '@/components/site/FavCount'
import { IconBag, IconHeart } from '@/components/site/Icon'
import { SearchPanel } from '@/components/site/SearchPanel'
import { SignIn } from '@/components/site/SignIn'
import { PRODUCTS } from '@/lib/catalog'

/**
 * Шапка. Клиентская, потому что показывает счётчик корзины и открывает меню.
 *
 * Мобильное решение отдельное: на 390 навигация уезжает в полноэкранную панель,
 * а в шапке остаются только логотип, поиск и корзина — три цели, в которые
 * попадают большим пальцем.
 */
export function Header({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const [open, setOpen] = useState(false)

  const links = [
    { href: `/${lang}/catalog`, label: t.nav.shop },
    { href: `/${lang}/catalog?category=lashes`, label: t.nav.lashes },
    { href: `/${lang}/catalog?category=care`, label: t.nav.care },
    { href: `/${lang}/catalog?category=tools`, label: t.nav.tools },
    { href: `/${lang}/info/about`, label: t.nav.about },
  ]

  /**
   * Служебные страницы. До этого они жили только в футере, и вопрос «когда
   * приедет и как вернуть» заставлял прокрутить всю страницу до конца — а
   * задают его чаще всего до покупки, а не после. Тот же список, та же панель,
   * что у каталога: в шапке он стоит рядом с решением, которое от него
   * зависит.
   */
  const care = [
    { href: `/${lang}/info/delivery`, label: t.footer.delivery },
    { href: `/${lang}/info/returns`, label: t.footer.returns },
    { href: `/${lang}/info/contacts`, label: t.footer.contacts },
    { href: `/${lang}/info/privacy`, label: t.footer.privacy },
  ]

  /**
   * Коллекции в выпадающей панели.
   *
   * Плоский ряд из пяти ссылок был нормален для пятнадцати позиций. Сейчас их
   * двадцать одна, и шесть коллекционных линеек не видно ниоткуда, кроме
   * блока на главной. Панель раскрывается наведением и, что важнее,
   * получением фокуса с клавиатуры — состояния в JS нет вовсе, поэтому нечему
   * рассинхронизироваться и не нужно ловить нажатие мимо панели.
   *
   * На телефоне панели нет: там всё меню и так развёрнуто списком.
   */
  const collections = PRODUCTS.filter((p) => p.id.startsWith('glass-'))

  return (
    <>
      <PromoBar lang={lang} />
      <header className="sticky top-0 z-50 border-b border-[var(--color-rule)] bg-[var(--color-paper)]">
      <div className="wrap flex h-[var(--header-h)] items-center gap-4">
        <button
          type="button"
          className="t-nav tap -ms-2 px-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t.nav.close : t.nav.menu}
        </button>

        {/* Логотип разложен на знак и надпись: вертикальный локап целиком
            в полосе высотой 72px нечитаем — слово GLASS сжималось бы до 8px. */}
        <Link href={`/${lang}`} className="tap gap-3" aria-label="GLASS OWM">
          <Image src="/media/logo-mark.png" alt="" width={210} height={254} priority className="h-9 w-auto" />
          {/* Пока меню открыто, слово прячется, а знак остаётся: «Закрыть»
              шире «Меню» на тридцать пикселей, и на 390 логотип наезжал на
              корзину. Марка при этом никуда не девается. */}
          <Image
            src="/media/logo-word.png"
            alt=""
            width={770}
            height={116}
            priority
            className={`h-4 w-auto ${open ? 'hidden lg:block' : ''}`}
          />
        </Link>

        <nav aria-label={t.nav.menu} className="t-nav ms-6 hidden items-center gap-5 whitespace-nowrap lg:flex xl:ms-8">
          <div className="group/nav relative">
            <Link href={`/${lang}/catalog`} className="lnk tap">
              {t.nav.shop}
            </Link>

            <div className="invisible absolute start-0 top-full z-10 -translate-y-1 opacity-0 transition-[opacity,translate,visibility] duration-[var(--dur)] ease-[var(--ease-brand)] group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
              <div className="mt-px grid w-max grid-cols-2 gap-x-14 gap-y-3 border border-[var(--color-rule)] bg-[var(--color-paper)] p-7">
                <p className="t-label t-muted">{t.catalog.category}</p>
                <p className="t-label t-muted">{t.blocks.collectionsTitle}</p>

                <ul className="flex flex-col gap-1">
                  {links.slice(1).map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="lnk tap-sm block py-1">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="flex flex-col gap-1">
                  {collections.map((p) => (
                    <li key={p.id}>
                      <Link href={`/${lang}/product/${p.slug}`} className="lnk tap-sm block py-1">
                        {p.slug.replace(/-/g, ' ').toUpperCase()}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Разделы каталога живут в плашке слева и в строке не повторяются:
              вместе с «О бренде» они занимали 400 px, а на 1024 их вовсе не
              было куда поставить. «О бренде» возвращается в строку с 1536,
              где место есть; ниже он там же, в плашке. */}
          <Link href={`/${lang}/info/about`} className="lnk tap hidden 2xl:inline-flex">
            {t.nav.about}
          </Link>

          {/* Служебные разделы стоят в строке ссылками, а не за словом
              «Помощь»: вопрос «когда приедет и как вернуть» задают до покупки,
              и лишнее наведение на пути к ответу здесь ни к чему.

              Три из четырёх: «Конфиденциальность» набором шапки требует
              207 px — с ней строка перестаёт помещаться даже на 1536. Это
              юридическая страница, её место в футере, где она и осталась.

              Ниже 1280 в строке нет места и на три, поэтому там они
              сворачиваются в ту же плашку, что была раньше. */}
          {care.slice(0, 3).map((l) => (
            <Link key={l.href} href={l.href} className="lnk tap hidden xl:inline-flex">
              {l.label}
            </Link>
          ))}

          <div className="group/care relative xl:hidden">
            <Link href={`/${lang}/info/delivery`} className="lnk tap">
              {t.footer.care}
            </Link>

            <div className="invisible absolute start-0 top-full z-10 -translate-y-1 opacity-0 transition-[opacity,translate,visibility] duration-[var(--dur)] ease-[var(--ease-brand)] group-focus-within/care:visible group-focus-within/care:translate-y-0 group-focus-within/care:opacity-100 group-hover/care:visible group-hover/care:translate-y-0 group-hover/care:opacity-100">
              <ul className="mt-px flex w-max flex-col gap-1 border border-[var(--color-rule)] bg-[var(--color-paper)] p-7">
                {care.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="lnk tap-sm block py-1">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Правый угол — знаками. Словами он стоил 250 px, и из-за них
            избранное пряталось до 640, а язык с валютой — до 1280. Знаки
            возвращают на место и то и другое, а слова остаются в мобильном
            меню, где на них есть место. */}
        <div className="t-nav ms-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden lg:block">
            <Switchers lang={lang} compact fields={['lang', 'currency']} />
          </div>
          {/* Настоящий поиск по сайту вместо ссылки на каталог. На телефоне
              его в шапке нет: он стоит первой строкой в самом меню. */}
          <span className="hidden sm:inline-flex">
            <SearchPanel lang={lang} />
          </span>

          {/* Кабинет открывается панелью входа: на телефоне он в меню. */}
          <span className="hidden sm:inline-flex">
            <SignIn lang={lang} />
          </span>

          {/* Сердце на карточке складывало товар в хранилище с самого начала,
              но открыть отложенное было негде. Вход стоит рядом с корзиной:
              это два одинаковых по смыслу списка, и ищут их в одном месте. */}
          <Link href={`/${lang}/favorites`} className="lnk tap tap-icon whitespace-nowrap">
            <IconHeart />
            <span className="sr-only">{t.nav.favorites}</span>
            <FavCount />
          </Link>

          <Link href={`/${lang}/cart`} className="lnk tap tap-icon whitespace-nowrap">
            <IconBag />
            <span className="sr-only">{t.nav.cart}</span>
            <span className="ms-1">
              <CartCount />
            </span>
          </Link>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="wrap border-t border-[var(--color-rule)] py-4 lg:hidden">
          <div className="border-b border-[var(--color-rule)] pb-3">
            <SearchPanel lang={lang} label />
          </div>
          <ul className="t-h3 flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-[var(--color-rule)]">
                <Link href={l.href} className="block py-4" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* На телефоне панели нет — служебные ссылки идут списком сразу
              под основными, мелким кеглем: это не витрина, а справка. */}
          <ul className="t-nav pt-4">
            {care.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="lnk tap block py-2" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="t-nav flex items-center gap-6 border-y border-[var(--color-rule)] py-4">
            <SignIn lang={lang} label />
            <Link
              href={`/${lang}/favorites`}
              className="lnk tap"
              onClick={() => setOpen(false)}
            >
              {t.nav.favorites}
              <FavCount />
            </Link>
          </div>
          <div className="pt-6">
            <Switchers lang={lang} fields={['lang', 'currency']} />
          </div>
        </nav>
      ) : null}
      </header>
    </>
  )
}

