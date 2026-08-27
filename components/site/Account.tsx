'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { BLANKS, CONTENT } from '@/lib/content'
import { COUNTRIES, countryLabel, type Locale } from '@/lib/i18n'
import { Select } from '@/components/site/Select'

/**
 * Личный кабинет — разделы, которым нужен браузер.
 *
 * Сервера за ними нет: формы показывают раскладку и состояния, но ничего не
 * отправляют. Это сказано вслух на самой странице (`account.note`) — так же,
 * как витрина говорит про неподключённую рассылку, а не молчит и делает вид.
 *
 * Отсюда и главное решение: никаких выдуманных данных. Сохранённый адрес,
 * заказ и трек-номер выглядят как `— АДРЕС —` и `— ДАННЫЕ —`, то есть теми же
 * заглушками, что цена и отзыв на витрине. Дыру видно, и её закрывает бэкенд,
 * а не наша фантазия.
 *
 * Три раздела в одном файле, потому что у них общий словарь полей и общий
 * приём: подпись сверху, линия снизу, кнопка действия под формой. Порознь это
 * были бы три файла с одинаковой шапкой импортов.
 */

/** Поле с подписью. Одна разметка на весь кабинет. */
function Field({
  label,
  hint,
  type = 'text',
  autoComplete,
  placeholder,
  textarea = false,
}: {
  label: string
  hint?: string
  type?: string
  autoComplete?: string
  placeholder?: string
  textarea?: boolean
}) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="t-label t-muted block">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} className="inp t-nav mt-1" placeholder={placeholder} />
      ) : (
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="inp t-nav mt-1"
        />
      )}
      {hint ? <p className="t-label t-muted pt-2">{hint}</p> : null}
    </div>
  )
}

/* ─── Профиль ──────────────────────────────────────────────────────────────
   Пять полей и пароль отдельным блоком. Пароль не стоит рядом с телефоном
   намеренно: это другое действие с другими последствиями, и оно требует
   подтверждения, которого у остальных полей нет. */
export function AccountProfile({ lang }: { lang: Locale }) {
  const t = CONTENT[lang].account

  return (
    <div>
      <p className="t-lead">{t.profile.lead}</p>

      <form
        className="mt-8 grid gap-6 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        aria-describedby="account-off"
      >
        <Field label={t.profile.name} autoComplete="given-name" />
        <Field label={t.profile.surname} autoComplete="family-name" />
        <Field label={t.profile.email} type="email" autoComplete="email" placeholder={BLANKS.email} />
        <Field label={t.profile.phone} type="tel" autoComplete="tel" placeholder={BLANKS.phone} />
        <div className="sm:col-span-2 sm:max-w-[calc(50%-0.75rem)]">
          <Field
            label={t.profile.birthday}
            hint={t.profile.birthdayHint}
            type="date"
            autoComplete="bday"
          />
        </div>

        <div className="sm:col-span-2">
          <button type="submit" className="btn btn-wide">
            {t.profile.save}
          </button>
        </div>
      </form>

      {/* Пароль отдельным блоком, и в нём только кнопка: пустое поле
          «текущий пароль» на странице профиля ничего не показывает и не
          делает — смену пароля всё равно спрашивают отдельным шагом. */}
      <section className="mt-12 border-t border-[var(--color-rule)] pt-8">
        <h2 className="t-h3">{t.profile.security}</h2>
        <p className="t-label t-muted mt-3">{t.profile.password}: ••••••••</p>
        <button type="button" className="btn btn-ghost btn-wide mt-6">
          {t.profile.passwordChange}
        </button>
      </section>
    </div>
  )
}

/* ─── Адреса ───────────────────────────────────────────────────────────────
   Список карточек и панель добавления. Панель — <dialog>, а не форма под
   списком: адрес вводят редко, и семь полей, постоянно висящих на странице,
   выглядели бы главным содержимым раздела, которым они не являются. */
export function AccountAddresses({ lang }: { lang: Locale }) {
  const t = CONTENT[lang].account
  const sheet = useRef<HTMLDialogElement>(null)
  const [country, setCountry] = useState(COUNTRIES[0].code)

  return (
    <div>
      <p className="t-lead">{t.addresses.lead}</p>

      {/* Две карточки-заглушки: одна основная, одна обычная. Показать нужно
          именно разницу между ними — она и есть весь смысл списка. */}
      <ul className="mt-8 flex flex-col">
        {[true, false].map((main) => (
          <li
            key={String(main)}
            className="flex flex-wrap items-start justify-between gap-4 border-t border-[var(--color-rule)] py-6"
          >
            <div className="min-w-0">
              {main ? <p className="t-label mb-2">{t.addresses.main}</p> : null}
              <p className="t-nav">{BLANKS.address}</p>
              <p className="t-label t-muted pt-2">{BLANKS.phone}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {main ? null : (
                <button type="button" className="lnk tap t-label t-muted">
                  {t.addresses.makeMain}
                </button>
              )}
              <button type="button" className="lnk tap t-label">
                {t.addresses.edit}
              </button>
              <button type="button" className="lnk tap t-label t-muted">
                {t.addresses.remove}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-wide mt-8"
        onClick={() => sheet.current?.showModal()}
      >
        {t.addresses.add}
      </button>

      <dialog
        ref={sheet}
        aria-label={t.addresses.add}
        className="drawer fixed inset-0 m-0 h-full max-h-none w-full max-w-none flex-col border-0 bg-transparent p-0 text-[var(--color-ink)] open:flex"
      >
        <form
          method="dialog"
          className="my-auto"
        >
          <div className="wrap flex flex-col gap-6 py-8 lg:px-10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="t-h3">{t.addresses.add}</h2>
              <button type="submit" className="lnk tap t-label t-muted">
                {t.addresses.cancel}
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={t.addresses.recipient} autoComplete="name" />
              <Field label={t.addresses.phone} type="tel" autoComplete="tel" />
              <div className="sm:col-span-2">
                <Select
                  label={t.addresses.country}
                  block
                  value={country}
                  onChange={setCountry}
                  options={COUNTRIES.map((c) => ({ value: c.code, label: countryLabel(c, lang) }))}
                />
              </div>
              <Field label={t.addresses.city} autoComplete="address-level2" />
              <Field label={t.addresses.zip} autoComplete="postal-code" />
              <div className="sm:col-span-2">
                <Field label={t.addresses.street} autoComplete="street-address" />
              </div>
            </div>

            <label className="t-label flex items-center gap-3">
              <input type="checkbox" className="size-4 accent-[var(--color-ink)]" />
              {t.addresses.makeMain}
            </label>

            <button type="submit" className="btn btn-wide">
              {t.addresses.save}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

/* ─── Возврат ──────────────────────────────────────────────────────────────
   Единственная форма кабинета, которой нужен настоящий JavaScript: бриф
   требует перетаскивание файлов и превью до отправки. Файлы никуда не идут —
   превью строится из blob-ссылки в самом браузере и освобождается при снятии
   кадра, иначе ссылки копятся до перезагрузки страницы. */
const MAX_PHOTOS = 5

export function AccountReturn({ lang }: { lang: Locale }) {
  const t = CONTENT[lang].account
  const [reason, setReason] = useState('0')
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([])
  const [over, setOver] = useState(false)
  const [sent, setSent] = useState(false)
  const pick = useRef<HTMLInputElement>(null)

  // Освобождаем blob-ссылки при уходе со страницы: браузер держит файл в
  // памяти, пока ссылка жива, и без этого кадры остаются в ней навсегда.
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos])

  const take = (files: FileList | null) => {
    if (!files) return
    const next = [...files]
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, MAX_PHOTOS - photos.length)
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
    if (next.length) setPhotos((p) => [...p, ...next])
  }

  const drop = (i: number) => {
    URL.revokeObjectURL(photos[i].url)
    setPhotos((p) => p.filter((_, n) => n !== i))
  }

  return (
    <div>
      <p className="t-lead">{t.returns.lead}</p>

      <form
        className="mt-8 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          setSent(true)
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={t.returns.order} placeholder={BLANKS.data} />
          <Field label={t.returns.item} placeholder={BLANKS.data} />
        </div>

        <Select
          label={t.returns.reason}
          block
          value={reason}
          onChange={setReason}
          options={t.returns.reasons.map((r, i) => ({ value: String(i), label: r }))}
        />

        <Field label={t.returns.comment} textarea />

        <div>
          <p className="t-label t-muted">{t.returns.photos}</p>

          {/* Зона приёма — не кнопка и не label: внутри неё лежит своя кнопка
              выбора файлов, и вложенная интерактивность в label ломает
              клавиатуру. Перетаскивание ловится на div, выбор — на кнопке. */}
          <div
            className="drop mt-2"
            data-over={over}
            onDragOver={(e) => {
              e.preventDefault()
              setOver(true)
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              take(e.dataTransfer.files)
            }}
          >
            <p className="t-label t-muted">{t.returns.photosHint}</p>
            <button
              type="button"
              className="btn btn-ghost mt-4"
              onClick={() => pick.current?.click()}
              disabled={photos.length >= MAX_PHOTOS}
            >
              {t.returns.photosPick}
            </button>
            {/* Настоящее поле файлов спрятано и убрано из обхода: нажимают
                кнопку рядом, а два элемента с одним именем читались бы с
                экрана как два разных способа выбрать файл. */}
            <input
              ref={pick}
              type="file"
              accept="image/*"
              multiple
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
              onChange={(e) => {
                take(e.target.files)
                e.target.value = ''
              }}
            />
          </div>

          {photos.length ? (
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map((p, i) => (
                <li key={p.url} className="relative">
                  <span className="tile block aspect-square">
                    {/* Кадр из памяти браузера: next/image здесь не нужен и
                        не может помочь — оптимизировать нечего. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="size-full object-cover" />
                  </span>
                  <button
                    type="button"
                    onClick={() => drop(i)}
                    aria-label={`${t.returns.photosRemove}: ${p.name}`}
                    className="tap absolute end-1 top-1 bg-[var(--color-paper)] px-2 leading-none"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <button type="submit" className="btn btn-wide self-start">
          {t.returns.send}
        </button>

        <p className="t-label t-muted min-h-[1.4em]" aria-live="polite">
          {sent ? t.returns.sent : ''}
        </p>
      </form>
    </div>
  )
}
