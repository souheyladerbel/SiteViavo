"use client";

import { useCallback, useState } from "react";
import type { CategoryListItem } from "@/types/category";
import CategoryModal from "./components/CategoryModal";
import CategoriesTable from "./components/CategoriesTable";
import CreateCategoryForm from "./components/CreateCategoryForm";
import EditCategoryForm from "./components/EditCategoryForm";

type ModalState =
  | { type: "create" }
  | { type: "edit"; category: CategoryListItem }
  | null;

type CategoriesClientProps = {
  categories: CategoryListItem[];
};

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const [modal, setModal] = useState<ModalState>(null);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Gestion des catégories
          </h2>
          <p className="mt-2 text-gray-600">
            Ajouter, modifier, masquer ou archiver les catégories du site.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ type: "create" })}
          className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Ajouter une catégorie
        </button>
      </div>

      <div className="mt-8">
        <CategoriesTable
          categories={categories}
          onEdit={(category) => setModal({ type: "edit", category })}
        />
      </div>

      {modal?.type === "create" ? (
        <CategoryModal
          title="Ajouter une catégorie"
          description="Créer une nouvelle catégorie affichable côté client."
          onClose={closeModal}
        >
          <CreateCategoryForm onCancel={closeModal} onSuccess={closeModal} />
        </CategoryModal>
      ) : null}

      {modal?.type === "edit" ? (
        <CategoryModal
          title="Modifier une catégorie"
          description="Modifier les informations, l’image et l’affichage."
          onClose={closeModal}
        >
          <EditCategoryForm
            category={modal.category}
            onCancel={closeModal}
            onSuccess={closeModal}
          />
        </CategoryModal>
      ) : null}
    </section>
  );
}