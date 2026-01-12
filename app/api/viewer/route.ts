import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getViewer } from "@/app/lib/graphql/queries/getViewer";

export async function GET() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;
  if (!token) return NextResponse.json({ viewer: null }, { status: 200 });

  try {
    const viewer = await getViewer(token);
    return NextResponse.json({ viewer });
  } catch {
    cookiesStore.delete("authToken");
    return NextResponse.json({ viewer: null }, { status: 401 });
  }
}
