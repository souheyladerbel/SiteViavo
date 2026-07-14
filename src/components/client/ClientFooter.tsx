import Link from "next/link";
import type {
  ClientCategoryNavItem,
  ClientSiteSettings,
} from "@/types/client";

type ClientFooterProps = {
  settings: ClientSiteSettings;
  categories: ClientCategoryNavItem[];
};

export default function ClientFooter({
  settings,
  categories,
}: ClientFooterProps) {
  return (
    <footer className="mt-24 border-t border-gray-200 bg-[#faf7f2]">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-1">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          ) : (
            <span className="font-serif text-4xl italic text-black">
              Viavo
            </span>
          )}

          <p className="mt-5 max-w-xs text-sm leading-6 text-gray-600">
            Bijoux élégants et raffinés, pensés pour sublimer chaque moment du
            quotidien.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900">
            Boutique
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-gray-600">
            <li>
              <Link href="/products" className="hover:text-black">
                Tous les produits
              </Link>
            </li>

            <li>
              <Link href="/products?bestSeller=true" className="hover:text-black">
                Best Sellers
              </Link>
            </li>

            <li>
              <Link href="/products?promotion=true" className="hover:text-black">
                Promotions
              </Link>
            </li>

            <li>
              <Link href="/cart" className="hover:text-black">
                Panier
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900">
            Catégories
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-gray-600">
            {categories.length === 0 ? (
              <li>Aucune catégorie disponible</li>
            ) : (
              categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-black"
                  >
                    {category.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900">
            Contact
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-gray-600">
            <li>Tunisie</li>
            <li>contact@viavo.tn</li>
            <li>Instagram</li>
            <li>Facebook</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 px-5 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Viavo. Tous droits réservés.
      </div>
    </footer>
  );
}