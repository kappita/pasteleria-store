import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrder } from "@/app/lib/graphql/queries/getOrder";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Falta el parámetro id" },
      { status: 400 }
    );
  }

  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("authToken")?.value;
    if (!token) return NextResponse.json({ order: null });

    const order = await getOrder(token, id);

    return NextResponse.json(order);
  } catch (error: any) {
    throw error;
  }
}
