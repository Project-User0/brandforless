"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Package,
  Heart,
  Settings,
  Star,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useWishlist } from "@/store";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
  });
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "wishlist" | "reviews" | "settings"
  >("profile");

  const [userReviews, setUserReviews] = useState<any[]>([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedReviews = localStorage.getItem("product_reviews");
        if (storedReviews) {
          const parsed = JSON.parse(storedReviews);
          setUserReviews(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error("Error reading reviews from localStorage", error);
      }
    }
  }, [activeTab]);

  const { items } = useWishlist();
  const wishlistProducts = items
    .map((item) => products.find((p) => p.id === item.productId))
    .filter(Boolean) as typeof products;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData(parsedUser);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");

        let userData = storedUser
          ? JSON.parse(storedUser)
          : { email: "user@example.com", password: "password123" };

        if (userData.password !== currentPassword) {
          setPasswordError("The current password you entered is incorrect.");
          return;
        }

        userData.password = newPassword;
        localStorage.setItem("user_account", JSON.stringify(userData));

        setPasswordSuccess("Your password has been updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        console.error(err);
        setPasswordError("An error occurred while updating your password.");
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(formData));
    setUser(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Upper Editorial Title */}
        <div className="border-b border-border pb-6 mb-10 lg:mb-14">
          <span className="text-[12px] uppercase tracking-[0.3em] text-muted-foreground font-semibold block mb-2">
            Member Area
          </span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight font-serif">
            Welcome, {user.name.split(" ")[0]}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
          {/* Navigation Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3 lg:sticky lg:top-28 space-y-8"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-border/60">
              <div className="w-12 h-12 bg-foreground text-background rounded-none flex items-center justify-center text-base font-medium tracking-wider select-none">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium tracking-wide truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate font-light mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 border-border/40 pb-2 lg:pb-0 gap-1 lg:gap-2 no-scrollbar">
              {[
                { id: "profile", label: "Profile Details", icon: User },
                { id: "orders", label: "Order History", icon: Package },
                { id: "wishlist", label: "Your Wishlist", icon: Heart },
                { id: "reviews", label: "Product Reviews", icon: Star },
                { id: "settings", label: "Account Settings", icon: Settings },
              ].map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`relative flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-all duration-200 rounded-none group ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 bottom-0 lg:bottom-auto lg:top-0 lg:h-full w-full lg:w-[2px] bg-foreground border-b-2 lg:border-b-0 border-foreground"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon className="w-4 h-4 shrink-0 stroke-[1.5]" />
                    {label}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-widest font-medium text-red-500/80 hover:text-red-600 transition-colors rounded-none"
            >
              <LogOut className="w-4 h-4 shrink-0 stroke-[1.5]" />
              Sign Out
            </button>
          </motion.aside>

          {/* Dynamic Window Container */}
          <section className="lg:col-span-9 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-10 xl:space-y-14">
                    <div className="flex items-end justify-between border-b border-border/60 pb-3">
                      <h2 className="text-xl font-light font-serif tracking-tight">
                        Personal Profile
                      </h2>
                      <div className="flex items-center gap-4">
                        {isEditing && (
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              if (typeof setFormData === "function") {
                                setFormData({ ...user });
                              }
                            }}
                            type="button"
                            className="text-xs uppercase tracking-widest font-medium text-muted-foreground border-b border-transparent pb-0.5 text-red-600 hover:text-red-500 hover:border-red-500 transition-all duration-200"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() =>
                            isEditing ? handleSave() : setIsEditing(true)
                          }
                          className="text-xs uppercase tracking-widest font-medium border-b border-foreground pb-0.5 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-200"
                        >
                          {isEditing ? "Save Changes" : "Edit Profile"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-10">
                      {/* Identity Row */}
                      <div className="space-y-6">
                        <h3 className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
                          Identity Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/80">
                              Full Name
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-0 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground transition-colors text-sm"
                              />
                            ) : (
                              <p className="text-sm tracking-wide py-2 font-light">
                                {user.name}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/80">
                              Email Address
                            </label>
                            {isEditing ? (
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-0 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground transition-colors text-sm"
                              />
                            ) : (
                              <p className="text-sm tracking-wide py-2 font-light text-muted-foreground">
                                {user.email}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/80">
                              Contact Phone
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                placeholder="Not provided"
                                className="w-full px-0 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/30 transition-colors text-sm"
                              />
                            ) : (
                              <p
                                className={`text-sm tracking-wide py-2 font-light ${!formData.phone ? "text-muted-foreground/40" : ""}`}
                              >
                                {formData.phone || "No entry added"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Row */}
                      <div className="space-y-6 pt-4">
                        <h3 className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
                          Default Shipping Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {[
                            "address",
                            "city",
                            "state",
                            "country",
                            "zipCode",
                          ].map((field) => (
                            <div key={field} className="space-y-1">
                              <label className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/80">
                                {field === "zipCode"
                                  ? "Zip / Postal Code"
                                  : field}
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name={field}
                                  value={
                                    formData[field as keyof UserData] || ""
                                  }
                                  onChange={handleChange}
                                  placeholder={`Enter ${field}`}
                                  className="w-full px-0 py-2 border-b border-border bg-transparent rounded-none focus:outline-none focus:border-foreground placeholder:text-muted-foreground/30 transition-colors text-sm capitalize"
                                />
                              ) : (
                                <p
                                  className={`text-sm tracking-wide py-2 font-light ${!formData[field as keyof UserData] ? "text-black" : ""}`}
                                >
                                  {formData[field as keyof UserData] ||
                                    `No ${field} specified`}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Empty State Tab */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <div className="border-b border-border/60 pb-3">
                      <h2 className="text-xl font-light font-serif tracking-tight">
                        Orders
                      </h2>
                    </div>
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 px-4">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground/40 stroke-[1.2] mb-4" />
                      <h3 className="text-sm font-medium tracking-wide">
                        No Orders Found
                      </h3>
                      <p className="text-xs text-muted-foreground font-light max-w-xs mt-1.5 leading-relaxed">
                        You have not placed any orders yet. Once items are
                        purchased, their routing statuses will update here.
                      </p>
                      <button
                        onClick={() => router.push("/")}
                        className="mt-6 border border-foreground text-foreground text-[11px] uppercase tracking-widest font-medium px-6 py-2.5 hover:bg-foreground hover:text-background transition-colors duration-200"
                      >
                        Continue Browsing
                      </button>
                    </div>
                  </div>
                )}

                {/* Wishlist Empty State Tab */}
                {activeTab === "wishlist" && (
                  <div className="space-y-6">
                    <div className="border-b border-border/60 pb-3">
                      <h2 className="text-xl font-light font-serif tracking-tight">
                        Your Wishlist
                      </h2>
                    </div>
                    {wishlistProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 px-4">
                        <Heart className="w-8 h-8 text-muted-foreground/40 stroke-[1.2] mb-4" />
                        <h3 className="text-sm font-medium tracking-wide">
                          Your list is empty
                        </h3>
                        <p className="text-xs text-muted-foreground font-light max-w-xs mt-1.5 leading-relaxed">
                          Tap the heart indicator symbol on product pages to
                          gather pieces you look forward to reviewing later.
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="border-b border-border/60 pb-3 capitalize">
                      <h2 className="text-xl font-light font-serif tracking-tight">
                        {activeTab} Details
                      </h2>
                    </div>

                    {activeTab === "reviews" ? (
                      userReviews.length > 0 ? (
                        <div className="space-y-4">
                          {userReviews.map((review, idx) => (
                            <div
                              key={review.id || idx}
                              className="rounded-sm border border-border p-4 bg-card hover:shadow-sm transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <h4 className="font-medium text-sm text-foreground">
                                    {review.title ||
                                      `Review for Product #${review.productId}`}
                                  </h4>
                                  <div className="flex gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-md ${
                                          i < review.rating
                                            ? "text-neutral-900"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {/* Converts the timestamp number back into a clean date string */}
                                <span className="text-xs text-muted-foreground">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt,
                                      ).toLocaleDateString()
                                    : "Recent"}
                                </span>
                              </div>

                              {review.content && (
                                <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
                                  {review.content}
                                </p>
                              )}

                              {review.author && (
                                <p className="mt-2 text-xs text-foreground/70 italic">
                                  By: {review.author}{" "}
                                  {review.verified && "✓ (Verified Buyer)"}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 bg-secondary/10 px-6 text-center rounded-sm border border-dashed border-border">
                          <p className="text-sm text-muted-foreground font-light">
                            You haven't written any reviews yet.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="py-12 bg-secondary/10 px-6 text-center rounded-sm">
                        <p className="text-xs tracking-wide text-muted-foreground font-light">
                          Configuration views for{" "}
                          <span className="font-medium text-foreground capitalize">
                            {activeTab}
                          </span>{" "}
                          are currently being adjusted for your account scope.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="rounded-sm border border-border bg-card p-6">
                    <h3 className="text-base font-medium text-foreground mb-1">
                      Update Password
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6">
                      Ensure your account is using a long, random password to
                      stay secure.
                    </p>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      {/* Status Banners */}
                      {passwordError && (
                        <div className="rounded-sm bg-destructive/10 p-3 text-xs font-medium text-destructive">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="rounded-sm bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {passwordSuccess}
                        </div>
                      )}

                      {/* Input Fields */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-sm border border-border bg-background pl-3 pr-10 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                            aria-label={
                              showCurrentPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-sm border border-border bg-background pl-3 pr-10 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                            aria-label={
                              showNewPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-sm border border-border bg-background pl-3 pr-10 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="sm"
                        className="w-full sm:w-auto mt-2"
                      >
                        Save Changes
                      </Button>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        {/* Mobile-Only Logout Trigger */}
        <div className="block lg:hidden mt-12 pt-6 border-t border-border/60">
          <button
            onClick={handleLogout}
            className="w-full py-3 border border-red-200 text-red-500 text-xs uppercase tracking-widest font-medium bg-red-50/20 hover:bg-red-50 transition-colors"
          >
            Sign Out Account
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
