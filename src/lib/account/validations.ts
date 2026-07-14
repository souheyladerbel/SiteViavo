import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "L'ancien mot de passe est obligatoire."),

    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères."),

    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est obligatoire."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les deux mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });