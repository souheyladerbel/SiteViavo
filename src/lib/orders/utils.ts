export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle commande",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export function formatOrderStatus(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(priceInCents / 100);
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getOrderStatusClass(status: string): string {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-700";
    case "CONFIRMED":
      return "bg-green-100 text-green-700";
    case "PREPARING":
      return "bg-amber-100 text-amber-700";
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
}