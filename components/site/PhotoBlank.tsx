import Image from 'next/image'

/**
 * Место под фотографию товара.
 *
 * Съёмку получить не удалось: витрина Gold Apple закрыта защитой от ботов, а от
 * бренда исходников пока нет. Один и тот же кадр на всех карточках читался бы
 * как сбой данных, а пустой серый прямоугольник — как недоделка.
 *
 * Поэтому плитка несёт фирменный знак приглушённо и подпись «— ФОТО —»:
 * повторяющаяся нейтральная метка очевидно читается как заглушка, а название
 * товара и так стоит прямо под ней и дублировать его незачем.
 * Заменяется на реальный кадр одной правкой в lib/catalog.ts.
 */
export function PhotoBlank({
  note,
  compact = false,
}: {
  name?: string
  note: string
  /** В маленькой плитке подпись не помещается и обрезается — оставляем знак. */
  compact?: boolean
}) {
  return (
    <div
      className={`tile flex h-full w-full flex-col items-center justify-center ${compact ? 'gap-0' : 'gap-5'}`}
      title={compact ? note : undefined}
    >
      <span className="block">
        <Image
          src="/media/logo-mark.png"
          alt=""
          width={210}
          height={254}
          aria-hidden="true"
          className={compact ? 'h-6 w-auto opacity-20' : 'h-10 w-auto opacity-15'}
        />
      </span>
      {compact ? <span className="sr-only">{note}</span> : <span className="t-label t-muted">{note}</span>}
    </div>
  )
}
