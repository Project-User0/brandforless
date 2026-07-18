import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartPage } from '@/components/pages/cart'

export const metadata = {
  title: 'Shopping Cart - Brand for Less',
  description: 'Review your shopping cart',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CartPage />
      <Footer />
    </main>
  )
}
