"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export type Order = {
  orderNumber: string;
  date: string;
  status: string;
  total: string;
  subtotal: string;
  shippingTotal: string;
  paymentMethodTitle: string;
  customerNote: string | null;

  lineItems: {
    nodes: OrderLineItem[];
  };

  billing: BillingAddress;

  shipping: ShippingAddress;
};

export type OrderLineItem = {
  product: {
    node: {
      date: string;
      name: string;
    };
  };
  quantity: number;
  total: string;
  metaData: {
    key: string;
    value: string;
  }[];
};

export type BillingAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postcode: string | null;
  phone: string;
  email: string;
};

export type ShippingAddress = {
  address1: string;
  address2: string | null;
  city: string;
  company: string | null;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  postcode: string | null;
  email: string | null;
};

export default function OrderDetail() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const data = await fetch(`/api/order?id=${params.id}`);
        const { order } = await data.json();
        setOrder(order);
      } catch (err: any) {
        setError(err.message || "Error al cargar la orden");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

  if (loading) return <div className="p-8"><p className="text-center text-gray-600">Cargando...</p></div>;
  if (error) return <div className="p-8"><p className="text-center text-red-600">{error}</p></div>;
  if (!order) return <div className="p-8"><p className="text-center text-gray-600">Orden no encontrada</p></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Título */}
      <div className="border-b border-gray-200 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pedido #{order.orderNumber}
        </h1>
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Columna IZQUIERDA: Envío + Facturación */}
        <div className="space-y-6">
          {/* Envío */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Envío
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-gray-700 mb-1">Dirección (opcional)</p>
                <p className="text-gray-900">{order.shipping.address1 || '-'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Comuna</p>
                <p className="text-gray-900">{order.shipping.city}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Región</p>
                <p className="text-gray-900">{order.shipping.state}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Contacto</p>
                <p className="text-gray-900">{order.shipping.phone}</p>
              </div>
            </div>
          </div>

          {/* Facturación */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Facturación
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-gray-700 mb-1">Método de pago</p>
                <p className="text-gray-900">{order.paymentMethodTitle}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Número de tarjeta</p>
                <p className="text-gray-900">**** **** **** 9354</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Dirección (opcional)</p>
                <p className="text-gray-900">{order.billing.address1}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Comuna</p>
                <p className="text-gray-900">{order.billing.city}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Región</p>
                <p className="text-gray-900">{order.billing.state}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Teléfono</p>
                <p className="text-gray-900">{order.billing.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna DERECHA: Detalle de la compra - SEGUNDA IMAGEN */}
        <div className="space-y-6">
          <div className="overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r -translate-x-4 from-gray-50/50 to-transparent">
              <h2 className="text-xl font-bold text-gray-900">
                Detalle de la compra
              </h2>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full translate-x-6 ${
                  order.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="divide-y divide-gray-300">
              {order.lineItems.nodes.map((item, i) => {
                const cantidad = item.metaData.find((m) => m.key === "cantidad")?.value || item.quantity;
                const fechaEntrega = item.metaData.find((m) => m.key === "Fecha de entrega")?.value || '-';

                return (
                  <div key={i} className="p-4 hover:bg-gray-50/30 transition-colors grid grid-cols-2 gap-8 items-end">
                    <div>
                      <p className="font-semibold text-md text-gray-900 mb-1 leading-tight">
                        {item.product.node.name}
                      </p>
                      <p className="text-sm text-gray-600 leading-tight">
                        {fechaEntrega}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium text-gray-600">
                        {cantidad} unidades
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        ${item.total}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {/* Subtotal, Envío, Total */}
              <div className="p-4 space-y-2 bg-gradient-to-r from-gray-50/30 to-transparent">
                <div className="grid grid-cols-2 items-end gap-8">
                  <span className="text-sm font-medium text-gray-600">Subtotal</span>
                  <span className="text-lg font-semibold text-gray-900 text-right">{order.subtotal}</span>
                </div>
                <div className="grid grid-cols-2 items-end gap-8">
                  <span className="text-sm font-medium text-gray-600">Envío</span>
                  <span className="text-lg font-semibold text-gray-900 text-right">{order.shippingTotal}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-300 grid grid-cols-2 items-end gap-8">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-semibold text-gray-900 text-right">{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Notas si existen */}
      {order.customerNote && (
        <div className="border border-gray-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📝 Notas
          </h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.customerNote}</p>
        </div>
      )}
    </div>
  );
}