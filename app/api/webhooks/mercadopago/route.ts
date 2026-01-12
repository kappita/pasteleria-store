import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET } from "@/lib/env.server";
import api from "@/app/lib/woocommerce";

// En caso de usar servicio Vercel para deploy
let vercelWaitUntil: any;
try {
  vercelWaitUntil = require("@vercel/functions").waitUntil;
} catch {
  vercelWaitUntil = null;
}

const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataId = searchParams.get("data.id");
    const type = searchParams.get("type");
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    // 1. Validación de Firma (Seguridad Producción)
    if (xSignature && dataId && xRequestId) {
      const secret = MP_WEBHOOK_SECRET;
      const parts = xSignature.split(",");
      let ts = "",
        hash = "";
      parts.forEach((p) => {
        const [k, v] = p.split("=");
        if (k.trim() === "ts") ts = v.trim();
        if (k.trim() === "v1") hash = v.trim();
      });
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const hmac = crypto
        .createHmac("sha256", secret)
        .update(manifest)
        .digest("hex");

      if (hmac !== hash)
        return new NextResponse("Unauthorized", { status: 401 });
    }
    // 2. Ejecución en Segundo Plano de la logica del webhook
    if (type === "payment" && dataId) {
      const tarea = procesarActualizacion(dataId); //función asincrona que procesa la actualización

      if (vercelWaitUntil) {
        vercelWaitUntil(tarea); // En caso de usar Vercel
      } else {
        tarea.catch((err) => console.error("Error en fondo:", err)); // En caso de usar otro hosting
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

async function procesarActualizacion(paymentId: string) {
  try {
    const payment = new Payment(client);
    const data = await payment.get({ id: paymentId });

    const status = data.status; // 'approved', 'rejected', 'pending', 'cancelled', 'in_process'
    const statusDetail = data.status_detail;
    const orderId = data.external_reference; // ID de la orden en WooCommerce

    if (!orderId) return;

    switch (status) {
      case "approved":
        await api.put(`orders/${orderId}`, {
          status: "processing",
          set_paid: true,
          transaction_id: paymentId,
        });
        await api.post(`orders/${orderId}/notes`, {
          note: `✅ Pago aprobado por Mercado Pago (ID: ${paymentId}).`,
        });
        break;

      case "rejected":
        await api.put(`orders/${orderId}`, {
          status: "failed",
        });
        // Nota con el motivo del rechazo para que el administrador sepa qué pasó
        await api.post(`orders/${orderId}/notes`, {
          note: `❌ Pago rechazado por Mercado Pago. Motivo: ${statusDetail}.`,
          customer_note: false,
        });
        break;

      case "pending":
      case "in_process":
        // El pago está en revisión (ej: efectivo o análisis de fraude)
        await api.put(`orders/${orderId}`, {
          status: "on-hold",
        });
        await api.post(`orders/${orderId}/notes`, {
          note: `⏳ El pago está pendiente de aprobación (ID: ${paymentId}). No preparar el pedido aún.`,
        });
        break;

      case "cancelled":
        await api.put(`orders/${orderId}`, {
          status: "cancelled",
        });
        break;

      default:
        console.log(`Estado no manejado: ${status} para la orden ${orderId}`);
    }
  } catch (error: any) {
    console.error(`❌ Error procesando pago ${paymentId}:`, error.message);
  }
}
