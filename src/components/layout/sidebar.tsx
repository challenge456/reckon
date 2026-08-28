"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@/lib/theme-provider";
import { useState } from "react";
import {
  Home,
  Target,
  Trophy,
  BarChart3,
  Zap,
  LifeBuoy,
  History,
  User,
  Settings,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_MAIN = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/goals", label: "My Goals", icon: Target },
  { href: "/dashboard/challenges", label: "Active Challenges", icon: Zap },
  { href: "/dashboard/lifelines", label: "Lifelines", icon: LifeBuoy },
];

const NAV_PROGRESS = [
  { href: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { href: "/dashboard/statistics", label: "Statistics", icon: BarChart3 },
  { href: "/dashboard/goal-history", label: "Goal History", icon: History },
  { href: "/dashboard/consequence-history", label: "Consequence History", icon: History },
];

const NAV_ACCOUNT = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const NavContent = () => (
    <nav className="p-4 space-y-8">
      {/* Main Section */}
      <div>
        <p className="px-2 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
          Main
        </p>
        <div className="space-y-1">
          {NAV_MAIN.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Progress Section */}
      <div>
        <p className="px-2 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
          Progress
        </p>
        <div className="space-y-1">
          {NAV_PROGRESS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Account Section */}
      <div>
        <p className="px-2 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
          Account
        </p>
        <div className="space-y-1">
          {NAV_ACCOUNT.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:flex md:left-0 md:top-0 md:h-screen md:w-64 md:border-r md:border-border md:bg-sidebar md:text-sidebar-foreground md:flex-col md:overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-sidebar-primary hover:opacity-90 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
              ⚡
            </div>
            <span>Reckon</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <NavContent />
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-sidebar-border bg-sidebar p-4 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            {isDark ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <button
            onClick={() => signOut({ redirectTo: "/" })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b border-border bg-sidebar text-sidebar-foreground p-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-bold text-sidebar-primary"
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs">
            ⚡
          </div>
          <span>Reckon</span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}
      <div
        className={`md:hidden fixed left-0 top-16 bottom-0 w-64 bg-sidebar text-sidebar-foreground border-r border-border overflow-y-auto transition-transform duration-300 z-30 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />

        {/* Mobile Bottom Actions */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            {isDark ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <button
            onClick={() => signOut({ redirectTo: "/" })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="md:ml-64 min-h-screen bg-background text-foreground pt-20 md:pt-0 md:p-8 p-4">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
