import { AnchorLink } from '@/components/site/AnchorLink'

/**
 * Ряд входов в разделы каталога — только разметка.
 *
 * Ссылка ведёт к сетке: раздел выбирают, чтобы увидеть его товар, а не чтобы
 * поменять подчёркивание в ряду. Плавность — в AnchorLink.
 *
 * Директивы 'use client' здесь нет намеренно: тот же ряд рисует и подложка на
 * сервере, и клиентская версия, которая читает активный раздел из адреса.
 * Подложка не может содержать useSearchParams — Next отказывается собирать
 * страницу статически, если он оказывается вне границы <Suspense>, а
 * fallback как раз вне её. Отсюда разделение: состояние в SectionLinks,
 * геометрия здесь. Разметка одна на двоих, поэтому после гидратации ряд не
 * сдвигается ни на пиксель.
 */
export type SectionItem = {
  key: string
  label: string
  count: number
  href: string
  current: boolean
}

export function SectionNav({ label, items }: { label: string; items: SectionItem[] }) {
  return (
    <nav aria-label={label} className="border-t border-[var(--color-rule)] pt-4">
      <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
        {items.map((s) => (
          <li key={s.key}>
            <AnchorLink
              href={s.href}
              targetId="catalog"
              prefetch={false}
              aria-current={s.current ? 'true' : undefined}
              className="section-link t-h3"
            >
              {s.label}
              <span className="t-label t-muted tabular-nums">{s.count}</span>
            </AnchorLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
