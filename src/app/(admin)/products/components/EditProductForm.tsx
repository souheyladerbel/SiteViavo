"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductListItem } from "@/types/product";
import type { ProductCategoryOption } from "../ProductsClient";
import {
  updateProductAction,
  type ProductActionState,
} from "@/lib/products/actions";

type EditProductFormProps = {
  product: ProductListItem;
  categories: ProductCategoryOption[];
  onCancel: () => void;
  onSuccess: () => void;
};

type EditProductValues = {
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

function priceToInputValue(priceInCents: number): string {
  return (priceInCents / 100).toFixed(2);
}

export default function EditProductForm({
  product,
  categories,
  onCancel,
  onSuccess,
}: EditProductFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<EditProductValues>({
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: priceToInputValue(product.priceInCents),
    stock: product.stock,
    categoryId: product.category.id,
    videoUrl: product.videoUrl ?? "",
    isVisible: product.isVisible,
    isBestSeller: product.isBestSeller,
    isPromotion: product.isPromotion,
  });

  const [state, formAction, isPending] = useActionState(
    updateProductAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onSuccess();
    }
  }, [state.success, router, onSuccess]);

  function updateField<K extends keyof EditProductValues>(
    field: K,
    value: EditProductValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={product.id} />

      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      {product.isArchived ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Ce produit est archivé. Il reste conservé pour l’historique, mais il
          ne doit pas apparaître dans la vitrine client.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="edit-name" className="form-label">
            Nom du produit
          </label>

          <input
            id="edit-name"
            name="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="form-control"
          />

          {state.fieldErrors?.name ? (
            <p className="form-error">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="edit-slug" className="form-label">
            Slug
          </label>

          <input
            id="edit-slug"
            name="slug"
            value={values.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            className="form-control"
          />

          {state.fieldErrors?.slug ? (
            <p className="form-error">{state.fieldErrors.slug[0]}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="edit-description" className="form-label">
          Description
        </label>

        <textarea
          id="edit-description"
          name="description"
          value={values.description}
          onChange={(event) =>
            updateField("description", event.target.value)
          }
          rows={3}
          className="form-control"
        />

        {state.fieldErrors?.description ? (
          <p className="form-error">{state.fieldErrors.description[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="edit-price" className="form-label">
            Prix
          </label>

          <input
            id="edit-price"
            name="price"
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="form-control"
          />

          {state.fieldErrors?.price ? (
            <p className="form-error">{state.fieldErrors.price[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="edit-stock" className="form-label">
            Stock
          </label>

          <input
            id="edit-stock"
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
          <label htmlFor="edit-categoryId" className="form-label">
            Catégorie
          </label>

          <select
            id="edit-categoryId"
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
        <label htmlFor="edit-mainImage" className="form-label">
          Image principale
        </label>

        {product.mainImageUrl ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="mb-3 h-20 w-20 rounded-xl object-cover"
          />
        ) : null}

        <input
          id="edit-mainImage"
          name="mainImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="form-control"
        />

        <p className="mt-1 text-xs text-gray-500">
          Laissez vide pour garder l’image actuelle.
        </p>
      </div>

      <div>
        <label htmlFor="edit-secondaryImages" className="form-label">
          Ajouter des images secondaires
        </label>

        <input
          id="edit-secondaryImages"
          name="secondaryImages"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="form-control"
        />

        <p className="mt-1 text-xs text-gray-500">
          Les nouvelles images seront ajoutées à la galerie existante.
        </p>
      </div>

      <div>
        <label htmlFor="edit-videoUrl" className="form-label">
          Vidéo
        </label>

        <input
          id="edit-videoUrl"
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
            disabled={product.isArchived}
            className="form-checkbox disabled:cursor-not-allowed disabled:opacity-50"
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
        Si la catégorie du produit est désactivée, masquée ou archivée, le
        produit ne sera pas affiché côté client.
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
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}