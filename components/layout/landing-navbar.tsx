"use client";

import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <AppLogo href="/" />

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-600">
          <a href="#features" className="hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#templates" className="hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0">
            Templates
          </a>
          <a href="#how-it-works" className="hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0">
            How It Works
          </a>
          <a href="#faq" className="hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0">
            FAQ
          </a>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap shrink-0">
            Open Dashboard
          </Link>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/invoices/new"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Create Your First Invoice
          </Link>
        </div>
      </div>
    </header>
  );
}
