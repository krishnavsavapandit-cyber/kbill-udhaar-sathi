"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Users,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Store,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  ShopkeeperMascot,
  KhataBookIcon,
  AttaSackIcon,
  MustardOilIcon,
  ChaiPattiIcon,
  DesiGheeIcon,
} from "@/components/RationIcons";

interface LandingPageClientProps {
  shopName?: string;
  isLoggedIn?: boolean;
}

export function LandingPageClient({
  shopName = "Gupta Kirana Store",
  isLoggedIn = false,
}: LandingPageClientProps) {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 flex flex-col selection:bg-amber-300 selection:text-amber-950">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {isLoggedIn ? (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
          <Link
            href="/dashboard"
            className="hover:underline flex items-center gap-1.5"
          >
            <span>{t.alreadyLoggedInBanner(shopName)}</span>
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-amber-950 px-4 py-1.5 text-xs font-black text-center tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-950" />
          <span>{t.landingTagline}</span>
        </div>
      )}

      {/* 2. STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b-2 border-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-amber-300/20 border-2 border-amber-300/40 p-1 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <ShopkeeperMascot className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                  {t.appName}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
                  {t.kiranaBadge}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-200 block mt-0.5">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            <a
              href="#how-it-works"
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-emerald-100 hover:text-white px-3 py-1.5 rounded-xl hover:bg-emerald-700/60 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>{t.landingCtaHowItWorks}</span>
            </a>

            {/* Trilingual Toggle */}
            <LanguageToggle />

            {/* Primary Action Button */}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md shadow-amber-950/20 active:scale-95 transition-all"
              >
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">{t.landingCtaDashboard}</span>
                <span className="sm:hidden">{t.dashboard}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md shadow-amber-950/20 active:scale-95 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>{t.landingCtaStart}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white border-b-4 border-amber-400">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider shadow-md">
                <KhataBookIcon className="w-4 h-4" />
                <span>{t.digitalKhataSubtitle}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {t.landingHeroTitle}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t.landingHeroSubtitle}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-base font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-amber-950 shadow-xl shadow-amber-950/30 active:scale-95 transition-all border-2 border-amber-500"
                >
                  <Store className="w-5 h-5 text-amber-900" />
                  <span>{isLoggedIn ? t.landingCtaDashboard : t.landingCtaStart}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-sm font-bold bg-emerald-900/70 hover:bg-emerald-900 text-emerald-100 border-2 border-emerald-600/50 backdrop-blur-sm active:scale-95 transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-amber-300" />
                  <span>{t.landingCtaHowItWorks}</span>
                </a>
              </div>

              {/* Multi-Device Support Strip */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-300" /> Phone
                </span>
                <span className="text-emerald-500">•</span>
                <span className="flex items-center gap-1.5">
                  <Tablet className="w-4 h-4 text-amber-300" /> Tablet
                </span>
                <span className="text-emerald-500">•</span>
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-amber-300" /> Counter PC
                </span>
              </div>
            </div>

            {/* Right Column: Colorful Live Kirana Counter & Cartoon Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-white/95 to-amber-50/90 text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-amber-300/40 relative">
                {/* Shop Badge */}
                <div className="flex items-center justify-between border-b-2 border-amber-200/60 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 p-1 flex items-center justify-center shadow-inner">
                      <ShopkeeperMascot className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                        {t.kiranaBadge}
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {shopName}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ● Active Live
                    </span>
                  </div>
                </div>

                {/* Simulated Ledger Snapshot */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-600">
                        {t.totalOutstanding}
                      </div>
                      <div className="text-2xl font-black text-emerald-800 mt-0.5">
                        ₹18,450.00
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-200/60 text-emerald-900">
                      12 {t.customers}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3">
                      <div className="text-[11px] font-bold text-rose-700">
                        {t.creditGiven}
                      </div>
                      <div className="text-lg font-black text-rose-900 mt-0.5">
                        + ₹650.00
                      </div>
                      <div className="text-[10px] text-rose-600 font-semibold truncate mt-0.5">
                        Atta, Sugar, Dal
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                      <div className="text-[11px] font-bold text-emerald-700">
                        {t.paymentReceived}
                      </div>
                      <div className="text-lg font-black text-emerald-900 mt-0.5">
                        - ₹400.00
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold truncate mt-0.5">
                        Cash Payment
                      </div>
                    </div>
                  </div>

                  {/* Cartoon Ration Pantry Item Row */}
                  <div className="pt-2 bg-amber-100/70 border border-amber-300/60 rounded-2xl p-3 flex items-center justify-around">
                    <div className="text-center group" title="Atta">
                      <AttaSackIcon className="w-8 h-8 mx-auto" />
                      <span className="text-[10px] font-bold text-amber-900 block mt-0.5">
                        {t.flourGrains}
                      </span>
                    </div>
                    <div className="text-center group" title="Mustard Oil">
                      <MustardOilIcon className="w-8 h-8 mx-auto" />
                      <span className="text-[10px] font-bold text-amber-900 block mt-0.5">
                        {t.mustardOil}
                      </span>
                    </div>
                    <div className="text-center group" title="Chai">
                      <ChaiPattiIcon className="w-8 h-8 mx-auto" />
                      <span className="text-[10px] font-bold text-amber-900 block mt-0.5">
                        {t.teaSpices}
                      </span>
                    </div>
                    <div className="text-center group" title="Desi Ghee">
                      <DesiGheeIcon className="w-8 h-8 mx-auto" />
                      <span className="text-[10px] font-bold text-amber-900 block mt-0.5">
                        Ghee
                      </span>
                    </div>
                    <div className="text-center group" title="Khata Book">
                      <KhataBookIcon className="w-8 h-8 mx-auto" />
                      <span className="text-[10px] font-bold text-amber-900 block mt-0.5">
                        Khata
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Trust Highlights Under Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 pt-6 border-t border-emerald-600/40">
            <div className="bg-emerald-900/60 backdrop-blur-sm border border-emerald-600/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-emerald-50">
                {t.landingTrust1}
              </span>
            </div>
            <div className="bg-emerald-900/60 backdrop-blur-sm border border-emerald-600/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-emerald-50">
                {t.landingTrust2}
              </span>
            </div>
            <div className="bg-emerald-900/60 backdrop-blur-sm border border-emerald-600/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
              <KeyRound className="w-6 h-6 text-amber-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-emerald-50">
                {t.landingTrust3}
              </span>
            </div>
            <div className="bg-emerald-900/60 backdrop-blur-sm border border-emerald-600/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-amber-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-emerald-50">
                {t.landingTrust4}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STEP-BY-STEP HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-950 uppercase tracking-wider border border-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.howItWorksHeading}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.howItWorksHeading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {t.howItWorksSubheading}
          </p>
        </div>

        {/* Step Selector Pills for Easy Navigation */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {[
            { id: 1, label: t.step1Badge, title: t.step1Title, color: "amber" },
            { id: 2, label: t.step2Badge, title: t.step2Title, color: "emerald" },
            { id: 3, label: t.step3Badge, title: t.step3Title, color: "teal" },
            { id: 4, label: t.step4Badge, title: t.step4Title, color: "indigo" },
            { id: 5, label: t.step5Badge, title: t.step5Title, color: "sky" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveStep(item.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 active:scale-95 ${
                activeStep === item.id
                  ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/20 scale-105"
                  : "bg-white text-slate-700 hover:bg-amber-100/50 border border-amber-900/10"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                activeStep === item.id ? "bg-amber-400 text-amber-950" : "bg-slate-200 text-slate-700"
              }`}>
                {item.id}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* The 5 Fluid Step Cards Grid */}
        <div className="space-y-8">
          {/* STEP 1: ONE-TAP LOGIN */}
          <div
            id="step-1"
            className={`rounded-3xl p-6 sm:p-8 transition-all border-2 ${
              activeStep === 1
                ? "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 border-amber-400 shadow-xl"
                : "bg-white border-amber-900/10 shadow-sm opacity-90"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-amber-500 text-white uppercase tracking-wider shadow-sm">
                    {t.step1Badge}
                  </span>
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    {t.singleShopSecured}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step1Feature1}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step1Feature2}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step1Feature3}</span>
                  </div>
                </div>
              </div>

              {/* Step 1 Visual Mockup Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-md">
                <div className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{t.loginTitle}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                    1-Tap Entry
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    {t.passwordLabel}
                  </label>
                  <div className="bg-white border-2 border-amber-400 rounded-lg p-2.5 text-sm font-mono tracking-widest text-slate-700 flex items-center justify-between">
                    <span>•••••••••••</span>
                    <LockIcon className="w-4 h-4 text-amber-700" />
                  </div>
                  <button className="w-full py-2.5 bg-amber-400 text-amber-950 font-black text-xs rounded-lg shadow-sm">
                    {t.loginButton} ➔
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: ADD CUSTOMERS & APPEND-ONLY LEDGER */}
          <div
            id="step-2"
            className={`rounded-3xl p-6 sm:p-8 transition-all border-2 ${
              activeStep === 2
                ? "bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-400 shadow-xl"
                : "bg-white border-amber-900/10 shadow-sm opacity-90"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white uppercase tracking-wider shadow-sm">
                    {t.step2Badge}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {t.appendOnlyNotice}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step2Feature1}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step2Feature2}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step2Feature3}</span>
                  </div>
                </div>
              </div>

              {/* Step 2 Visual Mockup Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border-2 border-emerald-200 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Ramesh Kumar</h4>
                    <p className="text-[11px] font-semibold text-slate-500">98765-43210</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block">{t.netBalance}</span>
                    <span className="text-base font-black text-rose-700">₹850.00</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] font-bold text-rose-700 block">{t.giveCredit}</span>
                    <span className="text-sm font-black text-rose-900">+ ₹500</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 block">{t.receivePayment}</span>
                    <span className="text-sm font-black text-emerald-900">- ₹300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: 1-TAP POLITE WHATSAPP REMINDER */}
          <div
            id="step-3"
            className={`rounded-3xl p-6 sm:p-8 transition-all border-2 ${
              activeStep === 3
                ? "bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100/60 border-teal-400 shadow-xl"
                : "bg-white border-amber-900/10 shadow-sm opacity-90"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-teal-600 text-white uppercase tracking-wider shadow-sm">
                    {t.step3Badge}
                  </span>
                  <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    1-Tap wa.me
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step3Feature1}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step3Feature2}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step3Feature3}</span>
                  </div>
                </div>
              </div>

              {/* Step 3 Visual Mockup Card: WhatsApp Bubble */}
              <div className="lg:col-span-5 bg-[#EFEAE2] rounded-2xl p-5 border-2 border-teal-300 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 border-b border-slate-300/60 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>WhatsApp Message Preview</span>
                </div>

                <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-sm border border-emerald-200 text-xs text-slate-800 leading-relaxed font-medium">
                  {t.reminderMessage("Ramesh Ji", shopName, "850")}
                  <span className="block text-[9px] text-slate-400 text-right mt-1.5 font-bold">
                    10:30 AM ✓✓
                  </span>
                </div>

                <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.remindWhatsApp}</span>
                </button>
              </div>
            </div>
          </div>

          {/* STEP 4: SMART UDHAAR SCORE & LIMITS */}
          <div
            id="step-4"
            className={`rounded-3xl p-6 sm:p-8 transition-all border-2 ${
              activeStep === 4
                ? "bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100/60 border-indigo-400 shadow-xl"
                : "bg-white border-amber-900/10 shadow-sm opacity-90"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-600 text-white uppercase tracking-wider shadow-sm">
                    {t.step4Badge}
                  </span>
                  <span className="text-xs font-bold text-indigo-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    FIFO Repayment & 15th-of-Month Rule
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step4Feature1}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step4Feature2}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step4Feature3}</span>
                  </div>
                </div>
              </div>

              {/* Step 4 Visual Mockup Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border-2 border-indigo-200 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    {t.udhaarScoreTitle}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {t.bandGood}
                  </span>
                </div>

                <div className="text-center py-2">
                  <div className="text-4xl font-black text-emerald-700">85 / 100</div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full w-[85%]"></div>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-600 block">{t.suggestedLimit}</span>
                    <span className="font-black text-indigo-950 text-sm">₹5,000.00</span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700">
                    1.0x Base Limit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 5: PROFIT SAATHI & VELOCITY METRICS */}
          <div
            id="step-5"
            className={`rounded-3xl p-6 sm:p-8 transition-all border-2 ${
              activeStep === 5
                ? "bg-gradient-to-br from-sky-50 via-teal-50 to-sky-100/60 border-sky-400 shadow-xl"
                : "bg-white border-amber-900/10 shadow-sm opacity-90"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-sky-600 text-white uppercase tracking-wider shadow-sm">
                    {t.step5Badge}
                  </span>
                  <span className="text-xs font-bold text-sky-800 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {t.profitSaathiTitle}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.step5Title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {t.step5Desc}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step5Feature1}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step5Feature2}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t.step5Feature3}</span>
                  </div>
                </div>
              </div>

              {/* Step 5 Visual Mockup Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border-2 border-sky-200 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2.5">
                    <MustardOilIcon className="w-7 h-7" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{t.mustardOil}</h4>
                      <span className="text-[10px] font-bold text-emerald-700">Rank #1 Profit Maker</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                    6 {t.days} left
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 block">{t.currentStock}</span>
                    <span className="text-sm font-black text-slate-900">8 units</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 block">{t.salesPerDay}</span>
                    <span className="text-sm font-black text-emerald-700">2.0 /day</span>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2 border border-amber-200">
                    <span className="text-[10px] font-semibold text-amber-800 block">Reorder</span>
                    <span className="text-sm font-black text-amber-950">+20 units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIDE-BY-SIDE COMPARISON: OLD PAPER DIARY VS UDHAAR SAATHI */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white rounded-3xl border-2 border-amber-900/10 shadow-lg my-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.comparisonTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {t.comparisonSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Paper Diary Pain Points */}
          <div className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3 border-b border-rose-200/80 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-200 flex items-center justify-center text-rose-800 font-black">
                ✕
              </div>
              <div>
                <h3 className="text-base font-black text-rose-950">
                  {t.paperKhata}
                </h3>
                <span className="text-xs font-semibold text-rose-700">
                  Daily risks & headaches
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-rose-900">
                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{t.paperPoint1}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-rose-900">
                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{t.paperPoint2}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-rose-900">
                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{t.paperPoint3}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-rose-900">
                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{t.paperPoint4}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-rose-900">
                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{t.paperPoint5}</span>
              </li>
            </ul>
          </div>

          {/* Udhaar Saathi Modern Advantages */}
          <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3 border-b border-emerald-200/80 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-200 flex items-center justify-center text-emerald-800 font-black">
                ✓
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-950">
                  {t.digitalKhata}
                </h3>
                <span className="text-xs font-semibold text-emerald-700">
                  Built for smart shopkeepers
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{t.digitalPoint1}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{t.digitalPoint2}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{t.digitalPoint3}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{t.digitalPoint4}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{t.digitalPoint5}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden border-4 border-amber-400">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 bg-amber-300/20 border-2 border-amber-300/50 rounded-3xl p-1.5 flex items-center justify-center mx-auto shadow-inner">
              <ShopkeeperMascot className="w-12 h-12" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {t.landingBottomCtaTitle}
            </h2>

            <p className="text-sm sm:text-base text-emerald-100 font-medium">
              {t.landingBottomCtaDesc}
            </p>

            <div className="pt-2">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-black bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-xl shadow-amber-950/40 active:scale-95 transition-all border-2 border-amber-500"
              >
                <Store className="w-5 h-5 text-amber-900" />
                <span>{isLoggedIn ? t.landingCtaDashboard : t.landingBottomCtaButton}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HONEST FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/30 p-0.5 flex items-center justify-center">
              <ShopkeeperMascot className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-200">{t.appName}</span>
            <span className="text-slate-500">•</span>
            <span>{t.tagline}</span>
          </div>

          <div className="text-center sm:text-right text-slate-400">
            <span>{t.singleShopSecured}</span>
            <span className="mx-2">•</span>
            <span className="text-amber-400 font-semibold">100% Private Ledger</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
