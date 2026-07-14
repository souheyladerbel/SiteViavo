import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import type { AdminListItem } from "@/types/admin";
import AdminsClient from "./AdminsClient";

export default async function AdminsPage() {
  const currentAdmin = await requireSuperAdmin();

  const admins = await prisma.admin.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  const formattedAdmins: AdminListItem[] = admins.map((admin) => ({
    ...admin,
    createdAt: admin.createdAt.toISOString(),
    lastLoginAt: admin.lastLoginAt ? admin.lastLoginAt.toISOString() : null,
  }));

  return (
    <AdminsClient
      admins={formattedAdmins}
      currentAdminId={currentAdmin.id}
    />
  );
}