import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireCurrentAdmin } from "../../lib/auth/guards";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const admin = await requireCurrentAdmin();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar
        admin={{
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }}
      />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Espace administration</p>
              <h1 className="text-lg font-semibold text-gray-900">
                Gestion admin
              </h1>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{admin.name}</p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}