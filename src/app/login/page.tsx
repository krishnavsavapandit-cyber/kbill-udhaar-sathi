"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, KeyRound, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { loginAction } from "@/app/actions";

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

  const handleFillDemo = () => {
    setPassword("kirana123");
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-800 via-emerald-700 to-slate-900 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header with Lang Toggle */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-300" />
          <span className="font-black text-lg tracking-tight">{t.appName}</span>
        </div>
        <LanguageToggle />
      </div>

      {/* Main Login Card */}
      <div className="w-full my-auto py-8">
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {t.loginTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t.loginSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  required
                  autoFocus
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-lg font-medium tracking-wide focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-lg shadow-lg shadow-emerald-700/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>{t.loginButton}</span>
                </>
              )}
            </button>

            {/* Quick Demo Fill Helper */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🔑</span>
                <span>{t.useDemoPassword}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Single-shopkeeper secured ledger (.env)</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-2 text-xs text-emerald-200/80 font-medium">
        {t.tagline} • Udhaar Saathi v1.0
      </footer>
    </main>
  );
}
