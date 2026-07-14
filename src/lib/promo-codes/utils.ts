export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function parseDiscountValue(
  discountType: string,
  value: string
): number {
  const normalizedValue = value.replace(",", ".").trim();
  const numericValue = Number(normalizedValue);

  if (discountType === "FIXED_AMOUNT") {
    return Math.round(numericValue * 100);
  }

  return Math.round(numericValue);
}

export function formatDiscount(
  discountType: string,
  discountValue: number
): string {
  if (discountType === "PERCENTAGE") {
    return `${discountValue}%`;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(discountValue / 100);
}

export function formatDateForInput(date: string | null): string {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().slice(0, 10);
}

export function getPromoCodeStatus(params: {
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  usageLimit: number | null;
  usedCount: number;
}) {
  const now = new Date();
  const startDate = new Date(params.startDate);
  const endDate = params.endDate ? new Date(params.endDate) : null;

  if (!params.isActive) {
    return "Désactivé";
  }

  if (startDate > now) {
    return "Programmé";
  }

  if (endDate && endDate < now) {
    return "Expiré";
  }

  if (params.usageLimit !== null && params.usedCount >= params.usageLimit) {
    return "Limite atteinte";
  }

  return "Actif";
}