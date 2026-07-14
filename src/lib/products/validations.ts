import { z } from "zod";

export const productBaseSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),

  slug: z.string().trim().optional(),

  description: z.string().trim().optional(),

  price: z
    .string()
    .trim()
    .min(1, "Le prix est obligatoire."),

  stock: z.coerce
    .number()
    .int("Le stock doit être un nombre entier.")
    .min(0, "Le stock ne peut pas être négatif."),

  categoryId: z.string().min(1, "La catégorie est obligatoire."),

  videoUrl: z.string().trim().optional(),

  isVisible: z.boolean(),

  isBestSeller: z.boolean(),

  isPromotion: z.boolean(),
});

export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema.extend({
  id: z.string().min(1, "Identifiant produit manquant."),
});