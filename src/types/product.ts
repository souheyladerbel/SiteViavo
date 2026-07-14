export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceInCents: number;
  stock: number;
  mainImageUrl: string | null;
  videoUrl: string | null;
  isVisible: boolean;
  isBestSeller: boolean;
  isPromotion: boolean;
  isArchived: boolean;
  category: {
    id: string;
    name: string;
    isActive: boolean;
    isVisible: boolean;
    isArchived: boolean;
  };
  imagesCount: number;
  orderItemsCount: number;
  createdAt: string;
};