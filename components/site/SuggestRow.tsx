'use client'

import Image from 'next/image'
import { CONTENT } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import type { Product } from '@/lib/catalog'
import { useStore } from '@/components/StoreProvider'
import { PhotoBlank } from '@/components/site/PhotoBlank'

/**
 * Содержимое одной строки подсказки: миниатюра, название, краткое описание, цена.
 *
 * Семантику задаёт вызывающий — в шапке это option комбобокса, в каталоге
 * обычная ссылка. Поэтому здесь только разметка и ни одного интерактивного
 * элемента: вложенных кнопок и ссылок так не появится.
 */
export function SuggestRow({ product, lang }: { product: Product; lang: Locale }) {
  const t = CONTENT[lang]
  const { price } = useStore()

  return (
    /* Миниатюра 3.5rem плюс вертикальные поля — строка заведомо выше 44 px.
       Меньше нельзя: фотографий у товаров пока нет ни у одного, во всех строках
       стоит PhotoBlank, а его знак с подписью требует 75 px, иначе .tile
       обрезает подпись. Появится съёмка — миниатюру можно ужать. */
    <div className="flex w-full items-center gap-4 py-2">
      <div className="h-14 w-14 shrink-0">
        {product.images[0] ? (
          <div className="tile h-full w-full">
            <Image src={product.images[0]} alt="" width={160} height={160} sizes="80px" />
          </div>
        ) : (
          <PhotoBlank note={t.product.photoBlank} compact />
        )}
      </div>

      {/* min-w-0 обязателен: без него truncate не срабатывает во flex-строке. */}
      <div className="min-w-0 flex-1">
        <span className="t-label block truncate">{product.name[lang]}</span>
        <span className="t-label t-muted mt-1 block truncate">{product.summary[lang]}</span>
      </div>

      <span className="t-price shrink-0 ps-4">{price(product.price)}</span>
    </div>
  )
}
