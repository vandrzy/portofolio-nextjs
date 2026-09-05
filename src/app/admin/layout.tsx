"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-inter text-[#575757]">
      {/* Sidebar Component */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Wrapper - Offset by Sidebar width on desktop (md:pl-64) */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Navbar */}
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
