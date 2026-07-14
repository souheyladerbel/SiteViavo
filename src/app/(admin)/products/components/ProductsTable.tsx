"use client";

import type { ProductListItem } from "@/types/product";
import { archiveOrDeleteProductAction } from "@/lib/products/actions";
import { formatPrice } from "@/lib/products/utils";

type ProductsTableProps = {
  products: ProductListItem[];
  onEdit: (product: ProductListItem) => void;
};

function getClientVisibility(product: ProductListItem): boolean {
  return (
    product.isVisible &&
    !product.isArchived &&
    product.category.isActive &&
    product.category.isVisible &&
    !product.category.isArchived
  );
}

export default function ProductsTable({ products, onEdit }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-600">Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] border-collapse text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Produit</th>
              <th className="px-6 py-4 font-medium">Catégorie</th>
              <th className="px-6 py-4 font-medium">Prix</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Options</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {products.map((product) => {
              const isDisplayedClientSide = getClientVisibility(product);

              return (
                <tr key={product.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {product.mainImageUrl ? (
                      <img
                        src={product.mainImageUrl}
                        alt={product.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-500">
                        No img
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{product.name}</p>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.slug}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.imagesCount} image(s) secondaire(s)
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {product.category.name}
                    </p>

                    {!product.category.isActive ||
                    !product.category.isVisible ||
                    product.category.isArchived ? (
                      <p className="mt-1 text-xs text-orange-600">
                        Catégorie non affichée côté client
                      </p>
                    ) : null}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(product.priceInCents)}
                  </td>

                  <td className="px-6 py-4">
                    {product.stock > 0 ? (
                      <span className="text-gray-700">{product.stock}</span>
                    ) : (
                      <span className="font-medium text-red-600">Rupture</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {product.isArchived ? (
                        <span className="w-fit rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                          Archivé
                        </span>
                      ) : product.isVisible ? (
                        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Visible
                        </span>
                      ) : (
                        <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                          Masqué
                        </span>
                      )}

                      {isDisplayedClientSide ? (
                        <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          Affiché client
                        </span>
                      ) : (
                        <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                          Non affiché client
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {product.isBestSeller ? (
                        <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          Best seller
                        </span>
                      ) : null}

                      {product.isPromotion ? (
                        <span className="w-fit rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                          Promotion
                        </span>
                      ) : null}

                      {product.videoUrl ? (
                        <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          Vidéo
                        </span>
                      ) : null}

                      {product.orderItemsCount > 0 ? (
                        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                          Déjà commandé
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Modifier
                      </button>

                      <form
                        action={archiveOrDeleteProductAction}
                        onSubmit={(event) => {
                          const message =
                            product.orderItemsCount > 0
                              ? "Ce produit a déjà été commandé. Il sera archivé et masqué. Continuer ?"
                              : "Ce produit sera supprimé définitivement. Continuer ?";

                          if (!window.confirm(message)) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={product.id} />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                        >
                          {product.orderItemsCount > 0
                            ? "Archiver"
                            : "Supprimer"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}