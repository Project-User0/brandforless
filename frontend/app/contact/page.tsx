import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us - Brand for Less",
  description: "Get in touch with our customer service team",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white antialiased">
      <Header />

      {/* Full Section Background Header */}
      <div className="relative border-b border-neutral-100 py-28 overflow-hidden bg-neutral-900">
        {/* Background Image Layer */}
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/011/020/176/small/abstract-white-and-light-gray-wave-modern-soft-luxury-texture-with-smooth-and-clean-background-free-vector.jpg"
          alt="Contact Studio Background"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none grayscale brightness-100 contrast-[1]"
        />

        {/* Pure Light Theme Overlay Wash */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

        {/* Content Frame */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-16 z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500 mb-3">
            Connect With Us
          </p>
          <h1 className="font-serif text-5xl font-light tracking-tight text-neutral-950 md:text-6xl">
            Contact{" "}
            <span className="font-serif italic font-extralight text-neutral-500">
              the Studio.
            </span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-12 items-start">
          {/* Column 1: Info Matrices */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">
                Direct Channels
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start group">
                  <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-none border border-neutral-200 bg-white text-neutral-900">
                    <MapPin className="h-4 w-4 stroke-[1.25]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-neutral-950">
                      Flagship Space
                    </h3>
                    <p className="mt-1 text-sm font-light text-neutral-500 leading-relaxed">
                      Tilottama-32907
                      <br />
                      Lumbini Province, Nepal
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group">
                  <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-none border border-neutral-200 bg-white text-neutral-900">
                    <Phone className="h-4 w-4 stroke-[1.25]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-neutral-950">
                      Concierge Desk
                    </h3>
                    <p className="mt-1 text-sm font-mono font-light text-neutral-500">
                      +977 1 234 5678
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start group">
                  <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-none border border-neutral-200 bg-white text-neutral-900">
                    <Mail className="h-4 w-4 stroke-[1.25]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-neutral-950">
                      Digital Correspondence
                    </h3>
                    <p className="mt-1 text-sm font-light text-neutral-500 hover:text-neutral-900 transition-colors">
                      info@brandforless.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Hours
              </h4>
              <p className="text-sm font-light text-neutral-500">
                Monday - Friday: 09:00 AM- 06:00 PM
              </p>
            </div>
          </div>

          {/* Column 2: The Editorial Form Canvas */}
          <div className="lg:col-span-8 bg-white lg:border-l lg:border-neutral-100 lg:pl-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8">
              Send an Inquiry
            </h2>

            <form className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-700 uppercase tracking-wider">
                    First Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    className="rounded-none border-neutral-200 focus-visible:border-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-500 h-11 shadow-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-700 uppercase tracking-wider">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    className="rounded-none border-neutral-200 focus-visible:border-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-500 h-11 shadow-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-700 uppercase tracking-wider">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="rounded-none border-neutral-200 focus-visible:border-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-500 h-11 shadow-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-700 uppercase tracking-wider">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="How can we assist you?"
                  className="rounded-none border-neutral-200 focus-visible:border-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-500 h-11 shadow-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-700 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  placeholder="Elaborate on your inquiry..."
                  className="min-h-36 w-full resize-none rounded-none border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors shadow-none"
                />
              </div>

              <Button
                // type="submit"
                size="lg"
                className="w-full rounded-none border border-neutral-900 bg-transparent text-neutral-900 font-light hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-none"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Full-width Map Canvas Integration */}
      <section className="w-full h-[450px] bg-neutral-50 border-t border-neutral-100 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3294.947362831157!2d83.46585938125139!3d27.647883988801027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399685346f5a7535%3A0x1a295344c4ffdc65!2sBrand%20for%20Less!5e1!3m2!1sen!2snp!4v1784402667070!5m2!1sen!2snp"
          className="w-full h-full border-none grayscale contrast-[0.85] opacity-90 hover:grayscale-0 transition-all duration-700 ease-in-out"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Brand for Less Location Map"
        />
      </section>

      <Footer />
    </main>
  );
}
