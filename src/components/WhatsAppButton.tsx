"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatINR } from "@/lib/money";

interface WhatsAppButtonProps {
  customerName: string;
  customerPhone: string;
  balancePaise: number;
  shopName?: string;
  className?: string;
  variant?: "button" | "icon" | "full";
}

export function WhatsAppButton({
  customerName,
  customerPhone,
  balancePaise,
  shopName = "Kirana Store",
  className = "",
  variant = "button",
}: WhatsAppButtonProps) {
  const { t } = useLanguage();

  // If customer has no dues or advance, reminder is not necessary or can show 0
  if (balancePaise <= 0) {
    return null;
  }

  // Sanitize phone number to 10 digits and prepend 91 for India
  const digitsOnly = customerPhone.replace(/\D/g, "");
  const formattedPhone =
    digitsOnly.length === 10
      ? `91${digitsOnly}`
      : digitsOnly.startsWith("91") && digitsOnly.length === 12
      ? digitsOnly
      : `91${digitsOnly.slice(-10)}`;

  const formattedAmount = formatINR(balancePaise).replace("₹", "");
  const rawMessage = t.reminderMessage(customerName, shopName, formattedAmount);
  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(rawMessage)}`;

  if (variant === "icon") {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.remindWhatsApp}
        title={t.remindWhatsApp}
        className={`p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors inline-flex items-center justify-center active:scale-95 ${className}`}
      >
        <MessageCircle className="w-4 h-4 fill-current" />
      </a>
    );
  }

  if (variant === "full") {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all ${className}`}
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span>{t.remindWhatsApp}</span>
      </a>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95 ${className}`}
    >
      <MessageCircle className="w-3.5 h-3.5 fill-current" />
      <span>{t.remindWhatsApp}</span>
    </a>
  );
}
