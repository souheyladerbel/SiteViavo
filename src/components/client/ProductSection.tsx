import Link from "next/link";
import type { ClientProductCard } from "@/types/client";
import ProductCard from "@/components/client/ProductCard";

type ProductSectionProps = {
  title: string;
  subtitle: string;
  href: string;
  products: ClientProductCard[];
};

export default function ProductSection({
  title,
  subtitle,
  href,
  products,
}: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
            Sélection
          </p>

          <h2 className="mt-3 font-serif text-4xl text-gray-950 md:text-5xl">
            {title}
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            {subtitle}
          </p>
        </div>

        <Link
          href={href}
          className="text-sm font-semibold uppercase tracking-wide text-gray-900 underline underline-offset-8 transition hover:text-gray-500"
        >
          Voir tout
        </Link>
      </div>

      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}