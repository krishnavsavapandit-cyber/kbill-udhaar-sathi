import { redirect } from "next/navigation";
import { getCurrentShop } from "@/lib/auth";
import { getProfitSaathiReport } from "@/app/actions";
import { ProfitSaathiClient } from "./ProfitSaathiClient";

export default async function ProfitSaathiPage() {
  const shop = await getCurrentShop();
  if (!shop) {
    redirect("/login");
  }

  const reportRes = await getProfitSaathiReport();
  const report = reportRes.data || {
    items: [],
    totalInventoryCostPaise: 0,
    totalInventoryValuePaise: 0,
    totalDeadStockItemsCount: 0,
    topMarginItemName: null,
    lowStockItemsCount: 0,
    festivalHints: [],
    aiSummary: null,
  };

  return (
    <ProfitSaathiClient
      report={report}
      shopName={shop.name}
      isDemo={shop.isDemo}
    />
  );
}
