import CategoryShowcase from "@/components/client/CategoryShowcase";
import HeroCarousel from "@/components/client/HeroCarousel";
import ProductSection from "@/components/client/ProductSection";
import TrustSection from "@/components/client/TrustSection";
import { getClientHomePageData } from "@/lib/client/queries";

export const dynamic = "force-dynamic";

export default async function ClientHomePage() {
  const {
    settings,
    carouselImages,
    categories,
    bestSellers,
    promotionProducts,
  } = await getClientHomePageData();

  return (
    <>
      <HeroCarousel settings={settings} images={carouselImages} />

      <CategoryShowcase categories={categories} />

      <ProductSection
        title="Nos Best Sellers"
        subtitle="Les bijoux préférés de nos clientes, sélectionnés depuis l’espace admin."
        href="/products?bestSeller=true"
        products={bestSellers}
      />

      <section className="mx-auto max-w-[1600px] px-5 py-10 lg:px-10">
        <div className="relative min-h-[420px] overflow-hidden bg-[#eee5da]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />

          <div className="relative z-10 flex min-h-[420px] max-w-xl flex-col justify-center px-8 py-16 text-white md:px-14">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
              Collection signature
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
              Des bijoux pour illuminer chaque détail.
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/85">
              Une sélection élégante pour accompagner vos tenues du quotidien
              comme vos moments les plus précieux.
            </p>

            <a
              href="/products"
              className="mt-8 inline-flex w-fit items-center justify-center bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-black hover:text-white"
            >
              Découvrir
            </a>
          </div>
        </div>
      </section>

      <ProductSection
        title="Promotions"
        subtitle="Découvrez les pièces actuellement en promotion."
        href="/products?promotion=true"
        products={promotionProducts}
      />

      <TrustSection />
    </>
  );
}