"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentAdmin } from "@/lib/auth/guards";
import { deleteSessionCookie } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/account/validations";

export type ChangePasswordActionState = {
  error?: string;
  fieldErrors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
};

export async function changePasswordAction(
  _previousState: ChangePasswordActionState,
  formData: FormData
): Promise<ChangePasswordActionState> {
  const admin = await requireCurrentAdmin();

  const rawData = {
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const validation = changePasswordSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = validation.data;

  const isCurrentPasswordValid = await verifyPassword(
    currentPassword,
    admin.passwordHash
  );

  if (!isCurrentPasswordValid) {
    return {
      error: "L'ancien mot de passe est incorrect.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      error: "Le nouveau mot de passe doit être différent de l'ancien.",
    };
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.admin.update({
    where: {
      id: admin.id,
    },
    data: {
      passwordHash: newPasswordHash,
    },
  });

  await deleteSessionCookie();

  redirect("/login");
}