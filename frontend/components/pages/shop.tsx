"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { useFilters } from "@/store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function ShopPage() {
  const [showFilters, setShowFilters] = useState(false);
  const {
    selectedCategories,
    priceRange,
    sortBy,
    setSortBy,
    setSelectedCategories,
    setPriceRange,
  } = useFilters();

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter((p) => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [selectedCategories, priceRange, sortBy]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((c) => c !== categoryId)
        : [...selectedCategories, categoryId],
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            Shop
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover our complete collection
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filters */}
        <motion.aside
          className={`w-full border-r border-border p-6 md:w-64 lg:w-72 ${
            showFilters ? "block" : "hidden md:block"
          }`}
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-8 bg-white text-neutral-900">
            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Categories
              </h3>
              <div className="mt-4 space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="h-4 w-4 accent-neutral-900 rounded border-neutral-300 bg-white"
                    />
                    <span className="text-sm font-light text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Price Range
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-sm font-mono text-neutral-600">
                  <span>Rs. {priceRange[0]}</span>
                  <span>Rs. {priceRange[1]}</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full accent-neutral-900 bg-neutral-200 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full accent-neutral-900 bg-neutral-200 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <Button
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange([0, 500]);
                setSortBy("featured");
              }}
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 transition-colors"
            >
              Reset Filters
            </Button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="border-b border-border px-6 py-4">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex gap-4 items-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <ChevronDown size={16} />
                  Filters
                </Button>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-40"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-6">
            {filteredProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex h-96 items-center justify-center text-center">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    No products found
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
