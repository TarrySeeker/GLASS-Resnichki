'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'

/**
 * Вход и регистрация — панель, а не страница.
 *
 * Вход почти всегда случается посреди дела: из корзины, из карточки товара,
 * из письма. Отдельная страница выбрасывает человека оттуда, где он был, и
 * потом приходится возвращать его обратно. Панель закрывается, и страница
 * остаётся та же.
 *
 * Вход и регистрация — не две панели и не две вкладки, а одна форма с одним
 * лишним полем: набор полей у них совпадает, а вкладки заставляют выбирать
 * ярлык до того, как понятно, чем они отличаются. Переключение стоит внизу
 * одной строкой — там, где человек упирается, не найдя своей кнопки.
 *
 * Сервера за формой нет: подтверждение просто открывает кабинет, а о том,
 * что он ещё не подключён, говорит первая строка самого кабинета. Отдельная
 * надпись здесь только удваивала бы то же самое сообщение.
 */
export function SignIn({ lang }: { lang: Locale }) {
  const t = CONTENT[lang]
  const a = t.account
  const router = useRouter()
  const ref = useRef<HTMLDialogElement>(null)
  const [isNew, setNew] = useState(false)

  return (
    <>
      <button
        type="button"
        /* t-nav повторяется здесь, а не берётся от полосы шапки: у кнопки
           text-transform от предка не наследуется, и «Кабинет» стоял строчными
           между ПОИСК и КОРЗИНОЙ. */
        className="lnk tap t-nav whitespace-nowrap"
        onClick={() => ref.current?.showModal()}
      >
        {a.title}
      </button>

      <dialog
        ref={ref}
        aria-label={isNew ? a.signUp : a.signIn}
        /* Нажатие мимо панели закрывает её. Сама панель — прозрачная плоскость
           во весь экран, а видимая часть лежит внутри; клик приходит на
           <dialog> только если он пришёлся в прозрачное, то есть мимо. */
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close()
        }}
        className="drawer fixed inset-0 m-0 h-full max-h-none w-full max-w-none flex-col border-0 bg-transparent p-0 text-[var(--color-ink)] open:flex"
      >
        <div className="mt-auto bg-[var(--color-paper)] lg:m-auto lg:w-full lg:max-w-md">
          <form
            className="wrap flex flex-col gap-6 py-8 lg:px-10"
            onSubmit={(e) => {
              e.preventDefault()
              ref.current?.close()
              router.push(`/${lang}/account`)
            }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="t-h3">{isNew ? a.signUp : a.signIn}</h2>
              <button
                type="button"
                className="lnk tap t-label t-muted"
                onClick={() => ref.current?.close()}
              >
                {t.nav.close}
              </button>
            </div>

            <p className="t-label t-muted">{a.auth.lead}</p>

            <label className="block">
              <span className="t-label t-muted block">{a.auth.email}</span>
              <input
                type="email"
                required
                autoComplete="email"
                className="inp t-nav mt-1"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="t-label t-muted block">{a.auth.password}</span>
              <input
                type="password"
                required
                autoComplete={isNew ? 'new-password' : 'current-password'}
                className="inp t-nav mt-1"
              />
            </label>

            {/* Повтор пароля — единственное отличие регистрации от входа. */}
            {isNew ? (
              <label className="block">
                <span className="t-label t-muted block">{a.auth.passwordRepeat}</span>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  className="inp t-nav mt-1"
                />
              </label>
            ) : (
              <button type="button" className="lnk tap t-label t-muted self-start">
                {a.auth.forgot}
              </button>
            )}

            <button type="submit" className="btn btn-wide">
              {isNew ? a.signUp : a.signIn}
            </button>

            {/* Переход между входом и регистрацией — внизу и одной строкой:
                вкладки заставляли бы выбирать ярлык раньше, чем понятно, чем
                эти два экрана отличаются. */}
            <div className="border-t border-[var(--color-rule)] pt-5">
              <button type="button" className="lnk tap t-label" onClick={() => setNew((v) => !v)}>
                {isNew ? a.auth.hasAccount : a.auth.noAccount}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
