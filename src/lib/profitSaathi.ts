/**
 * PROFIT SAATHI CALCULATION ENGINE
 * 
 * Strict rule-based inventory and profitability calculations.
 * ZERO AI in the mathematical calculations.
 * All metrics are derived from the shop's own items and sales history.
 */

export const ANALYSIS_WINDOW_DAYS = 30;
export const DEFAULT_TARGET_DAYS_OF_COVER = 14;

export interface ItemProfitAnalysis {
  itemId: string;
  name: string;
  costPaise: number;
  pricePaise: number;
  quantity: number;
  category: string | null;
  totalUnitsSold30Days: number;
  avgDailySales: number;
  daysOfStockLeft: number | null; // null if 0 sales
  suggestedReorderQuantity: number;
  isDeadStock: boolean;
  marginPaise: number;
  marginPercentage: number;
  profitPerDayPaise: number; // marginPaise * avgDailySales
  marginRank: number; // Ranked by daily profit (margin * avg daily sales)
}

export interface ProfitSaathiReport {
  items: ItemProfitAnalysis[];
  totalInventoryCostPaise: number;
  totalInventoryValuePaise: number;
  totalDeadStockItemsCount: number;
  topMarginItemName: string | null;
  lowStockItemsCount: number;
  targetDaysOfCover: number;
  festivalHints: Array<{ title: string; hint: string }>;
  aiSummary: string | null;
}

/**
 * Static festival hints list labeled: "general hint, not a prediction"
 */
export const STATIC_FESTIVAL_HINTS = [
  {
    title: "Diwali & Festive Season",
    hint: "General hint, not a prediction: Kirana stores typically observe heightened demand for edible oils, ghee, sugar, maida, and dry fruits.",
  },
  {
    title: "Holi & Spring",
    hint: "General hint, not a prediction: Local retail stores often see increased turnover in beverages, tea, snacks, and sweet ingredients.",
  },
  {
    title: "Chhath, Bihu & Regional Harvests",
    hint: "General hint, not a prediction: Increased sales typically observed for staple flours, jaggery, mustard oil, and packaged grains.",
  },
];

/**
 * Deterministic Calculation of Inventory & Sales Metrics
 */
export function calculateProfitSaathiMetrics(
  items: Array<{
    id: string;
    name: string;
    costPaise: number;
    pricePaise: number;
    quantity: number;
    category?: string | null;
    sales: Array<{
      quantity: number;
      createdAt: Date | string;
    }>;
  }>,
  targetDaysOfCover: number = DEFAULT_TARGET_DAYS_OF_COVER,
  referenceDate: Date = new Date()
): ProfitSaathiReport {
  const windowStart = new Date(referenceDate);
  windowStart.setDate(windowStart.getDate() - ANALYSIS_WINDOW_DAYS);

  let totalInventoryCostPaise = 0;
  let totalInventoryValuePaise = 0;
  let totalDeadStockItemsCount = 0;
  let lowStockItemsCount = 0;

  const analyzedItems = items.map((item) => {
    totalInventoryCostPaise += item.costPaise * item.quantity;
    totalInventoryValuePaise += item.pricePaise * item.quantity;

    // Filter sales within the 30-day window
    const recentSales = item.sales.filter((s) => new Date(s.createdAt) >= windowStart);
    let totalUnitsSold30Days = 0;
    for (const sale of recentSales) {
      totalUnitsSold30Days += sale.quantity;
    }

    // Average daily sales over last 30 days
    const avgDailySales = Math.round((totalUnitsSold30Days / ANALYSIS_WINDOW_DAYS) * 100) / 100;

    // Days of stock left: item.quantity / avgDailySales
    let daysOfStockLeft: number | null = null;
    if (avgDailySales > 0) {
      daysOfStockLeft = Math.round((item.quantity / avgDailySales) * 10) / 10;
      if (daysOfStockLeft <= 7) {
        lowStockItemsCount++;
      }
    }

    // Suggested reorder quantity: target stock for targetDaysOfCover buffer minus current quantity
    let suggestedReorderQuantity = 0;
    if (avgDailySales > 0) {
      const targetStock = Math.ceil(avgDailySales * targetDaysOfCover);
      suggestedReorderQuantity = Math.max(0, targetStock - item.quantity);
    }

    // Dead stock: no sale in last 30 days while stock is sitting
    const isDeadStock = totalUnitsSold30Days === 0 && item.quantity > 0;
    if (isDeadStock) {
      totalDeadStockItemsCount++;
    }

    // Margin calculations
    const marginPaise = item.pricePaise - item.costPaise;
    let marginPercentage = 0;
    if (item.pricePaise > 0) {
      marginPercentage = Math.round(((item.pricePaise - item.costPaise) / item.pricePaise) * 1000) / 10;
    }

    // Profit per day: marginPaise * avgDailySales (integer paise per day)
    const profitPerDayPaise = Math.round(marginPaise * avgDailySales);

    return {
      itemId: item.id,
      name: item.name,
      costPaise: item.costPaise,
      pricePaise: item.pricePaise,
      quantity: item.quantity,
      category: item.category || null,
      totalUnitsSold30Days,
      avgDailySales,
      daysOfStockLeft,
      suggestedReorderQuantity,
      isDeadStock,
      marginPaise,
      marginPercentage,
      profitPerDayPaise,
      marginRank: 0, // Assigned below
    };
  });

  // Sort and assign ranks: Rank by profit per day (margin * avg daily sales) descending.
  // Dead stock has 0 daily sales, so 0 profit per day and will never be ranked #1.
  // Tie-breaker: margin percentage descending, then name ascending.
  analyzedItems.sort((a, b) => {
    if (b.profitPerDayPaise !== a.profitPerDayPaise) {
      return b.profitPerDayPaise - a.profitPerDayPaise;
    }
    if (b.marginPercentage !== a.marginPercentage) {
      return b.marginPercentage - a.marginPercentage;
    }
    return a.name.localeCompare(b.name);
  });
  analyzedItems.forEach((it, idx) => {
    it.marginRank = idx + 1;
  });

  const topMarginItemName =
    analyzedItems.length > 0 && analyzedItems[0].profitPerDayPaise > 0
      ? analyzedItems[0].name
      : null;

  return {
    items: analyzedItems,
    totalInventoryCostPaise,
    totalInventoryValuePaise,
    totalDeadStockItemsCount,
    topMarginItemName,
    lowStockItemsCount,
    targetDaysOfCover,
    festivalHints: STATIC_FESTIVAL_HINTS,
    aiSummary: null, // Populated via optional Gemini helper
  };
}

/**
 * Optional plain-language summary via Gemini.
 * Strictly summarizes the computed numbers.
 * The model NEVER produces or changes the numbers.
 * If GEMINI_API_KEY is missing or call fails, returns null gracefully.
 */
export async function getPlainLanguageSummary(
  report: Omit<ProfitSaathiReport, "aiSummary">,
  lang: "en" | "hi" = "en"
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const summaryData = {
      totalItems: report.items.length,
      deadStockCount: report.totalDeadStockItemsCount,
      lowStockCount: report.lowStockItemsCount,
      topMarginItem: report.topMarginItemName,
      inventoryCost: (report.totalInventoryCostPaise / 100).toFixed(0),
    };

    const prompt = `You are a Kirana Store assistant. Summarize ONLY these exact computed numbers in 2 short sentences for the shopkeeper in ${
      lang === "hi" ? "Hindi" : "English"
    }.
Data: ${JSON.stringify(summaryData)}.
STRICT RULES:
1. Do NOT invent numbers or dates.
2. Do NOT predict best or worst months to buy.
3. Be direct, polite and concise.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || null;
  } catch {
    return null;
  }
}
