"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  checkPassword,
  clearSessionCookie,
  getCurrentShop,
  getOrCreateDefaultShop,
  setSessionCookie,
} from "@/lib/auth";
import { customerSchema, ledgerEntrySchema } from "@/lib/validations";
import { rupeesToPaise } from "@/lib/money";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  requiresConfirmation?: boolean;
}

// -----------------------------------------------------------------------------
// Authentication Actions
// -----------------------------------------------------------------------------

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const password = formData.get("password") as string;
  if (!password || !checkPassword(password)) {
    return { success: false, error: "Invalid shop password" };
  }

  const shop = await getOrCreateDefaultShop();
  await setSessionCookie(shop.id);
  return { success: true };
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

// -----------------------------------------------------------------------------
// Helper: require authenticated shop
// -----------------------------------------------------------------------------

async function requireShop() {
  const shop = await getCurrentShop();
  if (!shop) {
    throw new Error("UNAUTHORIZED");
  }
  return shop;
}

// -----------------------------------------------------------------------------
// Customer Actions (CRUD)
// -----------------------------------------------------------------------------

export async function getCustomers(searchQuery?: string) {
  const shop = await requireShop();

  const whereClause: {
    shopId: string;
    OR?: Array<{
      name?: { contains: string };
      phone?: { contains: string };
    }>;
  } = {
    shopId: shop.id,
  };

  if (searchQuery && searchQuery.trim() !== "") {
    const q = searchQuery.trim();
    whereClause.OR = [
      { name: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const customers = await prisma.customer.findMany({
    where: whereClause,
    include: {
      entries: {
        select: {
          type: true,
          amountPaise: true,
          createdAt: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Calculate balance on server
  return customers.map((c) => {
    let balancePaise = 0;
    for (const entry of c.entries) {
      if (entry.type === "CREDIT_GIVEN") {
        balancePaise += entry.amountPaise;
      } else if (entry.type === "PAYMENT_RECEIVED") {
        balancePaise -= entry.amountPaise;
      }
    }

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      balancePaise,
      totalEntries: c.entries.length,
      lastActiveAt: c.entries.length > 0 ? c.entries[c.entries.length - 1].createdAt : c.createdAt,
      createdAt: c.createdAt,
    };
  });
}

export async function getCustomer(customerId: string) {
  const shop = await requireShop();

  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      shopId: shop.id,
    },
    include: {
      entries: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) return null;

  let balancePaise = 0;
  for (const entry of customer.entries) {
    if (entry.type === "CREDIT_GIVEN") {
      balancePaise += entry.amountPaise;
    } else if (entry.type === "PAYMENT_RECEIVED") {
      balancePaise -= entry.amountPaise;
    }
  }

  return {
    ...customer,
    balancePaise,
  };
}

export async function createCustomer(formData: FormData): Promise<ActionResult<{ customerId: string }>> {
  try {
    const shop = await requireShop();

    const rawData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
    };

    const validated = customerSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    // Check duplicate phone in this shop
    const existing = await prisma.customer.findFirst({
      where: {
        shopId: shop.id,
        phone: validated.data.phone,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "A customer with this phone number already exists in your khata",
      };
    }

    const customer = await prisma.customer.create({
      data: {
        shopId: shop.id,
        name: validated.data.name,
        phone: validated.data.phone,
      },
    });

    revalidatePath("/customers");
    revalidatePath("/dashboard");
    return { success: true, data: { customerId: customer.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create customer";
    return { success: false, error: message };
  }
}

export async function updateCustomer(
  customerId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const shop = await requireShop();

    const rawData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
    };

    const validated = customerSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    // Check if phone belongs to another customer in the same shop
    const duplicate = await prisma.customer.findFirst({
      where: {
        shopId: shop.id,
        phone: validated.data.phone,
        NOT: { id: customerId },
      },
    });

    if (duplicate) {
      return {
        success: false,
        error: "Another customer already has this phone number",
      };
    }

    await prisma.customer.updateMany({
      where: {
        id: customerId,
        shopId: shop.id,
      },
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
      },
    });

    revalidatePath(`/customers/${customerId}`);
    revalidatePath("/customers");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update customer";
    return { success: false, error: message };
  }
}

// -----------------------------------------------------------------------------
// Ledger Entry Actions (Append-only & Server calculated balance)
// -----------------------------------------------------------------------------

export async function addLedgerEntry(data: {
  customerId: string;
  type: "CREDIT_GIVEN" | "PAYMENT_RECEIVED";
  amountRupees: number;
  note?: string;
  allowNegativeBalance?: boolean;
}): Promise<ActionResult> {
  try {
    const shop = await requireShop();

    const validated = ledgerEntrySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        shopId: shop.id,
      },
      include: {
        entries: true,
      },
    });

    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    // Compute existing balance
    let currentBalancePaise = 0;
    for (const entry of customer.entries) {
      if (entry.type === "CREDIT_GIVEN") {
        currentBalancePaise += entry.amountPaise;
      } else if (entry.type === "PAYMENT_RECEIVED") {
        currentBalancePaise -= entry.amountPaise;
      }
    }

    const amountPaise = rupeesToPaise(data.amountRupees);

    // Rule: "Never allow a payment that makes the balance negative without a confirm dialog."
    if (data.type === "PAYMENT_RECEIVED") {
      const resultingBalancePaise = currentBalancePaise - amountPaise;
      if (resultingBalancePaise < 0 && !data.allowNegativeBalance) {
        return {
          success: false,
          requiresConfirmation: true,
          error: "Payment exceeds current due amount. Please confirm to record advance.",
        };
      }
    }

    // Create append-only ledger entry
    await prisma.ledgerEntry.create({
      data: {
        shopId: shop.id,
        customerId: customer.id,
        type: data.type,
        amountPaise,
        note: data.note?.trim() || null,
      },
    });

    // Touch customer updated timestamp
    await prisma.customer.update({
      where: { id: customer.id },
      data: { updatedAt: new Date() },
    });

    revalidatePath(`/customers/${customer.id}`);
    revalidatePath("/customers");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add ledger entry";
    return { success: false, error: message };
  }
}

/**
 * Append-only Reversal:
 * "Ledger entries are append-only: corrections are a new reversing entry, not an edit or delete."
 */
export async function reverseLedgerEntry(entryId: string): Promise<ActionResult> {
  try {
    const shop = await requireShop();

    const originalEntry = await prisma.ledgerEntry.findFirst({
      where: {
        id: entryId,
        shopId: shop.id,
      },
      include: {
        customer: true,
      },
    });

    if (!originalEntry) {
      return { success: false, error: "Entry not found" };
    }

    // Determine reversed type
    const reversedType =
      originalEntry.type === "CREDIT_GIVEN" ? "PAYMENT_RECEIVED" : "CREDIT_GIVEN";

    const reversalNote = `Reversal of ${
      originalEntry.type === "CREDIT_GIVEN" ? "Credit" : "Payment"
    } (₹${(originalEntry.amountPaise / 100).toFixed(2)})${
      originalEntry.note ? ` - "${originalEntry.note}"` : ""
    }`;

    await prisma.ledgerEntry.create({
      data: {
        shopId: shop.id,
        customerId: originalEntry.customerId,
        type: reversedType,
        amountPaise: originalEntry.amountPaise,
        note: reversalNote,
      },
    });

    await prisma.customer.update({
      where: { id: originalEntry.customerId },
      data: { updatedAt: new Date() },
    });

    revalidatePath(`/customers/${originalEntry.customerId}`);
    revalidatePath("/customers");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reverse entry";
    return { success: false, error: message };
  }
}

// -----------------------------------------------------------------------------
// Dashboard Metrics Action
// -----------------------------------------------------------------------------

export async function getDashboardData() {
  const shop = await requireShop();

  const customers = await prisma.customer.findMany({
    where: { shopId: shop.id },
    include: {
      entries: {
        select: {
          id: true,
          type: true,
          amountPaise: true,
          note: true,
          createdAt: true,
        },
      },
    },
  });

  let totalOutstandingPaise = 0;
  let customersWithDuesCount = 0;

  const customerBalances = customers.map((c) => {
    let balancePaise = 0;
    for (const e of c.entries) {
      if (e.type === "CREDIT_GIVEN") {
        balancePaise += e.amountPaise;
      } else if (e.type === "PAYMENT_RECEIVED") {
        balancePaise -= e.amountPaise;
      }
    }

    if (balancePaise > 0) {
      totalOutstandingPaise += balancePaise;
      customersWithDuesCount += 1;
    }

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      balancePaise,
      lastActiveAt: c.entries.length > 0 ? c.entries[c.entries.length - 1].createdAt : c.createdAt,
    };
  });

  // Top 5 customers by balance owed (descending)
  const top5Owed = [...customerBalances]
    .filter((c) => c.balancePaise > 0)
    .sort((a, b) => b.balancePaise - a.balancePaise)
    .slice(0, 5);

  // Recent 8 ledger entries across the entire shop
  const recentEntries = await prisma.ledgerEntry.findMany({
    where: { shopId: shop.id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return {
    shopName: shop.name,
    ownerName: shop.ownerName,
    isDemo: shop.isDemo,
    totalOutstandingPaise,
    customersWithDuesCount,
    totalCustomersCount: customers.length,
    top5Owed,
    recentEntries,
  };
}
