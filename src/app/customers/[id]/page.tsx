import { notFound, redirect } from "next/navigation";
import { getCurrentShop } from "@/lib/auth";
import { getCustomer } from "@/app/actions";
import { CustomerLedgerClient } from "./CustomerLedgerClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CustomerLedgerPage({ params }: PageProps) {
  const shop = await getCurrentShop();
  if (!shop) {
    redirect("/login");
  }

  const customer = await getCustomer(params.id);
  if (!customer) {
    notFound();
  }

  return (
    <CustomerLedgerClient
      customer={customer}
      shopName={shop.name}
      isDemo={shop.isDemo}
    />
  );
}
