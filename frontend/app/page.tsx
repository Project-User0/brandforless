import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HomePage } from '@/components/pages/home'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HomePage />
      <Footer />
    </main>
  )
}
