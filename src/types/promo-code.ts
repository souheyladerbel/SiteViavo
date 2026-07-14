export type PromoCodeListItem = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  scope: string;
  startDate: string;
  endDate: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  } | null;
  product: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
};

export type PromoTargetOption = {
  id: string;
  name: string;
};