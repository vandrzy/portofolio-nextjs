"use client";

import { usePathname } from "next/navigation";

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

export default function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const pathname = usePathname();

  // Determine current page title based on active path
  const getPageTitle = () => {
    if (pathname.includes("/admin/teknologi")) {
      return "Teknologi";
    }
    if (pathname.includes("/admin/projek")) {
      return "Projek";
    }
    return "Dashboard Admin";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 md:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            type="button"
            className="md:hidden p-2 rounded-xl text-gray-500 hover:text-[#202224] hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Buka Sidebar Navigasi"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Page Title */}
          <div>
            <h1 className="font-poppins font-bold text-xl md:text-2xl text-[#202224]">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Optional Right Action/Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-poppins text-xs font-semibold text-[#202224]">
              Admin
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#026c99]/10 text-[#026c99] font-poppins font-bold flex items-center justify-center text-sm border border-[#026c99]/20">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
