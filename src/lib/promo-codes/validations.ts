import { z } from "zod";

const discountTypeSchema = z.enum(["PERCENTAGE", "FIXED_AMOUNT"]);
const scopeSchema = z.enum(["CATALOG", "CATEGORY", "PRODUCT"]);

export const promoCodeBaseSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Le code promo doit contenir au moins 3 caractères.")
      .max(30, "Le code promo ne doit pas dépasser 30 caractères."),

    discountType: discountTypeSchema,

    discountValue: z
      .string()
      .trim()
      .min(1, "La valeur de réduction est obligatoire."),

    scope: scopeSchema,

    categoryId: z.string().optional(),
    productId: z.string().optional(),

    startDate: z.string().min(1, "La date de début est obligatoire."),
    endDate: z.string().optional(),

    usageLimit: z.string().optional(),

    isActive: z.boolean(),
  })
  .superRefine((data, context) => {
    const numericDiscount = Number(data.discountValue.replace(",", "."));

    if (Number.isNaN(numericDiscount) || numericDiscount <= 0) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "La valeur de réduction doit être supérieure à 0.",
      });
    }

    if (data.discountType === "PERCENTAGE" && numericDiscount > 100) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Le pourcentage ne peut pas dépasser 100%.",
      });
    }

    if (data.scope === "CATEGORY" && !data.categoryId) {
      context.addIssue({
        code: "custom",
        path: ["categoryId"],
        message: "La catégorie est obligatoire pour cette portée.",
      });
    }

    if (data.scope === "PRODUCT" && !data.productId) {
      context.addIssue({
        code: "custom",
        path: ["productId"],
        message: "Le produit est obligatoire pour cette portée.",
      });
    }

    if (data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (end < start) {
        context.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "La date de fin doit être après la date de début.",
        });
      }
    }

    if (data.usageLimit) {
      const usageLimit = Number(data.usageLimit);

      if (!Number.isInteger(usageLimit) || usageLimit <= 0) {
        context.addIssue({
          code: "custom",
          path: ["usageLimit"],
          message: "La limite d’utilisation doit être un nombre positif.",
        });
      }
    }
  });

export const createPromoCodeSchema = promoCodeBaseSchema;

export const updatePromoCodeSchema = promoCodeBaseSchema.extend({
  id: z.string().min(1, "Identifiant code promo manquant."),
});