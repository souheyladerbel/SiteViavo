export type ClientSiteSettings = {
  logoUrl: string | null;
  themeMode: string;
  primaryColor: string;
  secondaryColor: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeCtaText: string;
  homeCtaHref: string;
};

export type ClientCategoryNavItem = {
  id: string;
  name: string;
  slug: string;
};

export type ClientCategoryCard = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type ClientCarouselImage = {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  altText: string | null;
};

export type ClientProductCard = {
  id: string;
  name: string;
  slug: string;
  mainImageUrl: string | null;
  priceInCents: number;
  stock: number;
  isBestSeller: boolean;
  isPromotion: boolean;
  category: {
    name: string;
    slug: string;
  };
};