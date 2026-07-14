"use client";

import Link from "next/link";
import type { ProductCategoryOption } from "../ProductsClient";

type ProductsFiltersProps = {
  categories: ProductCategoryOption[];
  filters: {
    q: string;
    categoryId: string;
    status: string;
  };
};

export default function ProductsFilters({
  categories,
  filters,
}: ProductsFiltersProps) {
  return (
    <form
      method="GET"
      className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-4"
    >
      <div>
        <label htmlFor="q" className="form-label">
          Recherche
        </label>

        <input
          id="q"
          name="q"
          defaultValue={filters.q}
          placeholder="Nom ou slug du produit"
          className="form-control"
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="form-label">
          Catégorie
        </label>

        <select
          id="categoryId"
          name="categoryId"
          defaultValue={filters.categoryId}
          className="form-select"
        >
          <option value="">Toutes les catégories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {!category.isActive || !category.isVisible
                ? " — non affichée"
                : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="form-label">
          Statut
        </label>

        <select
          id="status"
          name="status"
          defaultValue={filters.status}
          className="form-select"
        >
          <option value="">Tous les statuts</option>
          <option value="visible">Visible</option>
          <option value="hidden">Masqué</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <div className="flex items-end gap-3">
        <button
          type="submit"
          className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Rechercher
        </button>

        <Link
          href="/products"
          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}