"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryListItem } from "@/types/category";
import {
  updateCategoryAction,
  type CategoryActionState,
} from "@/lib/categories/actions";

type EditCategoryFormProps = {
  category: CategoryListItem;
  onCancel: () => void;
  onSuccess: () => void;
};

const initialState: CategoryActionState = {};

export default function EditCategoryForm({
  category,
  onCancel,
  onSuccess,
}: EditCategoryFormProps) {
  const router = useRouter();

  const [values, setValues] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    isVisible: category.isVisible,
  });

  const [state, formAction, isPending] = useActionState(
    updateCategoryAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onSuccess();
    }
  }, [state.success, router, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={category.id} />

      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div>
        <label className="form-label">Nom</label>
        <input
          name="name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="form-control"
        />
      </div>

      <div>
        <label className="form-label">Slug</label>
        <input
          name="slug"
          value={values.slug}
          onChange={(e) => setValues({ ...values, slug: e.target.value })}
          className="form-control"
        />
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          rows={3}
          className="form-control"
        />
      </div>

      <div>
        <label className="form-label">Image de catégorie</label>

        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="mb-3 h-20 w-20 rounded-xl object-cover"
          />
        ) : null}

        <input name="image" type="file" accept="image/*" className="form-control" />
      </div>

      <div>
        <label className="form-label">Ordre d’affichage</label>
        <input
          name="displayOrder"
          type="number"
          min="0"
          value={values.displayOrder}
          onChange={(e) =>
            setValues({ ...values, displayOrder: Number(e.target.value) })
          }
          className="form-control"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name="isActive"
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => setValues({ ...values, isActive: e.target.checked })}
            className="form-checkbox"
          />
          Catégorie active
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name="isVisible"
            type="checkbox"
            checked={values.isVisible}
            onChange={(e) =>
              setValues({ ...values, isVisible: e.target.checked })
            }
            className="form-checkbox"
          />
          Visible côté client
        </label>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Une catégorie désactivée ou archivée ne sera pas affichée dans la
        vitrine client.
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          Annuler
        </button>

        <button type="submit" disabled={isPending} className="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400">
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}