'use client'

import { useState } from 'react'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'

/**
 * Форма подписки в футере.
 *
 * Единственное место на сайте, где посетитель может оставить след, ничего
 * не купив. До этого у витрины не было ни одной формы: тот, кто пришёл
 * посмотреть и не решился, уходил насовсем.
 *
 * Состояний три, и ни одно из них не врёт: отправлено, ошибка адреса и
 * «рассылка ещё не подключена» — последнее приходит от ручки, когда сервис
 * не задан. Показывать «спасибо, вы подписаны» в этом случае нельзя.
 *
 * Адрес проверяется здесь, а не браузером. С `required` и `type="email"`
 * браузер перехватывал отправку раньше формы и показывал системную жёлтую
 * подсказку — единственный элемент на витрине, нарисованный не нами, и
 * единственное сообщение не нашими словами. Своё состояние ошибки при этом
 * не срабатывало никогда и лежало мёртвым кодом.
 *
 * Заголовок и подпись живут снаружи: в футере они стоят слева, а поле —
 * справа, и держать их в одном компоненте значило бы держать в одной колонке.
 * Имя полю даёт этот заголовок через aria-labelledby, поэтому подпись не
 * дублируется ради разметки.
 */
type State = 'idle' | 'sending' | 'ok' | 'bad' | 'off'

export function Subscribe({ lang, labelledBy }: { lang: Locale; labelledBy: string }) {
  const t = CONTENT[lang]
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  const message =
    state === 'ok'
      ? t.footer.subscribeOk
      : state === 'off'
        ? t.footer.subscribeOff
        : state === 'bad'
          ? t.footer.subscribeBad
          : ''

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault()
        // Проверка нарочно грубая: точную правильность адреса знает только
        // письмо, которое по нему дойдёт. Здесь ловится опечатка, а не
        // соответствие RFC, и цена ошибки — одна лишняя строка под полем.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
          setState('bad')
          return
        }
        setState('sending')
        try {
          const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email }),
          })
          if (res.ok) {
            setState('ok')
            setEmail('')
          } else setState('off')
        } catch {
          setState('off')
        }
      }}
    >
      {/* Переносится только на узких экранах: кнопка с полем в одну строку
          требует 340 px, а на 390 после полей остаётся 336. На широком
          переноса быть не должно — разорванная надвое форма читается
          сломанной. */}
      <div className="flex w-full flex-wrap gap-px sm:flex-nowrap">
        <input
          id="subscribe-email"
          type="email"
          aria-labelledby={labelledBy}
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setState('idle')
          }}
          placeholder="you@example.com"
          aria-invalid={state === 'bad'}
          aria-describedby={message ? 'subscribe-msg' : undefined}
          className="t-nav min-w-0 flex-1 basis-48 border border-[var(--color-rule-ink)] bg-transparent px-3 py-3 placeholder:text-[#a9a29a]"
        />
        {/* Гасится только на время отправки. Кнопка, погашенная из-за пустого
            поля, встречает человека серым прямоугольником и читается
            сломанной; пустой адрес и так не пройдёт — поле обязательное. */}
        <button type="submit" className="btn btn-wide shrink-0 px-5" disabled={state === 'sending'}>
          {t.footer.subscribeCta}
        </button>
      </div>

      {/* Ответ объявляется вслух: на монохромной витрине смена состояния
          формы иначе остаётся незамеченной. */}
      <p id="subscribe-msg" className="t-label t-muted pt-3 min-h-[1.4em]" aria-live="polite">
        {message}
      </p>
    </form>
  )
}
