"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Eye, EyeOff, ShieldCheck, Lock, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { loginAction } from "@/app/actions";
import { ShopkeeperMascot } from "@/components/RationIcons";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("password", password);
      const res = await loginAction(formData);

      if (res.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.error || t.invalidPassword);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header with Lang Toggle */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-200 border border-amber-400 p-1 flex items-center justify-center shadow-inner">
            <ShopkeeperMascot className="w-8 h-8" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 leading-none">
              {t.appName}
            </span>
            <span className="block text-[11px] font-bold text-amber-800">
              {t.tagline}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.landingCtaHowItWorks}</span>
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Login Card Centered */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-900/10">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-3 border-2 border-amber-300 shadow-inner">
              <ShopkeeperMascot className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {t.loginTitle}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {t.loginSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5 text-amber-700" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  required
                  autoFocus
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-slate-900 text-lg font-bold tracking-wide focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 text-slate-600" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-emerald-700/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-emerald-700"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t.loginButton}</span>
                </>
              )}
            </button>

            {/* Demo Password 1-Click Autofill Helper */}
            <div className="pt-2">
              <div className="p-3.5 bg-amber-50/90 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-sm">
                <div className="text-left w-full sm:w-auto">
                  <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>{t.demoPasswordHint}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Demo Password:</span>
                    <code className="px-2 py-0.5 bg-amber-200 text-amber-950 font-mono font-black text-xs rounded-lg select-all border border-amber-300">
                      kirana123
                    </code>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPassword("kirana123")}
                  className="w-full sm:w-auto text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 px-3.5 py-2 rounded-xl border border-amber-500 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-950" />
                  <span>{t.useDemoPassword}</span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-amber-900/10 flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.singleShopSecured}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-slate-500 font-semibold max-w-6xl mx-auto w-full">
        {t.tagline} • Udhaar Saathi v1.0
      </footer>
    </main>
  );
}
