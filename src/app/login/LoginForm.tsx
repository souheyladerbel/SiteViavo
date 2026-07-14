"use client";

import { useActionState } from "react";
import { loginAction, type LoginActionState } from "@/lib/auth/actions";
import PasswordInput from "@/components/ui/PasswordInput";

const initialState: LoginActionState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="form-label">
          Adresse email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="superadmin@example.com"
          autoComplete="email"
          className="form-control"
        />

        {state.fieldErrors?.email ? (
          <p className="form-error">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Mot de passe
        </label>

     
        <PasswordInput
          id="password"
          name="password"
          placeholder="********"
          autoComplete="current-password"
        />

        {state.fieldErrors?.password ? (
          <p className="form-error">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isPending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}