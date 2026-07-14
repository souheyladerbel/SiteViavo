import Link from "next/link";
import ProductCard from "@/components/client/ProductCard";
import { getClientProductsPageData } from "@/lib/client/queries";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    bestSeller?: string;
    promotion?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const { products, categories } = await getClientProductsPageData({
    q: params?.q,
    category: params?.category,
    bestSeller: params?.bestSeller,
    promotion: params?.promotion,
    sort: params?.sort,
  });

  return (
    <main>
      <section className="border-b border-gray-100 bg-[#faf7f2] px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
            Boutique
          </p>

          <h1 className="mt-4 font-serif text-5xl text-gray-950 md:text-7xl">
            Tous les bijoux
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
            Découvrez notre sélection de bijoux élégants, affichés selon les
            règles de visibilité définies dans l’espace admin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-10 lg:px-10">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="border border-black bg-black px-5 py-2 text-sm font-medium uppercase tracking-wide text-white"
          >
            Tous
          </Link>

          <Link
            href="/products?bestSeller=true"
            className="border border-gray-300 px-5 py-2 text-sm font-medium uppercase tracking-wide text-gray-900 hover:border-black"
          >
            Best Sellers
          </Link>

          <Link
            href="/products?promotion=true"
            className="border border-red-300 px-5 py-2 text-sm font-medium uppercase tracking-wide text-red-600 hover:border-red-600"
          >
            Promotions
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="border border-gray-300 px-5 py-2 text-sm font-medium uppercase tracking-wide text-gray-900 hover:border-black"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {products.length} produit(s) trouvé(s)
          </p>

          <form method="GET" className="flex gap-3">
            <input
              name="q"
              placeholder="Rechercher..."
              defaultValue={params?.q ?? ""}
              className="h-11 w-64 border border-gray-300 px-4 text-sm outline-none focus:border-black"
            />

            <button
              type="submit"
              className="h-11 bg-black px-5 text-sm font-semibold uppercase tracking-wide text-white"
            >
              Rechercher
            </button>
          </form>
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <h2 className="font-serif text-4xl text-gray-950">
              Aucun produit trouvé
            </h2>

            <p className="mt-3 text-gray-600">
              Aucun produit visible ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}