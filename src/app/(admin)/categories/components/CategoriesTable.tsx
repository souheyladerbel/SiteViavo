"use client";

import type { CategoryListItem } from "@/types/category";
import { deleteCategoryAction } from "@/lib/categories/actions";

type CategoriesTableProps = {
  categories: CategoryListItem[];
  onEdit: (category: CategoryListItem) => void;
};

export default function CategoriesTable({
  categories,
  onEdit,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-600">Aucune catégorie trouvée.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Nom</th>
              <th className="px-6 py-4 font-medium">Ordre</th>
              <th className="px-6 py-4 font-medium">Produits</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Visibilité</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {categories.map((category) => (
              <tr key={category.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-500">
                      No img
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{category.slug}</p>
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {category.displayOrder}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {category.productsCount}
                </td>

                <td className="px-6 py-4">
                  {category.isArchived ? (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                      Archivée
                    </span>
                  ) : category.isActive ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Désactivée
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {category.isVisible && category.isActive && !category.isArchived ? (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Visible
                    </span>
                  ) : (
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      Masquée
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Modifier
                    </button>

                    <form
                      action={deleteCategoryAction}
                      onSubmit={(event) => {
                        const message =
                          category.productsCount > 0
                            ? "Cette catégorie contient des produits. Elle sera archivée et masquée. Continuer ?"
                            : "Cette catégorie sera supprimée définitivement. Continuer ?";

                        if (!window.confirm(message)) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                      >
                        {category.productsCount > 0 ? "Archiver" : "Supprimer"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}