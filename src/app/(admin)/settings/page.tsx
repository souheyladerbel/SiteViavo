import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import type {
  BestSellerProductItem,
  CarouselImageItem,
  EligibleBestSellerProduct,
  SiteSettingView,
} from "@/types/settings";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  await requireSuperAdmin();

  const settings = await prisma.siteSetting.upsert({
    where: {
      id: "site-settings",
    },
    update: {},
    create: {
      id: "site-settings",
    },
  });

  const carouselImages = await prisma.carouselImage.findMany({
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const bestSellerProducts = await prisma.product.findMany({
    where: {
      isBestSeller: true,
    },
    orderBy: [
      {
        bestSellerOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      mainImageUrl: true,
      priceInCents: true,
      stock: true,
      bestSellerOrder: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const eligibleProducts = await prisma.product.findMany({
    where: {
      isArchived: false,
      isVisible: true,
      category: {
        isArchived: false,
        isActive: true,
        isVisible: true,
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const formattedSettings: SiteSettingView = {
    id: settings.id,
    logoUrl: settings.logoUrl,
    themeMode: settings.themeMode,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    homeHeroTitle: settings.homeHeroTitle,
    homeHeroSubtitle: settings.homeHeroSubtitle,
    homeCtaText: settings.homeCtaText,
    homeCtaHref: settings.homeCtaHref,
  };

  const formattedCarouselImages: CarouselImageItem[] = carouselImages.map(
    (image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      title: image.title,
      subtitle: image.subtitle,
      altText: image.altText,
      displayOrder: image.displayOrder,
      isActive: image.isActive,
      createdAt: image.createdAt.toISOString(),
    })
  );

  const formattedBestSellerProducts: BestSellerProductItem[] =
    bestSellerProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      mainImageUrl: product.mainImageUrl,
      priceInCents: product.priceInCents,
      stock: product.stock,
      bestSellerOrder: product.bestSellerOrder,
      category: product.category,
    }));

  const formattedEligibleProducts: EligibleBestSellerProduct[] =
    eligibleProducts;

  return (
    <SettingsClient
      settings={formattedSettings}
      carouselImages={formattedCarouselImages}
      bestSellerProducts={formattedBestSellerProducts}
      eligibleProducts={formattedEligibleProducts}
    />
  );
}