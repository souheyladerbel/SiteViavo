export type SiteSettingView = {
  id: string;
  logoUrl: string | null;
  themeMode: string;
  primaryColor: string;
  secondaryColor: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeCtaText: string;
  homeCtaHref: string;
};

export type CarouselImageItem = {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  altText: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
};

export type BestSellerProductItem = {
  id: string;
  name: string;
  slug: string;
  mainImageUrl: string | null;
  priceInCents: number;
  stock: number;
  bestSellerOrder: number;
  category: {
    name: string;
  };
};

export type EligibleBestSellerProduct = {
  id: string;
  name: string;
};