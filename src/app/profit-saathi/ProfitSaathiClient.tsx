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
} from "lucide-react";
import { formatINR } from "@/lib/money";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ItemProfitAnalysis, ProfitSaathiReport } from "@/lib/profitSaathi";
import { createItem, recordSale } from "@/app/actions";

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
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <Navbar shopName={shopName} isDemo={isDemo} />

      <main className="flex-1 p-4 space-y-4">
        {/* Title & Quick Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>Profit Saathi</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              30-day sales velocity, margins & stock insights
            </p>
          </div>

          <button
            onClick={() => setShowAddItem(true)}
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        {/* AI PLAIN-LANGUAGE SUMMARY (IF AVAILABLE, ELSE GRACEFUL NUMBERS) */}
        {report.aiSummary ? (
          <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-3xl p-4 shadow-md">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Plain-Language Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
              {report.aiSummary}
            </p>
            <p className="text-[10px] text-emerald-300/80 mt-2">
              * Based strictly on computed shop numbers. Never invents figures or seasonal predictions.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-3.5 text-emerald-900 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Package className="w-4 h-4 text-emerald-700" />
              <span>Inventory Analytics (Deterministic)</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Tracking {report.items.length} items. All figures computed directly from your shop&apos;s 30-day sales register.
            </p>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Stock Cost
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {formatINR(report.totalInventoryCostPaise)}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Value: {formatINR(report.totalInventoryValuePaise)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Low Stock (&le;7d)
            </div>
            <div className="text-lg font-black text-amber-600 mt-0.5">
              {report.lowStockItemsCount} items
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Needs reorder soon
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm col-span-2 sm:col-span-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dead Stock
            </div>
            <div className="text-lg font-black text-rose-600 mt-0.5">
              {report.totalDeadStockItemsCount} items
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              No sales in 30 days
            </div>
          </div>
        </div>

        {/* Item Intelligence List */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-700" />
              <span>Item Velocity & Margins</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">
              {report.items.length} products
            </span>
          </div>

          {report.items.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-semibold">No inventory items added yet</p>
              <button
                onClick={() => setShowAddItem(true)}
                className="mt-2 text-emerald-700 font-bold underline"
              >
                Add your first product
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {report.items.map((item) => (
                <div
                  key={item.itemId}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Rank #{item.marginRank}
                        </span>
                        {item.isDeadStock && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-0.5">
                            <AlertOctagon className="w-3 h-3" />
                            Dead Stock
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Cost: {formatINR(item.costPaise)} • Price: {formatINR(item.pricePaise)} • Margin:{" "}
                        <strong className="text-emerald-700 font-bold">
                          {item.marginPercentage}% ({formatINR(item.marginPaise)})
                        </strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSaleItem(item);
                        setSaleQuantity("1");
                        setSaleError(null);
                      }}
                      disabled={item.quantity <= 0}
                      className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all flex-shrink-0"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Sell</span>
                    </button>
                  </div>

                  {/* 30-Day Metrics Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Stock
                      </div>
                      <div className="text-xs font-black text-slate-800 mt-0.5">
                        {item.quantity} units
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Avg/Day
                      </div>
                      <div className="text-xs font-black text-slate-800 mt-0.5">
                        {item.avgDailySales}
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Stock Left
                      </div>
                      <div
                        className={`text-xs font-black mt-0.5 ${
                          item.daysOfStockLeft !== null && item.daysOfStockLeft <= 7
                            ? "text-rose-600"
                            : "text-slate-800"
                        }`}
                      >
                        {item.daysOfStockLeft !== null ? `${item.daysOfStockLeft}d` : "None"}
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Reorder
                      </div>
                      <div className="text-xs font-black text-emerald-700 mt-0.5">
                        +{item.suggestedReorderQuantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATIC FESTIVAL HINTS SECTION (LABELED GENERAL HINT, NOT A PREDICTION) */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>Seasonal Demand Context (General Hints, Not Predictions)</span>
          </div>

          <div className="space-y-2">
            {report.festivalHints.map((hint, idx) => (
              <div key={idx} className="bg-white/80 p-3 rounded-2xl border border-amber-100 text-xs">
                <div className="font-bold text-amber-950 mb-0.5">{hint.title}</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{hint.hint}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-amber-800/80 italic text-center pt-1">
            * These hints reflect general historical grocery patterns in India and are not statistical prophecies.
          </p>
        </div>
      </main>

      {/* MODAL: ADD PRODUCT ITEM */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Add Inventory Product</h3>
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Fortune Mustard Oil 1L"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    placeholder="120"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="145"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Starting Stock Units
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={itemStock}
                    onChange={(e) => setItemStock(e.target.value)}
                    placeholder="25"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    placeholder="Oils / Grains"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-600"
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
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  {isPending ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD SALE (REDUCES STOCK, NEVER GOES NEGATIVE) */}
      {saleItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-base font-black text-slate-900">Record Sale</h3>
              <button
                type="button"
                onClick={() => setSaleItem(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSale} className="space-y-3.5">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="font-extrabold text-sm text-slate-900">{saleItem.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Available in stock: <strong className="text-slate-800">{saleItem.quantity} units</strong>
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-0.5">
                  Unit Price: {formatINR(saleItem.pricePaise)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Units Sold
                </label>
                <input
                  type="number"
                  min="1"
                  max={saleItem.quantity}
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-lg font-black focus:outline-none focus:border-emerald-600"
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
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md"
                >
                  {isPending ? "Recording..." : "Confirm Sale"}
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
