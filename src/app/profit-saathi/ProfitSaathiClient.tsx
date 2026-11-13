"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  Plus,
  ShoppingBag,
  X,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import { formatINR } from "@/lib/money";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ItemProfitAnalysis, ProfitSaathiReport } from "@/lib/profitSaathi";
import { createItem, recordSale, updateShopReorderDays } from "@/app/actions";
import { getRationItemIcon } from "@/components/RationIcons";

interface ProfitSaathiClientProps {
  report: ProfitSaathiReport;
  shopName: string;
  isDemo: boolean;
}

export function ProfitSaathiClient({
  report,
  shopName,
  isDemo,
}: ProfitSaathiClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Add Item Modal State
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemStock, setItemStock] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Record Sale Modal State
  const [saleItem, setSaleItem] = useState<ItemProfitAnalysis | null>(null);
  const [saleQuantity, setSaleQuantity] = useState("1");
  const [saleError, setSaleError] = useState<string | null>(null);

  // Settings Modal State (Target Days of Cover)
  const [showSettings, setShowSettings] = useState(false);
  const [targetDaysInput, setTargetDaysInput] = useState(
    (report.targetDaysOfCover || 14).toString()
  );
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const handleUpdateCoverDays = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    const days = parseInt(targetDaysInput, 10);
    if (isNaN(days) || days < 1 || days > 365) {
      setSettingsError("Please enter valid days between 1 and 365");
      return;
    }
    startTransition(async () => {
      const res = await updateShopReorderDays(days);
      if (res.success) {
        setShowSettings(false);
        router.refresh();
      } else {
        setSettingsError(res.error || "Failed to update target cover days");
      }
    });
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const costNum = parseFloat(itemCost);
    const priceNum = parseFloat(itemPrice);
    const qtyNum = parseInt(itemStock, 10);

    if (isNaN(costNum) || costNum < 0 || isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please enter valid positive cost and selling prices");
      return;
    }
    if (isNaN(qtyNum) || qtyNum < 0) {
      setFormError("Stock quantity must be a non-negative number");
      return;
    }

    startTransition(async () => {
      const res = await createItem({
        name: itemName.trim(),
        costRupees: costNum,
        priceRupees: priceNum,
        quantity: qtyNum,
        category: itemCategory.trim() || undefined,
      });

      if (res.success) {
        setShowAddItem(false);
        setItemName("");
        setItemCost("");
        setItemPrice("");
        setItemStock("");
        setItemCategory("");
        router.refresh();
      } else {
        setFormError(res.error || "Failed to create item");
      }
    });
  };

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    setSaleError(null);

    if (!saleItem) return;
    const qty = parseInt(saleQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setSaleError("Quantity must be at least 1");
      return;
    }

    if (qty > saleItem.quantity) {
      setSaleError(`Cannot sell ${qty} units. Only ${saleItem.quantity} units available.`);
      return;
    }

    startTransition(async () => {
      const res = await recordSale({
        itemId: saleItem.itemId,
        quantity: qty,
      });

      if (res.success) {
        setSaleItem(null);
        setSaleQuantity("1");
        router.refresh();
      } else {
        setSaleError(res.error || "Failed to record sale");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] pb-24 md:pb-12">
      <Navbar shopName={shopName} isDemo={isDemo} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Header Title & Actions */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Profit Saathi (राशन व मुनाफा साथी)
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  30-दिनों की बिक्री से स्टॉक के दिन, रिऑर्डर मात्रा व मुनाफ़ा विश्लेषण
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setShowSettings(true)}
              className="py-2.5 px-3.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-2xl text-xs font-black border border-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-800" />
              <span>Buffer: {report.targetDaysOfCover}d</span>
            </button>

            <button
              onClick={() => setShowAddItem(true)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md shadow-emerald-700/20 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>नया सामान जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards: 4 columns on Desktop / 2 on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border-2 border-amber-900/10 shadow-sm">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              कुल स्टॉक लागत (Cost)
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatINR(report.totalInventoryCostPaise)}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
              बिक्री मूल्य: {formatINR(report.totalInventoryValuePaise)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-amber-900/10 shadow-sm">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              कम स्टॉक (&le;7d)
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
              {report.lowStockItemsCount} आइटम
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
              जल्द रिऑर्डर की आवश्यकता
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-amber-900/10 shadow-sm">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              डेड स्टॉक (Dead Stock)
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
              {report.totalDeadStockItemsCount} आइटम
            </div>
            <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
              30 दिनों में शून्य बिक्री
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-amber-900/10 shadow-sm">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              सक्रिय राशन आइटम
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              {report.items.length} उत्पाद
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
              नियमित दुकान इन्वेंट्री
            </div>
          </div>
        </div>

        {/* Main Grid: Inventory List (Left) + AI & Festival Hints (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Item Velocity & Profit Ranking List (8 cols on Desktop) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-900/10 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <span>राशन आइटम व दैनिक मुनाफ़ा रैंकिंग</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">
                Ranked by Profit/Day
              </span>
            </div>

            {report.items.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Package className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">अभी तक कोई सामान नहीं जोड़ा गया</p>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                >
                  पहला राशन उत्पाद जोड़ें
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {report.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="p-4 rounded-2xl border-2 border-amber-900/10 bg-[#FAF7F0] hover:border-amber-400 hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Cartoon Ration Icon Thumbnail */}
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-900/10 p-1 flex items-center justify-center flex-shrink-0 shadow-sm">
                          {getRationItemIcon(item.name, "w-8 h-8")}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                              {item.name}
                            </h3>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-300 text-amber-950 border border-amber-400 shadow-sm">
                              Rank #{item.marginRank}
                            </span>
                            {item.isDeadStock && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-0.5">
                                <AlertOctagon className="w-3 h-3" />
                                डेड स्टॉक
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-500 font-semibold mt-1">
                            लागत: {formatINR(item.costPaise)} • बिक्री मूल्य: {formatINR(item.pricePaise)}
                          </div>

                          {/* Margin %, Daily Sales, and Profit per day side by side */}
                          <div className="flex items-center gap-1.5 flex-wrap text-xs mt-2 font-bold">
                            <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                              मार्जिन: {item.marginPercentage}%
                            </span>
                            <span className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-lg border border-blue-300">
                              बिक्री: {item.avgDailySales}/दिन
                            </span>
                            <span className="bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-lg border border-purple-300">
                              दैनिक मुनाफ़ा: {formatINR(item.profitPerDayPaise)}/दिन
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSaleItem(item);
                          setSaleQuantity("1");
                          setSaleError(null);
                        }}
                        disabled={item.quantity <= 0}
                        className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>बेचें (Sell)</span>
                      </button>
                    </div>

                    {/* 30-Day Metrics Bar */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-amber-900/10 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-black uppercase">
                          दुकान में स्टॉक
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                          {item.quantity} units
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-black uppercase">
                          औसत बिक्री
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                          {item.avgDailySales}
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-black uppercase">
                          स्टॉक कितने दिन चलेगा
                        </div>
                        <div
                          className={`text-xs sm:text-sm font-black mt-0.5 ${
                            item.daysOfStockLeft !== null && item.daysOfStockLeft <= 7
                              ? "text-rose-600"
                              : "text-slate-900"
                          }`}
                        >
                          {item.daysOfStockLeft !== null ? `${item.daysOfStockLeft} दिन` : "शून्य बिक्री"}
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-black uppercase">
                          सुझाया रिऑर्डर ({report.targetDaysOfCover}d)
                        </div>
                        <div className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">
                          +{item.suggestedReorderQuantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: AI Summary & Festival Hints (4 cols on Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Morning Briefing or Deterministic Box */}
            {report.aiSummary ? (
              <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-md border-2 border-emerald-950/20 space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Morning Briefing (दुकान रिपोर्ट)</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-semibold">
                  {report.aiSummary}
                </p>
                <p className="text-[10px] text-emerald-300/80 italic pt-1 border-t border-white/10">
                  * दुकान की 30-दिनों की वास्तविक बिक्री पर आधारित। कोई काल्पनिक भविष्यवाणियां नहीं।
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-5 border-2 border-amber-900/10 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>इन्वेंट्री रिपोर्ट (Deterministic)</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  कुल {report.items.length} राशन उत्पाद ट्रैक हो रहे हैं। सभी आंकड़े आपकी दुकान के 30-दिनों के वास्तविक बिक्री रजिस्टर से निकाले गए हैं।
                </p>
              </div>
            )}

            {/* Static Festival Demand Hints */}
            <div className="bg-amber-50 rounded-3xl p-5 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>त्योहारी व मौसमी मांग संदर्भ (General Hints)</span>
              </div>

              <div className="space-y-2.5">
                {report.festivalHints.map((hint, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-2xl border border-amber-200 text-xs">
                    <div className="font-extrabold text-amber-950 mb-1">{hint.title}</div>
                    <p className="text-slate-600 leading-relaxed text-[11px] font-medium">{hint.hint}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-amber-900/80 italic text-center pt-1">
                * यह संदर्भ सामान्य भारतीय खुदरा मांग पर आधारित है, यह कोई सांख्यिकीय भविष्यवाणी नहीं है।
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: ADD PRODUCT ITEM */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-4">
              <h3 className="text-base font-black text-slate-900">नया राशन उत्पाद जोड़ें</h3>
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  उत्पाद का नाम (Product Name)
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="उदा. Fortune Mustard Oil 1L"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    लागत मूल्य (₹ Cost)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    placeholder="120"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    बिक्री मूल्य (₹ Price)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="145"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    शुरुआती स्टॉक (Units)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={itemStock}
                    onChange={(e) => setItemStock(e.target.value)}
                    placeholder="25"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    श्रेणी (Category)
                  </label>
                  <input
                    type="text"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    placeholder="तेल / अनाज"
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md"
                >
                  {isPending ? "सहेज रहे हैं..." : "उत्पाद सहेजें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD SALE */}
      {saleItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-3">
              <h3 className="text-base font-black text-slate-900">बिक्री दर्ज करें (Record Sale)</h3>
              <button
                type="button"
                onClick={() => setSaleItem(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSale} className="space-y-3.5">
              <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border-2 border-amber-900/10">
                <div className="font-extrabold text-sm text-slate-900">{saleItem.name}</div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">
                  उपलब्ध स्टॉक: <strong className="text-slate-800">{saleItem.quantity} units</strong>
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-0.5">
                  प्रति यूनिट मूल्य: {formatINR(saleItem.pricePaise)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  बेची गई इकाइयां (Units Sold)
                </label>
                <input
                  type="number"
                  min="1"
                  max={saleItem.quantity}
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-lg font-black focus:outline-none focus:border-emerald-600"
                />
              </div>

              {saleError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {saleError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaleItem(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-black shadow-md"
                >
                  {isPending ? "दर्ज हो रहा है..." : "बिक्री पक्की करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reorder Cover Days Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-amber-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-bold border border-amber-300">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Target Days of Cover
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              रिऑर्डर सुझाव गणना के लिए अपनी दुकान का लक्ष्य स्टॉक बफर (दिन) निर्धारित करें।
            </p>

            <form onSubmit={handleUpdateCoverDays} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Buffer Days (Default: 14 दिन)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={targetDaysInput}
                  onChange={(e) => setTargetDaysInput(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-lg font-black focus:outline-none focus:border-emerald-600"
                />
              </div>

              {settingsError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {settingsError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md"
                >
                  {isPending ? "सहेज रहे हैं..." : "सेटिंग सहेजें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
