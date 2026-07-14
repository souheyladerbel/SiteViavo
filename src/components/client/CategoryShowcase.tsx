"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ClientCategoryCard } from "@/types/client";

type CategoryShowcaseProps = {
  categories: ClientCategoryCard[];
};

export default function CategoryShowcase({
  categories,
}: CategoryShowcaseProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  if (categories.length === 0) {
    return null;
  }

  const showArrows = categories.length > 4;

  function scrollCategories(direction: "previous" | "next") {
    const container = carouselRef.current;

    if (!container) {
      return;
    }

    const scrollAmount = container.clientWidth;

    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
            Collections
          </p>

          <h2 className="mt-3 font-serif text-4xl text-gray-950 md:text-5xl">
            Explorer par catégorie
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {showArrows ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCategories("previous")}
                aria-label="Catégories précédentes"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-2xl text-gray-900 transition hover:bg-black hover:text-white"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => scrollCategories("next")}
                aria-label="Catégories suivantes"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-2xl text-gray-900 transition hover:bg-black hover:text-white"
              >
                ›
              </button>
            </div>
          ) : null}

          <Link
            href="/products"
            className="text-sm font-semibold uppercase tracking-wide text-gray-900 underline underline-offset-8 transition hover:text-gray-500"
          >
            Voir toute la boutique
          </Link>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group min-w-[85%] snap-start sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)]"
          >
            <div className="relative h-[420px] overflow-hidden bg-gray-100">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#eadfd2] via-[#faf7f2] to-white" />
              )}

              <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-serif text-3xl">{category.name}</h3>

                {category.description ? (
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
                    {category.description}
                  </p>
                ) : null}

                <span className="mt-5 inline-block text-sm font-semibold uppercase tracking-wide underline underline-offset-8">
                  Découvrir
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}