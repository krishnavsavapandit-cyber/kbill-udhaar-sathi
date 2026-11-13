import { redirect } from "next/navigation";
import { getCurrentShop } from "@/lib/auth";
import { getDashboardData } from "@/app/actions";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const shop = await getCurrentShop();
  if (!shop) {
    redirect("/login");
  }

  const data = await getDashboardData();

  return <DashboardClient data={data} />;
}
