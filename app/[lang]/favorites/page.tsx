import { notFound } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import { LOCALES, isLocale } from '@/lib/i18n'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { FavoritesView } from '@/components/site/FavoritesView'

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return {
    title: CONTENT[lang].favorites.title,
    // Список личный и у каждого свой: в выдаче ему делать нечего — как и корзине.
    alternates: { canonical: `/${lang}/favorites` },
    robots: { index: false, follow: true },
  }
}

export default async function FavoritesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <>
      <Header lang={lang} />
      <main>
        <FavoritesView lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
