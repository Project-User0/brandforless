"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, LayoutGrid, Grid3X3, ArrowUpDown } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { collections } from "../page"; // Adjust import path if needed
import { products } from "@/data/products"; // Adjust import path if needed

interface PageProps {
  params: Promise<{ slug: string }>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CollectionDetailPage({ params }: PageProps) {
  // Next.js 15+ async params unwrapping
  const { slug } = use(params);

  // Find target collection
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  // Filter products by collection's productIds
  const rawCollectionProducts = products.filter((product) =>
    collection.productIds.includes(String(product.id))
  );

  // Interactive state
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

  // Sorting Logic
  const collectionProducts = [...rawCollectionProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default featured order
  });

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="w-full">
        {/* Hero Editorial Banner */}
        <section className="relative w-full border-b border-neutral-100 bg-neutral-50 px-4 py-12 sm:px-8 sm:py-20 lg:px-16">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumbs / Back Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Collections</span>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              {/* Left Column: Text & Editorial Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 space-y-4"
              >
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
                  <span>{collection.edition || "Capsule Collection"}</span>
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  <span>{collectionProducts.length} Pieces</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-neutral-900">
                  {collection.name}
                </h1>

                {collection.tagline && (
                  <p className="font-serif italic text-lg sm:text-xl text-neutral-500 font-light">
                    &ldquo;{collection.tagline}&rdquo;
                  </p>
                )}

                <div className="h-[1px] w-16 bg-neutral-900 my-4" />

                <p className="max-w-xl text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                  {collection.description}
                </p>
              </motion.div>

              {/* Right Column: Collection Mood Board Cover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-xs border border-neutral-200/80 bg-neutral-100 shadow-sm"
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  priority
                  className="object-cover mix-blend-multiply"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Toolbar & Filter Options */}
        <section className="sticky top-0 z-20 border-b border-neutral-100 bg-white/90 backdrop-blur-md px-4 py-4 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
            {/* Status indicator */}
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              Showing <span className="text-neutral-900 font-semibold">{collectionProducts.length}</span> items
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-6">
              {/* Grid Column Selector (Desktop) */}
              <div className="hidden sm:flex items-center gap-1 border-r border-neutral-200 pr-6">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-1.5 transition-colors ${
                    gridCols === 2 ? "text-neutral-900" : "text-neutral-300 hover:text-neutral-500"
                  }`}
                  title="2 Columns"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 transition-colors ${
                    gridCols === 3 ? "text-neutral-900" : "text-neutral-300 hover:text-neutral-500"
                  }`}
                  title="3 Columns"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-1.5 transition-colors ${
                    gridCols === 4 ? "text-neutral-900" : "text-neutral-300 hover:text-neutral-500"
                  }`}
                  title="4 Columns"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs uppercase font-semibold tracking-wider text-neutral-800 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Order</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-16">
          <div className="mx-auto max-w-7xl">
            {collectionProducts.length > 0 ? (
              <motion.div
                key={`${sortBy}-${gridCols}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 ${
                  gridCols === 2
                    ? "lg:grid-cols-2"
                    : gridCols === 3
                    ? "lg:grid-cols-3"
                    : "lg:grid-cols-4"
                }`}
              >
                {collectionProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Empty Fallback State */
              <div className="py-24 text-center space-y-4">
                <p className="font-serif text-2xl text-neutral-400">
                  No products currently assigned to this lookbook.
                </p>
                <Link
                  href="/collections"
                  className="inline-block text-xs uppercase font-semibold tracking-widest underline underline-offset-4 text-neutral-900"
                >
                  Return to Archive
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}