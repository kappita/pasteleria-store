// app/api/store/cart/route.ts
import { NextResponse } from "next/server";

const WP = process.env.WORDPRESS_URL!; // e.g. https://your-site.com

export async function GET() {

  const res = await fetch(`${WP}/wp-json/custom/v1/delivery-limit`, {
  });

  const body = await res.json();
  const out = NextResponse.json(body, { status: res.status });
  return out
}
