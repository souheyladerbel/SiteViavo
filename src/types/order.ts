export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERED"
  | "CANCELLED";

export type OrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: string;
  totalInCents: number;
  itemsCount: number;
  createdAt: string;
};

export type OrderDetailsItem = {
  id: string;
  productId: string | null;
  productNameSnapshot: string;
  productSlugSnapshot: string | null;
  productImageSnapshot: string | null;
  productPriceSnapshot: number;
  categoryNameSnapshot: string | null;
  quantity: number;
  subtotal: number;
};

export type OrderDetails = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  customerCity: string | null;
  customerNote: string | null;
  status: string;
  subtotalInCents: number;
  discountInCents: number;
  totalInCents: number;
  promoCodeSnapshot: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderDetailsItem[];
};