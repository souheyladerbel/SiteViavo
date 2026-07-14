"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { updateOrderStatusSchema } from "@/lib/orders/validations";

export type OrderActionState = {
  success?: string;
  error?: string;
  fieldErrors?: {
    id?: string[];
    status?: string[];
  };
};

export async function updateOrderStatusAction(
  _previousState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  await requireSuperAdmin();

  const rawData = {
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? ""),
  };

  const validation = updateOrderStatusSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { id, status } = validation.data;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return {
      error: "Commande introuvable.",
    };
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/orders");

  return {
    success: "Statut de la commande modifié avec succès.",
  };
}
export async function getOrderDetailsAction(id: string) {
  await requireSuperAdmin();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    customerCity: order.customerCity,
    customerNote: order.customerNote,
    status: order.status,
    subtotalInCents: order.subtotalInCents,
    discountInCents: order.discountInCents,
    totalInCents: order.totalInCents,
    promoCodeSnapshot: order.promoCodeSnapshot,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot,
      productSlugSnapshot: item.productSlugSnapshot,
      productImageSnapshot: item.productImageSnapshot,
      productPriceSnapshot: item.productPriceSnapshot,
      categoryNameSnapshot: item.categoryNameSnapshot,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
  };
}