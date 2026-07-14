import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

export async function requireCurrentAdmin() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const admin = await prisma.admin.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    },
  });

  if (!admin || !admin.isActive) {
    redirect("/login");
  }

  return admin;
}

export async function requireSuperAdmin() {
  const admin = await requireCurrentAdmin();

  if (admin.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return admin;
}