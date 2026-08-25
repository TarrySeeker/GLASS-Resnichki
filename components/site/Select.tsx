'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

/**
 * Выпадающий список в фирменном стиле.
 *
 * Нативный <select> раскрывается системой: шрифт, отступы, цвет выделения и
 * скруглённая подложка приходят от операционной системы, и повлиять на них
 * нельзя — цвет вариантов единственное, что вообще слушается. На тёмной
 * плоскости футера это давало белым по белому, а на светлой — синюю строку
 * выделения посреди монохромной витрины.
 *
 * Поэтому список свой: бумага, линейка в один пиксель, прописные того же
 * набора, выбранное значение инвертировано — ровно как у чипов фильтра и у
 * подсказок поиска. Одна разметка на все четыре списка витрины: язык, валюта,
 * страна и сортировка каталога.
 *
 * Что пришлось написать руками вместо браузера:
 *   — роли combobox/listbox/option и связь подписи с полем;
 *   — стрелки, Home/End, Enter, пробел, Esc и набор первых букв;
 *   — возврат фокуса на кнопку после выбора и закрытие по нажатию мимо;
 *   — сторона раскрытия: вверх, если снизу нет места, и к концу строки, если
 *     список не помещается по ширине. В футере оба случая настоящие.
 *
 * Мобильного колеса выбора здесь нет, и это осознанная потеря: единый вид
 * важнее системного жеста, а строки списка сделаны в 44 px, чтобы попадание
 * пальцем не стало хуже.
 */
export type SelectOption = { value: string; label: string }

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 10 6"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className="pick-caret"
      data-open={open}
    >
      <path d="M1 1l4 4 4-4" />
    </svg>
  )
}

export function Select({
  label,
  labelHidden = false,
  value,
  options,
  onChange,
  boxed = false,
  block = false,
  disabled = false,
}: {
  label: string
  /** true — только для чтения с экрана, 'mobile' — прячется до 640. */
  labelHidden?: boolean | 'mobile'
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  /** Поле в рамке — для панели региона и корзины. */
  boxed?: boolean
  /** Подпись сверху, поле во всю ширину — для форм, а не для строки. */
  block?: boolean
  disabled?: boolean
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState({ up: false, end: false })
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const typed = useRef({ text: '', at: 0 })

  const selected = options.findIndex((o) => o.value === value)
  const current = options[selected] ?? options[0]

  const close = useCallback((focusBack = true) => {
    setOpen(false)
    if (focusBack) btn.current?.focus()
  }, [])

  const choose = (i: number) => {
    const opt = options[i]
    if (opt) onChange(opt.value)
    close()
  }

  /* Сторона раскрытия считается после отрисовки, но до кадра: список уже
     измерим, а глаз ещё ничего не увидел, поэтому прыжка нет. */
  useLayoutEffect(() => {
    if (!open || !list.current || !btn.current) return
    const l = list.current.getBoundingClientRect()
    const b = btn.current.getBoundingClientRect()
    const rtl = getComputedStyle(document.documentElement).direction === 'rtl'
    setPos({
      up: b.bottom + l.height > window.innerHeight - 8 && b.top - l.height > 8,
      end: rtl ? b.right - l.width < 8 : b.left + l.width > window.innerWidth - 8,
    })
  }, [open])

  useEffect(() => {
    if (open) list.current?.focus()
  }, [open])

  /* Нажатие мимо закрывает. pointerdown, а не click: иначе выбор в другом
     списке успевал бы открыть его и тут же закрыть этим же нажатием. */
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      const root = btn.current?.parentElement
      if (root && !root.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  const openWith = (index: number) => {
    if (disabled) return
    setActive(index < 0 ? 0 : index)
    setOpen(true)
  }

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => Math.min(i + 1, last))
        return
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
        return
      case 'Home':
        e.preventDefault()
        setActive(0)
        return
      case 'End':
        e.preventDefault()
        setActive(last)
        return
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(active)
        return
      case 'Escape':
        e.preventDefault()
        close()
        return
      case 'Tab':
        close(false)
        return
    }

    // Набор первых букв: «ро» находит Россию, не дожидаясь стрелок.
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return
    const now = Date.now()
    typed.current.text = now - typed.current.at > 800 ? e.key : typed.current.text + e.key
    typed.current.at = now
    const needle = typed.current.text.toLocaleLowerCase()
    const hit = options.findIndex((o) => o.label.toLocaleLowerCase().startsWith(needle))
    if (hit >= 0) setActive(hit)
  }

  return (
    <div className={block ? 'flex min-w-0 flex-col gap-2' : 'flex min-w-0 items-center gap-2'}>
      {/* Скрытая подпись остаётся в разметке: aria-labelledby читает и её,
          поэтому имя поля не теряется, когда места на строку нет. */}
      <span
        id={`${id}-label`}
        className={
          labelHidden === true
            ? 'sr-only'
            : labelHidden === 'mobile'
              ? 't-label t-muted hidden sm:inline'
              : 't-label t-muted'
        }
      >
        {label}
      </span>

      <div className={block ? 'pick w-full' : 'pick'}>
        <button
          ref={btn}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-labelledby={`${id}-label ${id}-value`}
          disabled={disabled}
          className={`pick-btn t-nav tap ${boxed ? 'pick-btn-boxed' : ''} ${
            block ? 'w-full justify-between py-3' : ''
          }`}
          onClick={() => (open ? close() : openWith(selected))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
              openWith(selected)
            }
          }}
        >
          <span id={`${id}-value`} className="truncate">
            {current?.label}
          </span>
          <Caret open={open} />
        </button>

        {open ? (
          <ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${id}-label`}
            aria-activedescendant={`${id}-opt-${active}`}
            onKeyDown={onListKey}
            className={`pick-list ${pos.up ? 'pick-list-up' : ''} ${pos.end ? 'pick-list-end' : ''}`}
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={o.value === value}
                data-active={i === active}
                className="pick-opt t-nav"
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
              >
                {o.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
