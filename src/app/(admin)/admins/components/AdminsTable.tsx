"use client";

import type { AdminListItem } from "@/types/admin";

type AdminsTableProps = {
  admins: AdminListItem[];
  onEdit: (admin: AdminListItem) => void;
};

function formatDate(date: string | null) {
  if (!date) {
    return "Jamais";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function AdminsTable({ admins, onEdit }: AdminsTableProps) {
  if (admins.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-600">Aucun admin trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Nom</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Rôle</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Dernière connexion</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {admins.map((admin) => (
              <tr key={admin.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {admin.name}
                </td>

                <td className="px-6 py-4 text-gray-600">{admin.email}</td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {admin.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {admin.isActive ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Actif
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Désactivé
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatDate(admin.lastLoginAt)}
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onEdit(admin)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}