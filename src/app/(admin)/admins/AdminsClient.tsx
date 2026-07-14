"use client";

import { useCallback, useState } from "react";
import type { AdminListItem } from "@/types/admin";
import AdminsTable from "./components/AdminsTable";
import AdminModal from "./components/AdminModal";
import CreateAdminForm from "./components/CreateAdminForm";
import EditAdminForm from "./components/EditAdminForm";

type ModalState =
  | { type: "create" }
  | { type: "edit"; admin: AdminListItem }
  | null;

type AdminsClientProps = {
  admins: AdminListItem[];
  currentAdminId: string;
};

export default function AdminsClient({
  admins,
  currentAdminId,
}: AdminsClientProps) {
  const [modal, setModal] = useState<ModalState>(null);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Gestion des admins
          </h2>
          <p className="mt-2 text-gray-600">
            Ajouter, modifier ou désactiver les comptes administrateurs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ type: "create" })}
          className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Ajouter un admin
        </button>
      </div>

      <div className="mt-8">
        <AdminsTable
          admins={admins}
          onEdit={(admin) => setModal({ type: "edit", admin })}
        />
      </div>

      {modal?.type === "create" ? (
        <AdminModal
          title="Ajouter un admin"
          description="Créer un nouveau compte administrateur."
          onClose={closeModal}
        >
          <CreateAdminForm onCancel={closeModal} onSuccess={closeModal} />
        </AdminModal>
      ) : null}

      {modal?.type === "edit" ? (
        <AdminModal
          title="Modifier un admin"
          description="Modifier les informations et le statut du compte."
          onClose={closeModal}
        >
          <EditAdminForm
            admin={modal.admin}
            currentAdminId={currentAdminId}
            onCancel={closeModal}
            onSuccess={closeModal}
          />
        </AdminModal>
      ) : null}
    </section>
  );
}