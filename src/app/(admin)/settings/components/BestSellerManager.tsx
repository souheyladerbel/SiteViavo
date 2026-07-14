"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  BestSellerProductItem,
  EligibleBestSellerProduct,
} from "@/types/settings";
import { formatPrice } from "@/lib/products/utils";
import {
  addBestSellerProductAction,
  removeBestSellerProductAction,
  updateBestSellerOrderAction,
  type SettingsActionState,
} from "@/lib/settings/actions";

type BestSellerManagerProps = {
  bestSellerProducts: BestSellerProductItem[];
  eligibleProducts: EligibleBestSellerProduct[];
};

const initialState: SettingsActionState = {};

export default function BestSellerManager({
  bestSellerProducts,
  eligibleProducts,
}: BestSellerManagerProps) {
  const router = useRouter();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [bestSellerOrder, setBestSellerOrder] = useState(0);

  const [state, formAction, isPending] = useActionState(
    addBestSellerProductAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      setSelectedProductId("");
      setBestSellerOrder(0);
    }
  }, [state.success, router]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">
        Cartes Best Seller
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Choisir les produits affichés dans la section Best Seller.
      </p>

      {state.success ? (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {state.success}
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="productId" className="form-label">
            Produit
          </label>

          <select
            id="productId"
            name="productId"
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
            className="form-select"
          >
            <option value="">Choisir un produit</option>

            {eligibleProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          {state.fieldErrors?.productId ? (
            <p className="form-error">{state.fieldErrors.productId[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="bestSellerOrder" className="form-label">
            Ordre d’affichage
          </label>

          <input
            id="bestSellerOrder"
            name="bestSellerOrder"
            type="number"
            min="0"
            value={bestSellerOrder}
            onChange={(event) => setBestSellerOrder(Number(event.target.value))}
            className="form-control"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isPending ? "Ajout..." : "Ajouter en Best Seller"}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {bestSellerProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucun produit Best Seller sélectionné.
          </p>
        ) : (
          bestSellerProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex gap-3">
                {product.mainImageUrl ? (
                  <img
                    src={product.mainImageUrl}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-gray-100" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">
                    {product.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {product.category.name}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatPrice(product.priceInCents)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <form action={updateBestSellerOrderAction} className="flex gap-2">
                  <input type="hidden" name="productId" value={product.id} />

                  <input
                    name="bestSellerOrder"
                    type="number"
                    min="0"
                    defaultValue={product.bestSellerOrder}
                    className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                  />

                  <button
                    type="submit"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Ordre
                  </button>
                </form>

                <form
                  action={removeBestSellerProductAction}
                  onSubmit={(event) => {
                    if (!window.confirm("Retirer ce produit des Best Sellers ?")) {
                      event.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="productId" value={product.id} />

                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Retirer
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}