// app/api/store/cart/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP = process.env.WORDPRESS_URL!; // e.g. https://your-site.com

export async function GET() {
  const jar = await cookies();
  const existingToken = jar.get("wc_cart_token")?.value;

  const res = await fetch(`${WP}/wp-json/wc/store/v1/cart`, {
    headers: existingToken ? { "Cart-Token": existingToken } : {},
    cache: "no-store",
  });

  console.log(res.headers)
  const cartToken = res.headers.get("Cart-Token");
  const body = await res.json();
  const token = cartToken ? cartToken : existingToken
  const out = NextResponse.json({...body, cartToken: token});
  if (cartToken) {
    out.cookies.set("wc_cart_token", cartToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
  }
  return out;
}
