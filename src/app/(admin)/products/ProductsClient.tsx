"use client";

import { useCallback, useState } from "react";
import type { ProductListItem } from "@/types/product";
import ProductModal from "./components/ProductModal";
import ProductsTable from "./components/ProductsTable";
import ProductsFilters from "./components/ProductsFilters";
import CreateProductForm from "./components/CreateProductForm";
import EditProductForm from "./components/EditProductForm";

export type ProductCategoryOption = {
  id: string;
  name: string;
  isActive: boolean;
  isVisible: boolean;
  isArchived: boolean;
};

type ProductFilters = {
  q: string;
  categoryId: string;
  status: string;
};

type ProductsClientProps = {
  products: ProductListItem[];
  categories: ProductCategoryOption[];
  filters: ProductFilters;
};

type ModalState =
  | { type: "create" }
  | { type: "edit"; product: ProductListItem }
  | null;

export default function ProductsClient({
  products,
  categories,
  filters,
}: ProductsClientProps) {
  const [modal, setModal] = useState<ModalState>(null);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Gestion des produits
          </h2>

          <p className="mt-2 text-gray-600">
            Ajouter, modifier, masquer ou archiver les produits du catalogue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ type: "create" })}
          className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Ajouter un produit
        </button>
      </div>

      <div className="mt-8">
        <ProductsFilters categories={categories} filters={filters} />
      </div>

      <div className="mt-8">
        <ProductsTable
          products={products}
          onEdit={(product) => setModal({ type: "edit", product })}
        />
      </div>

      {modal?.type === "create" ? (
        <ProductModal
          title="Ajouter un produit"
          description="Créer un nouveau produit dans le catalogue."
          onClose={closeModal}
        >
          <CreateProductForm
            categories={categories}
            onCancel={closeModal}
            onSuccess={closeModal}
          />
        </ProductModal>
      ) : null}

      {modal?.type === "edit" ? (
        <ProductModal
          title="Modifier un produit"
          description="Modifier les informations, médias et options du produit."
          onClose={closeModal}
        >
          <EditProductForm
            product={modal.product}
            categories={categories}
            onCancel={closeModal}
            onSuccess={closeModal}
          />
        </ProductModal>
      ) : null}
    </section>
  );
}