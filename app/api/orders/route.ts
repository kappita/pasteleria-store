import { NextResponse } from "next/server";
import api from "@/app/lib/woocommerce";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data } = await api.post("orders", body);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ Error creando orden:", err);
    return NextResponse.json(
      { error: "Error creando la orden" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // 1. Obtener el ID de la URL (ej: /api/orders?id=123)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de orden es requerido" }, { status: 400 });
    }

    // 2. Llamar a WooCommerce para borrar la orden
    // force: true -> La borra permanentemente de la base de datos
    // force: false -> La mueve a la papelera
    const { data } = await api.delete(`orders/${id}`, { force: true });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ Error cancelando orden:", err);
    return NextResponse.json(
      { error: "Error cancelando la orden" },
      { status: 500 }
    );
  }
}
