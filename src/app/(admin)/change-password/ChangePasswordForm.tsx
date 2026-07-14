"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  changePasswordAction,
  type ChangePasswordActionState,
} from "@/lib/account/actions";

const initialState: ChangePasswordActionState = {};

export default function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor="currentPassword" className="form-label">
          Ancien mot de passe
        </label>

        <div className="relative">
          <input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            autoComplete="current-password"
            className="form-control pr-12"
          />

          <button
            type="button"
            onClick={() => setShowCurrentPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label={
              showCurrentPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showCurrentPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {state.fieldErrors?.currentPassword ? (
          <p className="form-error">
            {state.fieldErrors.currentPassword[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="newPassword" className="form-label">
          Nouveau mot de passe
        </label>

        <div className="relative">
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            className="form-control pr-12"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label={
              showNewPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showNewPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {state.fieldErrors?.newPassword ? (
          <p className="form-error">{state.fieldErrors.newPassword[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="form-label">
          Confirmer le nouveau mot de passe
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            className="form-control pr-12"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label={
              showConfirmPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {state.fieldErrors?.confirmPassword ? (
          <p className="form-error">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Après la modification, vous serez déconnecté et vous devrez vous
        reconnecter avec le nouveau mot de passe.
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isPending ? "Modification..." : "Modifier le mot de passe"}
      </button>
    </form>
  );
}