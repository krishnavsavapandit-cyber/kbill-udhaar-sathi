"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  UserPlus,
  Phone,
  ChevronRight,
  X,
  Edit2,
  AlertCircle,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatINR } from "@/lib/money";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { createCustomer, updateCustomer } from "@/app/actions";

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  balancePaise: number;
  totalEntries: number;
  lastActiveAt: Date | string;
}

interface CustomersClientProps {
  initialCustomers: CustomerItem[];
  shopName: string;
  isDemo: boolean;
}

export function CustomersClient({
  initialCustomers,
  shopName,
  isDemo,
}: CustomersClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(
    searchParams.get("openAdd") === "true"
  );
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return initialCustomers;
    const q = search.toLowerCase().trim();
    return initialCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [initialCustomers, search]);

  const handleOpenAdd = () => {
    setName("");
    setPhone("");
    setFormError(null);
    setEditingCustomer(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (customer: CustomerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone);
    setFormError(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCustomer(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Frontend validation
    if (name.trim().length < 2) {
      setFormError("Name must be at least 2 characters");
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setFormError("Must be a valid 10-digit Indian mobile number (e.g. 9876543210)");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", cleanPhone);

      let res;
      if (editingCustomer) {
        res = await updateCustomer(editingCustomer.id, formData);
      } else {
        res = await createCustomer(formData);
      }

      if (res.success) {
        handleCloseModal();
        router.refresh();
      } else {
        setFormError(res.error || "Failed to save customer");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <Navbar shopName={shopName} isDemo={isDemo} />

      <main className="flex-1 p-4 space-y-4">
        {/* Top Header & Search Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>{t.allCustomers}</span>
              <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                {initialCustomers.length}
              </span>
            </h1>

            <button
              onClick={handleOpenAdd}
              className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.addCustomer}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-600 shadow-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Customer List */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-sm mt-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">
              {search ? t.noCustomersFound : t.noCustomersYet}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {search
                ? `No results for "${search}". Check phone or spelling.`
                : t.addFirstCustomer}
            </p>
            {!search && (
              <button
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-2 py-2.5 px-4 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.addCustomer}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredCustomers.map((customer) => {
              const hasDue = customer.balancePaise > 0;
              const hasAdvance = customer.balancePaise < 0;

              return (
                <div
                  key={customer.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:border-emerald-300 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-extrabold text-slate-900 truncate">
                          {customer.name}
                        </h2>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(customer, e)}
                          title={t.editCustomer}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {customer.phone}
                        </span>
                        <span>•</span>
                        <span>{customer.totalEntries} entries</span>
                      </div>
                    </Link>

                    {/* Balance & Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <div
                          className={`text-base font-black ${
                            hasDue
                              ? "text-rose-600"
                              : hasAdvance
                              ? "text-blue-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {formatINR(customer.balancePaise)}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {hasDue
                            ? t.balanceOwed
                            : hasAdvance
                            ? t.advancePaid
                            : t.settled}
                        </div>
                      </div>

                      <WhatsAppButton
                        customerName={customer.name}
                        customerPhone={customer.phone}
                        balancePaise={customer.balancePaise}
                        shopName={shopName}
                        variant="icon"
                      />

                      <Link
                        href={`/customers/${customer.id}`}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-lg font-black text-slate-900">
                {editingCustomer ? t.editCustomer : t.addCustomer}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.customerName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.customerPhone}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="9876543210"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono font-semibold focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter 10-digit mobile number for WhatsApp balance reminders
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>{t.save}</span>
                  )}
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
