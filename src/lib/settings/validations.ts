import { z } from "zod";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide. Exemple : #111827");

export const updateSiteSettingsSchema = z.object({
  themeMode: z.enum(["LIGHT", "DARK"]),

  primaryColor: hexColorSchema,

  secondaryColor: hexColorSchema,

  homeHeroTitle: z
    .string()
    .trim()
    .min(2, "Le titre doit contenir au moins 2 caractères."),

  homeHeroSubtitle: z
    .string()
    .trim()
    .min(2, "Le sous-titre doit contenir au moins 2 caractères."),

  homeCtaText: z
    .string()
    .trim()
    .min(2, "Le texte du bouton doit contenir au moins 2 caractères."),

  homeCtaHref: z
    .string()
    .trim()
    .min(1, "Le lien du bouton est obligatoire."),
});

export const carouselImageSchema = z.object({
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  altText: z.string().trim().optional(),

  displayOrder: z.coerce
    .number()
    .int("L’ordre doit être un nombre entier.")
    .min(0, "L’ordre ne peut pas être négatif."),

  isActive: z.boolean(),
});

export const updateCarouselImageSchema = carouselImageSchema.extend({
  id: z.string().min(1, "Identifiant image manquant."),
});

export const bestSellerSchema = z.object({
  productId: z.string().min(1, "Produit obligatoire."),

  bestSellerOrder: z.coerce
    .number()
    .int("L’ordre doit être un nombre entier.")
    .min(0, "L’ordre ne peut pas être négatif."),
});

export const updateBestSellerOrderSchema = z.object({
  productId: z.string().min(1, "Produit obligatoire."),

  bestSellerOrder: z.coerce
    .number()
    .int("L’ordre doit être un nombre entier.")
    .min(0, "L’ordre ne peut pas être négatif."),
});