"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const username = email.split("@")[0];
      const isAdmin = username === "admin";

      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name: username,
          isAdmin,
        }),
      );
      toast.success("Welcome back!");
      router.push(isAdmin ? "/admin" : "/account");
    } catch (error) {
      toast.error("Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen w-full flex items-stretch overflow-x-hidden">
      
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative bg-zinc-950 items-end p-8 xl:p-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity scale-100 hover:scale-105 transition-transform duration-[1200ms] ease-out"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative z-10 max-w-sm xl:max-w-md text-white space-y-4"
        >
          <span className="text-[10px] xl:text-xs uppercase tracking-[0.3em] text-zinc-400 font-semibold block">
            The Autumn Edit
          </span>
          <h2 className="text-3xl xl:text-5xl font-light tracking-tight font-serif leading-tight xl:leading-none">
            Curated pieces, <br className="hidden xl:inline" />tailored for your expression.
          </h2>
        </motion.div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-12 xl:px-24 py-12 w-full lg:w-1/2 xl:w-7/12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-md md:max-w-[420px] mx-auto space-y-8 xl:space-y-4"
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-light tracking-tight font-serif">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground tracking-wide font-light">
              Sign in to manage your orders and view your wardrobe wishlist.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 xl:space-y-8">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-muted-foreground block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-0 py-2.5 sm:py-3 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/40 transition-colors text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-muted-foreground">
                  Password
                </label>
                <Link href="/auth/forget-pass" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-0 pr-10 py-2.5 sm:py-3 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/40 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded-none border-border bg-transparent text-foreground focus:ring-0 focus:ring-offset-0 checked:bg-foreground accent-foreground" 
                />
                <span className="text-xs tracking-wide text-muted-foreground group-hover:text-foreground transition-colors font-light">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Premium Interactive Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-2 sm:py-3.5 mt-2 font-medium tracking-widest hover:bg-opacity-90 transition duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase"
            >
              {isLoading ? "Verifying..." : "Sign In"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
              or
            </span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          <button className="w-full py-3 border border-border tracking-wider text-xs uppercase font-medium hover:bg-secondary/40 hover:border-foreground transition-all duration-200 flex items-center justify-center gap-2.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs sm:text-sm tracking-wide text-muted-foreground pt-2 font-light">
            New to our collections?{" "}
            <Link
              href="/auth/register"
              className="text-foreground hover:text-muted-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}