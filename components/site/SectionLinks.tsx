'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { SectionNav } from '@/components/site/SectionNav'
import type { Section } from '@/components/site/CatalogHero'

/**
 * Ряд разделов каталога, знающий активный.
 *
 * Клиентский ровно из-за одного: раздел лежит в адресе, а не в состоянии.
 * Ссылки при этом остаются ссылками — их можно открыть в новой вкладке,
 * скопировать и отдать другому человеку.
 *
 * Переход сохраняет остальные параметры: выбрав длину и изгиб, а потом
 * переключив раздел, покупательница ожидает увидеть тот же фильтр в другой
 * категории, а не сброшенный. И ведёт к сетке — за этим на раздел и нажимают.
 */
export function SectionLinks({
  label,
  sections,
}: {
  label: string
  sections: { key: Section; label: string; count: number }[]
}) {
  const pathname = usePathname()
  const sp = useSearchParams()
  const current = (sp.get('category') as Section | null) ?? 'all'

  const items = sections.map((s) => {
    const p = new URLSearchParams(sp.toString())
    if (s.key === 'all') p.delete('category')
    else p.set('category', s.key)
    const qs = p.toString()
    return {
      ...s,
      href: `${qs ? `${pathname}?${qs}` : pathname}#catalog`,
      current: s.key === current,
    }
  })

  return <SectionNav label={label} items={items} />
}
