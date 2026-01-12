"use client";

interface Order {
  databaseId: number;
  date: string;
  status: string;
  total: string;
  lineItems: {
    nodes: any[];
  };
}

interface ClickableOrdersTableProps {
  orders: Order[];
}

export default function ClickableOrdersTable({ orders }: ClickableOrdersTableProps) {
  return (
    <tbody className="divide-y divide-gray-200">
      {orders.length === 0 ? (
        <tr>
          <td colSpan={5} className="py-12 text-center text-gray-500">
            No se encontraron pedidos.
          </td>
        </tr>
      ) : (
        orders.map((order) => (
          <tr 
            key={order.databaseId}
            className="cursor-pointer hover:bg-gray-50/50 transition-all text-left border-b border-gray-200 last:border-b-0 group"
            onClick={() => window.location.href = `/my-account/orders/${order.databaseId}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = `/my-account/orders/${order.databaseId}`;
              }
            }}
          >
            <td className="py-4 px-6 font-mono text-sm font-semibold text-gray-900 group-hover:text-blue-600">
              #{order.databaseId}
            </td>
            <td className="py-4 px-6 text-sm text-gray-700 group-hover:text-gray-900">
              {new Date(order.date).toLocaleDateString("es-ES")}
            </td>
            <td className="py-4 px-6 text-sm font-semibold text-gray-900 group-hover:text-gray-900">
              {order.lineItems?.nodes?.length || 0}
            </td>
            <td className="py-4 px-6 group-hover:bg-green-50">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 group-hover:bg-green-200 transition-colors inline-block">
                {order.status}
              </span>
            </td>
            <td className="py-4 px-6 text-right font-semibold text-lg text-gray-900 group-hover:text-blue-600">
              {order.total}
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
