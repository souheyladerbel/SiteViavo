import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import type {
  PromoCodeListItem,
  PromoTargetOption,
} from "@/types/promo-code";
import PromoCodesClient from "./PromoCodesClient";

export default async function PromoCodesPage() {
  await requireSuperAdmin();

  const promoCodes = await prisma.promoCode.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const formattedPromoCodes: PromoCodeListItem[] = promoCodes.map((promo) => ({
    id: promo.id,
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    scope: promo.scope,
    startDate: promo.startDate.toISOString(),
    endDate: promo.endDate ? promo.endDate.toISOString() : null,
    usageLimit: promo.usageLimit,
    usedCount: promo.usedCount,
    isActive: promo.isActive,
    category: promo.category,
    product: promo.product,
    createdAt: promo.createdAt.toISOString(),
  }));

  const categoryOptions: PromoTargetOption[] = categories;
  const productOptions: PromoTargetOption[] = products;

  return (
    <PromoCodesClient
      promoCodes={formattedPromoCodes}
      categories={categoryOptions}
      products={productOptions}
    />
  );
}