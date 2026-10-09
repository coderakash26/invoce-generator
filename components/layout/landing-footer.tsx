import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-zinc-200/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <AppLogo href="/" size="sm" />
          <p className="text-xs text-zinc-500 mt-2">
            Create professional invoices in minutes. Browser-based client-side application.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-600">
          <Link href="/dashboard" className="hover:text-zinc-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/invoices" className="hover:text-zinc-900 transition-colors">
            Invoices
          </Link>
          <Link href="/clients" className="hover:text-zinc-900 transition-colors">
            Clients
          </Link>
          <Link href="/templates" className="hover:text-zinc-900 transition-colors">
            Templates
          </Link>
          <Link href="/settings" className="hover:text-zinc-900 transition-colors">
            Settings
          </Link>
        </div>

        <div className="text-center md:text-right text-[11px] text-zinc-400">
          <p>Local Storage Demo Mode · No Server Authentication Required</p>
          <p className="mt-0.5">© 2026 InvoiceFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
