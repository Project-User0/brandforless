import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckoutPage } from '@/components/pages/checkout'

export const metadata = {
  title: 'Checkout - Brand for Less',
  description: 'Complete your purchase',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CheckoutPage />
      <Footer />
    </main>
  )
}
