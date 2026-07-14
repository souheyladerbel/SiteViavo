"use client";

import { useActionState, useEffect, useState } from "react";
import type { OrderDetails } from "@/types/order";
import {
  getOrderDetailsAction,
  updateOrderStatusAction,
  type OrderActionState,
} from "@/lib/orders/actions";
import {
  formatDateTime,
  formatOrderStatus,
  formatPrice,
  getOrderStatusClass,
} from "@/lib/orders/utils";

type OrderDetailsModalProps = {
  orderId: string;
  onClose: () => void;
};

const initialState: OrderActionState = {};

export default function OrderDetailsModal({
  orderId,
  onClose,
}: OrderDetailsModalProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [state, formAction, isPending] = useActionState(
    updateOrderStatusAction,
    initialState
  );

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);

      const details = await getOrderDetailsAction(orderId);

      setOrder(details);
      setIsLoading(false);
    }

    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (state.success) {
      async function reloadOrder() {
        const details = await getOrderDetailsAction(orderId);
        setOrder(details);
      }

      reloadOrder();
    }
  }, [state.success, orderId]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Détails de la commande
            </h3>

            {order ? (
              <p className="mt-1 text-sm text-gray-500">
                Commande {order.orderNumber}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-2xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">
          {isLoading ? (
            <p className="text-gray-600">Chargement...</p>
          ) : null}

          {!isLoading && !order ? (
            <p className="text-red-600">Commande introuvable.</p>
          ) : null}

          {order ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Client
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    {order.customerName}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {order.customerEmail}
                  </p>

                  {order.customerPhone ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {order.customerPhone}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Livraison
                  </p>

                  <p className="mt-2 text-sm text-gray-700">
                    {order.customerAddress || "Adresse non renseignée"}
                  </p>

                  {order.customerCity ? (
                    <p className="mt-1 text-sm text-gray-700">
                      {order.customerCity}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Statut
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                      order.status
                    )}`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>

                  <p className="mt-3 text-sm text-gray-600">
                    Créée le {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <form
                action={formAction}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <input type="hidden" name="id" value={order.id} />

                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <label htmlFor="status" className="form-label">
                      Modifier le statut
                    </label>

                    <select
                      id="status"
                      name="status"
                      defaultValue={order.status}
                      className="form-select"
                    >
                      <option value="NEW">Nouvelle commande</option>
                      <option value="CONFIRMED">Confirmée</option>
                      <option value="PREPARING">En préparation</option>
                      <option value="DELIVERED">Livrée</option>
                      <option value="CANCELLED">Annulée</option>
                    </select>

                    {state.error ? (
                      <p className="form-error">{state.error}</p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    {isPending ? "Mise à jour..." : "Mettre à jour"}
                  </button>
                </div>
              </form>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Produit</th>
                      <th className="px-4 py-3 font-medium">Catégorie</th>
                      <th className="px-4 py-3 font-medium">Prix achat</th>
                      <th className="px-4 py-3 font-medium">Quantité</th>
                      <th className="px-4 py-3 font-medium">Sous-total</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.productImageSnapshot ? (
                              <img
                                src={item.productImageSnapshot}
                                alt={item.productNameSnapshot}
                                className="h-12 w-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-gray-100" />
                            )}

                            <div>
                              <p className="font-medium text-gray-900">
                                {item.productNameSnapshot}
                              </p>

                              {item.productSlugSnapshot ? (
                                <p className="text-xs text-gray-500">
                                  {item.productSlugSnapshot}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.categoryNameSnapshot || "Non renseignée"}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {formatPrice(item.productPriceSnapshot)}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-3 font-medium text-gray-900">
                          {formatPrice(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto max-w-sm space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Sous-total</span>
                  <span>{formatPrice(order.subtotalInCents)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>
                    Réduction{" "}
                    {order.promoCodeSnapshot
                      ? `(${order.promoCodeSnapshot})`
                      : ""}
                  </span>
                  <span>- {formatPrice(order.discountInCents)}</span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(order.totalInCents)}</span>
                </div>
              </div>

              {order.customerNote ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Note client
                  </p>

                  <p className="mt-2 text-sm text-gray-700">
                    {order.customerNote}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}