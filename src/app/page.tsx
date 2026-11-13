import { getCurrentShop } from "@/lib/auth";
import { LandingPageClient } from "./LandingPageClient";

export default async function HomePage() {
  const shop = await getCurrentShop();
  return (
    <LandingPageClient
      shopName={shop?.name || "Gupta Kirana Store"}
      isLoggedIn={!!shop}
    />
  );
}
