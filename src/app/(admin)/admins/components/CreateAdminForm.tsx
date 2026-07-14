"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAdminAction,
  type AdminActionState,
} from "@/lib/admin/actions";

type CreateAdminFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

type CreateAdminFormValues = {
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  password: string;
  confirmPassword: string;
};

const initialState: AdminActionState = {};

const initialFormValues: CreateAdminFormValues = {
  name: "",
  email: "",
  role: "ADMIN",
  isActive: true,
  password: "",
  confirmPassword: "",
};

export default function CreateAdminForm({
  onCancel,
  onSuccess,
}: CreateAdminFormProps) {
  const router = useRouter();
  const [formValues, setFormValues] =
    useState<CreateAdminFormValues>(initialFormValues);

  const [state, formAction, isPending] = useActionState(
    createAdminAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onSuccess();
    }
  }, [state.success, router, onSuccess]);

  function updateField<K extends keyof CreateAdminFormValues>(
    field: K,
    value: CreateAdminFormValues[K]
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
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

      <div>
        <label htmlFor="name" className="form-label">
          Nom
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formValues.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Exemple : Ahmed Ben Ali"
          className="form-control"
        />

        {state.fieldErrors?.name ? (
          <p className="form-error">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="form-label">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="admin@example.com"
          className="form-control"
        />

        {state.fieldErrors?.email ? (
          <p className="form-error">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="role" className="form-label">
          Rôle
        </label>

        <select
          id="role"
          name="role"
          value={formValues.role}
          onChange={(event) =>
            updateField("role", event.target.value as "ADMIN" | "SUPER_ADMIN")
          }
          className="form-select"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>

        {state.fieldErrors?.role ? (
          <p className="form-error">{state.fieldErrors.role[0]}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
        <input
          name="isActive"
          type="checkbox"
          checked={formValues.isActive}
          onChange={(event) => updateField("isActive", event.target.checked)}
          className="form-checkbox"
        />
        Compte actif
      </label>

      <div>
        <label htmlFor="password" className="form-label">
          Mot de passe
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={formValues.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="Minimum 8 caractères"
          className="form-control"
        />

        {state.fieldErrors?.password ? (
          <p className="form-error">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="form-label">
          Confirmer le mot de passe
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formValues.confirmPassword}
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          placeholder="Répéter le mot de passe"
          className="form-control"
        />

        {state.fieldErrors?.confirmPassword ? (
          <p className="form-error">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        ) : null}
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