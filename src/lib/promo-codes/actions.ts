"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import {
  createPromoCodeSchema,
  updatePromoCodeSchema,
} from "@/lib/promo-codes/validations";
import {
  normalizePromoCode,
  parseDiscountValue,
} from "@/lib/promo-codes/utils";

type PromoCodeFieldErrors = Partial<
  Record<
    | "id"
    | "code"
    | "discountType"
    | "discountValue"
    | "scope"
    | "categoryId"
    | "productId"
    | "startDate"
    | "endDate"
    | "usageLimit"
    | "isActive",
    string[]
  >
>;

export type PromoCodeActionState = {
  success?: string;
  error?: string;
  fieldErrors?: PromoCodeFieldErrors;
};

function buildPromoDates(startDate: string, endDate?: string) {
  return {
    startDate: new Date(`${startDate}T00:00:00`),
    endDate: endDate ? new Date(`${endDate}T23:59:59`) : null,
  };
}

function buildUsageLimit(usageLimit?: string): number | null {
  if (!usageLimit) {
    return null;
  }

  return Number(usageLimit);
}

async function validatePromoTarget(params: {
  scope: string;
  categoryId?: string;
  productId?: string;
}) {
  if (params.scope === "CATEGORY") {
    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!category || category.isArchived) {
      throw new Error("La catégorie sélectionnée est introuvable ou archivée.");
    }
  }

  if (params.scope === "PRODUCT") {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
    });

    if (!product || product.isArchived) {
      throw new Error("Le produit sélectionné est introuvable ou archivé.");
    }
  }
}

export async function createPromoCodeAction(
  _previousState: PromoCodeActionState,
  formData: FormData
): Promise<PromoCodeActionState> {
  await requireSuperAdmin();

  const rawData = {
    code: String(formData.get("code") ?? ""),
    discountType: String(formData.get("discountType") ?? ""),
    discountValue: String(formData.get("discountValue") ?? ""),
    scope: String(formData.get("scope") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    productId: String(formData.get("productId") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    usageLimit: String(formData.get("usageLimit") ?? ""),
    isActive: formData.get("isActive") === "on",
  };

  const validation = createPromoCodeSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validation.data;
    const code = normalizePromoCode(data.code);

    const existingCode = await prisma.promoCode.findUnique({
      where: {
        code,
      },
    });

    if (existingCode) {
      return {
        error: "Ce code promo existe déjà.",
      };
    }

    await validatePromoTarget({
      scope: data.scope,
      categoryId: data.categoryId,
      productId: data.productId,
    });

    const dates = buildPromoDates(data.startDate, data.endDate);

    await prisma.promoCode.create({
      data: {
        code,
        discountType: data.discountType,
        discountValue: parseDiscountValue(
          data.discountType,
          data.discountValue
        ),
        scope: data.scope,
        categoryId: data.scope === "CATEGORY" ? data.categoryId : null,
        productId: data.scope === "PRODUCT" ? data.productId : null,
        startDate: dates.startDate,
        endDate: dates.endDate,
        usageLimit: buildUsageLimit(data.usageLimit),
        isActive: data.isActive,
      },
    });

    revalidatePath("/promo-codes");

    return {
      success: "Code promo créé avec succès.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la création.",
    };
  }
}

export async function updatePromoCodeAction(
  _previousState: PromoCodeActionState,
  formData: FormData
): Promise<PromoCodeActionState> {
  await requireSuperAdmin();

  const rawData = {
    id: String(formData.get("id") ?? ""),
    code: String(formData.get("code") ?? ""),
    discountType: String(formData.get("discountType") ?? ""),
    discountValue: String(formData.get("discountValue") ?? ""),
    scope: String(formData.get("scope") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    productId: String(formData.get("productId") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    usageLimit: String(formData.get("usageLimit") ?? ""),
    isActive: formData.get("isActive") === "on",
  };

  const validation = updatePromoCodeSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validation.data;
    const code = normalizePromoCode(data.code);

    const currentPromoCode = await prisma.promoCode.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!currentPromoCode) {
      return {
        error: "Code promo introuvable.",
      };
    }

    const existingCode = await prisma.promoCode.findUnique({
      where: {
        code,
      },
    });

    if (existingCode && existingCode.id !== data.id) {
      return {
        error: "Ce code promo est déjà utilisé.",
      };
    }

    await validatePromoTarget({
      scope: data.scope,
      categoryId: data.categoryId,
      productId: data.productId,
    });

    const dates = buildPromoDates(data.startDate, data.endDate);

    await prisma.promoCode.update({
      where: {
        id: data.id,
      },
      data: {
        code,
        discountType: data.discountType,
        discountValue: parseDiscountValue(
          data.discountType,
          data.discountValue
        ),
        scope: data.scope,
        categoryId: data.scope === "CATEGORY" ? data.categoryId : null,
        productId: data.scope === "PRODUCT" ? data.productId : null,
        startDate: dates.startDate,
        endDate: dates.endDate,
        usageLimit: buildUsageLimit(data.usageLimit),
        isActive: data.isActive,
      },
    });

    revalidatePath("/promo-codes");

    return {
      success: "Code promo modifié avec succès.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la modification.",
    };
  }
}

export async function togglePromoCodeStatusAction(
  formData: FormData
): Promise<void> {
  await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const promoCode = await prisma.promoCode.findUnique({
    where: {
      id,
    },
  });

  if (!promoCode) {
    return;
  }

  await prisma.promoCode.update({
    where: {
      id,
    },
    data: {
      isActive: !promoCode.isActive,
    },
  });

  revalidatePath("/promo-codes");
}

export async function deletePromoCodeAction(formData: FormData): Promise<void> {
  await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const promoCode = await prisma.promoCode.findUnique({
    where: {
      id,
    },
  });

  if (!promoCode) {
    return;
  }

  if (promoCode.usedCount > 0) {
    await prisma.promoCode.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  } else {
    await prisma.promoCode.delete({
      where: {
        id,
      },
    });
  }

  revalidatePath("/promo-codes");
}