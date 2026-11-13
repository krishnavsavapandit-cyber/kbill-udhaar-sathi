"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
  { code: "as", label: "অসমীয়া" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
      {languages.map((item) => {
        const isActive = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              isActive
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
