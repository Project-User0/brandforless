import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShopPage } from '@/components/pages/shop'

export const metadata = {
  title: 'Shop - Brand for Less',
  description: 'Browse our premium collection of fashion and lifestyle products',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ShopPage />
      <Footer />
    </main>
  )
}
