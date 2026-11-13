import { redirect } from "next/navigation";
import { getCurrentShop } from "@/lib/auth";
import { getCustomers } from "@/app/actions";
import { CustomersClient } from "./CustomersClient";

export default async function CustomersPage() {
  const shop = await getCurrentShop();
  if (!shop) {
    redirect("/login");
  }

  const customers = await getCustomers();

  return (
    <CustomersClient
      initialCustomers={customers}
      shopName={shop.name}
      isDemo={shop.isDemo}
    />
  );
}
