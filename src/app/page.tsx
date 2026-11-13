import { redirect } from "next/navigation";
import { getCurrentShop } from "@/lib/auth";

export default async function HomePage() {
  const shop = await getCurrentShop();
  if (!shop) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
