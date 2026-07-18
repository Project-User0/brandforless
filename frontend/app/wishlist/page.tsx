import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WishlistPage } from '@/components/pages/wishlist'

export const metadata = {
  title: 'Wishlist - Brand for Less',
  description: 'Your saved favorite items',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <WishlistPage />
      <Footer />
    </main>
  )
}
