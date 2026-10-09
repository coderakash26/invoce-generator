"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Palette,
  Settings,
  Plus,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { AppLogo } from "@/components/shared/app-logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/templates", label: "Templates", icon: Palette },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/appearance", label: "Branding", icon: Sliders },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-zinc-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 hidden md:flex">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100">
          <AppLogo href="/dashboard" />
        </div>

        {/* Primary Action Button */}
        <div className="p-4">
          <Link
            href="/invoices/new"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || (item.href !== "/settings" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50/70 text-indigo-700 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-zinc-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Mode Notice */}
      <div className="p-4 border-t border-zinc-100 space-y-3">
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 text-[11px] text-zinc-500">
          <p className="font-semibold text-zinc-800 mb-0.5">Local Storage Active</p>
          <p className="text-[10px] text-zinc-400 leading-snug">
            All invoices and clients are stored securely in your browser profile.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-900 px-2 py-1"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
