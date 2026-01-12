import { cookies } from "next/headers";
import { getCustomerOrders } from "@/app/lib/graphql/queries/getCustomerOrders";
import { redirect } from "next/navigation";
import { getViewer } from "@/app/lib/graphql/queries/getViewer";
import ClickableOrdersTable from "./ClickableOrdersTable";
import Link from "next/link";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const user = await getViewer(token);
    const email = user?.email;

    const ordersData = await getCustomerOrders(token, email, 10);
    const orders = ordersData?.nodes ?? [];

    console.log(orders);
    
    return (
      <main className="space-y-6 mt-5">
        {/* Título con línea debajo */}
        <div>
          <h1 className="text-4xl text-gray-800 mb-2">
            Historial de Pedidos
          </h1>
          <hr className="border-gray-300 w-[45%]" />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-xl border border-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr className="text-center">
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide rounded-tl-2xl">
                  ID Pedido
                </th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  Fecha
                </th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  N° Productos
                </th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  Estado
                </th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide rounded-tr-2xl">
                  Total
                </th>
              </tr>
            </thead>
            <ClickableOrdersTable orders={orders} />
          </table>
        </div>

        {/* Línea decorativa final */}
        {orders.length > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-all">&lt;</button>
              <span>1</span>
              <button className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-all">&gt;</button>
            </div>
          </div>
        )}
      </main>
    );
  } catch (err) {
    return (
      <main className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Historial de Pedidos
          </h1>
          <hr className="border-gray-300 w-full" />
        </div>
        <div className="text-center py-12 text-red-600 bg-red-50 rounded-2xl border border-red-200">
          No se pudieron cargar los pedidos. Por favor inténtalo más tarde.
        </div>
      </main>
    );
  }
}
