"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productIds: string[];
  tagline?: string;
  edition?: string;
}

export const collections: Collection[] = [
  {
    id: "summer-collection",
    name: "Summer Collection",
    slug: "summer-collection",
    image:
      "https://static.standard.co.uk/2024/05/16/10/36/Summer_mens_fashion.jpg.jpg?trim=0,0,0,0&quality=100&auto=webp&width=1920",
    description:
      "Light, fluid, and breathable pieces crafted intentionally for warm weather escapes.",
    productIds: ["1", "11"],
    tagline: "Chasing the Endless Sun",
    edition: "Vol. I / 26",
  },
  {
    id: "everyday",
    name: "Everyday Essentials",
    slug: "everyday-essentials",
    image:
      "https://i.pinimg.com/474x/41/f5/e3/41f5e3ce92ed437700ceba05ce17f9a5.jpg",
    description:
      "Timeless structural staples engineered to flow effortlessly through daily rotations.",
    productIds: ["2", "3", "4", "12"],
    tagline: "Form Meets Function",
    edition: "Core Series",
  },
  {
    id: "premium",
    name: "Premium Collection",
    slug: "premium-collection",
    image:
      "https://thevou.com/wp-content/uploads/2024/09/Old-Money-Mens-Clothing-Brands-696x1044.jpg",
    description:
      "Our finest luxury capsule, utilizing bespoke textiles and artisanal craftsmanship.",
    productIds: ["5", "6", "8", "13", "15", "19"],
    tagline: "Uncompromising Luxury",
    edition: "Limited Run",
  },
  {
    id: "winter",
    name: "Winter Warmth",
    slug: "winter-warmth",
    image:
      "https://cdn.firstcry.com/education/2022/11/14125845/Winter-Clothes-Vocabulary-in-English.jpg",
    description:
      "Cozy profiles and heavyweight layering shields designed for freezing temperatures.",
    productIds: ["8", "15"],
    tagline: "Architectural Insulation",
    edition: "Vol. II / 26",
  },
  {
    id: "casual",
    name: "Casual Chic",
    slug: "casual-chic",
    image:
      "https://cdn.mos.cms.futurecdn.net/in9LepMURKAmFxbb2QkqG9.jpg",
    description:
      "Relaxed modern aesthetics providing unparalleled ease without sacrificing posture.",
    productIds: ["3", "4", "14"],
    tagline: "Effortless Lounging",
    edition: "Pre-Fall",
  },
  {
    id: "basics",
    name: "Basics",
    slug: "basics",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    description:
      "Minimalist canvas pieces rendered in clean, natural, and highly adaptive colors.",
    productIds: ["4"],
    tagline: "The Foundation of Style",
    edition: "Permanent",
  },
  {
    id: "essentials",
    name: "Essentials",
    slug: "essentials",
    image:
      "https://cdn.shopify.com/s/files/1/0611/4443/2883/files/signature-style-wardrobe-inspiration-lifestyle_600x600.jpg?v=1777326852",
    description:
      "Non-negotiable signature additions built to establish structural consistency.",
    productIds: ["7", "10", "18"],
    tagline: "Curated Essentials Only",
    edition: "Restocked",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CollectionsPage() {
  return (
    <div>
      <Header />
      <main className="min-h-screen w-full bg-white px-4 py-10 sm:px-8 lg:px-16 text-neutral-900 selection:bg-neutral-900 selection:text-white">
        {/* Editorial Header - Clean Left Alignment */}
        <header className="max-w-3xl mb-24 space-y-5">
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400"
          >
            Curation Archive
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl font-light tracking-tight sm:text-7xl text-neutral-900"
          >
            The Collections
          </motion.h1>
          <div className="h-[1px] w-20 bg-neutral-900 mt-2" />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg text-sm font-light tracking-wide text-neutral-500 leading-relaxed pt-2"
          >
            Explore architectural capsules engineered around exclusive fabrics,
            custom silhouettes, and modular styling utility.
          </motion.p>
        </header>

        {/* Asymmetric Light Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-20 items-start"
        >
          {collections.map((item, idx) => {
            const isWide = idx % 3 === 0;
            const gridSpan = isWide ? "md:col-span-8" : "md:col-span-4";
            const aspectRatio = isWide ? "aspect-[16/10]" : "aspect-[3/4]";

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className={`${gridSpan} group relative flex flex-col`}
              >
                {/* Image Container frame with minimal light styling */}
                <Link
                  href={`/collections/${item.slug}`}
                  className="block relative w-full overflow-hidden bg-neutral-50 border border-neutral-100"
                >
                  <div
                    className={`relative ${aspectRatio} w-full overflow-hidden`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.03] mix-blend-multiply"
                      sizes={
                        isWide
                          ? "(max-width: 1024px) 100vw, 66vw"
                          : "(max-width: 1024px) 50vw, 33vw"
                      }
                      priority={idx < 2}
                    />

                    {/* Absolute Minimal Stark Line Overlay on Hover */}
                    <div className="absolute inset-0 bg-neutral-900/0 transition-colors duration-500 group-hover:bg-neutral-900/[0.02]" />
                  </div>

                  {/* Micro Floating Badge */}
                  <span className="absolute left-4 bottom-4 bg-white px-3 py-1 text-[9px] uppercase font-semibold tracking-widest text-neutral-900 shadow-sm border border-neutral-100 opacity-0 transform translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    View Lookbook
                  </span>
                </Link>

                {/* Data & Text Area */}
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-[85%]">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                      <span>{item.edition}</span>
                      <span className="h-1 w-1 rounded-full bg-neutral-300" />
                      <span>{item.productIds.length} Items</span>
                    </div>

                    <Link
                      href={`/collections/${item.slug}`}
                      className="inline-flex items-center gap-2 group/title pt-0.5"
                    >
                      <h2 className="font-serif text-xl font-normal tracking-tight text-neutral-900 group-hover/title:text-neutral-500 transition-colors duration-300">
                        {item.name}
                      </h2>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 transform -translate-x-2 transition-all duration-300 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:text-neutral-900" />
                    </Link>

                    {item.tagline && (
                      <p className="text-xs font-serif italic text-neutral-400 block font-light">
                        {item.tagline}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-neutral-500 font-light tracking-wide leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Subtle light Index string tracking */}
                  <span className="font-serif text-xl font-extralight text-neutral-200 select-none group-hover:text-neutral-400 transition-colors duration-300">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
