"use client";

import { useCallback, useState } from "react";
import type {
  PromoCodeListItem,
  PromoTargetOption,
} from "@/types/promo-code";
import PromoCodeModal from "./components/PromoCodeModal";
import PromoCodesTable from "./components/PromoCodesTable";
import CreatePromoCodeForm from "./components/CreatePromoCodeForm";
import EditPromoCodeForm from "./components/EditPromoCodeForm";

type PromoCodesClientProps = {
  promoCodes: PromoCodeListItem[];
  categories: PromoTargetOption[];
  products: PromoTargetOption[];
};

type ModalState =
  | { type: "create" }
  | { type: "edit"; promoCode: PromoCodeListItem }
  | null;

export default function PromoCodesClient({
  promoCodes,
  categories,
  products,
}: PromoCodesClientProps) {
  const [modal, setModal] = useState<ModalState>(null);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Gestion des codes promo
          </h2>

          <p className="mt-2 text-gray-600">
            Créer, modifier, désactiver ou supprimer les codes promo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ type: "create" })}
          className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Ajouter un code promo
        </button>
      </div>

      <div className="mt-8">
        <PromoCodesTable
          promoCodes={promoCodes}
          onEdit={(promoCode) => setModal({ type: "edit", promoCode })}
        />
      </div>

      {modal?.type === "create" ? (
        <PromoCodeModal
          title="Ajouter un code promo"
          description="Créer un code applicable au catalogue, à une catégorie ou à un produit."
          onClose={closeModal}
        >
          <CreatePromoCodeForm
            categories={categories}
            products={products}
            onCancel={closeModal}
            onSuccess={closeModal}
          />
        </PromoCodeModal>
      ) : null}

      {modal?.type === "edit" ? (
        <PromoCodeModal
          title="Modifier un code promo"
          description="Modifier les règles, dates et limites d’utilisation."
          onClose={closeModal}
        >
          <EditPromoCodeForm
            promoCode={modal.promoCode}
            categories={categories}
            products={products}
            onCancel={closeModal}
            onSuccess={closeModal}
          />
        </PromoCodeModal>
      ) : null}
    </section>
  );
}