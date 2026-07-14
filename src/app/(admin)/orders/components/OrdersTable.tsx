"use client";

import type { OrderListItem } from "@/types/order";
import {
  formatDateTime,
  formatOrderStatus,
  formatPrice,
  getOrderStatusClass,
} from "@/lib/orders/utils";

type OrdersTableProps = {
  orders: OrderListItem[];
  onViewDetails: (orderId: string) => void;
};

export default function OrdersTable({
  orders,
  onViewDetails,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-600">Aucune commande trouvée.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Commande</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Produits</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">
                    {order.orderNumber}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {order.customerName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {order.customerEmail}
                  </p>
                  {order.customerPhone ? (
                    <p className="mt-1 text-xs text-gray-500">
                      {order.customerPhone}
                    </p>
                  ) : null}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {order.itemsCount} produit(s)
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {formatPrice(order.totalInCents)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                      order.status
                    )}`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {formatDateTime(order.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onViewDetails(order.id)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}