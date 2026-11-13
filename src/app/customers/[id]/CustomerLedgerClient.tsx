"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  PlusCircle,
  MinusCircle,
  X,
  AlertTriangle,
  History,
  RotateCcw,
  Edit2,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatINR } from "@/lib/money";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Navbar } from "@/components/Navbar";
import { UdhaarScoreResult } from "@/lib/udhaarScore";
import {
  addLedgerEntry,
  reverseLedgerEntry,
  updateCustomer,
} from "@/app/actions";
import { KhataBookIcon } from "@/components/RationIcons";

interface LedgerEntryItem {
  id: string;
  type: string;
  amountPaise: number;
  note: string | null;
  createdAt: Date | string;
}

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  balancePaise: number;
  scoreResult?: UdhaarScoreResult;
  baseCreditLimitPaise?: number;
  entries: LedgerEntryItem[];
}

interface CustomerLedgerClientProps {
  customer: CustomerData;
  shopName: string;
  isDemo: boolean;
}

export function CustomerLedgerClient({
  customer,
  shopName,
  isDemo,
}: CustomerLedgerClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Add Entry Modal State
  const [modalType, setModalType] = useState<"CREDIT_GIVEN" | "PAYMENT_RECEIVED" | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Negative balance confirmation dialog state
  const [confirmExcessModal, setConfirmExcessModal] = useState<{
    pendingAmount: number;
    pendingNote?: string;
  } | null>(null);

  // Suggested credit limit warning modal state
  const [confirmLimitModal, setConfirmLimitModal] = useState<{
    pendingAmount: number;
    pendingNote?: string;
    suggestedLimitPaise: number;
    resultingDuePaise: number;
  } | null>(null);

  // Reversal Entry target state
  const [reversalTarget, setReversalTarget] = useState<LedgerEntryItem | null>(null);

  // Edit Customer Modal State
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [editName, setEditName] = useState(customer.name);
  const [editPhone, setEditPhone] = useState(customer.phone);
  const [editError, setEditError] = useState<string | null>(null);

  const hasDue = customer.balancePaise > 0;
  const hasAdvance = customer.balancePaise < 0;

  const handleOpenEntryModal = (type: "CREDIT_GIVEN" | "PAYMENT_RECEIVED") => {
    setModalType(type);
    setAmountInput("");
    setNoteInput("");
    setFormError(null);
  };

  const handleCloseEntryModal = () => {
    setModalType(null);
    setAmountInput("");
    setNoteInput("");
    setFormError(null);
  };

  const handleQuickAmount = (amount: number) => {
    const current = parseFloat(amountInput) || 0;
    setAmountInput((current + amount).toString());
  };

  const handleQuickNote = (tag: string) => {
    if (!noteInput) {
      setNoteInput(tag);
    } else {
      setNoteInput(`${noteInput}, ${tag}`);
    }
  };

  const handleEntrySubmit = async (e: React.FormEvent, forceNegative = false) => {
    e.preventDefault();
    setFormError(null);

    const numAmount = parseFloat(amountInput);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError("Please enter a valid amount greater than ₹0");
      return;
    }

    // Check advisory credit limit warning for new credit
    if (modalType === "CREDIT_GIVEN" && customer.scoreResult) {
      const suggestedLimitPaise = customer.scoreResult.suggestedLimitPaise;
      const proposedPaise = Math.round(numAmount * 100);
      const resultingDuePaise = customer.balancePaise + proposedPaise;

      if (resultingDuePaise > suggestedLimitPaise && !confirmLimitModal) {
        setConfirmLimitModal({
          pendingAmount: numAmount,
          pendingNote: noteInput.trim() || undefined,
          suggestedLimitPaise,
          resultingDuePaise,
        });
        return;
      }
    }

    startTransition(async () => {
      const res = await addLedgerEntry({
        customerId: customer.id,
        type: modalType!,
        amountRupees: numAmount,
        note: noteInput.trim(),
        allowNegativeBalance: forceNegative,
      });

      if (res.requiresConfirmation) {
        setConfirmExcessModal({
          pendingAmount: numAmount,
          pendingNote: noteInput.trim(),
        });
      } else if (res.success) {
        handleCloseEntryModal();
        setConfirmExcessModal(null);
        setConfirmLimitModal(null);
        router.refresh();
      } else {
        setFormError(res.error || "Failed to record transaction");
      }
    });
  };

  const handleConfirmLimitOverride = () => {
    if (!confirmLimitModal) return;
    const numAmount = confirmLimitModal.pendingAmount;
    const note = confirmLimitModal.pendingNote;

    startTransition(async () => {
      const res = await addLedgerEntry({
        customerId: customer.id,
        type: "CREDIT_GIVEN",
        amountRupees: numAmount,
        note,
      });

      if (res.success) {
        setConfirmLimitModal(null);
        handleCloseEntryModal();
        router.refresh();
      } else {
        setFormError(res.error || "Failed to record credit");
      }
    });
  };

  const handleConfirmExcessPayment = () => {
    if (!confirmExcessModal) return;
    startTransition(async () => {
      const res = await addLedgerEntry({
        customerId: customer.id,
        type: "PAYMENT_RECEIVED",
        amountRupees: confirmExcessModal.pendingAmount,
        note: confirmExcessModal.pendingNote,
        allowNegativeBalance: true,
      });

      if (res.success) {
        setConfirmExcessModal(null);
        handleCloseEntryModal();
        router.refresh();
      } else {
        setFormError(res.error || "Failed to record payment");
      }
    });
  };

  const handleExecuteReversal = async () => {
    if (!reversalTarget) return;

    startTransition(async () => {
      const res = await reverseLedgerEntry(reversalTarget.id);
      if (res.success) {
        setReversalTarget(null);
        router.refresh();
      } else {
        alert(res.error || "Failed to reverse entry");
      }
    });
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    const cleanPhone = editPhone.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setEditError("Must be a valid 10-digit mobile number");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", editName.trim());
      formData.append("phone", cleanPhone);

      const res = await updateCustomer(customer.id, formData);
      if (res.success) {
        setShowEditCustomer(false);
        router.refresh();
      } else {
        setEditError(res.error || "Failed to update customer");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] pb-28 md:pb-12">
      <Navbar shopName={shopName} isDemo={isDemo} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/customers"
            className="p-2 -ml-2 rounded-2xl text-slate-700 hover:text-emerald-800 hover:bg-amber-100/60 flex items-center gap-1.5 text-xs sm:text-sm font-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.customersBreadcrumb}</span>
          </Link>

          <button
            onClick={() => {
              setEditName(customer.name);
              setEditPhone(customer.phone);
              setEditError(null);
              setShowEditCustomer(true);
            }}
            className="py-1.5 px-3 rounded-xl bg-white hover:bg-amber-50 text-slate-700 border-2 border-amber-900/10 text-xs font-black flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{t.editCustomer}</span>
          </button>
        </div>

        {/* Responsive Multi-Device Layout: Left (Overview & Score) + Right (Actions & History) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Customer Card, Balance, Score, Remind (5 cols on Desktop) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Customer Profile Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-amber-900/10 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-950 font-black text-xl flex items-center justify-center flex-shrink-0 border border-amber-400 shadow-inner">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {customer.name}
                    </h1>
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5 hover:text-emerald-700 font-mono font-bold"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+91 {customer.phone}</span>
                    </a>
                  </div>
                </div>

                <WhatsAppButton
                  customerName={customer.name}
                  customerPhone={customer.phone}
                  balancePaise={customer.balancePaise}
                  shopName={shopName}
                  variant="button"
                />
              </div>
            </div>

            {/* Net Balance Highlight Card */}
            <div
              className={`rounded-3xl p-6 text-white shadow-lg relative overflow-hidden transition-all border-2 border-black/10 ${
                hasDue
                  ? "bg-gradient-to-br from-rose-600 via-rose-700 to-amber-700 shadow-rose-700/20"
                  : hasAdvance
                  ? "bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-800 shadow-blue-700/20"
                  : "bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 shadow-emerald-700/20"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-white/90">
                <span>{t.netBalance}</span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur font-black text-[11px] border border-white/20">
                  {hasDue ? t.balanceOwed : hasAdvance ? t.advancePaid : t.settled}
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-white flex items-baseline drop-shadow">
                {formatINR(customer.balancePaise)}
              </div>

              <p className="text-xs text-white/90 font-medium mt-2">
                {hasDue
                  ? `${customer.name} owes this amount to ${shopName}`
                  : hasAdvance
                  ? `${customer.name} has paid advance to ${shopName}`
                  : `All dues are cleared for ${customer.name}`}
              </p>
            </div>

            {/* WhatsApp Reminder Full CTA if dues exist */}
            {hasDue && (
              <WhatsAppButton
                customerName={customer.name}
                customerPhone={customer.phone}
                balancePaise={customer.balancePaise}
                shopName={shopName}
                variant="full"
              />
            )}

            {/* UDHAAR SCORE CARD (RULE-BASED, DETERMINISTIC) */}
            {customer.scoreResult && (
              <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-amber-900/10 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border-2 ${
                        customer.scoreResult.band === "Good"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : customer.scoreResult.band === "Watch"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-rose-50 text-rose-800 border-rose-300"
                      }`}
                    >
                      {customer.scoreResult.score}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">
                          {t.udhaarScoreTitle}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            customer.scoreResult.band === "Good"
                              ? "bg-emerald-600 text-white"
                              : customer.scoreResult.band === "Watch"
                              ? "bg-amber-500 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {customer.scoreResult.band === "Good"
                            ? t.bandGood
                            : customer.scoreResult.band === "Watch"
                            ? t.bandWatch
                            : t.bandRisky}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {t.suggestedLimit}:{" "}
                        <strong className="text-slate-900 font-black">
                          {formatINR(customer.scoreResult.suggestedLimitPaise)}
                        </strong>{" "}
                        <span className="text-[10px] text-slate-400 font-bold">
                          ({t.advisoryNote})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reasons List */}
                {customer.scoreResult.reasons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {t.scoreFactorsTitle}
                    </div>
                    <div className="space-y-1">
                      {customer.scoreResult.reasons.map((reason, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-slate-700 flex items-start gap-1.5 font-semibold"
                        >
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Quick Action Buttons & Append-Only History (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Desktop / In-Page Big Action Buttons */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-amber-900/10 space-y-3">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>{t.recordTransaction}</span>
                <span className="text-[11px] font-bold text-slate-400">Append-Only</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEntryModal("CREDIT_GIVEN")}
                  className="py-4 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-95 transition-all border border-rose-700"
                >
                  <PlusCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{t.giveCredit}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEntryModal("PAYMENT_RECEIVED")}
                  className="py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all border border-emerald-700"
                >
                  <MinusCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{t.receivePayment}</span>
                </button>
              </div>
            </div>

            {/* Transaction History Header & List */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-900/10 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-700" />
                  <span>{t.entriesHistory}</span>
                </h2>
                <span className="text-xs font-black bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {customer.entries.length} {t.entriesCount}
                </span>
              </div>

              {customer.entries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <KhataBookIcon className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">{t.noEntriesYet}</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">
                    {t.recordInstructions}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.entries.map((entry) => {
                    const isCredit = entry.type === "CREDIT_GIVEN";
                    const isReversal =
                      entry.note?.startsWith("Reversal of") ||
                      entry.note?.includes("Reversal");

                    const formattedDate = new Date(entry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    const formattedTime = new Date(entry.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          isReversal
                            ? "bg-slate-50 border-dashed border-slate-300 opacity-80"
                            : "bg-[#FAF7F0] border-amber-900/10 hover:border-amber-400 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                                  isCredit
                                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {isCredit ? t.creditGiven : t.paymentReceived}
                              </span>

                              {isReversal && (
                                <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-400">
                                  {t.reverseEntry}
                                </span>
                              )}
                            </div>

                            {entry.note && (
                              <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-2 break-words">
                                {entry.note}
                              </p>
                            )}

                            <div className="text-[11px] text-slate-500 mt-1.5 font-semibold">
                              {formattedDate} at {formattedTime}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                            <div
                              className={`text-lg sm:text-xl font-black ${
                                isCredit ? "text-rose-600" : "text-emerald-600"
                              }`}
                            >
                              {isCredit ? "+" : "-"}
                              {formatINR(entry.amountPaise)}
                            </div>

                            {!isReversal && (
                              <button
                                type="button"
                                onClick={() => setReversalTarget(entry)}
                                title={t.reverseEntry}
                                className="text-[11px] text-slate-500 hover:text-amber-900 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-100 font-bold transition-colors border border-transparent hover:border-amber-300"
                              >
                                <RotateCcw className="w-3 h-3 text-amber-700" />
                                <span>{t.reverseEntry}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-amber-900/10 text-center">
                <p className="text-xs text-slate-500 font-semibold">
                  ℹ️ {t.appendOnlyNotice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Hidden on Tablet and Desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t-2 border-amber-900/10 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => handleOpenEntryModal("CREDIT_GIVEN")}
            className="py-3.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{t.giveCredit}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenEntryModal("PAYMENT_RECEIVED")}
            className="py-3.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <MinusCircle className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{t.receivePayment}</span>
          </button>
        </div>
      </div>

      {/* Add Entry Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-inner ${
                    modalType === "CREDIT_GIVEN" ? "bg-rose-600" : "bg-emerald-600"
                  }`}
                >
                  {modalType === "CREDIT_GIVEN" ? (
                    <PlusCircle className="w-5 h-5" />
                  ) : (
                    <MinusCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {modalType === "CREDIT_GIVEN" ? t.giveCredit : t.receivePayment}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    {customer.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseEntryModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleEntrySubmit(e, false)} className="space-y-4">
              {/* Amount input */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.amountLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-2xl font-black text-slate-400">
                    ₹
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder={t.amountPlaceholder}
                    required
                    autoFocus
                    className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-2xl sm:text-3xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-slate-300"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {[100, 200, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickAmount(amt)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-950 text-xs font-black transition-colors border border-amber-300"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Item Input */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.noteLabel}
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder={t.notePlaceholder}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />

                {/* Common quick grocery/retail tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["Atta/Rice", "Dal/Oil", "Chai/Sugar", "Spices", "Cash", "UPI"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleQuickNote(tag)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        +{tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseEntryModal}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending || !amountInput}
                  className={`flex-1 py-3.5 rounded-2xl text-white font-black text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                    modalType === "CREDIT_GIVEN"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                  }`}
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>{t.submitEntry}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG: NEGATIVE / EXCESS PAYMENT WARNING */}
      {confirmExcessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {t.negativeBalanceWarningTitle}
            </h3>

            <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
              {t.negativeBalanceWarningBody}
            </p>

            <div className="my-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold text-left space-y-1">
              <div className="flex justify-between">
                <span>Current Due:</span>
                <span>{formatINR(customer.balancePaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Amount:</span>
                <span>₹{confirmExcessModal.pendingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200/60 pt-1 text-rose-700 font-black">
                <span>Resulting Advance:</span>
                <span>
                  -₹
                  {(
                    confirmExcessModal.pendingAmount -
                    customer.balancePaise / 100
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmExcessPayment}
                disabled={isPending}
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-sm shadow-md shadow-amber-600/30 transition-all active:scale-95"
              >
                {t.confirmPayment}
              </button>
              <button
                type="button"
                onClick={() => setConfirmExcessModal(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {t.cancelPayment}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG: SUGGESTED CREDIT LIMIT OVERRIDE (ADVISORY, NON-BLOCKING) */}
      {confirmLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Suggested Limit Warning
            </h3>

            <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
              This credit of <strong>₹{confirmLimitModal.pendingAmount.toFixed(2)}</strong> will bring total due to <strong>{formatINR(confirmLimitModal.resultingDuePaise)}</strong>, exceeding the suggested limit of <strong>{formatINR(confirmLimitModal.suggestedLimitPaise)}</strong> ({customer.scoreResult?.band ?? "Advisory"}).
            </p>

            <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              ℹ️ Suggested credit limits are advisory only. You can override and record this credit.
            </p>

            <div className="flex flex-col gap-2 pt-4">
              <button
                type="button"
                onClick={handleConfirmLimitOverride}
                disabled={isPending}
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-sm shadow-md shadow-amber-600/30 transition-all active:scale-95"
              >
                {isPending ? "Recording..." : "Confirm & Give Credit"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmLimitModal(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVERSAL CONFIRMATION MODAL */}
      {reversalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20 text-center">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {t.reverseEntry}
            </h3>

            <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
              Create an offsetting reversing transaction of{" "}
              <strong className="text-slate-900">
                {formatINR(reversalTarget.amountPaise)}
              </strong>
              ? Ledger records are append-only.
            </p>

            <div className="flex gap-2 pt-5">
              <button
                type="button"
                onClick={() => setReversalTarget(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleExecuteReversal}
                disabled={isPending}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95"
              >
                {isPending ? "Reversing..." : "Confirm Reversal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-4">
              <h3 className="text-base font-black text-slate-900">
                {t.editCustomer}
              </h3>
              <button
                type="button"
                onClick={() => setShowEditCustomer(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.customerName}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.customerPhone}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={editPhone}
                    onChange={(e) =>
                      setEditPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    required
                    className="w-full pl-11 pr-3 py-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {editError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {editError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditCustomer(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-md"
                >
                  {isPending ? "Saving..." : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
