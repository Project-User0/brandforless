'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store'
import { products } from '@/data/products'

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart()
  const subtotal = getTotalPrice(products)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = Math.round(subtotal * 0.1 * 100) / 100
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground" />
          <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Start shopping to add items</p>
          <Button className="mt-6">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">Shopping Cart</h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div className="space-y-4">
              {items.map((item, idx) => {
                const product = products.find((p) => p.id === item.productId)
                if (!product) return null

                const price = product.discountPrice || product.price
                const itemTotal = price * item.quantity

                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 border-b border-border pb-4"
                  >
                    {/* Image */}
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Color: {item.selectedColor} | Size: {item.selectedSize}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">Rs. {price}</p>
                    </div>

                    {/* Quantity & Total */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="rounded-sm border border-border px-2 py-1 hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="rounded-sm border border-border px-2 py-1 hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Rs.{itemTotal}</p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Button variant="outline" className="w-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-fit rounded-sm border border-border bg-muted/30 p-6"
          >
            <h2 className="font-semibold text-foreground">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">
                  {shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">Rs. {tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button className="mt-6 w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <button
              onClick={clearCart}
              className="mt-3 w-full rounded-sm border border-border bg-transparent py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              Clear Cart
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
