"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useWishlist } from "@/store";
import { products } from "@/data/products";

export function WishlistPage() {
  const { items } = useWishlist();
  const wishlistProducts = items
    .map((item) => products.find((p) => p.id === item.productId))
    .filter(Boolean) as typeof products;

  if (wishlistProducts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-muted-foreground" />
          <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">
            Your wishlist is empty
          </h1>
          <p className="mt-2 text-muted-foreground">
            Save items you love to your wishlist
          </p>
          <Link href="/shop" className="inline-block mt-6">
            <Button className="cursor-pointer">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">
          My Wishlist
        </h1>
        <p className="mt-2 text-muted-foreground">
          {wishlistProducts.length} item
          {wishlistProducts.length !== 1 ? "s" : ""} saved
        </p>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {wishlistProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
