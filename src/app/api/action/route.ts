import { NextRequest, NextResponse } from "next/server";
import { requireShop, UnauthorizedError } from "@/lib/auth";
import {
  getDashboardData,
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  addLedgerEntry,
  reverseLedgerEntry,
  getCustomerScore,
  updateShopBaseLimit,
  createItem,
  recordSale,
  getProfitSaathiReport,
} from "@/app/actions";

export async function POST(req: NextRequest) {
  try {
    // 1. Every route handler verifies session first and fails closed
    await requireShop();

    const body = await req.json().catch(() => ({}));
    const { action, payload } = body;

    switch (action) {
      case "getDashboardData": {
        const data = await getDashboardData();
        return NextResponse.json({ success: true, data });
      }

      case "getCustomers": {
        const customers = await getCustomers(payload?.query);
        return NextResponse.json({ success: true, data: customers });
      }

      case "getCustomer": {
        const customer = await getCustomer(payload?.id);
        if (!customer) {
          return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: customer });
      }

      case "createCustomer": {
        const formData = new FormData();
        formData.append("name", payload?.name || "");
        formData.append("phone", payload?.phone || "");
        const res = await createCustomer(formData);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "updateCustomer": {
        const formData = new FormData();
        formData.append("name", payload?.name || "");
        formData.append("phone", payload?.phone || "");
        const res = await updateCustomer(payload?.id, formData);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "addLedgerEntry": {
        const res = await addLedgerEntry({
          customerId: payload?.customerId,
          type: payload?.type,
          amountRupees: payload?.amountRupees,
          note: payload?.note,
          allowNegativeBalance: payload?.allowNegativeBalance,
        });
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "reverseLedgerEntry": {
        const res = await reverseLedgerEntry(payload?.entryId);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "getCustomerScore": {
        const res = await getCustomerScore(payload?.customerId);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "updateShopBaseLimit": {
        const res = await updateShopBaseLimit(payload?.baseLimitRupees);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "createItem": {
        const res = await createItem({
          name: payload?.name,
          costRupees: payload?.costRupees,
          priceRupees: payload?.priceRupees,
          quantity: payload?.quantity,
          category: payload?.category,
        });
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "recordSale": {
        const res = await recordSale({
          itemId: payload?.itemId,
          quantity: payload?.quantity,
        });
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      case "getProfitSaathiReport": {
        const res = await getProfitSaathiReport(payload?.lang);
        return NextResponse.json(res, { status: res.success ? 200 : 400 });
      }

      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
    }
  } catch (err: unknown) {
    if (
      err instanceof UnauthorizedError ||
      (err instanceof Error && err.message.includes("Authentication required"))
    ) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Valid shopkeeper session required" },
        { status: 401 }
      );
    }
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
