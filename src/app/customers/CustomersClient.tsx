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
import { KhataBookIcon } from "@/components/RationIcons";

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
  const [filterType, setFilterType] = useState<"ALL" | "DUES" | "SETTLED">("ALL");
  const [showAddModal, setShowAddModal] = useState(
    searchParams.get("openAdd") === "true"
  );
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Filter customers by search and filterType
  const filteredCustomers = useMemo(() => {
    let list = initialCustomers;

    if (filterType === "DUES") {
      list = list.filter((c) => c.balancePaise > 0);
    } else if (filterType === "SETTLED") {
      list = list.filter((c) => c.balancePaise <= 0);
    }

    if (!search.trim()) return list;
    const q = search.toLowerCase().trim();
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [initialCustomers, search, filterType]);

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
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] pb-24 md:pb-12">
      <Navbar shopName={shopName} isDemo={isDemo} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
        {/* Top Control Bar: Title, Search, and Action */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-amber-900/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-700" />
                <span>{t.allCustomers}</span>
                <span className="text-xs font-black bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-400">
                  {initialCustomers.length}
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                दुकानदार का डिजिटल खाता रजिस्टर (Shopkeeper Khata Directory)
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95 transition-all self-stretch sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.addCustomer}</span>
            </button>
          </div>

          {/* Search Input & Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-10 py-3 bg-[#FAF7F0] rounded-2xl border-2 border-amber-900/10 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all placeholder:text-slate-400"
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

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-3 py-1.5 rounded-xl font-black transition-all ${
                  filterType === "ALL"
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-amber-100/70 hover:bg-amber-200/80 text-amber-950"
                }`}
              >
                सभी ({initialCustomers.length})
              </button>
              <button
                onClick={() => setFilterType("DUES")}
                className={`px-3 py-1.5 rounded-xl font-black transition-all ${
                  filterType === "DUES"
                    ? "bg-rose-700 text-white shadow-sm"
                    : "bg-rose-100 hover:bg-rose-200 text-rose-900"
                }`}
              >
                उधार बाकी ({initialCustomers.filter((c) => c.balancePaise > 0).length})
              </button>
              <button
                onClick={() => setFilterType("SETTLED")}
                className={`px-3 py-1.5 rounded-xl font-black transition-all ${
                  filterType === "SETTLED"
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-teal-100 hover:bg-teal-200 text-teal-900"
                }`}
              >
                हिसाब चुकता ({initialCustomers.filter((c) => c.balancePaise <= 0).length})
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Multi-Device Customer Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-amber-900/10 shadow-sm space-y-3">
            <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto text-amber-800 border border-amber-300">
              <KhataBookIcon className="w-8 h-8" />
            </div>
            <p className="text-base font-extrabold text-slate-800">
              {search ? t.noCustomersFound : t.noCustomersYet}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              {search
                ? `"${search}" के नाम या नंबर से कोई ग्राहक नहीं मिला। कृपया नंबर या वर्तनी जांचें।`
                : t.addFirstCustomer}
            </p>
            {!search && (
              <button
                onClick={handleOpenAdd}
                className="mt-3 inline-flex items-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.addCustomer}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => {
              const hasDue = customer.balancePaise > 0;
              const hasAdvance = customer.balancePaise < 0;

              return (
                <div
                  key={customer.id}
                  className="bg-white rounded-2xl p-4 border-2 border-amber-900/10 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="flex items-center gap-3 min-w-0 flex-1 group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-950 font-black text-base flex items-center justify-center flex-shrink-0 border border-amber-300 group-hover:scale-105 transition-transform shadow-inner">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base font-extrabold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                          {customer.name}
                        </h2>
                        <p className="text-xs text-slate-500 font-mono font-semibold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{customer.phone}</span>
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(customer, e)}
                      title={t.editCustomer}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-amber-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div
                        className={`text-base sm:text-lg font-black tracking-tight ${
                          hasDue
                            ? "text-rose-600"
                            : hasAdvance
                            ? "text-blue-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {formatINR(customer.balancePaise)}
                      </div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        {hasDue
                          ? t.balanceOwed
                          : hasAdvance
                          ? t.advancePaid
                          : t.settled}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <WhatsAppButton
                        customerName={customer.name}
                        customerPhone={customer.phone}
                        balancePaise={customer.balancePaise}
                        shopName={shopName}
                        variant="icon"
                      />

                      <Link
                        href={`/customers/${customer.id}`}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-extrabold flex items-center gap-1 transition-colors"
                      >
                        <span>खाता</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-2 border-amber-900/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-4">
              <div className="flex items-center gap-2">
                <KhataBookIcon className="w-6 h-6" />
                <h2 className="text-lg font-black text-slate-900">
                  {editingCustomer ? t.editCustomer : t.addCustomer}
                </h2>
              </div>
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
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.customerName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-bold focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.customerPhone}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-extrabold text-sm">
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
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-[#FAF7F0] text-sm font-mono font-bold focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  10-अंकों का भारतीय मोबाइल नंबर (WhatsApp रिमाइंडर हेतु)
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
                  className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2"
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
