"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductCategoryOption } from "../ProductsClient";
import {
  createProductAction,
  type ProductActionState,
} from "@/lib/products/actions";

type CreateProductFormProps = {
  categories: ProductCategoryOption[];
  onCancel: () => void;
  onSuccess: () => void;
};

type CreateProductValues = {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  categoryId: string;
  videoUrl: string;
  isVisible: boolean;
  isBestSeller: boolean;
  isPromotion: boolean;
};

const initialState: ProductActionState = {};

const initialValues: CreateProductValues = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: 0,
  categoryId: "",
  videoUrl: "",
  isVisible: true,
  isBestSeller: false,
  isPromotion: false,
};

export default function CreateProductForm({
  categories,
  onCancel,
  onSuccess,
}: CreateProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CreateProductValues>(initialValues);

  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onSuccess();
    }
  }, [state.success, router, onSuccess]);

  function updateField<K extends keyof CreateProductValues>(
    field: K,
    value: CreateProductValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
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
          <label htmlFor="name" className="form-label">
            Nom du produit
          </label>

          <input
            id="name"
            name="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Exemple : Collier doré"
            className="form-control"
          />

          {state.fieldErrors?.name ? (
            <p className="form-error">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="slug" className="form-label">
            Slug
          </label>

          <input
            id="slug"
            name="slug"
            value={values.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="Optionnel, ex : collier-dore"
            className="form-control"
          />

          {state.fieldErrors?.slug ? (
            <p className="form-error">{state.fieldErrors.slug[0]}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={(event) =>
            updateField("description", event.target.value)
          }
          rows={3}
          placeholder="Description détaillée du produit"
          className="form-control"
        />

        {state.fieldErrors?.description ? (
          <p className="form-error">{state.fieldErrors.description[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="price" className="form-label">
            Prix
          </label>

          <input
            id="price"
            name="price"
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            placeholder="Exemple : 49.90"
            className="form-control"
          />

          {state.fieldErrors?.price ? (
            <p className="form-error">{state.fieldErrors.price[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="stock" className="form-label">
            Stock
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={values.stock}
            onChange={(event) =>
              updateField("stock", Number(event.target.value))
            }
            className="form-control"
          />

          {state.fieldErrors?.stock ? (
            <p className="form-error">{state.fieldErrors.stock[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="categoryId" className="form-label">
            Catégorie
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
                {!category.isActive || !category.isVisible
                  ? " — non affichée"
                  : ""}
              </option>
            ))}
          </select>

          {state.fieldErrors?.categoryId ? (
            <p className="form-error">{state.fieldErrors.categoryId[0]}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="mainImage" className="form-label">
          Image principale
        </label>

        <input
          id="mainImage"
          name="mainImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="form-control"
        />

        <p className="mt-1 text-xs text-gray-500">
          Formats acceptés : JPG, PNG, WEBP. Taille max : 2 Mo.
        </p>
      </div>

      <div>
        <label htmlFor="secondaryImages" className="form-label">
          Images secondaires
        </label>

        <input
          id="secondaryImages"
          name="secondaryImages"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="form-control"
        />

        <p className="mt-1 text-xs text-gray-500">
          Vous pouvez sélectionner plusieurs images.
        </p>
      </div>

      <div>
        <label htmlFor="videoUrl" className="form-label">
          Vidéo
        </label>

        <input
          id="videoUrl"
          name="videoUrl"
          value={values.videoUrl}
          onChange={(event) => updateField("videoUrl", event.target.value)}
          placeholder="Lien vidéo optionnel"
          className="form-control"
        />

        {state.fieldErrors?.videoUrl ? (
          <p className="form-error">{state.fieldErrors.videoUrl[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-3">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name="isVisible"
            type="checkbox"
            checked={values.isVisible}
            onChange={(event) =>
              updateField("isVisible", event.target.checked)
            }
            className="form-checkbox"
          />
          Visible côté client
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name="isBestSeller"
            type="checkbox"
            checked={values.isBestSeller}
            onChange={(event) =>
              updateField("isBestSeller", event.target.checked)
            }
            className="form-checkbox"
          />
          Best seller
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name="isPromotion"
            type="checkbox"
            checked={values.isPromotion}
            onChange={(event) =>
              updateField("isPromotion", event.target.checked)
            }
            className="form-checkbox"
          />
          En promotion
        </label>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Un produit ne sera affiché côté client que si lui-même est visible et si
        sa catégorie est active, visible et non archivée.
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
          {isPending ? "Ajout..." : "Ajouter"}
        </button>
      </div>
    </form>
  );
}