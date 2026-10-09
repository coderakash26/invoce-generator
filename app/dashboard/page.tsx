"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { Plus, Users, Palette, Settings, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { useBusinessProfile } from "@/lib/hooks/use-business-profile";
import { formatDateDisplay, getTodayDateString } from "@/lib/utils/dates";

const emptySubscribe = () => () => {};

export default function DashboardPage() {
  const { invoices } = useInvoices();
  const { profile } = useBusinessProfile();
  const todayFormatted = useSyncExternalStore(
    emptySubscribe,
    () => formatDateDisplay(getTodayDateString(), "EEEE, MMMM d, yyyy"),
    () => "Tuesday, March 31, 2026"
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Welcome back, {profile.name || "Business"}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">{todayFormatted}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/invoices/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </Link>
          </div>
        </div>

        {/* Real Dynamic Summary Metrics */}
        <SummaryCards invoices={invoices} currency={profile.defaultCurrency} />

        {/* Analytics and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart invoices={invoices} currency={profile.defaultCurrency} />
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-3">
            <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Quick Actions</h3>

              <div className="space-y-2">
                <Link
                  href="/invoices/new"
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50 hover:border-zinc-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">New Invoice</p>
                      <p className="text-[11px] text-zinc-500">Create & download PDF</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/clients"
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50 hover:border-zinc-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">Manage Clients</p>
                      <p className="text-[11px] text-zinc-500">Directory & history</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/templates"
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50 hover:border-zinc-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">Templates Gallery</p>
                      <p className="text-[11px] text-zinc-500">Explore styles</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50 hover:border-zinc-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">Business Profile</p>
                      <p className="text-[11px] text-zinc-500">Bank, currency & tax</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Recent Invoices</h2>
              <p className="text-xs text-zinc-500">Overview of your latest transactions</p>
            </div>
            <Link
              href="/invoices"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Invoices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <InvoiceTable invoices={invoices} limit={5} showFilters={false} />
        </div>
      </div>
    </AppLayout>
  );
}
