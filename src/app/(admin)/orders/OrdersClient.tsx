"use client";

import { useCallback, useState } from "react";
import type { OrderListItem } from "@/types/order";
import OrdersFilters from "./components/OrdersFilters";
import OrdersTable from "./components/OrdersTable";
import OrderDetailsModal from "./components/OrderDetailsModal";

type OrdersClientProps = {
  orders: OrderListItem[];
  filters: {
    q: string;
    status: string;
    customer: string;
    dateFrom: string;
    dateTo: string;
  };
};

export default function OrdersClient({ orders, filters }: OrdersClientProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  return (
    <section>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Gestion des commandes
        </h2>

        <p className="mt-2 text-gray-600">
          Consulter les commandes, voir les détails et modifier leur statut.
        </p>
      </div>

      <div className="mt-8">
        <OrdersFilters filters={filters} />
      </div>

      <div className="mt-8">
        <OrdersTable
          orders={orders}
          onViewDetails={(orderId) => setSelectedOrderId(orderId)}
        />
      </div>

      {selectedOrderId ? (
        <OrderDetailsModal orderId={selectedOrderId} onClose={closeModal} />
      ) : null}
    </section>
  );
}