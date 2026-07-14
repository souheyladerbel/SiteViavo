"use client";

import { logoutAction } from "@/lib/auth/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Se déconnecter
      </button>
    </form>
  );
}