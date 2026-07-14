import { prisma } from "@/lib/prisma";
import type {
  ClientCarouselImage,
  ClientCategoryCard,
  ClientCategoryNavItem,
  ClientProductCard,
  ClientSiteSettings,
} from "@/types/client";

export async function getClientSiteSettings(): Promise<ClientSiteSettings> {
  const settings = await prisma.siteSetting.findUnique({
    where: {
      id: "site-settings",
    },
  });

  return {
    logoUrl: settings?.logoUrl ?? null,
    themeMode: settings?.themeMode ?? "LIGHT",
    primaryColor: settings?.primaryColor ?? "#111827",
    secondaryColor: settings?.secondaryColor ?? "#C8A45D",
    homeHeroTitle: settings?.homeHeroTitle ?? "Nouvelle Collection",
    homeHeroSubtitle:
      settings?.homeHeroSubtitle ??
      "Découvrez des bijoux élégants pensés pour sublimer chaque moment.",
    homeCtaText: settings?.homeCtaText ?? "Découvrir",
    homeCtaHref: settings?.homeCtaHref ?? "/products",
  };
}

export async function getClientVisibleCategories(): Promise<
  ClientCategoryNavItem[]
> {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      isVisible: true,
      isArchived: false,
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return categories;
}

export async function getClientHomePageData(): Promise<{
  settings: ClientSiteSettings;
  carouselImages: ClientCarouselImage[];
  categories: ClientCategoryCard[];
  bestSellers: ClientProductCard[];
  promotionProducts: ClientProductCard[];
}> {
  const [settings, carouselImages, categories, bestSellers, promotionProducts] =
    await Promise.all([
      getClientSiteSettings(),

      prisma.carouselImage.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: 5,
        select: {
          id: true,
          imageUrl: true,
          title: true,
          subtitle: true,
          altText: true,
        },
      }),

  prisma.category.findMany({
  where: {
    isActive: true,
    isVisible: true,
    isArchived: false,
  },
  orderBy: [
    {
      displayOrder: "asc",
    },
    {
      name: "asc",
    },
  ],
  select: {
    id: true,
    name: true,
    slug: true,
    description: true,
    imageUrl: true,
  },
}),

      prisma.product.findMany({
        where: {
          isBestSeller: true,
          isVisible: true,
          isArchived: false,
          stock: {
            gt: 0,
          },
          category: {
            isActive: true,
            isVisible: true,
            isArchived: false,
          },
        },
        orderBy: [
          {
            bestSellerOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: 8,
        select: {
          id: true,
          name: true,
          slug: true,
          mainImageUrl: true,
          priceInCents: true,
          stock: true,
          isBestSeller: true,
          isPromotion: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),

      prisma.product.findMany({
        where: {
          isPromotion: true,
          isVisible: true,
          isArchived: false,
          stock: {
            gt: 0,
          },
          category: {
            isActive: true,
            isVisible: true,
            isArchived: false,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
        select: {
          id: true,
          name: true,
          slug: true,
          mainImageUrl: true,
          priceInCents: true,
          stock: true,
          isBestSeller: true,
          isPromotion: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

  return {
    settings,
    carouselImages,
    categories,
    bestSellers,
    promotionProducts,
  };
}
export async function getClientProductsPageData(params?: {
  q?: string;
  category?: string;
  bestSeller?: string;
  promotion?: string;
  sort?: string;
}): Promise<{
  products: ClientProductCard[];
  categories: ClientCategoryNavItem[];
}> {
  const q = params?.q?.trim() ?? "";
  const category = params?.category ?? "";
  const bestSeller = params?.bestSeller ?? "";
  const promotion = params?.promotion ?? "";
  const sort = params?.sort ?? "newest";

  const orderBy =
    sort === "price-asc"
      ? { priceInCents: "asc" as const }
      : sort === "price-desc"
        ? { priceInCents: "desc" as const }
        : sort === "name-asc"
          ? { name: "asc" as const }
          : { createdAt: "desc" as const };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isVisible: true,
        isArchived: false,
        ...(q
          ? {
              OR: [
                {
                  name: {
                    contains: q,
                  },
                },
                {
                  description: {
                    contains: q,
                  },
                },
              ],
            }
          : {}),
        ...(category
          ? {
              category: {
                slug: category,
                isActive: true,
                isVisible: true,
                isArchived: false,
              },
            }
          : {
              category: {
                isActive: true,
                isVisible: true,
                isArchived: false,
              },
            }),
        ...(bestSeller === "true"
          ? {
              isBestSeller: true,
            }
          : {}),
        ...(promotion === "true"
          ? {
              isPromotion: true,
            }
          : {}),
      },
      orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        mainImageUrl: true,
        priceInCents: true,
        stock: true,
        isBestSeller: true,
        isPromotion: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),

    getClientVisibleCategories(),
  ]);

  return {
    products,
    categories,
  };
}