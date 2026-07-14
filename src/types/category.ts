export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  isVisible: boolean;
  isArchived: boolean;
  productsCount: number;
  createdAt: string;
};