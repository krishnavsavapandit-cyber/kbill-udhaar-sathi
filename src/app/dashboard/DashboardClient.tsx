"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  UserPlus,
  ArrowRight,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatINR } from "@/lib/money";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

interface DashboardData {
  shopName: string;
  ownerName: string;
  isDemo: boolean;
  totalOutstandingPaise: number;
  customersWithDuesCount: number;
  totalCustomersCount: number;
  top5Owed: Array<{
    id: string;
    name: string;
    phone: string;
    balancePaise: number;
    lastActiveAt: Date | string;
  }>;
  recentEntries: Array<{
    id: string;
    type: string;
    amountPaise: number;
    note: string | null;
    createdAt: Date | string;
    customer: {
      id: string;
      name: string;
      phone: string;
    };
  }>;
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <Navbar shopName={data.shopName} isDemo={data.isDemo} />

      <main className="flex-1 p-4 space-y-5">
        {/* Main Outstanding Highlight Banner */}
        <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-amber-300" />
              {t.totalOutstanding}
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] backdrop-blur">
              {data.shopName}
            </span>
          </div>

          <div className="mt-2 mb-4">
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-1">
              {formatINR(data.totalOutstandingPaise)}
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              {data.customersWithDuesCount > 0
                ? `${data.customersWithDuesCount} ${t.customersWithDues.toLowerCase()}`
                : t.settled}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur">
              <div className="text-emerald-200 font-medium text-[11px]">
                {t.customersWithDues}
              </div>
              <div className="text-xl font-black text-amber-300 mt-0.5">
                {data.customersWithDuesCount}
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur">
              <div className="text-emerald-200 font-medium text-[11px]">
                {t.allCustomers}
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                {data.totalCustomersCount}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Buttons */}
        <section className="grid grid-cols-2 gap-3">
          <Link
            href="/customers?openAdd=true"
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t.addCustomer}</span>
          </Link>
          <Link
            href="/customers"
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <Users className="w-5 h-5 text-emerald-700" />
            <span>{t.allCustomers}</span>
          </Link>
        </section>

        {/* Top 5 Customers by Balance Owed */}
        <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t.topDebtors}
            </h2>
            <Link
              href="/customers"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{t.allCustomers}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data.top5Owed.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium">{t.noCustomersYet}</p>
              <Link
                href="/customers?openAdd=true"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t.addFirstCustomer}
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.top5Owed.map((customer, index) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors"
                >
                  <Link
                    href={`/customers/${customer.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1 pr-2"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center flex-shrink-0">
                      #{index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{customer.phone}</span>
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-black text-rose-600">
                        {formatINR(customer.balancePaise)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        {t.balanceOwed}
                      </div>
                    </div>

                    <WhatsAppButton
                      customerName={customer.name}
                      customerPhone={customer.phone}
                      balancePaise={customer.balancePaise}
                      shopName={data.shopName}
                      variant="icon"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Ledger Activity */}
        <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              {t.recentActivity}
            </h2>
          </div>

          {data.recentEntries.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              {t.noEntriesYet}
            </div>
          ) : (
            <div className="space-y-2">
              {data.recentEntries.map((entry) => {
                const isCredit = entry.type === "CREDIT_GIVEN";
                const dateStr = new Date(entry.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                });

                return (
                  <Link
                    key={entry.id}
                    href={`/customers/${entry.customer.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {entry.customer.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {entry.note || (isCredit ? t.creditGiven : t.paymentReceived)} • {dateStr}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-lg inline-block ${
                          isCredit
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatINR(entry.amountPaise)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
