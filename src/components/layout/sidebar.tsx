"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@/lib/theme-provider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/goals", label: "My Goals", icon: "🎯" },
  { href: "/dashboard/achievements", label: "Achievements", icon: "🏆" },
  { href: "/dashboard/statistics", label: "Statistics", icon: "📊" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-neutral-800 bg-neutral-900 p-6 text-white dark:bg-neutral-950">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8 block text-2xl font-bold">
        🎯 Reckon
      </Link>

      {/* Navigation */}
      <nav className="mb-8 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
                isActive
                  ? "bg-neutral-800 font-medium text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 pt-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
        >
          <span>{isDark ? "🌙" : "☀️"}</span>
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Sign Out */}
        <button
          onClick={() => signOut({ redirectTo: "/" })}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-950 hover:text-red-300"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export function MainContent({ children }: { children: React.ReactNode }) {
  return <main className="ml-64 min-h-screen bg-white p-8 dark:bg-neutral-950 dark:text-white">{children}</main>;
}
