import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { pickLocale } from '@/lib/i18n'

/**
 * Корень сайта. Раньше здесь стоял жёсткий переброс на русскую витрину —
 * покупатель из Дубая попадал на русский с рублями. Теперь язык выбирается
 * по заголовку браузера, а страна и валюта подставляются в StoreProvider.
 */
export default async function RootPage() {
  const h = await headers()
  redirect(`/${pickLocale(h.get('accept-language'))}`)
}
