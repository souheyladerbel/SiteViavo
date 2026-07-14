"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { createAdminSchema, updateAdminSchema } from "@/lib/admin/validations";

type AdminFieldErrors = Partial<
  Record<
    | "id"
    | "name"
    | "email"
    | "role"
    | "isActive"
    | "password"
    | "confirmPassword",
    string[]
  >
>;

export type AdminActionState = {
  success?: string;
  error?: string;
  fieldErrors?: AdminFieldErrors;
};

export async function createAdminAction(
  _previousState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireSuperAdmin();

  const rawData = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? ""),
    isActive: formData.get("isActive") === "on",
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const validation = createAdminSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, role, isActive, password } = validation.data;

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    return {
      error: "Cette adresse email est déjà utilisée par un autre admin.",
    };
  }

  const passwordHash = await hashPassword(password);

  await prisma.admin.create({
    data: {
      name,
      email,
      role,
      isActive,
      passwordHash,
    },
  });

  revalidatePath("/admins");

  return {
    success: "Admin ajouté avec succès.",
  };
}

export async function updateAdminAction(
  _previousState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const currentAdmin = await requireSuperAdmin();

  const rawData = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? ""),
    isActive: formData.get("isActive") === "on",
  };

  const validation = updateAdminSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { id, name, email, role, isActive } = validation.data;

  const targetAdmin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!targetAdmin) {
    return {
      error: "Admin introuvable.",
    };
  }

  if (targetAdmin.id === currentAdmin.id) {
    if (!isActive) {
      return {
        error: "Vous ne pouvez pas désactiver votre propre compte.",
      };
    }

    if (role !== "SUPER_ADMIN") {
      return {
        error: "Vous ne pouvez pas retirer votre propre rôle Super Admin.",
      };
    }
  }

  const existingEmailAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingEmailAdmin && existingEmailAdmin.id !== id) {
    return {
      error: "Cette adresse email est déjà utilisée par un autre admin.",
    };
  }

  const willRemoveActiveSuperAdmin =
    targetAdmin.role === "SUPER_ADMIN" &&
    targetAdmin.isActive &&
    (role !== "SUPER_ADMIN" || !isActive);

  if (willRemoveActiveSuperAdmin) {
    const activeSuperAdminCount = await prisma.admin.count({
      where: {
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    if (activeSuperAdminCount <= 1) {
      return {
        error: "Impossible de désactiver le dernier Super Admin actif.",
      };
    }
  }

  await prisma.admin.update({
    where: { id },
    data: {
      name,
      email,
      role,
      isActive,
    },
  });

  revalidatePath("/admins");

  return {
    success: "Admin modifié avec succès.",
  };
}