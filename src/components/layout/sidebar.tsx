"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, Menu, Users, X } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employee", href: "/dashboard/employee", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-950 rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed md:relative z-40 bg-linear-to-t from-black/50 to-blue-950/50 backdrop-blur-sm border-r border-[#222] transition-all duration-300 min-h-screen
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${isSidebarOpen ? "md:w-64" : "md:w-20 flex items-center flex-col"}
      `}
      >
        <div className="p-6 mt-12 md:mt-0 flex items-center justify-between">
          {(isSidebarOpen || isMobileMenuOpen) && (
            <span className="text-xl font-bold tracking-tighter">
              DevDynamo
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSidebarOpen || isMobileMenuOpen
                    ? "justify-start"
                    : "justify-center"
                } ${
                  isActive
                    ? "text-white bg-indigo-600/10 border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className="h-5 w-5" />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span>{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
