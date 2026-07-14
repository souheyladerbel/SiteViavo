"use client";

import type { PromoCodeListItem } from "@/types/promo-code";
import {
  deletePromoCodeAction,
  togglePromoCodeStatusAction,
} from "@/lib/promo-codes/actions";
import {
  formatDiscount,
  getPromoCodeStatus,
} from "@/lib/promo-codes/utils";

type PromoCodesTableProps = {
  promoCodes: PromoCodeListItem[];
  onEdit: (promoCode: PromoCodeListItem) => void;
};

function formatDate(date: string | null): string {
  if (!date) {
    return "Sans date";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function formatScope(promoCode: PromoCodeListItem): string {
  if (promoCode.scope === "CATALOG") {
    return "Tout le catalogue";
  }

  if (promoCode.scope === "CATEGORY") {
    return promoCode.category
      ? `Catégorie : ${promoCode.category.name}`
      : "Catégorie supprimée";
  }

  if (promoCode.scope === "PRODUCT") {
    return promoCode.product
      ? `Produit : ${promoCode.product.name}`
      : "Produit supprimé";
  }

  return promoCode.scope;
}

function getStatusClass(status: string): string {
  switch (status) {
    case "Actif":
      return "bg-green-100 text-green-700";
    case "Programmé":
      return "bg-blue-100 text-blue-700";
    case "Expiré":
      return "bg-red-100 text-red-700";
    case "Limite atteinte":
      return "bg-amber-100 text-amber-700";
    case "Désactivé":
    default:
      return "bg-gray-200 text-gray-700";
  }
}

export default function PromoCodesTable({
  promoCodes,
  onEdit,
}: PromoCodesTableProps) {
  if (promoCodes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-600">Aucun code promo trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Réduction</th>
              <th className="px-6 py-4 font-medium">Portée</th>
              <th className="px-6 py-4 font-medium">Validité</th>
              <th className="px-6 py-4 font-medium">Utilisations</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {promoCodes.map((promoCode) => {
              const status = getPromoCodeStatus({
                isActive: promoCode.isActive,
                startDate: promoCode.startDate,
                endDate: promoCode.endDate,
                usageLimit: promoCode.usageLimit,
                usedCount: promoCode.usedCount,
              });

              return (
                <tr key={promoCode.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold tracking-wide text-gray-900">
                      {promoCode.code}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Créé le {formatDate(promoCode.createdAt)}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {formatDiscount(
                        promoCode.discountType,
                        promoCode.discountValue
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {promoCode.discountType === "PERCENTAGE"
                        ? "Pourcentage"
                        : "Montant fixe"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {formatScope(promoCode)}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    <p>Début : {formatDate(promoCode.startDate)}</p>
                    <p className="mt-1">
                      Fin :{" "}
                      {promoCode.endDate
                        ? formatDate(promoCode.endDate)
                        : "Aucune"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    <p>
                      {promoCode.usedCount}
                      {promoCode.usageLimit !== null
                        ? ` / ${promoCode.usageLimit}`
                        : " / illimité"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(promoCode)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Modifier
                      </button>

                      <form action={togglePromoCodeStatusAction}>
                        <input type="hidden" name="id" value={promoCode.id} />

                        <button
                          type="submit"
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          {promoCode.isActive ? "Désactiver" : "Activer"}
                        </button>
                      </form>

                      <form
                        action={deletePromoCodeAction}
                        onSubmit={(event) => {
                          const message =
                            promoCode.usedCount > 0
                              ? "Ce code a déjà été utilisé. Il sera seulement désactivé. Continuer ?"
                              : "Ce code promo sera supprimé définitivement. Continuer ?";

                          if (!window.confirm(message)) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={promoCode.id} />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                        >
                          {promoCode.usedCount > 0 ? "Désactiver" : "Supprimer"}
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