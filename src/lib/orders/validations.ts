import { z } from "zod";

export const orderStatusSchema = z.enum([
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
]);

export const updateOrderStatusSchema = z.object({
  id: z.string().min(1, "Identifiant commande manquant."),
  status: orderStatusSchema,
});