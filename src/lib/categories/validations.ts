import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  displayOrder: z.coerce
    .number()
    .int("L'ordre doit être un nombre entier.")
    .min(0, "L'ordre ne peut pas être négatif."),
  isActive: z.boolean(),
  isVisible: z.boolean(),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1, "Identifiant catégorie manquant."),
});