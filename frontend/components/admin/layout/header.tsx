"use client";

import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  ExternalLink,
  User2,
  LogOutIcon,
  Power,
} from "lucide-react";

interface AdminHeaderProps {
  onMenuTrigger: () => void;
}

export default function AdminHeader({ onMenuTrigger }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-[64px] bg-background/80 backdrop-blur-md border-b border-border/40 z-40 flex items-center justify-between px-4 sm:px-8 select-none">
      {/* Brand Workspace Identity */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuTrigger}
          className="lg:hidden text-muted-foreground hover:text-foreground p-1 transition-colors"
          aria-label="Toggle Control Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/admin" className="flex items-center gap-2.5 group">
          <span className="font-serif tracking-widest text-sm uppercase font-light">
            Brand for Less{" "}
            <span className="font-sans text-[10px] tracking-normal px-1.5 py-0.5 bg-foreground text-background font-medium ml-1">
              Admin
            </span>
          </span>
        </Link>
      </div>

      {/* Utility Action Module Clusters */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>

        <button className="relative text-muted-foreground hover:text-foreground transition-colors p-1">
          <Bell className="w-4 h-4 stroke-[1.5]" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-foreground rounded-none" />
        </button>

        <Link href="/admin/profile">
          <div className="flex items-center justify-center">
            <User2 className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/auth/login";
          }}
          className="relative text-muted-foreground hover:text-red-500 transition-colors p-1 cursor-pointer"
        >
          <Power className="w-4 h-4 stroke-[1.5] text-red-400" />
        </button>
      </div>
    </header>
  );
}
