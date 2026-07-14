import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import type { CategoryListItem } from "@/types/category";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  await requireSuperAdmin();

  const categories = await prisma.category.findMany({
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const formattedCategories: CategoryListItem[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    isVisible: category.isVisible,
    isArchived: category.isArchived,
    productsCount: category._count.products,
    createdAt: category.createdAt.toISOString(),
  }));

  return <CategoriesClient categories={formattedCategories} />;
}