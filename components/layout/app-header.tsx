"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Plus,
  LayoutDashboard,
  FileText,
  Users,
  Palette,
  Settings,
  Sliders,
} from "lucide-react";
import { AppLogo } from "@/components/shared/app-logo";

const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/templates", label: "Templates", icon: Palette },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/appearance", label: "Branding", icon: Sliders },
];

export function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Derive breadcrumb / page title
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/invoices") return "Invoices";
    if (pathname === "/invoices/new") return "New Invoice";
    if (pathname.startsWith("/invoices/") && pathname.endsWith("/edit")) return "Edit Invoice";
    if (pathname.startsWith("/invoices/")) return "Invoice Details";
    if (pathname === "/clients") return "Clients";
    if (pathname === "/clients/new") return "New Client";
    if (pathname.startsWith("/clients/")) return "Client Profile";
    if (pathname === "/templates") return "Templates";
    if (pathname === "/settings") return "Settings";
    if (pathname === "/settings/appearance") return "Appearance & Branding";
    return "InvoiceFlow";
  };

  return (
    <header className="h-16 bg-white border-b border-zinc-200/90 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Mobile Menu Button & Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <AppLogo href="/dashboard" size="sm" />
      </div>

      {/* Desktop Breadcrumb Title */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs font-medium text-zinc-400">InvoiceFlow</span>
        <span className="text-xs text-zinc-300">/</span>
        <h1 className="text-sm font-semibold text-zinc-900">{getPageTitle()}</h1>
      </div>

      {/* Right Zone: Primary action & status */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-100 px-2.5 py-1 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Local Storage</span>
        </span>

        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Invoice</span>
        </Link>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <AppLogo href="/dashboard" size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4">
                <Link
                  href="/invoices/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Invoice</span>
                </Link>
              </div>

              <nav className="space-y-1">
                {MOBILE_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-zinc-500 hover:text-zinc-900 block"
              >
                Back to Landing Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
