"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, LogOut, Store } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { logoutAction } from "@/app/actions";

interface NavbarProps {
  shopName?: string;
  isDemo?: boolean;
}

export function Navbar({ shopName = "Udhaar Saathi", isDemo = false }: NavbarProps) {
  const { t } = useLanguage();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      setIsLoggingOut(true);
      await logoutAction();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-emerald-800 text-white shadow-md border-b border-emerald-900/40">
      {/* Top Banner for Demo Data if loaded */}
      {isDemo && (
        <div className="bg-amber-400 text-amber-950 px-3 py-1 text-xs font-bold text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-inner">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-800 animate-pulse"></span>
          {t.demoDataBadge} (Demonstration Mode)
        </div>
      )}

      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-amber-300 shadow-sm group-active:scale-95 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-tight flex items-center gap-1.5 text-white">
              {t.appName}
            </h1>
            <p className="text-[11px] font-medium text-emerald-200 flex items-center gap-1 truncate max-w-[150px] sm:max-w-[200px]">
              <Store className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{shopName}</span>
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={t.logoutButton}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-700/60 rounded-xl transition-colors active:scale-95"
            aria-label={t.logoutButton}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
