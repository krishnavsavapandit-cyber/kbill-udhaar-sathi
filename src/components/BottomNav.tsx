"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserPlus, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isDashboard = pathname === "/dashboard" || pathname === "/";
  const isCustomers = pathname.startsWith("/customers");
  const isProfit = pathname.startsWith("/profit-saathi");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-amber-900/10 px-3 py-2 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <Link
        href="/dashboard"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isDashboard
            ? "text-emerald-700 font-bold scale-105"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition-colors ${
            isDashboard ? "bg-emerald-100 text-emerald-800" : ""
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight">{t.dashboard}</span>
      </Link>

      <Link
        href="/customers?openAdd=true"
        className="flex flex-col items-center -mt-6 group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 group-active:scale-95 transition-transform border-4 border-[#FAF7F0]">
          <UserPlus className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black text-emerald-800 mt-0.5">
          {t.addCustomer}
        </span>
      </Link>

      <Link
        href="/customers"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isCustomers
            ? "text-emerald-700 font-bold scale-105"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition-colors ${
            isCustomers ? "bg-emerald-100 text-emerald-800" : ""
          }`}
        >
          <Users className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight">{t.customers}</span>
      </Link>

      <Link
        href="/profit-saathi"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isProfit
            ? "text-emerald-700 font-bold scale-105"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition-colors ${
            isProfit ? "bg-emerald-100 text-emerald-800" : ""
          }`}
        >
          <TrendingUp className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight">Profit Saathi</span>
      </Link>
    </nav>
  );
}
