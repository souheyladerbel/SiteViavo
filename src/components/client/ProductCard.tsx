import Link from "next/link";
import type { ClientProductCard } from "@/types/client";
import { formatPrice } from "@/lib/products/utils";

type ProductCardProps = {
  product: ClientProductCard;
};

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#eadfd2] via-[#faf7f2] to-white" />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isPromotion ? (
              <span className="border border-red-500 bg-white px-2 py-1 text-xs font-medium uppercase tracking-wide text-red-600">
                Promo
              </span>
            ) : null}

            {product.isBestSeller ? (
              <span className="border border-black bg-white px-2 py-1 text-xs font-medium uppercase tracking-wide text-black">
                Best Seller
              </span>
            ) : null}

            {isOutOfStock ? (
              <span className="border border-gray-500 bg-white px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                Rupture
              </span>
            ) : null}
          </div>

          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex h-11 items-center justify-center border border-black bg-white text-sm font-semibold uppercase tracking-wide text-black">
              Voir le produit
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-4 text-center">
        <Link
          href={`/categories/${product.category.slug}`}
          className="text-xs font-medium uppercase tracking-widest text-gray-500 transition hover:text-black"
        >
          {product.category.name}
        </Link>

        <h3 className="mt-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          <Link href={`/products/${product.slug}`} className="hover:text-gray-500">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-gray-700">
          {formatPrice(product.priceInCents)}
        </p>
      </div>
    </article>
  );
}