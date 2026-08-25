import { notFound } from 'next/navigation'
import { CONTENT } from '@/lib/content'
import { isLocale } from '@/lib/i18n'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { CartView } from '@/components/site/CartView'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return {
    title: CONTENT[lang].cart.title,
    // Без своей canonical корзина наследовала главную из макета и склеивалась
    // с ней в индексе. Индексировать её незачем — отсюда и noindex.
    alternates: { canonical: `/${lang}/cart` },
    robots: { index: false, follow: true },
  }
}

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <>
      <Header lang={lang} />
      <main>
        <CartView lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
