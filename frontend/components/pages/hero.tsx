"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

// 1. Properly typed Global Animation Variants
const wordVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: "solid" | "outline";
}

function PremiumButton({ children, variant = "solid" }: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="relative overflow-hidden rounded-full"
    >
      <motion.div
        className={`group flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
          variant === "solid"
            ? "bg-white text-black hover:bg-neutral-200"
            : "border border-white/40 text-white backdrop-blur-sm hover:border-white hover:bg-white/10"
        }`}
      >
        <span className="relative z-10 block overflow-hidden">
          <motion.span className="block transition-transform duration-500 group-hover:-translate-y-full">
            {children}
          </motion.span>
          <motion.span className="absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0">
            {children}
          </motion.span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const titleWords = "Premium Fashion Redefined".split(" ");

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-neutral-950"
    >
      <motion.div
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0 h-full w-full origin-center select-none"
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] as any }}
      >
        <Image
          src="https://wallpaperaccess.com/full/6097924.jpg"
          alt="Editorial Fashion Campaign Hero Frame"
          fill
          className="object-cover object-center brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-neutral-950/90" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex h-full items-center justify-center text-center"
      >
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-serif text-5xl font-light tracking-tight text-white md:text-8xl flex flex-wrap justify-center gap-x-4 overflow-hidden py-2">
            {titleWords.map((word, index) => (
              <span
                key={index}
                className="relative inline-block overflow-hidden pb-1"
              >
                <motion.span
                  variants={wordVariants}
                  className="inline-block font-extralight first:font-normal"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={fadeUpVariants}
            className="mx-auto mt-6 max-w-xl text-base font-light tracking-wide text-neutral-300 leading-relaxed md:text-lg"
          >
            Discover curated collections of luxury apparel, meticulously
            designed for modern silhouettes and timeless elegance.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/shop" className="w-full sm:w-auto">
              <PremiumButton variant="solid">Shop Now</PremiumButton>
            </Link>
            <Link href="/collections" className="w-full sm:w-auto">
              <PremiumButton variant="outline">
                Explore Collections
              </PremiumButton>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
