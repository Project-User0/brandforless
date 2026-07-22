"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import { useUI, useCart, useWishlist } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const {
    isMobileMenuOpen,
    setMobileMenuOpen,
    isCartOpen,
    setCartOpen,
    isSearchOpen,
    setSearchOpen,
  } = useUI();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(stored);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-border bg-background/95 backdrop-blur-md"
          : "border-transparent bg-background"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-300 ">
              <span className="flex h-full w-full items-center justify-center font-bold text-foreground">
                B
              </span>
            </div>
            <span className="hidden font-serif text-lg font-bold text-foreground sm:inline">
              Brand for Less
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[13px] uppercase font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!isSearchOpen)}
              className="text-foreground/70 hover:text-foreground"
            >
              <Search size={20} />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground/70 hover:text-foreground"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground/70 hover:text-foreground"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User */}
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground/70 hover:text-foreground"
              >
                <User size={24} />
                {user && (
                  <span className="absolute -right-0 -top-0 flex h-2 w-2 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-primary-foreground"></span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pb-4"
          >
            <Input
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-md"
            />
          </motion.div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 border-t border-border py-4 md:hidden"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm uppercase font-medium text-foreground/70 transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="block text-sm uppercase font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                Sign Out
              </button>
            )}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
