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
  ShoppingBag,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatINR } from "@/lib/money";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import {
  ShopkeeperMascot,
  AttaSackIcon,
  MustardOilIcon,
  ChaiPattiIcon,
  DesiGheeIcon,
  MasalaPackIcon,
  KhataBookIcon,
  BiscuitPackIcon,
} from "@/components/RationIcons";

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
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] pb-24 md:pb-12">
      <Navbar shopName={data.shopName} isDemo={data.isDemo} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Top Banner: Lofi Kirana Store Showcase */}
        <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-2 border-emerald-950/20">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute right-1/4 -top-10 w-36 h-36 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Col: Shopkeeper Mascot & Outstanding Total */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {t.totalOutstanding}
                </span>
                <span className="bg-emerald-900/80 border border-emerald-600/50 px-2.5 py-0.5 rounded-full text-xs text-emerald-100 font-semibold truncate max-w-[200px]">
                  {data.shopName}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-300/20 border-2 border-amber-300/40 rounded-3xl p-1.5 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <ShopkeeperMascot className="w-14 h-14 sm:w-16 sm:h-16" />
                </div>
                <div>
                  <div className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                    {formatINR(data.totalOutstandingPaise)}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-200 mt-1 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    {data.customersWithDuesCount > 0
                      ? `${data.customersWithDuesCount} ${t.customersWithDues.toLowerCase()}`
                      : t.settled}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Quick Stats & Cartoon Ration Counter Preview */}
            <div className="md:col-span-5 bg-emerald-900/50 backdrop-blur-md rounded-2xl p-4 border border-emerald-600/40 space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-200 font-bold border-b border-emerald-700/60 pb-2">
                <span className="flex items-center gap-1 text-amber-300">
                  <KhataBookIcon className="w-4 h-4" />
                  {t.khataSummaryTitle}
                </span>
                <span className="text-[11px] text-emerald-300">{data.totalCustomersCount} {t.totalCount}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-emerald-800/80 rounded-xl p-2.5 border border-emerald-600/40">
                  <div className="text-[11px] font-semibold text-emerald-200">{t.customersWithDues}</div>
                  <div className="text-2xl font-black text-amber-300 mt-0.5">{data.customersWithDuesCount}</div>
                </div>
                <div className="bg-emerald-800/80 rounded-xl p-2.5 border border-emerald-600/40">
                  <div className="text-[11px] font-semibold text-emerald-200">{t.allCustomers}</div>
                  <div className="text-2xl font-black text-white mt-0.5">{data.totalCustomersCount}</div>
                </div>
              </div>

              {/* Cartoon Ration Item Doodles Row */}
              <div className="pt-1 flex items-center justify-around bg-emerald-950/40 rounded-xl py-2 px-1">
                <div title="Atta" className="hover:scale-110 transition-transform"><AttaSackIcon className="w-7 h-7" /></div>
                <div title="Mustard Oil" className="hover:scale-110 transition-transform"><MustardOilIcon className="w-7 h-7" /></div>
                <div title="Chai" className="hover:scale-110 transition-transform"><ChaiPattiIcon className="w-7 h-7" /></div>
                <div title="Desi Ghee" className="hover:scale-110 transition-transform"><DesiGheeIcon className="w-7 h-7" /></div>
                <div title="Masala" className="hover:scale-110 transition-transform"><MasalaPackIcon className="w-7 h-7" /></div>
                <div title="Biscuits" className="hover:scale-110 transition-transform"><BiscuitPackIcon className="w-7 h-7" /></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Navigation Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/customers?openAdd=true"
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-700/20 active:scale-95 transition-all border border-emerald-700"
          >
            <UserPlus className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{t.addCustomer}</span>
          </Link>

          <Link
            href="/customers"
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-amber-50/50 text-slate-800 border-2 border-amber-900/10 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <Users className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span className="truncate">{t.allCustomers}</span>
          </Link>

          <Link
            href="/profit-saathi"
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-2xl font-extrabold text-sm shadow-sm active:scale-95 transition-all col-span-2 sm:col-span-2 border border-amber-600"
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
            <span>{t.profitSaathiNav}</span>
          </Link>
        </section>

        {/* Main Responsive Grid: Top Debtors (Left) + Activity & Pantry (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Top 5 Debtors (7 cols on Desktop) */}
          <section className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-900/10 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{t.topDebtors}</span>
              </h2>
              <Link
                href="/customers"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
              >
                <span>{t.allCustomers}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {data.top5Owed.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <KhataBookIcon className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">{t.noCustomersYet}</p>
                <Link
                  href="/customers?openAdd=true"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  {t.addFirstCustomer}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.top5Owed.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F0] hover:bg-amber-50/70 border-2 border-amber-900/10 transition-all hover:border-amber-400/60"
                  >
                    <Link
                      href={`/customers/${customer.id}`}
                      className="flex items-center gap-3 min-w-0 flex-1 pr-3"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-950 font-black text-sm flex items-center justify-center flex-shrink-0 border border-amber-400 shadow-sm">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                          {customer.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{customer.phone}</span>
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-black text-rose-600">
                          {formatINR(customer.balancePaise)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
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

          {/* Right Column: Recent Activity & Kirana Pantry Snapshot (5 cols on Desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Recent Ledger Activity */}
            <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-900/10 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>{t.recentActivity}</span>
                </h2>
                <span className="text-[11px] font-bold text-slate-400">{t.liveFeed}</span>
              </div>

              {data.recentEntries.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
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
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                            {entry.customer.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate font-medium">
                            {entry.note || (isCredit ? t.creditGiven : t.paymentReceived)} • {dateStr}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block ${
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

            {/* Quick Profit Saathi Kirana Pantry Card */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-950">{t.rationPantryTitle}</h3>
                    <p className="text-[11px] font-semibold text-amber-800">{t.rationPantrySubtitle}</p>
                  </div>
                </div>
                <Link
                  href="/profit-saathi"
                  className="text-xs font-black text-amber-900 bg-amber-300 hover:bg-amber-400 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
                >
                  {t.openButton}
                </Link>
              </div>

              <p className="text-xs text-amber-900/80 font-medium">
                {t.rationPantryDesc}
              </p>

              <div className="flex items-center justify-between pt-1 text-center bg-white/70 rounded-xl p-2.5 border border-amber-200">
                <div className="flex-1 border-r border-amber-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t.flourGrains}</div>
                  <div className="text-xs font-black text-slate-800 mt-0.5">{t.essentialRation}</div>
                </div>
                <div className="flex-1 border-r border-amber-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t.mustardOil}</div>
                  <div className="text-xs font-black text-slate-800 mt-0.5">{t.fastMoving}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t.teaSpices}</div>
                  <div className="text-xs font-black text-slate-800 mt-0.5">{t.profitLeader}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
