// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
import { MP_ACCESS_TOKEN } from "@/lib/env.server";

// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
});

export async function POST(req: Request) {
  const { items, orderId } = await req.json();

  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`,
        },
        auto_return: "approved",
        external_reference: orderId,
      },
    });

    return new Response(JSON.stringify({ id: response.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al crear la preferencia" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
