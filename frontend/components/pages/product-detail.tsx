'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useCart, useWishlist } from '@/store'
import { ProductCard } from '@/components/product-card'
import { products } from '@/data/products'
import { ProductReviews } from '../admin/users/product-review'

interface ProductDetailPageProps {
  product: Product
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

const handleAddToCart = () => {
  addItem({
    productId: product.id,
    quantity,
    selectedSize: selectedSize || null,
    selectedColor: selectedColor?.name || null,
  })
}

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* Product Section */}
      <div className="border-b border-border px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
                {discountPercent > 0 && (
                  <div className="absolute left-4 top-4">
                    <Badge variant="destructive">-{discountPercent}%</Badge>
                  </div>
                )}
              </div>
              
              {/* Responsive Thumbnails (Scrollable horizontally on mobile, normal wrapping on desktop) */}
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x lg:overflow-visible lg:flex-wrap">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square w-20 flex-shrink-0 snap-start overflow-hidden rounded-sm border-1 transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {product.brand}
                </p>
                <h1 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {product.title}
                </h1>
                <p className="mt-2 text-base sm:text-lg text-muted-foreground">{product.subtitle}</p>

                {/* Rating */}
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.round(product.rating) ? 'text-neutral-900' : 'text-muted-foreground'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    Rs. {product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-lg sm:text-xl text-muted-foreground line-through">
                      Rs. {product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground">{product.fullDescription}</p>

              {/* Options */}
              <div className="space-y-4">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground">Color</label>
                  <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 rounded-sm border-1 px-3 py-1.5 sm:px-4 sm:py-2 transition-all ${
                          selectedColor.name === color.name
                            ? 'border-primary'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div
                          className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-border flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs sm:text-sm">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="max-w-xs">
                  <label className="block text-sm font-medium text-foreground">Size</label>
                  <Select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="mt-3 w-full h-9 border border-gray-200"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-foreground">Quantity</label>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-sm border border-border px-4 py-2 hover:bg-muted select-none"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-sm border border-border px-4 py-2 hover:bg-muted select-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button onClick={handleAddToCart} size="lg" className="w-full sm:flex-1">
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlist}
                  variant='outline'
                  size="lg"
                  className="w-full sm:flex-1 gap-2"
                >
                  <Heart size={20} className={inWishlist ? 'fill-black' : ''} />
                  {inWishlist ? 'Saved' : 'Save'}
                </Button>
              </div>

              {/* Info Boxes */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-foreground">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw size={20} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-foreground">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-foreground">Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">SSL encrypted payments</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground">Product Details</h3>
                <dl className="mt-4 space-y-2">
                  <div className="flex gap-4">
                    <dt className="text-sm text-muted-foreground w-20 flex-shrink-0">Material:</dt>
                    <dd className="text-sm font-medium text-foreground">{product.material}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="text-sm text-muted-foreground w-20 flex-shrink-0">Care:</dt>
                    <dd className="text-sm font-medium text-foreground">{product.care}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="text-sm text-muted-foreground w-20 flex-shrink-0">Stock:</dt>
                    <dd className="text-sm font-medium text-foreground">
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Related Products</h2>
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}