import { addToCart } from "@/app/lib/graphql/mutations/addToCart";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type AddToCartBody = {
  productId: string;
  variationId?: string;
  quantity: number;
};

export async function POST(req: Request) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;
  if (!token) return NextResponse.json({ status: 401 });

  try {
    const body: AddToCartBody = await req.json();
    const { productId, variationId, quantity } = body;

    const input = {
      productId,
      quantity,
      ...(variationId ? { variationId } : {}),
    };

    const res = await addToCart(token, input);

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    throw err;
  }
}
