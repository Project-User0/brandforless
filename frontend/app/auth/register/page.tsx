"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const passwordStrength = {
    hasLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the privacy policy");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          name: formData.name,
          isAdmin: false,
          password: formData.password,
        }),
      );

      toast.success("Account created successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen w-full flex items-stretch overflow-x-hidden">
      {/* Editorial/Campaign Side Panel (Flips layout balance nicely from Login) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative bg-zinc-950 items-end p-8 xl:p-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity scale-100 hover:scale-105 transition-transform duration-[1200ms] ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop')`,
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
            Exclusive Access
          </span>
          <h2 className="text-3xl xl:text-5xl font-light tracking-tight font-serif leading-tight xl:leading-none">
            Create an account <br className="hidden xl:inline" />
            for tailored updates.
          </h2>
        </motion.div>
      </div>

      {/* Interactive Form Side Panel */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-12 xl:px-24 py-12 w-full lg:w-1/2 xl:w-7/12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-md md:max-w-[420px] mx-auto space-y-6 xl:space-y-10"
        >
          {/* Header Typography */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-light tracking-tight font-serif">
              Join the Club
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground tracking-wide font-light">
              Register now for priority orders, dynamic lookbooks, and
              customized member updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 xl:space-y-6">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-muted-foreground block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-0 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/40 transition-colors text-sm"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-muted-foreground block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="w-full px-0 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/40 transition-colors text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-muted-foreground block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-0 pr-10 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/40 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Refined Password Strength Indicators */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground font-light tracking-wide bg-secondary/20 p-3"
                >
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasLength ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground/40" />
                    )}
                    <span
                      className={
                        passwordStrength.hasLength ? "text-foreground" : ""
                      }
                    >
                      Min. 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasUpper ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground/40" />
                    )}
                    <span
                      className={
                        passwordStrength.hasUpper ? "text-foreground" : ""
                      }
                    >
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasLower ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground/40" />
                    )}
                    <span
                      className={
                        passwordStrength.hasLower ? "text-foreground" : ""
                      }
                    >
                      Lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground/40" />
                    )}
                    <span
                      className={
                        passwordStrength.hasNumber ? "text-foreground" : ""
                      }
                    >
                      Contains number
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-muted-foreground block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-0 pr-10 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/40 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-[11px] text-red-500 font-medium tracking-wide mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms & Conditions Agreement Linkage */}
            <div className="flex items-start pt-2 select-none">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-none border-border bg-transparent text-foreground focus:ring-0 focus:ring-offset-0 checked:bg-foreground accent-foreground"
                />
                <span className="text-xs tracking-wide text-muted-foreground group-hover:text-foreground transition-colors font-light leading-normal">
                  I accept the{" "}
                  <Link
                    href="#"
                    className="text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Premium Interactive Action Button */}
            <button
              type="submit"
              disabled={
                isLoading ||
                !isPasswordValid ||
                !passwordsMatch ||
                !agreedToTerms
              }
              className="w-full bg-foreground text-background py-2 sm:py-3.5 mt-4 font-medium tracking-widest hover:bg-opacity-90 transition duration-200 active:scale-[0.99] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 text-xs uppercase"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Account Login Pathway Link */}
          <p className="text-center text-xs sm:text-sm tracking-wide text-muted-foreground pt-2 font-light">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-foreground hover:text-muted-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
