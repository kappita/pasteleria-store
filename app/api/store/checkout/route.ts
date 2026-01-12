// app/api/store/checkout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const WP = process.env.WORDPRESS_URL!;

export async function POST(req: Request) {
  const token = (await cookies()).get("wc_cart_token")?.value;
  const payload = await req.json();
  // payload typically includes billing_address, shipping_address, customer_note, etc.
  // and MUST include payment_method (gateway id).

  const res = await fetch(`${WP}/wp-json/wc/store/v1/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Cart-Token": token } : {}),
    },
    body: JSON.stringify(payload),
  });
  console.log(res)

  const body = await res.json();
  return NextResponse.json(body, { status: res.status });
}

export async function GET(req: Request) {
  const token = (await cookies()).get("wc_cart_token")?.value;
  // payload typically includes billing_address, shipping_address, customer_note, etc.
  // and MUST include payment_method (gateway id).
  console.log("hola")
  const res = await fetch(`${WP}/wp-json/wc/store/v1/checkout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Cart-Token": token } : {}),
    }
  });
  console.log(res)

  const body = await res.json();
  return NextResponse.json(body, { status: res.status });
}
