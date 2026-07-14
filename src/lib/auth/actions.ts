"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { loginSchema } from "./validations";
import { verifyPassword } from "./password";
import { deleteSessionCookie, setSessionCookie } from "./session";

export type LoginActionState = {
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const rawData = {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };

  const validation = loginSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return {
      error: "Email ou mot de passe incorrect.",
    };
  }

  if (!admin.isActive) {
    return {
      error: "Ce compte admin est désactivé.",
    };
  }

  const isPasswordValid = await verifyPassword(password, admin.passwordHash);

  if (!isPasswordValid) {
    return {
      error: "Email ou mot de passe incorrect.",
    };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      lastLoginAt: new Date(),
    },
  });

  await setSessionCookie({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
  });

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await deleteSessionCookie();
  redirect("/login");
}