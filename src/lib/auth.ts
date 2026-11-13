import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma";

const COOKIE_NAME = "udhaar_session";
const SECRET = process.env.SESSION_SECRET || "udhaar-saathi-secure-session-key-2026-minimum-32-chars";

export function signToken(shopId: string): string {
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(shopId);
  const sig = hmac.digest("hex");
  return `${shopId}.${sig}`;
}

export function verifyToken(token: string): string | null {
  if (!token || !token.includes(".")) return null;
  const [shopId, sig] = token.split(".");
  if (!shopId || !sig) return null;

  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(shopId);
  const expectedSig = hmac.digest("hex");

  if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return shopId;
  }
  return null;
}

export async function getOrCreateDefaultShop() {
  let shop = await prisma.shop.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        name: "Gupta Kirana & General Store",
        ownerName: "Ramesh Gupta",
        phone: "9876543210",
        isDemo: false,
      },
    });
  }

  return shop;
}

export async function getCurrentShop() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const shopId = verifyToken(token);
    if (!shopId) return null;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    return shop;
  } catch {
    return null;
  }
}

export async function setSessionCookie(shopId: string) {
  const token = signToken(shopId);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function checkPassword(passwordAttempt: string): boolean {
  const expected = process.env.SHOP_PASSWORD || "kirana123";
  return passwordAttempt === expected;
}
