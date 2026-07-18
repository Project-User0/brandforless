"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useCart, useWishlist } from "@/store";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false); // Track client mounting
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const { isInWishlist, addItem: addToWishlist, removeItem } = useWishlist();
// Handle mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe check: default to false on server, check real state on client
  const inWishlist = mounted ? isInWishlist(product.id) : false;

  const discountPercent = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents link navigation

    addItem({
      productId: product.id,
      quantity,
      selectedSize,
      selectedColor: selectedColor.name,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mounted) return;
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div className="group relative h-full overflow-hidden rounded-sm bg-card hover:shadow-lg">
        <Link href={`/products/${product.slug}`}>
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.isNew && <Badge variant="default">New</Badge>}
              {product.isBestseller && (
                <Badge variant="secondary">Best Seller</Badge>
              )}
              {discountPercent > 0 && (
                <Badge variant="destructive">-{discountPercent}%</Badge>
              )}
            </div>

            {/* Quick View Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
              <Button
                variant="secondary"
                className="translate-y-10 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
              >
                <span>Quick View</span>
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </p>
            <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
              {product.title}
            </h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {product.subtitle}
            </p>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-md ${
                      i < Math.round(product.rating)
                        ? "text-neutral-900"
                        : "text-muted-foreground"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-base font-bold text-foreground">
                Rs. {product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  Rs.{product.price}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="flex justify-between items-center pointer-events-auto px-2 pb-2">
          <Button onClick={handleAddToCart} size="lg">
            Add to Cart
          </Button>

          <button
            onClick={handleWishlistToggle}
            className="rounded-full bg-white p-2 shadow-md dark:bg-muted"
            aria-label="Wishlist"
          >
            <Heart
              size={20}
              className={
                inWishlist
                  ? "fill-primary text-primary-foreground"
                  : "text-muted-foreground"
              }
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
