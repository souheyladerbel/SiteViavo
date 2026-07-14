"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminListItem } from "@/types/admin";
import {
  updateAdminAction,
  type AdminActionState,
} from "@/lib/admin/actions";

type EditAdminFormProps = {
  admin: AdminListItem;
  currentAdminId: string;
  onCancel: () => void;
  onSuccess: () => void;
};

type EditAdminFormValues = {
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
};

const initialState: AdminActionState = {};

export default function EditAdminForm({
  admin,
  currentAdminId,
  onCancel,
  onSuccess,
}: EditAdminFormProps) {
  const router = useRouter();
  const isEditingOwnAccount = admin.id === currentAdminId;

  const [formValues, setFormValues] = useState<EditAdminFormValues>({
    name: admin.name,
    email: admin.email,
    role: admin.role as "ADMIN" | "SUPER_ADMIN",
    isActive: admin.isActive,
  });

  const [state, formAction, isPending] = useActionState(
    updateAdminAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onSuccess();
    }
  }, [state.success, router, onSuccess]);

  function updateField<K extends keyof EditAdminFormValues>(
    field: K,
    value: EditAdminFormValues[K]
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={admin.id} />

      {isEditingOwnAccount ? (
        <input type="hidden" name="isActive" value="on" />
      ) : null}

      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor="edit-name" className="form-label">
          Nom
        </label>

        <input
          id="edit-name"
          name="name"
          type="text"
          value={formValues.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="form-control"
        />

        {state.fieldErrors?.name ? (
          <p className="form-error">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="edit-email" className="form-label">
          Email
        </label>

        <input
          id="edit-email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="form-control"
        />

        {state.fieldErrors?.email ? (
          <p className="form-error">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="edit-role" className="form-label">
          Rôle
        </label>

        <select
          id="edit-role"
          name="role"
          value={formValues.role}
          onChange={(event) =>
            updateField("role", event.target.value as "ADMIN" | "SUPER_ADMIN")
          }
          className="form-select"
          disabled={isEditingOwnAccount}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>

        {isEditingOwnAccount ? (
          <input type="hidden" name="role" value={formValues.role} />
        ) : null}

        {state.fieldErrors?.role ? (
          <p className="form-error">{state.fieldErrors.role[0]}</p>
        ) : null}

        {isEditingOwnAccount ? (
          <p className="mt-1 text-xs text-gray-500">
            Vous ne pouvez pas modifier votre propre rôle.
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name={isEditingOwnAccount ? undefined : "isActive"}
            type="checkbox"
            checked={formValues.isActive}
            onChange={(event) => updateField("isActive", event.target.checked)}
            disabled={isEditingOwnAccount}
            className="form-checkbox disabled:cursor-not-allowed disabled:opacity-50"
          />
          Compte actif
        </label>

        {isEditingOwnAccount ? (
          <p className="mt-2 text-xs text-amber-700">
            Vous ne pouvez pas désactiver votre propre compte.
          </p>
        ) : (
          <p className="mt-2 text-xs text-gray-500">
            Si le compte est désactivé, cet admin ne pourra plus se connecter.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Le mot de passe n’est pas modifié ici. Cette page sert uniquement à
        modifier les informations du compte.
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