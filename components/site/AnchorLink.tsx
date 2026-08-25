'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Ссылка, которая доезжает до места на этой же странице.
 *
 * Одного `scroll-behavior: smooth` на html не хватает: роутер Next специально
 * отключает плавность на время перехода — ему нужна предсказуемая позиция, а
 * не анимация, — и якорь в адресе отрабатывает мгновенным скачком. Поэтому
 * прокрутку делаем сами, а роутеру говорим не трогать её вовсе.
 *
 * Ссылка остаётся ссылкой: якорь никуда не делся из адреса, поэтому открытие
 * в новой вкладке, копирование и работа без JS ведут туда же, куда и нажатие.
 *
 * Цель ищется в момент нажатия, а не заранее: сетка уже стоит на странице,
 * меняется только её содержимое, поэтому ждать перехода незачем — прокрутка
 * и пересборка сетки идут одновременно.
 */
export function AnchorLink({
  href,
  targetId,
  className,
  children,
  ...rest
}: {
  href: string
  /** id элемента на этой же странице, к которому нужно доехать. */
  targetId: string
  className?: string
  children: ReactNode
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children' | 'scroll'>) {
  return (
    <Link
      href={href}
      scroll={false}
      className={className}
      onClick={() => {
        const el = document.getElementById(targetId)
        if (!el) return
        // Значение поведения задаётся явно, поэтому CSS-правило для тех, кто
        // просил меньше движения, сюда не достаёт — спрашиваем сами.
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' })
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
