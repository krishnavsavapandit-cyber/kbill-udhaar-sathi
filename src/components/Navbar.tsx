"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  UserPlus,
  LogOut,
  Store,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { logoutAction } from "@/app/actions";
import { ShopkeeperMascot } from "./RationIcons";

interface NavbarProps {
  shopName?: string;
  isDemo?: boolean;
}

export function Navbar({ shopName = "Udhaar Saathi", isDemo = false }: NavbarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      setIsLoggingOut(true);
      await logoutAction();
    }
  };

  const isDashboard = pathname === "/dashboard" || pathname === "/";
  const isCustomers = pathname.startsWith("/customers");
  const isProfit = pathname.startsWith("/profit-saathi");

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b-2 border-emerald-950/30">
      {/* Top Banner for Demo Data if loaded */}
      {isDemo && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-amber-950 px-3 py-1.5 text-xs font-black text-center tracking-wider uppercase flex items-center justify-center gap-2 shadow-inner border-b border-amber-500/40">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-800 animate-pulse"></span>
          <span className="tracking-wide">{t.demoDataBadge} (Demonstration Kirana Data)</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand & Mascot */}
        <Link href="/dashboard" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border-2 border-amber-300/40 p-1 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <ShopkeeperMascot className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
                किराना
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-200 flex items-center gap-1 truncate max-w-[140px] sm:max-w-[220px] mt-0.5">
              <Store className="w-3.5 h-3.5 flex-shrink-0 text-amber-300" />
              <span className="truncate">{shopName}</span>
            </p>
          </div>
        </Link>

        {/* Center: Desktop / Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-emerald-900/60 p-1.5 rounded-2xl border border-emerald-700/50 backdrop-blur-sm">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isDashboard
                ? "bg-amber-400 text-amber-950 shadow-sm"
                : "text-emerald-100 hover:text-white hover:bg-emerald-800/80"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t.dashboard}</span>
          </Link>

          <Link
            href="/customers"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isCustomers
                ? "bg-amber-400 text-amber-950 shadow-sm"
                : "text-emerald-100 hover:text-white hover:bg-emerald-800/80"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.customers}</span>
          </Link>

          <Link
            href="/profit-saathi"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isProfit
                ? "bg-amber-400 text-amber-950 shadow-sm"
                : "text-emerald-100 hover:text-white hover:bg-emerald-800/80"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Profit Saathi</span>
          </Link>

          <Link
            href="/customers?openAdd=true"
            className="flex items-center gap-1.5 ml-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-black bg-emerald-500 hover:bg-emerald-400 text-white shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden lg:inline">{t.addCustomer}</span>
          </Link>
        </nav>

        {/* Right: Language Toggle & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <LanguageToggle />
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={t.logoutButton}
            className="p-2 sm:px-3 sm:py-2 text-emerald-100 hover:text-white hover:bg-emerald-700/80 bg-emerald-900/40 border border-emerald-700/60 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            aria-label={t.logoutButton}
          >
            <LogOut className="w-4 h-4 text-rose-300" />
            <span className="hidden sm:inline">{t.logoutButton}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
