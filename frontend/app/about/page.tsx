import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Eye, Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Our Identity - Brand for Less",
  description: "Learn about our brand philosophy and mission",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white antialiased">
      <Header />

      {/* Hero Section: Editorial Bold Frame with Full Background Image */}
      <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-center px-4 sm:px-8 lg:px-16 overflow-hidden bg-neutral-50 border-b border-neutral-100">
        {/* Full Bleed Absolute Background Image Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="https://img.magnific.com/premium-photo/minimalist-interior-design-with-coat-wooden-stand_214966-1510.jpg?semt=ais_hybrid&w=740&q=80"
            alt="Minimalist high-fashion studio texture backplate"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Full-surface subtle wash to ensure stark typography contrast */}
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px] pointer-events-none" />

        {/* Content Box Overlays */}
        <div className="relative z-20 max-w-7xl mx-auto w-full pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="space-y-6 max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500">
              Who We Are
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight leading-none text-neutral-950">
              Redefining <br className="hidden sm:inline" />
              <span className="font-serif italic font-extralight text-neutral-800">
                Accessible Luxury.
              </span>
            </h1>
            <div className="h-[1px] w-24 bg-neutral-900 pt-1" />
          </div>
        </div>
      </section>

      {/* Story & Mission Section: Asymmetric Split Layout */}
      <section className="bg-white border-t border-neutral-100 py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <h2 className="font-serif text-3xl font-light tracking-tight text-neutral-950">
              The Genesis
            </h2>
            <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
              Est. 2020 / Permanent Philosophy
            </p>
          </div>

          {/* Right Floating Content Columns */}
          <div className="lg:col-span-8 space-y-20 max-w-2xl">
            {/* Our Story */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                01 / Origin
              </span>
              <p className="text-lg sm:text-xl font-light text-neutral-600 leading-relaxed tracking-wide">
                Founded in 2020,{" "}
                <strong className="font-normal text-neutral-900">
                  Brand for Less
                </strong>{" "}
                emerged with a single structural ambition: to democratize access
                to premium fashion and elevated lifestyle essentials.
              </p>
              <p className="text-sm font-light text-neutral-500 leading-relaxed tracking-wide">
                We collectively reject the antiquated notion that high-tier
                design and luxurious manufacturing demand artificial markup.
                True style shouldn&apos;t be parsed by prohibitive luxury entry
                walls—it belongs inside the daily rotation of modern closets.
              </p>
            </div>

            {/* Our Mission */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                02 / Purpose
              </span>
              <h3 className="font-serif text-xl font-normal text-neutral-950">
                Curated value, engineered with integrity.
              </h3>
              <p className="text-sm font-light text-neutral-500 leading-relaxed tracking-wide">
                We carefully track, source, and curate signature architectural
                pieces from elite spaces globally. Our curated catalogs optimize
                global trade networks to yield uncompromised garments
                celebrating premium form, material sustainability, and genuine
                value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break / Mid-Page Text Banner */}
      <section className="bg-neutral-50 py-20 px-4 sm:px-8 lg:px-16 text-center border-y border-neutral-100">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="font-serif text-2xl sm:text-3xl font-light italic text-neutral-800 tracking-wide">
            &ldquo;Exceptional design is not a luxury tier. It is standard human
            intent.&rdquo;
          </p>
        </div>
      </section>

      {/* Pillars / Why Choose Us Section */}
      <section className="bg-white py-28 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
            Core Architecture
          </p>
          <h2 className="font-serif text-3xl font-light tracking-tight text-neutral-950 sm:text-4xl">
            Why Design Partners Choose Us
          </h2>
        </div>

        {/* Minimal High-Contrast Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Pillar 1 */}
          <div className="group flex flex-col space-y-4 p-6 border border-neutral-100 hover:border-neutral-900 transition-colors duration-500 rounded-sm bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-50 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-500">
              <Eye className="w-5 h-5 stroke-[1.25]" />
            </div>
            <h3 className="font-serif text-lg font-normal text-neutral-950 pt-2">
              Curated Selection
            </h3>
            <p className="text-sm font-light text-neutral-500 leading-relaxed tracking-wide">
              Every garment undergoes a rigid aesthetic filtration. We assess
              geometry, cut versatility, and enduring alignment before
              inclusion.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="group flex flex-col space-y-4 p-6 border border-neutral-100 hover:border-neutral-900 transition-colors duration-500 rounded-sm bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-50 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-500">
              <Sparkles className="w-5 h-5 stroke-[1.25]" />
            </div>
            <h3 className="font-serif text-lg font-normal text-neutral-950 pt-2">
              Premium Textiles
            </h3>
            <p className="text-sm font-light text-neutral-500 leading-relaxed tracking-wide">
              We exclusively source through audited global suppliers maintaining
              transparent practices and excellent, high-density thread
              architectures.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="group flex flex-col space-y-4 p-6 border border-neutral-100 hover:border-neutral-900 transition-colors duration-500 rounded-sm bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-50 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-500">
              <ShieldCheck className="w-5 h-5 stroke-[1.25]" />
            </div>
            <h3 className="font-serif text-lg font-normal text-neutral-950 pt-2">
              Transparent Value
            </h3>
            <p className="text-sm font-light text-neutral-500 leading-relaxed tracking-wide">
              By pruning intermediate steps and bloated traditional runway
              loops, we ship pure aesthetic pieces at fair, direct costs.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action: Minimal and Striking */}
      <section className="bg-white pb-32 pt-12 text-center px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-[1px] w-12 bg-neutral-200 mx-auto" />
          <p className="text-xs font-light text-neutral-400 tracking-wider">
            Ready to explore the modules?
          </p>
          <Button
            size="lg"
            className="rounded-none border border-neutral-900 bg-transparent text-neutral-900 font-light hover:bg-neutral-900 hover:text-white px-8 transition-all duration-300 shadow-none"
          >
            <Link href="/shop" className="inline-flex items-center gap-2">
              Browse the Studio
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
