// app/api/store/cart/add-item/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP = process.env.WORDPRESS_URL!;

export async function POST(req: Request) {
  const { shipping_address, billing_address } = await req.json();
  const token = (await cookies()).get("wc_cart_token")?.value;

  const res = await fetch(`${WP}/wp-json/wc/store/v1/cart/update-customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Cart-Token": token } : {}),
    },
    body: JSON.stringify({ shipping_address, billing_address}),
  });

  const cartToken = res.headers.get("Cart-Token");
  const body = await res.json();

  const out = NextResponse.json(body, { status: res.status });
  if (cartToken) out.cookies.set("wc_cart_token", cartToken, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  return out;
}