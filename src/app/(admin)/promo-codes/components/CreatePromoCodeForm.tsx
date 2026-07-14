"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PromoTargetOption } from "@/types/promo-code";
import {
  createPromoCodeAction,
  type PromoCodeActionState,
} from "@/lib/promo-codes/actions";

type CreatePromoCodeFormProps = {
  categories: PromoTargetOption[];
  products: PromoTargetOption[];
  onCancel: () => void;
  onSuccess: () => void;
};

type PromoScope = "CATALOG" | "CATEGORY" | "PRODUCT";
type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

type CreatePromoCodeValues = {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  scope: PromoScope;
  categoryId: string;
  productId: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  isActive: boolean;
};

const initialState: PromoCodeActionState = {};

function getTodayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

const initialValues: CreatePromoCodeValues = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  scope: "CATALOG",
  categoryId: "",
  productId: "",
  startDate: getTodayDateInputValue(),
  endDate: "",
  usageLimit: "",
  isActive: true,
};

export default function CreatePromoCodeForm({
  categories,
  products,
  onCancel,
  onSuccess,
}: CreatePromoCodeFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CreatePromoCodeValues>(initialValues);

  const [state, formAction, isPending] = useActionState(
    createPromoCodeAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onSuccess();
    }
  }, [state.success, router, onSuccess]);

  function updateField<K extends keyof CreatePromoCodeValues>(
    field: K,
    value: CreatePromoCodeValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleScopeChange(scope: PromoScope) {
    setValues((current) => ({
      ...current,
      scope,
      categoryId: scope === "CATEGORY" ? current.categoryId : "",
      productId: scope === "PRODUCT" ? current.productId : "",
    }));
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="code" className="form-label">
            Code promo
          </label>

          <input
            id="code"
            name="code"
            value={values.code}
            onChange={(event) =>
              updateField(
                "code",
                event.target.value.toUpperCase().replace(/\s+/g, "")
              )
            }
            placeholder="Exemple : SUMMER20"
            className="form-control"
          />

          {state.fieldErrors?.code ? (
            <p className="form-error">{state.fieldErrors.code[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="discountType" className="form-label">
            Type de réduction
          </label>

          <select
            id="discountType"
            name="discountType"
            value={values.discountType}
            onChange={(event) =>
              updateField("discountType", event.target.value as DiscountType)
            }
            className="form-select"
          >
            <option value="PERCENTAGE">Pourcentage</option>
            <option value="FIXED_AMOUNT">Montant fixe</option>
          </select>

          {state.fieldErrors?.discountType ? (
            <p className="form-error">{state.fieldErrors.discountType[0]}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="discountValue" className="form-label">
          Valeur de la réduction
        </label>

        <input
          id="discountValue"
          name="discountValue"
          value={values.discountValue}
          onChange={(event) =>
            updateField("discountValue", event.target.value)
          }
          placeholder={
            values.discountType === "PERCENTAGE"
              ? "Exemple : 20"
              : "Exemple : 15.00"
          }
          className="form-control"
        />

        <p className="mt-1 text-xs text-gray-500">
          {values.discountType === "PERCENTAGE"
            ? "Pourcentage entre 1 et 100."
            : "Montant fixe en devise, exemple : 15.00."}
        </p>

        {state.fieldErrors?.discountValue ? (
          <p className="form-error">{state.fieldErrors.discountValue[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="scope" className="form-label">
          Portée du code promo
        </label>

        <select
          id="scope"
          name="scope"
          value={values.scope}
          onChange={(event) =>
            handleScopeChange(event.target.value as PromoScope)
          }
          className="form-select"
        >
          <option value="CATALOG">Tout le catalogue</option>
          <option value="CATEGORY">Une catégorie</option>
          <option value="PRODUCT">Un produit précis</option>
        </select>

        {state.fieldErrors?.scope ? (
          <p className="form-error">{state.fieldErrors.scope[0]}</p>
        ) : null}
      </div>

      {values.scope === "CATEGORY" ? (
        <div>
          <label htmlFor="categoryId" className="form-label">
            Catégorie concernée
          </label>

          <select
            id="categoryId"
            name="categoryId"
            value={values.categoryId}
            onChange={(event) =>
              updateField("categoryId", event.target.value)
            }
            className="form-select"
          >
            <option value="">Choisir une catégorie</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {state.fieldErrors?.categoryId ? (
            <p className="form-error">{state.fieldErrors.categoryId[0]}</p>
          ) : null}
        </div>
      ) : (
        <input type="hidden" name="categoryId" value="" />
      )}

      {values.scope === "PRODUCT" ? (
        <div>
          <label htmlFor="productId" className="form-label">
            Produit concerné
          </label>

          <select
            id="productId"
            name="productId"
            value={values.productId}
            onChange={(event) =>
              updateField("productId", event.target.value)
            }
            className="form-select"
          >
            <option value="">Choisir un produit</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          {state.fieldErrors?.productId ? (
            <p className="form-error">{state.fieldErrors.productId[0]}</p>
          ) : null}
        </div>
      ) : (
        <input type="hidden" name="productId" value="" />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="form-label">
            Date de début
          </label>

          <input
            id="startDate"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
            className="form-control"
          />

          {state.fieldErrors?.startDate ? (
            <p className="form-error">{state.fieldErrors.startDate[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="endDate" className="form-label">
            Date de fin
          </label>

          <input
            id="endDate"
            name="endDate"
            type="date"
            value={values.endDate}
            onChange={(event) => updateField("endDate", event.target.value)}
            className="form-control"
          />

          <p className="mt-1 text-xs text-gray-500">
            Laissez vide si le code n’a pas de date d’expiration.
          </p>

          {state.fieldErrors?.endDate ? (
            <p className="form-error">{state.fieldErrors.endDate[0]}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="usageLimit" className="form-label">
          Limite d’utilisation
        </label>

        <input
          id="usageLimit"
          name="usageLimit"
          type="number"
          min="1"
          value={values.usageLimit}
          onChange={(event) => updateField("usageLimit", event.target.value)}
          placeholder="Exemple : 100"
          className="form-control"
        />

        <p className="mt-1 text-xs text-gray-500">
          Laissez vide pour une utilisation illimitée.
        </p>

        {state.fieldErrors?.usageLimit ? (
          <p className="form-error">{state.fieldErrors.usageLimit[0]}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name="isActive"
            type="checkbox"
            checked={values.isActive}
            onChange={(event) =>
              updateField("isActive", event.target.checked)
            }
            className="form-checkbox"
          />
          Code promo actif
        </label>

        <p className="mt-2 text-xs text-gray-500">
          Un code désactivé ne fonctionnera pas côté client.
        </p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Le code promo ne fonctionnera que s’il est actif, dans sa période de
        validité, et si sa limite d’utilisation n’est pas atteinte.
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? "Création..." : "Créer"}
        </button>
      </div>
    </form>
  );
}