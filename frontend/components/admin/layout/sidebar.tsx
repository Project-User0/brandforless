"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Receipt, 
  Star, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  X,
  Lock,
  DollarSign
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Simplified and direct navigation structure
  const adminMenu = [
    {
      group: "Management",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Customers", href: "/admin/customers", icon: Users },
      ]
    },
    {
      group: "Store Content",
      items: [
        { label: "Products", href: "/admin/products", icon: ShoppingBag },
        { label: "Reviews", href: "/admin/reviews", icon: Star },
        { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      ]
    },
    {
      group: "Billings",
      items: [
        { label: "Orders", href: "/admin/orders", icon: Receipt, badge: "12" },
        { label: "Payments", href: "/admin/payments", icon: DollarSign },
      ]
    },
    {
      group: "Settings & Performance",
      items: [
        { label: "Reports", href: "/admin/reports", icon: BarChart3 },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between py-4 px-6 lg:px-8 select-none">
      <div className="space-y-6">
        
        {/* Mobile Header Inside Drawer */}
        <div className="flex lg:hidden items-center justify-between pb-2 border-b border-border/40">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">Navigation</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Categories */}
        {adminMenu.map((group) => (
          <div key={group.group} className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-muted-foreground/60">
              {group.group}
            </h4>
            <nav className="space-y-1 -mx-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 text-xs uppercase tracking-widest relative group transition-colors hover:bg-gray-100 ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActiveMarker"
                        className="absolute inset-0 bg-secondary/60 border-l-2 border-foreground -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 35 }}
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 stroke-[1.5] ${isActive ? "text-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-light tracking-normal p-1 bg-green-500 rounded-full border border-border text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Modern Session Stamp */}
      <div className="pt-4 border-t border-border/40 flex items-center gap-3 text-muted-foreground/50">
        <Lock className="w-3.5 h-3.5" />
        <span className="text-[9px] uppercase tracking-widest font-mono">
          System Secure
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Panel */}
      <aside className="hidden lg:block fixed top-[64px] bottom-0 left-0 w-64 xl:w-72 border-r border-border/40 bg-background overflow-y-auto scrollbar-none z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Animated Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "linear" }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-[300px] bg-background border-r border-border z-50 lg:hidden shadow-2xl overflow-y-auto scrollbar-none"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}