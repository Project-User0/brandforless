"use client";

import AdminHeader from "@/components/admin/layout/header";
import AdminSidebar from "@/components/admin/layout/sidebar";
import React, { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col antialiased selection:bg-foreground selection:text-background">
      {/* Structural Admin Control Header */}
      <AdminHeader
        onMenuTrigger={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex w-full relative pt-[65px]">
        {/* Isolated Sidebar Module Layout Core */}
        <AdminSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Canvas Workspace Area */}
        <main className="flex-1 w-full relative min-w-0 px-4 sm:px-8 lg:px-12 py-4 lg:py-8 lg:ml-64 xl:ml-72 transition-all duration-300">
          <div className="max-w-6xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
