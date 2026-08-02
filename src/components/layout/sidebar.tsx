"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Menu,
  Users,
  X,
  Layers,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useUserRole } from "@/lib/hook/user";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const { role, loading } = useUserRole();
  const isAdmin = role === 1;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Employee",
      href: "/dashboard/employee",
      icon: Users,
      adminOnly: true,
    },
    { name: "Tasks", href: "/dashboard/tasks", icon: Layers },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const visibleItems = menuItems.filter((item) => !item.adminOnly || isAdmin);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-950 rounded-lg text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed md:sticky top-0 z-40 bg-linear-to-t from-black/50 to-blue-950/50 backdrop-blur-sm border-r border-[#222] transition-all duration-300 h-screen flex flex-col justify-between
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${isSidebarOpen ? "md:w-64" : "md:w-20 items-center"}
      `}
      >
        <div>
          <div className="p-6 mt-12 md:mt-0 flex items-center justify-between">
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="text-xl font-bold tracking-tighter">
                DevDynamo
              </span>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block text-white"
            >
              <Menu size={20} />
            </button>
          </div>

          <nav className="space-y-1 px-2">
            {visibleItems.map((item) => {
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
                  <Icon className="h-5 w-5 shrink-0" />
                  {(isSidebarOpen || isMobileMenuOpen) && (
                    <span>{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Button Section */}
        <div className="p-2 mb-4">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent ${
              isSidebarOpen || isMobileMenuOpen
                ? "justify-start"
                : "justify-center"
            }`}
            title="Sign Out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
