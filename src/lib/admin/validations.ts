import { z } from "zod";

const adminRoleSchema = z.enum(["ADMIN", "SUPER_ADMIN"]);

export const createAdminSchema = z
  .object({
    name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
    email: z.string().trim().toLowerCase().email("Adresse email invalide."),
    role: adminRoleSchema,
    isActive: z.boolean(),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "La confirmation est obligatoire."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les deux mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const updateAdminSchema = z.object({
  id: z.string().min(1, "Identifiant admin manquant."),
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  role: adminRoleSchema,
  isActive: z.boolean(),
});