import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import type { ProductListItem } from "@/types/product";
import ProductsClient from "./ProductsClient";

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    categoryId?: string;
    status?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  await requireSuperAdmin();

  const params = await searchParams;
  const q = params?.q?.trim() ?? "";
  const categoryId = params?.categoryId ?? "";
  const status = params?.status ?? "";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                {
                  name: {
                    contains: q,
                  },
                },
                {
                  slug: {
                    contains: q,
                  },
                },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
        status === "visible"
          ? { isVisible: true, isArchived: false }
          : status === "hidden"
            ? { isVisible: false, isArchived: false }
            : status === "archived"
              ? { isArchived: true }
              : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          isActive: true,
          isVisible: true,
          isArchived: true,
        },
      },
      _count: {
        select: {
          images: true,
          orderItems: true,
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
      isActive: true,
      isVisible: true,
      isArchived: true,
    },
  });

  const formattedProducts: ProductListItem[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceInCents: product.priceInCents,
    stock: product.stock,
    mainImageUrl: product.mainImageUrl,
    videoUrl: product.videoUrl,
    isVisible: product.isVisible,
    isBestSeller: product.isBestSeller,
    isPromotion: product.isPromotion,
    isArchived: product.isArchived,
    category: product.category,
    imagesCount: product._count.images,
    orderItemsCount: product._count.orderItems,
    createdAt: product.createdAt.toISOString(),
  }));

  return (
    <ProductsClient
      products={formattedProducts}
      categories={categories}
      filters={{
        q,
        categoryId,
        status,
      }}
    />
  );
}