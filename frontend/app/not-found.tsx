import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="px-4">
        <div className="text-center">
          <h1 className="font-serif text-6xl font-bold text-foreground">404</h1>
          <p className="mt-4 text-2xl font-semibold text-foreground">Page Not Found</p>
          <p className="mt-2 text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <Button>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
