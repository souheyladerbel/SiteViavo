export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatPrice(priceInMillimes: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(priceInMillimes / 1000);
}

export function parsePriceToMillimes(value: string): number {
  const normalizedValue = value.replace(",", ".").trim();
  const numberValue = Number(normalizedValue);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return Math.round(numberValue * 1000);
}