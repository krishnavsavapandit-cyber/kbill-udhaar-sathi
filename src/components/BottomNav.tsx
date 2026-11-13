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
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
      <Link
        href="/dashboard"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isDashboard
            ? "text-emerald-700 font-bold"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl ${
            isDashboard ? "bg-emerald-100 text-emerald-800" : ""
          }`}
        >
          <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="text-[10px] sm:text-[11px] tracking-tight">{t.dashboard}</span>
      </Link>

      <Link
        href="/customers?openAdd=true"
        className="flex flex-col items-center -mt-5 group"
      >
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-active:scale-95 transition-transform border-4 border-white">
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 mt-0.5">
          {t.addCustomer}
        </span>
      </Link>

      <Link
        href="/customers"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isCustomers
            ? "text-emerald-700 font-bold"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl ${
            isCustomers ? "bg-emerald-100 text-emerald-800" : ""
          }`}
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="text-[10px] sm:text-[11px] tracking-tight">{t.customers}</span>
      </Link>

      <Link
        href="/profit-saathi"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isProfit
            ? "text-emerald-700 font-bold"
            : "text-slate-500 hover:text-slate-800 font-medium"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl ${
            isProfit ? "bg-emerald-100 text-emerald-800" : ""
          }`}
        >
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="text-[10px] sm:text-[11px] tracking-tight">Profit Saathi</span>
      </Link>
    </nav>
  );
}
